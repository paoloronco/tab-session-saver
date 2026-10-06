const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const backgroundSource = fs.readFileSync(
  path.join(__dirname, '..', 'Chrome-extension', 'background.js'),
  'utf8'
);
const workerSource = fs.readFileSync(
  path.join(__dirname, '..', 'cloud-sync', 'cloudflare-worker', 'src', 'index.js'),
  'utf8'
);
const settingsSource = fs.readFileSync(
  path.join(__dirname, '..', 'Chrome-extension', 'settings.css'),
  'utf8'
);

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function createHarness(options = {}) {
  const storageData = {
    sessions: [],
    autoSaveSettings: { enabled: false, intervalMinutes: 10, exitEnabled: true },
    autoSaveRunId: 'browser-run-one',
    ...(options.storageData || {})
  };
  const sessionStorageData = { autoSaveRunId: 'browser-run-one' };
  const windows = [{
    id: 10,
    type: 'normal',
    focused: true,
    tabs: [{
      id: 100,
      windowId: 10,
      index: 0,
      url: 'https://first.example/start',
      title: 'First run',
      active: true,
      groupId: -1
    }]
  }];
  const event = { addListener() {} };
  const alarmState = new Map();
  const identityCalls = [];
  const removedAuthTokens = [];
  const chrome = {
    runtime: {
      OnInstalledReason: { INSTALL: 'install' },
      onInstalled: event,
      onStartup: event,
      onMessage: event,
      onSuspend: event,
      setUninstallURL() {},
      getURL(value) { return value; },
      lastError: null
    },
    identity: {
      getAuthToken(details, callback) {
        identityCalls.push({ ...details });
        if (options.authError) {
          chrome.runtime.lastError = { message: options.authError };
          callback(undefined);
          chrome.runtime.lastError = null;
          return;
        }
        callback(options.authToken || 'google-access-token');
      },
      removeCachedAuthToken({ token }, callback) {
        removedAuthTokens.push(token);
        callback?.();
      }
    },
    action: { setPopup: async () => {}, onClicked: event },
    alarms: {
      async create(name, details) {
        alarmState.set(name, { ...details });
      },
      async clear(name) {
        return alarmState.delete(name);
      },
      onAlarm: event
    },
    storage: {
      local: {
        async get(defaults) {
          if (typeof defaults === 'string') {
            return { [defaults]: storageData[defaults] };
          }
          return { ...defaults, ...storageData };
        },
        async set(values) {
          Object.assign(storageData, values);
        }
      },
      session: {
        async get(defaults) {
          if (typeof defaults === 'string') {
            return { [defaults]: sessionStorageData[defaults] };
          }
          return { ...defaults, ...sessionStorageData };
        },
        async set(values) {
          Object.assign(sessionStorageData, values);
        }
      },
      onChanged: event
    },
    tabs: {
      query: async () => windows[0].tabs,
      create: async () => ({}),
      onCreated: event,
      onUpdated: event,
      onAttached: event,
      onDetached: event,
      onMoved: event,
      onReplaced: event,
      onRemoved: event
    },
    tabGroups: { query: async () => [] },
    windows: {
      getAll: async () => windows,
      getLastFocused: async () => windows[0],
      get: async () => windows[0],
      onCreated: event,
      onFocusChanged: event,
      onBoundsChanged: event,
      onRemoved: event
    }
  };
  const context = vm.createContext({
    chrome,
    console,
    setTimeout,
    clearTimeout,
    URL,
    Blob,
    fetch: options.fetch || (async () => { throw new Error('Unexpected fetch'); })
  });
  vm.runInContext(
    `${backgroundSource}\n;globalThis.__saveOnExitTest = { getCurrentAutoSaveRunId, applyAutoSaveSchedule, runAutoSaveNow, refreshAutoSaveExitSnapshot, scheduleAutoSaveExitSnapshotRefresh, hasPendingExitSnapshotRefresh: () => Boolean(exitSnapshotRefreshTimer), runAutoSaveOnExit, handleWindowRemovedForBrowserClose, renameSessionAtIndex, selectCloudSyncManualSessions, mergeCloudSyncManualSessions, loginCloudSync, runCloudSyncPush, runCloudSyncPull };`,
    context
  );
  return {
    storageData,
    sessionStorageData,
    windows,
    alarmState,
    identityCalls,
    removedAuthTokens,
    api: context.__saveOnExitTest
  };
}

test('Chromium session storage creates a new run after a browser restart', async () => {
  const { storageData, sessionStorageData, api } = createHarness();
  delete sessionStorageData.autoSaveRunId;

  const runId = await api.getCurrentAutoSaveRunId();

  assert.match(runId, /^run-\d+-[a-z0-9]+$/);
  assert.notEqual(runId, 'browser-run-one');
  assert.equal(storageData.autoSaveRunId, runId);
  assert.equal(sessionStorageData.autoSaveRunId, runId);
});

test('Save on Exit updates only the snapshot from the current browser run', async () => {
  const { storageData, windows, api } = createHarness();

  await api.refreshAutoSaveExitSnapshot();
  const originalName = storageData.sessions[0].name;
  assert.match(originalName, /^Exit Save \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);

  windows[0].tabs[0].url = 'https://first.example/latest';
  await api.refreshAutoSaveExitSnapshot();

  assert.equal(storageData.sessions.length, 1);
  assert.equal(storageData.sessions[0].name, originalName);
  assert.deepEqual(
    plain(storageData.sessions[0].windows[0].tabs.map((tab) => tab.url)),
    ['https://first.example/latest']
  );
});

test('Save on Exit retains older browser runs and preserves custom names', async () => {
  const { storageData, sessionStorageData, windows, api } = createHarness();

  await api.refreshAutoSaveExitSnapshot();
  assert.equal(await api.renameSessionAtIndex(0, 'My custom exit session'), true);

  storageData.autoSaveRunId = 'browser-run-two';
  sessionStorageData.autoSaveRunId = 'browser-run-two';
  windows[0].tabs[0].url = 'https://second.example/final';
  windows[0].tabs[0].title = 'Second run';
  await api.refreshAutoSaveExitSnapshot();
  await api.runAutoSaveOnExit();

  assert.equal(storageData.sessions.length, 2);
  assert.equal(storageData.sessions[0].name, 'My custom exit session');
  assert.equal(storageData.sessions[0].metadata.autoSaveRunId, 'browser-run-one');
  assert.deepEqual(
    plain(storageData.sessions[0].windows[0].tabs.map((tab) => tab.url)),
    ['https://first.example/start']
  );

  assert.match(
    storageData.sessions[1].name,
    /^Exit Save \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
  );
  assert.equal(storageData.sessions[1].metadata.autoSaveRunId, 'browser-run-two');
  assert.deepEqual(
    plain(storageData.sessions[1].windows[0].tabs.map((tab) => tab.url)),
    ['https://second.example/final']
  );
});

test('scheduled Auto Save and Save on Exit remain independent in all toggle combinations', async (t) => {
  const combinations = [
    { enabled: false, exitEnabled: false },
    { enabled: true, exitEnabled: false },
    { enabled: false, exitEnabled: true },
    { enabled: true, exitEnabled: true }
  ];

  for (const combination of combinations) {
    await t.test(
      `enabled=${combination.enabled}, exitEnabled=${combination.exitEnabled}`,
      async () => {
        const settings = { ...combination, intervalMinutes: 15 };
        const { storageData, windows, alarmState, api } = createHarness({
          storageData: { autoSaveSettings: settings }
        });

        await api.applyAutoSaveSchedule(settings);

        assert.equal(alarmState.has('auto-save-session'), combination.enabled);
        if (combination.enabled) {
          assert.deepEqual(plain(alarmState.get('auto-save-session')), {
            delayInMinutes: 15,
            periodInMinutes: 15
          });
        }

        const scheduledResult = await api.runAutoSaveNow();
        assert.equal(scheduledResult.success === true, combination.enabled);
        if (!combination.enabled) {
          assert.equal(scheduledResult.reason, 'disabled');
        }

        windows.splice(0, windows.length);
        const closeResult = await api.handleWindowRemovedForBrowserClose();
        assert.equal(closeResult.autoSave.success === true, combination.exitEnabled);
        if (!combination.exitEnabled) {
          assert.equal(closeResult.autoSave.reason, 'disabled');
        }

        const scheduledSessions = storageData.sessions.filter(
          (session) => session?.metadata?.saveTrigger === 'scheduled'
        );
        const exitSessions = storageData.sessions.filter(
          (session) => session?.metadata?.saveTrigger === 'exit'
        );
        assert.equal(scheduledSessions.length, combination.enabled ? 1 : 0);
        assert.equal(exitSessions.length, combination.exitEnabled ? 1 : 0);

        if (combination.enabled) {
          assert.equal(scheduledSessions[0].name, 'Auto Save 1');
        }
        if (combination.exitEnabled) {
          assert.match(
            exitSessions[0].name,
            /^Exit Save \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
          );
        }
      }
    );
  }
});

test('changing either Auto Save toggle does not mutate or schedule the other feature', async () => {
  const { storageData, alarmState, api } = createHarness({
    storageData: {
      autoSaveSettings: { enabled: true, intervalMinutes: 20, exitEnabled: true }
    }
  });

  await api.applyAutoSaveSchedule(storageData.autoSaveSettings);
  api.scheduleAutoSaveExitSnapshotRefresh();
  assert.equal(alarmState.has('auto-save-session'), true);
  assert.equal(api.hasPendingExitSnapshotRefresh(), true);

  storageData.autoSaveSettings = { enabled: false, intervalMinutes: 20, exitEnabled: true };
  await api.applyAutoSaveSchedule(storageData.autoSaveSettings);
  assert.equal(alarmState.has('auto-save-session'), false);
  assert.equal(api.hasPendingExitSnapshotRefresh(), true);
  assert.equal((await api.runAutoSaveNow()).reason, 'disabled');
  assert.equal((await api.runAutoSaveOnExit()).success, true);

  api.scheduleAutoSaveExitSnapshotRefresh();
  storageData.autoSaveSettings = { enabled: true, intervalMinutes: 20, exitEnabled: false };
  await api.applyAutoSaveSchedule(storageData.autoSaveSettings);
  assert.equal(alarmState.has('auto-save-session'), true);
  assert.equal(api.hasPendingExitSnapshotRefresh(), false);
  assert.equal((await api.runAutoSaveNow()).success, true);
  assert.equal((await api.runAutoSaveOnExit()).reason, 'disabled');

  storageData.autoSaveSettings = { enabled: false, intervalMinutes: 20, exitEnabled: false };
  await api.applyAutoSaveSchedule(storageData.autoSaveSettings);
  assert.equal(alarmState.has('auto-save-session'), false);
  assert.equal(api.hasPendingExitSnapshotRefresh(), false);
});

test('Settings shows the interval only for scheduled Auto Save', () => {
  assert.match(
    settingsSource,
    /\.auto-save-interval\s*\{[^}]*display:\s*none;/s
  );
  assert.match(
    settingsSource,
    /\.auto-save-interval\.is-visible\s*\{[^}]*display:\s*flex;/s
  );
});

test('Cloud Sync selects only the 10 most recent manual sessions', () => {
  const { api } = createHarness();
  const manualSessions = Array.from({ length: 12 }, (_, index) => ({
    name: `Manual ${index + 1}`,
    timestamp: `2026-08-${String(index + 1).padStart(2, '0')}T10:00:00.000Z`,
    windows: [{ tabs: [{ url: `https://manual-${index + 1}.example/` }] }],
    metadata: {
      saveType: 'manual',
      ...(index === 11 ? { folderId: 'manual-folder' } : {})
    },
    saveType: 'manual'
  }));
  const automaticSessions = [
    {
      name: 'Scheduled auto save',
      timestamp: '2026-08-30T10:00:00.000Z',
      windows: [{ tabs: [{ url: 'https://auto.example/' }] }],
      metadata: { saveType: 'auto', saveTrigger: 'scheduled', folderId: 'auto-folder' },
      saveType: 'auto'
    },
    {
      name: 'Exit Save 2026-08-31 10:00:00',
      timestamp: '2026-08-31T10:00:00.000Z',
      windows: [{ tabs: [{ url: 'https://exit.example/' }] }],
      metadata: { saveType: 'auto', saveTrigger: 'exit' },
      saveType: 'auto'
    }
  ];

  const selected = api.selectCloudSyncManualSessions([
    ...manualSessions,
    ...automaticSessions
  ]);

  assert.equal(selected.length, 10);
  assert.ok(selected.every((session) => session.saveType === 'manual'));
  assert.deepEqual(
    plain(selected.map((session) => session.name)),
    ['Manual 12', 'Manual 11', 'Manual 10', 'Manual 9', 'Manual 8', 'Manual 7', 'Manual 6', 'Manual 5', 'Manual 4', 'Manual 3']
  );
});

test('Cloud Sync pull merges manual sessions without removing local automatic history', () => {
  const { api } = createHarness();
  const localSessions = [
    {
      name: 'Older local manual',
      timestamp: '2026-07-01T10:00:00.000Z',
      windows: [{ tabs: [{ url: 'https://older-local.example/' }] }],
      metadata: { saveType: 'manual' },
      saveType: 'manual'
    },
    {
      name: 'Manual before remote edit',
      timestamp: '2026-08-01T10:00:00.000Z',
      windows: [{ tabs: [{ url: 'https://before.example/' }] }],
      metadata: { saveType: 'manual' },
      saveType: 'manual'
    },
    {
      name: 'Exit Save 2026-08-02 10:00:00',
      timestamp: '2026-08-02T10:00:00.000Z',
      windows: [{ tabs: [{ url: 'https://local-exit.example/' }] }],
      metadata: { saveType: 'auto', saveTrigger: 'exit' },
      saveType: 'auto'
    }
  ];
  const remoteSessions = [
    {
      name: 'Manual edited in cloud',
      timestamp: '2026-08-01T10:00:00.000Z',
      windows: [{ tabs: [{ url: 'https://after.example/' }] }],
      metadata: { saveType: 'manual' },
      saveType: 'manual'
    },
    {
      name: 'New cloud manual',
      timestamp: '2026-08-03T10:00:00.000Z',
      windows: [{ tabs: [{ url: 'https://new.example/' }] }],
      metadata: { saveType: 'manual' },
      saveType: 'manual'
    },
    {
      name: 'Remote auto must be ignored',
      timestamp: '2026-08-04T10:00:00.000Z',
      windows: [{ tabs: [{ url: 'https://remote-auto.example/' }] }],
      metadata: { saveType: 'auto', saveTrigger: 'scheduled' },
      saveType: 'auto'
    }
  ];

  const merged = api.mergeCloudSyncManualSessions(localSessions, remoteSessions);

  assert.deepEqual(
    plain(merged.map((session) => session.name)),
    ['Older local manual', 'Manual edited in cloud', 'Exit Save 2026-08-02 10:00:00', 'New cloud manual']
  );
  assert.ok(merged.some((session) => session.metadata.saveTrigger === 'exit'));
  assert.ok(!merged.some((session) => session.name === 'Remote auto must be ignored'));
});

test('Cloud Sync completes Identity login, manual-only push, and non-destructive pull', async () => {
  const sourceSessions = Array.from({ length: 12 }, (_, index) => ({
    name: `Manual ${index + 1}`,
    timestamp: `2026-08-${String(index + 1).padStart(2, '0')}T10:00:00.000Z`,
    windows: [{ tabs: [{ url: `https://manual-${index + 1}.example/` }] }],
    metadata: {
      saveType: 'manual',
      ...(index === 11 ? { folderId: 'manual-folder' } : {})
    },
    saveType: 'manual'
  }));
  sourceSessions.push(
    {
      name: 'Scheduled local history',
      timestamp: '2026-08-20T10:00:00.000Z',
      windows: [{ tabs: [{ url: 'https://scheduled-local.example/' }] }],
      metadata: { saveType: 'auto', saveTrigger: 'scheduled', folderId: 'auto-folder' },
      saveType: 'auto'
    },
    {
      name: 'Exit Save 2026-08-21 10:00:00',
      timestamp: '2026-08-21T10:00:00.000Z',
      windows: [{ tabs: [{ url: 'https://exit-local.example/' }] }],
      metadata: { saveType: 'auto', saveTrigger: 'exit' },
      saveType: 'auto'
    }
  );

  const requests = [];
  const fetchMock = async (url, options = {}) => {
    const path = new URL(url).pathname;
    const request = {
      path,
      method: options.method || 'GET',
      authorization: options.headers?.Authorization || '',
      body: options.body ? JSON.parse(options.body) : null
    };
    requests.push(request);

    if (path === '/v1/auth/session') {
      return new Response(JSON.stringify({
        success: true,
        profile: {
          userId: 'google:test-user',
          email: 'test@example.invalid',
          name: 'Test User',
          picture: ''
        },
        revision: 1,
        updatedAt: '2026-08-01T00:00:00.000Z'
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (path === '/v1/sync/snapshot' && request.method === 'PUT') {
      return new Response(JSON.stringify({
        success: true,
        revision: 2,
        updatedAt: '2026-08-22T00:00:00.000Z'
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (path === '/v1/sync/snapshot' && request.method === 'GET') {
      return new Response(JSON.stringify({
        success: true,
        revision: 3,
        updatedAt: '2026-07-23T00:00:00.000Z',
        sessions: [
          {
            name: 'Remote manual',
            timestamp: '2026-08-23T10:00:00.000Z',
            windows: [{ tabs: [{ url: 'https://remote-manual.example/' }] }],
            metadata: { saveType: 'manual', folderId: 'remote-folder' },
            saveType: 'manual'
          },
          {
            name: 'Remote auto must be ignored',
            timestamp: '2026-08-24T10:00:00.000Z',
            windows: [{ tabs: [{ url: 'https://remote-auto.example/' }] }],
            metadata: { saveType: 'auto', saveTrigger: 'exit' },
            saveType: 'auto'
          }
        ],
        folders: [{
          id: 'remote-folder',
          name: 'Remote manual folder',
          createdAt: '2026-07-01T00:00:00.000Z'
        }]
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    throw new Error(`Unexpected Cloud Sync request: ${request.method} ${path}`);
  };

  const { storageData, identityCalls, api } = createHarness({
    storageData: {
      sessions: sourceSessions,
      sessionFolders: [
        { id: 'manual-folder', name: 'Local manual folder', createdAt: '2026-06-01T00:00:00.000Z' },
        { id: 'auto-folder', name: 'Local auto-only folder', createdAt: '2026-06-02T00:00:00.000Z' }
      ]
    },
    authToken: 'oauth-token-from-chrome-identity',
    fetch: fetchMock
  });

  const loginResult = await api.loginCloudSync();
  assert.equal(loginResult.success, true);
  assert.equal(loginResult.settings.configured, true);
  assert.equal(loginResult.state.revision, 3);
  assert.deepEqual(plain(identityCalls), [{ interactive: true }, { interactive: false }]);
  assert.equal(requests[0].authorization, 'Bearer oauth-token-from-chrome-identity');
  assert.deepEqual(
    plain(requests.slice(0, 2).map((request) => `${request.method} ${request.path}`)),
    ['POST /v1/auth/session', 'GET /v1/sync/snapshot']
  );

  const pushResult = await api.runCloudSyncPush({ manual: true });
  assert.equal(pushResult.success, true);
  const pushRequest = requests.find((request) => request.method === 'PUT');
  assert.ok(pushRequest);
  assert.equal(pushRequest.body.sessions.length, 10);
  assert.deepEqual(
    plain(pushRequest.body.sessions.map((session) => session.name)),
    ['Remote manual', 'Manual 12', 'Manual 11', 'Manual 10', 'Manual 9', 'Manual 8', 'Manual 7', 'Manual 6', 'Manual 5', 'Manual 4']
  );
  assert.ok(pushRequest.body.sessions.every((session) => session.saveType === 'manual'));
  assert.deepEqual(
    plain(pushRequest.body.folders.map((folder) => folder.id).sort()),
    ['manual-folder', 'remote-folder']
  );
  assert.ok(!pushRequest.body.folders.some((folder) => folder.id === 'auto-folder'));

  const pullResult = await api.runCloudSyncPull({ applyRemote: true });
  assert.equal(pullResult.success, true);
  assert.ok(storageData.sessions.some((session) => session.name === 'Remote manual'));
  assert.ok(storageData.sessions.some((session) => session.name === 'Scheduled local history'));
  assert.ok(storageData.sessions.some((session) => session.name === 'Exit Save 2026-08-21 10:00:00'));
  assert.ok(!storageData.sessions.some((session) => session.name === 'Remote auto must be ignored'));
  assert.ok(storageData.sessionFolders.some((folder) => folder.id === 'auto-folder'));
});

test('Cloud Sync login pulls before push and never overwrites an existing cloud snapshot with an empty device', async () => {
  const requests = [];
  const fetchMock = async (url, options = {}) => {
    const request = {
      path: new URL(url).pathname,
      method: options.method || 'GET'
    };
    requests.push(request);

    if (request.path === '/v1/auth/session') {
      return new Response(JSON.stringify({
        success: true,
        profile: {
          userId: 'google:existing-user',
          email: 'existing@example.invalid',
          name: 'Existing User',
          picture: ''
        },
        revision: 4,
        updatedAt: '2026-07-01T00:00:00.000Z'
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (request.path === '/v1/sync/snapshot' && request.method === 'GET') {
      return new Response(JSON.stringify({
        success: true,
        revision: 4,
        updatedAt: '2026-07-01T00:00:00.000Z',
        sessions: [{
          name: 'Existing cloud manual',
          timestamp: '2026-06-30T10:00:00.000Z',
          windows: [{ tabs: [{ url: 'https://existing-cloud.example/' }] }],
          metadata: { saveType: 'manual' },
          saveType: 'manual'
        }],
        folders: []
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    throw new Error(`Unexpected Cloud Sync request: ${request.method} ${request.path}`);
  };

  const localExitSession = {
    name: 'Exit Save 2026-08-01 10:00:00',
    timestamp: '2026-08-01T10:00:00.000Z',
    windows: [{ tabs: [{ url: 'https://local-exit-only.example/' }] }],
    metadata: { saveType: 'auto', saveTrigger: 'exit' },
    saveType: 'auto'
  };
  const { storageData, api } = createHarness({
    storageData: { sessions: [localExitSession] },
    fetch: fetchMock
  });

  const loginResult = await api.loginCloudSync();
  assert.equal(loginResult.success, true);
  assert.equal(loginResult.state.revision, 4);
  assert.equal(loginResult.state.pending, false);
  assert.deepEqual(
    plain(requests.map((request) => `${request.method} ${request.path}`)),
    ['POST /v1/auth/session', 'GET /v1/sync/snapshot']
  );
  assert.ok(storageData.sessions.some((session) => session.name === 'Existing cloud manual'));
  assert.ok(storageData.sessions.some((session) => session.name === localExitSession.name));

  const pushResult = await api.runCloudSyncPush({ manual: true });
  assert.equal(pushResult.success, true);
  assert.equal(pushResult.skipped, true);
  assert.equal(pushResult.reason, 'no_pending_changes');
  assert.ok(!requests.some((request) => request.method === 'PUT'));
});

test('Cloudflare Worker enforces the same manual-only 10-session policy', () => {
  const context = vm.createContext({
    Blob,
    Date,
    Headers,
    Request,
    Response,
    URL,
    console,
    fetch: async () => { throw new Error('Unexpected fetch'); }
  });
  const testableWorkerSource = workerSource.replace(
    'export default {',
    'globalThis.__workerDefault = {'
  );
  vm.runInContext(
    `${testableWorkerSource}\n;globalThis.__normalizeCloudSessions = normalizeSessions; globalThis.__normalizeCloudFolders = normalizeFolders;`,
    context
  );
  const sourceSessions = Array.from({ length: 12 }, (_, index) => ({
    name: `Worker manual ${index + 1}`,
    timestamp: `2026-09-${String(index + 1).padStart(2, '0')}T10:00:00.000Z`,
    windows: [{ tabs: [{ url: `https://worker-${index + 1}.example/` }] }],
    metadata: {
      saveType: 'manual',
      ...(index === 11 ? { folderId: 'worker-manual-folder' } : {})
    },
    saveType: 'manual'
  }));
  sourceSessions.push({
    name: 'Worker exit save',
    timestamp: '2026-09-30T10:00:00.000Z',
    windows: [{ tabs: [{ url: 'https://worker-exit.example/' }] }],
    metadata: { saveType: 'auto', saveTrigger: 'exit', folderId: 'worker-auto-folder' },
    saveType: 'auto'
  });

  const normalized = context.__normalizeCloudSessions(sourceSessions);

  assert.equal(normalized.length, 10);
  assert.deepEqual(
    plain(normalized.map((session) => session.name)),
    ['Worker manual 12', 'Worker manual 11', 'Worker manual 10', 'Worker manual 9', 'Worker manual 8', 'Worker manual 7', 'Worker manual 6', 'Worker manual 5', 'Worker manual 4', 'Worker manual 3']
  );
  assert.ok(!normalized.some((session) => session.saveType === 'auto'));

  const normalizedFolders = context.__normalizeCloudFolders([
    { id: 'worker-manual-folder', name: 'Manual folder' },
    { id: 'worker-auto-folder', name: 'Auto-only folder' },
    { id: 'unreferenced-folder', name: 'Unreferenced folder' }
  ], normalized);
  assert.deepEqual(
    plain(normalizedFolders.map((folder) => folder.id)),
    ['worker-manual-folder']
  );
});
