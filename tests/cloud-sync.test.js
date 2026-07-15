const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const extensionRoot = path.join(__dirname, '..', 'Chrome-extension');

function readExtensionFile(filename) {
  return fs.readFileSync(path.join(extensionRoot, filename), 'utf8');
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadBackgroundCloudSyncBindings(harness) {
  const source = readExtensionFile('background.js');
  const context = vm.createContext({
    Blob,
    URL,
    chrome: harness.chrome,
    clearTimeout: harness.clearTimeout,
    console,
    fetch: harness.fetch,
    setTimeout: harness.setTimeout
  });

  vm.runInContext(
    `${source}\n;globalThis.__cloudSyncTest = { persistSessionFolders, persistSessions, runCloudSyncPull, runCloudSyncPush, handleWindowRemovedForBrowserClose, loadCloudSyncState, CLOUD_SYNC_AUTO_PUSH_DELAY_MINUTES };`,
    context
  );
  return context.__cloudSyncTest;
}

function createCloudSyncHarness(initialStorage = {}, responseFactory = null) {
  const alarmCalls = [];
  const fetchCalls = [];
  const timers = [];
  const storageData = {
    sessions: [],
    cloudSyncSettings: {
      enabled: true,
      apiBaseUrl: 'https://sync.example.test',
      profile: { userId: 'google:123', email: 'user@example.com' }
    },
    cloudSyncState: {
      revision: 1,
      pending: false,
      lastSyncedAt: null,
      lastPulledAt: null,
      lastPushedAt: null,
      lastError: '',
      lastChangeReason: '',
      deviceId: 'device_test'
    },
    ...initialStorage
  };

  const chrome = {
    runtime: {
      OnInstalledReason: { INSTALL: 'install' },
      onInstalled: { addListener() {} },
      onStartup: { addListener() {} },
      onSuspend: { addListener() {} },
      onMessage: { addListener() {} },
      lastError: null,
      setUninstallURL() {},
      getURL(value) { return value; }
    },
    alarms: {
      create: async (name, options) => alarmCalls.push({ name, options }),
      onAlarm: { addListener() {} }
    },
    identity: {
      getAuthToken(_options, callback) {
        callback('google-token');
      },
      removeCachedAuthToken(_options, callback) {
        if (callback) callback();
      }
    },
    storage: {
      local: {
        get: async (defaults) => {
          if (typeof defaults === 'string') {
            return { [defaults]: storageData[defaults] };
          }
          return { ...defaults, ...storageData };
        },
        set: async (values) => Object.assign(storageData, values)
      },
      onChanged: { addListener() {} }
    },
    tabs: {
      onCreated: { addListener() {} },
      onUpdated: { addListener() {} },
      onAttached: { addListener() {} },
      onDetached: { addListener() {} },
      onMoved: { addListener() {} },
      onReplaced: { addListener() {} },
      onRemoved: { addListener() {} },
      create() {}
    },
    windows: {
      onCreated: { addListener() {} },
      onFocusChanged: { addListener() {} },
      onBoundsChanged: { addListener() {} },
      onRemoved: { addListener() {} },
      getAll: async () => []
    }
  };

  return {
    alarmCalls,
    chrome,
    fetchCalls,
    storageData,
    clearTimeout(id) {
      const timer = timers.find((entry) => entry.id === id);
      if (timer) timer.cleared = true;
    },
    fetch: async (url, options = {}) => {
      fetchCalls.push({ url, options });
      return {
        ok: true,
        json: async () => responseFactory
          ? responseFactory(url, options)
          : ({
              success: true,
              revision: 2,
              updatedAt: '2026-07-15T10:00:00.000Z'
            })
      };
    },
    setTimeout(callback, delay) {
      const id = { delay, callback, cleared: false };
      timers.push(id);
      return id;
    },
    timers
  };
}

test('session changes schedule conservative automatic Cloud Sync push', async () => {
  const harness = createCloudSyncHarness();
  const { persistSessions, loadCloudSyncState, CLOUD_SYNC_AUTO_PUSH_DELAY_MINUTES } =
    loadBackgroundCloudSyncBindings(harness);

  await persistSessions([
    { name: 'Docs', windows: [{ tabs: [{ url: 'https://example.com' }] }] }
  ], { reason: 'rename_session' });

  const state = await loadCloudSyncState();
  assert.equal(state.pending, true);
  assert.equal(state.lastChangeReason, 'rename_session');
  assert.equal(harness.timers.length, 1);
  assert.equal(harness.timers[0].delay, CLOUD_SYNC_AUTO_PUSH_DELAY_MINUTES * 60 * 1000);
  assert.deepEqual(plain(harness.alarmCalls.at(-1)), {
    name: 'cloud-sync-push',
    options: { delayInMinutes: CLOUD_SYNC_AUTO_PUSH_DELAY_MINUTES }
  });
});

test('manual Cloud Sync push skips when there are no pending local changes', async () => {
  const harness = createCloudSyncHarness({
    cloudSyncState: {
      revision: 1,
      pending: false,
      lastSyncedAt: '2026-07-15T09:00:00.000Z',
      lastPulledAt: null,
      lastPushedAt: '2026-07-15T09:00:00.000Z',
      lastError: '',
      lastChangeReason: '',
      deviceId: 'device_test'
    }
  });
  const { runCloudSyncPush } = loadBackgroundCloudSyncBindings(harness);

  const result = await runCloudSyncPush({ force: true, manual: true });

  assert.equal(result.success, true);
  assert.equal(result.skipped, true);
  assert.equal(result.reason, 'no_pending_changes');
  assert.equal(harness.fetchCalls.length, 0);
});

test('manual Cloud Sync push is rate-limited before hitting the network', async () => {
  const harness = createCloudSyncHarness({
    cloudSyncState: {
      revision: 1,
      pending: true,
      lastSyncedAt: null,
      lastPulledAt: null,
      lastPushedAt: new Date().toISOString(),
      lastError: '',
      lastChangeReason: 'sessions_changed',
      deviceId: 'device_test'
    }
  });
  const { runCloudSyncPush } = loadBackgroundCloudSyncBindings(harness);

  const result = await runCloudSyncPush({ force: true, manual: true });

  assert.equal(result.success, false);
  assert.equal(result.skipped, true);
  assert.equal(result.reason, 'rate_limited');
  assert.equal(result.code, 'rate_limited');
  assert.ok(result.retryAfterSeconds > 0);
  assert.equal(harness.fetchCalls.length, 0);
});

test('browser close flushes pending Cloud Sync immediately', async () => {
  const harness = createCloudSyncHarness({
    sessions: [
      { name: 'Docs', windows: [{ tabs: [{ url: 'https://example.com' }] }] }
    ],
    cloudSyncState: {
      revision: 1,
      pending: true,
      lastSyncedAt: null,
      lastPulledAt: null,
      lastPushedAt: null,
      lastError: '',
      lastChangeReason: 'rename_session',
      deviceId: 'device_test'
    }
  });
  const { handleWindowRemovedForBrowserClose } = loadBackgroundCloudSyncBindings(harness);

  const result = await handleWindowRemovedForBrowserClose();

  assert.equal(result.cloudSync.success, true);
  assert.equal(harness.fetchCalls.length, 1);
  assert.equal(harness.fetchCalls[0].url, 'https://sync.example.test/v1/sync/snapshot');
  assert.equal(JSON.parse(harness.fetchCalls[0].options.body).syncReason, 'browser_close');
  assert.equal(harness.storageData.cloudSyncState.pending, false);
});

test('Cloud Sync push includes session folder metadata', async () => {
  const harness = createCloudSyncHarness({
    sessions: [
      { name: 'Docs', windows: [{ tabs: [{ url: 'https://example.com' }] }] }
    ],
    sessionFolders: [
      { id: 'project-docs', name: 'Project Docs', createdAt: '2026-07-15T08:00:00.000Z' }
    ],
    cloudSyncState: {
      revision: 1,
      pending: true,
      lastSyncedAt: null,
      lastPulledAt: null,
      lastPushedAt: null,
      lastError: '',
      lastChangeReason: 'create_session_folder',
      deviceId: 'device_test'
    }
  });
  const { runCloudSyncPush } = loadBackgroundCloudSyncBindings(harness);

  const result = await runCloudSyncPush();
  const body = JSON.parse(harness.fetchCalls[0].options.body);

  assert.equal(result.success, true);
  assert.deepEqual(body.folders, [
    { id: 'project-docs', name: 'Project Docs', createdAt: '2026-07-15T08:00:00.000Z' }
  ]);
});

test('Cloud Sync pull stores remote session folders locally', async () => {
  const harness = createCloudSyncHarness({}, () => ({
    success: true,
    revision: 2,
    updatedAt: '2026-07-15T10:00:00.000Z',
    sessions: [
      { name: 'Docs', windows: [{ tabs: [{ url: 'https://example.com' }] }] }
    ],
    folders: [
      { id: 'project-docs', name: 'Project Docs', createdAt: '2026-07-15T08:00:00.000Z' }
    ]
  }));
  const { runCloudSyncPull } = loadBackgroundCloudSyncBindings(harness);

  const result = await runCloudSyncPull({ applyRemote: true });

  assert.equal(result.success, true);
  assert.deepEqual(plain(harness.storageData.sessionFolders), [
    { id: 'project-docs', name: 'Project Docs', createdAt: '2026-07-15T08:00:00.000Z' }
  ]);
});

test('Cloudflare Worker keeps folder sync backward-compatible with legacy snapshots', () => {
  const worker = fs.readFileSync(
    path.join(__dirname, '..', 'cloud-sync', 'cloudflare-worker', 'src', 'index.js'),
    'utf8'
  );

  assert.match(worker, /function normalizeSnapshotRecord/);
  assert.match(worker, /Array\.isArray\(value\)/);
  assert.match(worker, /sessions: normalizeSessions\(value\), folders: \[\]/);
  assert.match(worker, /JSON\.stringify\(\{ version: 2, sessions, folders \}\)/);
  assert.match(worker, /folders: snapshot\.folders/);
});
