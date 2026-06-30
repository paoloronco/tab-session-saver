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

function loadPopupAutoSaveBindings(storageValues = {}) {
  const source = readExtensionFile('popup.js');
  const context = vm.createContext({
    URL,
    alert() {},
    chrome: {},
    console,
    document: {
      addEventListener() {},
      getElementById() { return null; },
      querySelectorAll() { return []; }
    },
    localStorage: {
      getItem(key) { return storageValues[key] ?? null; },
      setItem(key, value) { storageValues[key] = String(value); }
    },
    window: {}
  });

  vm.runInContext(
    `${source}\n;globalThis.__autoSavePopupTest = { translations, normalizeAutoSaveSettings, normalizeSessionSnapshot, getSessionsBySaveType, getSessionSaveTrigger, getSessionsByAutoSaveTrigger };`,
    context
  );
  return context.__autoSavePopupTest;
}

function loadBackgroundAutoSaveBindings(chrome) {
  const source = readExtensionFile('background.js');
  const context = vm.createContext({ chrome, console, setTimeout, clearTimeout, URL });
  vm.runInContext(
    `${source}\n;globalThis.__autoSaveBackgroundTest = { applyAutoSaveSchedule, runAutoSaveNow, runAutoSaveOnExit, refreshAutoSaveExitSnapshot };`,
    context
  );
  return context.__autoSaveBackgroundTest;
}

function createAutoSaveChromeHarness() {
  const storageData = { sessions: [] };
  const alarmCalls = [];
  const windows = [{
    id: 10,
    type: 'normal',
    focused: true,
    tabs: [{
      id: 100,
      windowId: 10,
      index: 0,
      url: 'https://example.com/work',
      title: 'Work',
      active: true,
      groupId: -1
    }]
  }];

  const chrome = {
    runtime: {
      OnInstalledReason: { INSTALL: 'install' },
      onInstalled: { addListener() {} },
      onMessage: { addListener() {} },
      setUninstallURL() {},
      getURL(value) { return value; }
    },
    alarms: {
      create: async (name, options) => alarmCalls.push({ type: 'create', name, options }),
      clear: async (name) => {
        alarmCalls.push({ type: 'clear', name });
        return true;
      },
      onAlarm: { addListener() {} }
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
      query: async () => windows[0].tabs
    },
    tabGroups: {
      query: async () => []
    },
    windows: {
      getAll: async () => windows,
      getLastFocused: async () => windows[0],
      get: async () => windows[0]
    }
  };

  return { chrome, alarmCalls, storageData };
}

test('auto save settings default off, clamp to ten minutes, and classify sessions', () => {
  const {
    normalizeAutoSaveSettings,
    normalizeSessionSnapshot,
    getSessionsBySaveType,
    getSessionSaveTrigger,
    getSessionsByAutoSaveTrigger
  } =
    loadPopupAutoSaveBindings();

  assert.deepEqual(plain(normalizeAutoSaveSettings()), {
    enabled: false,
    intervalMinutes: 10,
    exitEnabled: false
  });
  assert.deepEqual(
    plain(normalizeAutoSaveSettings({ enabled: true, intervalMinutes: 3, exitEnabled: true })),
    { enabled: true, intervalMinutes: 10, exitEnabled: true }
  );

  const sessions = [
    normalizeSessionSnapshot({ name: 'Manual', windows: [{ tabs: [{ url: 'https://manual.test' }] }] }),
    normalizeSessionSnapshot({
      name: 'Auto',
      metadata: { saveType: 'auto', saveTrigger: 'scheduled' },
      windows: [{ tabs: [{ url: 'https://auto.test' }] }]
    }),
    normalizeSessionSnapshot({
      name: 'Exit',
      metadata: { saveType: 'auto', saveTrigger: 'exit' },
      windows: [{ tabs: [{ url: 'https://exit.test' }] }]
    })
  ];

  assert.deepEqual(getSessionsBySaveType(sessions, 'manual').map((session) => session.name), ['Manual']);
  assert.deepEqual(getSessionsBySaveType(sessions, 'auto').map((session) => session.name), ['Auto', 'Exit']);
  assert.equal(getSessionSaveTrigger(sessions[0]), 'manual');
  assert.deepEqual(
    getSessionsByAutoSaveTrigger(sessions, 'scheduled').map((session) => session.name),
    ['Auto']
  );
  assert.deepEqual(
    getSessionsByAutoSaveTrigger(sessions, 'exit').map((session) => session.name),
    ['Exit']
  );
});

test('auto save UI exposes settings controls, session tabs, translations, and alarm permission', () => {
  const markup = readExtensionFile('popup.html');
  const manifest = JSON.parse(readExtensionFile('manifest.json'));
  const { translations } = loadPopupAutoSaveBindings();

  assert.match(markup, /class="settings-group-card settings-autosave"/);
  assert.match(markup, /type="checkbox" id="autoSaveEnabled"/);
  assert.match(markup, /type="checkbox" id="autoSaveOnExitEnabled"/);
  assert.match(markup, /id="autoSaveInterval"[^>]*type="number"[^>]*min="10"/);
  assert.match(markup, /id="session-category-manual"[\s\S]*?Manually Saved/);
  assert.match(markup, /id="session-category-auto"[\s\S]*?Auto Saved/);
  assert.match(markup, /id="auto-save-trigger-filters"/);
  assert.ok(manifest.permissions.includes('alarms'));

  for (const language of ['en', 'es', 'it', 'fr', 'de']) {
    for (const key of [
      'auto_save_title',
      'auto_save_description',
      'auto_save_toggle_label',
      'auto_save_on_exit_toggle_label',
      'auto_save_interval_label',
      'manual_sessions_tab',
      'auto_sessions_tab',
      'auto_save_filter_all',
      'auto_save_filter_scheduled',
      'auto_save_filter_exit'
    ]) {
      assert.equal(typeof translations[language][key], 'string', `${language}.${key}`);
      assert.ok(translations[language][key].trim().length > 0, `${language}.${key}`);
    }
  }
});

test('background schedules auto save immediately and stores auto sessions distinctly', async () => {
  const { chrome, alarmCalls, storageData } = createAutoSaveChromeHarness();
  const { applyAutoSaveSchedule, runAutoSaveNow } = loadBackgroundAutoSaveBindings(chrome);

  await applyAutoSaveSchedule({ enabled: true, intervalMinutes: 5 });

  assert.deepEqual(plain(alarmCalls), [
    { type: 'clear', name: 'auto-save-session' },
    {
      type: 'create',
      name: 'auto-save-session',
      options: { delayInMinutes: 10, periodInMinutes: 10 }
    }
  ]);

  await runAutoSaveNow();

  assert.equal(storageData.sessions.length, 1);
  assert.equal(storageData.sessions[0].metadata.saveType, 'auto');
  assert.equal(storageData.sessions[0].metadata.saveTrigger, 'scheduled');
  assert.equal(storageData.sessions[0].saveType, 'auto');
  assert.match(storageData.sessions[0].name, /^Auto Save/);
});

test('background stores an exit auto save from the last persistent snapshot', async () => {
  const { chrome, storageData } = createAutoSaveChromeHarness();
  storageData.autoSaveSettings = { enabled: false, intervalMinutes: 10, exitEnabled: true };
  const {
    refreshAutoSaveExitSnapshot,
    runAutoSaveOnExit
  } = loadBackgroundAutoSaveBindings(chrome);

  await refreshAutoSaveExitSnapshot();
  await runAutoSaveOnExit();

  assert.equal(storageData.sessions.length, 1);
  assert.equal(storageData.sessions[0].metadata.saveType, 'auto');
  assert.equal(storageData.sessions[0].metadata.saveTrigger, 'exit');
  assert.equal(storageData.sessions[0].saveType, 'auto');
  assert.match(storageData.sessions[0].name, /^Exit Save/);
  assert.deepEqual(
    storageData.sessions[0].windows[0].tabs.map((tab) => tab.url),
    ['https://example.com/work']
  );
});
