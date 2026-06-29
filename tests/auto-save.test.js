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
    `${source}\n;globalThis.__autoSavePopupTest = { translations, normalizeAutoSaveSettings, normalizeSessionSnapshot, getSessionsBySaveType };`,
    context
  );
  return context.__autoSavePopupTest;
}

function loadBackgroundAutoSaveBindings(chrome) {
  const source = readExtensionFile('background.js');
  const context = vm.createContext({ chrome, console, setTimeout, URL });
  vm.runInContext(
    `${source}\n;globalThis.__autoSaveBackgroundTest = { applyAutoSaveSchedule, runAutoSaveNow };`,
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
  const { normalizeAutoSaveSettings, normalizeSessionSnapshot, getSessionsBySaveType } =
    loadPopupAutoSaveBindings();

  assert.deepEqual(plain(normalizeAutoSaveSettings()), { enabled: false, intervalMinutes: 10 });
  assert.deepEqual(
    plain(normalizeAutoSaveSettings({ enabled: true, intervalMinutes: 3 })),
    { enabled: true, intervalMinutes: 10 }
  );

  const sessions = [
    normalizeSessionSnapshot({ name: 'Manual', windows: [{ tabs: [{ url: 'https://manual.test' }] }] }),
    normalizeSessionSnapshot({
      name: 'Auto',
      metadata: { saveType: 'auto' },
      windows: [{ tabs: [{ url: 'https://auto.test' }] }]
    })
  ];

  assert.deepEqual(getSessionsBySaveType(sessions, 'manual').map((session) => session.name), ['Manual']);
  assert.deepEqual(getSessionsBySaveType(sessions, 'auto').map((session) => session.name), ['Auto']);
});

test('auto save UI exposes settings controls, session tabs, translations, and alarm permission', () => {
  const markup = readExtensionFile('popup.html');
  const manifest = JSON.parse(readExtensionFile('manifest.json'));
  const { translations } = loadPopupAutoSaveBindings();

  assert.match(markup, /class="settings-group-card settings-autosave"/);
  assert.match(markup, /type="checkbox" id="autoSaveEnabled"/);
  assert.match(markup, /id="autoSaveInterval"[^>]*type="number"[^>]*min="10"/);
  assert.match(markup, /id="session-category-manual"[\s\S]*?Manually Saved/);
  assert.match(markup, /id="session-category-auto"[\s\S]*?Auto Saved/);
  assert.ok(manifest.permissions.includes('alarms'));

  for (const language of ['en', 'es', 'it', 'fr', 'de']) {
    for (const key of [
      'auto_save_title',
      'auto_save_description',
      'auto_save_toggle_label',
      'auto_save_interval_label',
      'manual_sessions_tab',
      'auto_sessions_tab'
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
  assert.equal(storageData.sessions[0].saveType, 'auto');
  assert.match(storageData.sessions[0].name, /^Auto Save/);
});
