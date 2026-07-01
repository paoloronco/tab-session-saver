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
    `${source}\n;globalThis.__autoSavePopupTest = { translations, normalizeAutoSaveSettings, normalizeSessionSnapshot, getSessionsBySaveType, getSessionSaveTrigger, getSessionsByAutoSaveTrigger, getAutoSaveTopicSignature, getAutoSaveGroupMode, groupAutoSavedSessionsForDisplay };`,
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

  return { chrome, alarmCalls, storageData, windows };
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

test('auto saved sessions group by browser run before topic similarity', () => {
  const {
    normalizeSessionSnapshot,
    groupAutoSavedSessionsForDisplay
  } = loadPopupAutoSaveBindings();
  const sessions = [
    normalizeSessionSnapshot({
      name: 'Run A docs',
      timestamp: '2026-06-30T10:00:00.000Z',
      metadata: { saveType: 'auto', saveTrigger: 'scheduled', autoSaveRunId: 'run-a' },
      windows: [{ tabs: [{ title: 'Docs', url: 'https://docs.example.com/a' }] }]
    }),
    normalizeSessionSnapshot({
      name: 'Run A mail',
      timestamp: '2026-06-30T10:10:00.000Z',
      metadata: { saveType: 'auto', saveTrigger: 'scheduled', autoSaveRunId: 'run-a' },
      windows: [{ tabs: [{ title: 'Mail', url: 'https://mail.other.test/inbox' }] }]
    }),
    normalizeSessionSnapshot({
      name: 'Docs later',
      timestamp: '2026-06-30T12:00:00.000Z',
      metadata: { saveType: 'auto', saveTrigger: 'scheduled' },
      windows: [{ tabs: [{ title: 'Docs', url: 'https://docs.example.com/b' }] }]
    })
  ];

  const groups = groupAutoSavedSessionsForDisplay(
    sessions.map((sessionData, originalIndex) => ({ sessionData, originalIndex }))
  );

  assert.equal(groups.length, 2);
  assert.deepEqual(
    plain(groups.map((group) => group.sessions.map(({ sessionData }) => sessionData.name))),
    [['Docs later'], ['Run A mail', 'Run A docs']]
  );
  assert.equal(groups[1].reason, 'browser');
  assert.equal(groups[1].sessions.length, 2);
});

test('auto saved sessions without run metadata group by similar domains', () => {
  const {
    normalizeSessionSnapshot,
    getAutoSaveTopicSignature,
    groupAutoSavedSessionsForDisplay
  } = loadPopupAutoSaveBindings();
  const sessions = [
    normalizeSessionSnapshot({
      name: 'Docs one',
      timestamp: '2026-06-30T10:00:00.000Z',
      metadata: { saveType: 'auto', saveTrigger: 'scheduled' },
      windows: [{ tabs: [{ title: 'One', url: 'https://docs.example.com/a' }] }]
    }),
    normalizeSessionSnapshot({
      name: 'Docs two',
      timestamp: '2026-06-30T10:10:00.000Z',
      metadata: { saveType: 'auto', saveTrigger: 'scheduled' },
      windows: [{ tabs: [{ title: 'Two', url: 'https://app.example.com/b' }] }]
    }),
    normalizeSessionSnapshot({
      name: 'Separate',
      timestamp: '2026-06-30T10:20:00.000Z',
      metadata: { saveType: 'auto', saveTrigger: 'scheduled' },
      windows: [{ tabs: [{ title: 'Other', url: 'https://project.test/c' }] }]
    })
  ];

  assert.equal(getAutoSaveTopicSignature(sessions[0]), 'example.com');
  assert.equal(getAutoSaveTopicSignature(sessions[1]), 'example.com');

  const groups = groupAutoSavedSessionsForDisplay(
    sessions.map((sessionData, originalIndex) => ({ sessionData, originalIndex }))
  );

  assert.deepEqual(
    plain(groups.map((group) => group.sessions.map(({ sessionData }) => sessionData.name))),
    [['Separate'], ['Docs two', 'Docs one']]
  );
  assert.equal(groups[1].reason, 'topic');
});

test('auto save group mode defaults to smart and accepts supported settings only', () => {
  assert.equal(loadPopupAutoSaveBindings().getAutoSaveGroupMode(), 'smart');
  assert.equal(loadPopupAutoSaveBindings({ autoSaveGroupMode: 'day' }).getAutoSaveGroupMode(), 'day');
  assert.equal(loadPopupAutoSaveBindings({ autoSaveGroupMode: 'session' }).getAutoSaveGroupMode(), 'session');
  assert.equal(loadPopupAutoSaveBindings({ autoSaveGroupMode: 'none' }).getAutoSaveGroupMode(), 'none');
  assert.equal(loadPopupAutoSaveBindings({ autoSaveGroupMode: 'surprise' }).getAutoSaveGroupMode(), 'smart');
});

test('auto saved sessions can group by day or browser session only', () => {
  const {
    normalizeSessionSnapshot,
    groupAutoSavedSessionsForDisplay
  } = loadPopupAutoSaveBindings();
  const sessions = [
    normalizeSessionSnapshot({
      name: 'Morning',
      timestamp: '2026-06-30T08:00:00.000Z',
      metadata: { saveType: 'auto', saveTrigger: 'scheduled', autoSaveRunId: 'run-a' },
      windows: [{ tabs: [{ title: 'Docs', url: 'https://docs.example.com/a' }] }]
    }),
    normalizeSessionSnapshot({
      name: 'Later',
      timestamp: '2026-06-30T16:00:00.000Z',
      metadata: { saveType: 'auto', saveTrigger: 'scheduled', autoSaveRunId: 'run-b' },
      windows: [{ tabs: [{ title: 'Mail', url: 'https://mail.other.test/inbox' }] }]
    }),
    normalizeSessionSnapshot({
      name: 'Next day',
      timestamp: '2026-07-01T08:00:00.000Z',
      metadata: { saveType: 'auto', saveTrigger: 'scheduled', autoSaveRunId: 'run-b' },
      windows: [{ tabs: [{ title: 'Docs', url: 'https://docs.example.com/b' }] }]
    })
  ];
  const matches = sessions.map((sessionData, originalIndex) => ({ sessionData, originalIndex }));

  const dayGroups = groupAutoSavedSessionsForDisplay(matches, 'day');
  assert.deepEqual(
    plain(dayGroups.map((group) => group.sessions.map(({ sessionData }) => sessionData.name))),
    [['Next day'], ['Later', 'Morning']]
  );
  assert.equal(dayGroups[1].reason, 'day');

  const sessionGroups = groupAutoSavedSessionsForDisplay(matches, 'session');
  assert.deepEqual(
    plain(sessionGroups.map((group) => group.sessions.map(({ sessionData }) => sessionData.name))),
    [['Next day', 'Later'], ['Morning']]
  );
  assert.equal(sessionGroups[0].reason, 'browser');
});

test('auto saved sessions can disable grouping', () => {
  const {
    normalizeSessionSnapshot,
    groupAutoSavedSessionsForDisplay
  } = loadPopupAutoSaveBindings();
  const sessions = [
    normalizeSessionSnapshot({
      name: 'One',
      timestamp: '2026-06-30T08:00:00.000Z',
      metadata: { saveType: 'auto', saveTrigger: 'scheduled', autoSaveRunId: 'run-a' },
      windows: [{ tabs: [{ title: 'Docs', url: 'https://docs.example.com/a' }] }]
    }),
    normalizeSessionSnapshot({
      name: 'Two',
      timestamp: '2026-06-30T09:00:00.000Z',
      metadata: { saveType: 'auto', saveTrigger: 'scheduled', autoSaveRunId: 'run-a' },
      windows: [{ tabs: [{ title: 'Docs', url: 'https://docs.example.com/b' }] }]
    })
  ];

  const groups = groupAutoSavedSessionsForDisplay(
    sessions.map((sessionData, originalIndex) => ({ sessionData, originalIndex })),
    'none'
  );

  assert.deepEqual(
    plain(groups.map((group) => group.sessions.map(({ sessionData }) => sessionData.name))),
    [['Two'], ['One']]
  );
  assert.ok(groups.every((group) => group.reason === 'single'));
});

test('auto save UI exposes settings controls, session tabs, translations, and alarm permission', () => {
  const markup = readExtensionFile('popup.html');
  const manifest = JSON.parse(readExtensionFile('manifest.json'));
  const { translations } = loadPopupAutoSaveBindings();

  assert.match(markup, /class="settings-group-card settings-autosave"/);
  assert.match(markup, /type="checkbox" id="autoSaveEnabled"/);
  assert.match(markup, /type="checkbox" id="autoSaveOnExitEnabled"/);
  assert.match(markup, /id="autoSaveInterval"[^>]*type="number"[^>]*min="10"/);
  assert.match(markup, /id="autoSaveGroupMode"[\s\S]*?value="smart"[\s\S]*?value="day"[\s\S]*?value="session"[\s\S]*?value="none"/);
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
      'auto_save_filter_exit',
      'auto_save_group_mode_label',
      'auto_save_group_mode_smart',
      'auto_save_group_mode_day',
      'auto_save_group_mode_session',
      'auto_save_group_mode_none',
      'auto_save_group_browser_title',
      'auto_save_group_day_title',
      'auto_save_group_topic_title',
      'auto_save_group_count'
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
  assert.equal(typeof storageData.sessions[0].metadata.autoSaveRunId, 'string');
  assert.equal(storageData.sessions[0].metadata.autoSaveTopicSignature, 'example.com');
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

test('background keeps an exit save session persisted before Chrome closes', async () => {
  const { chrome, storageData, windows } = createAutoSaveChromeHarness();
  storageData.autoSaveSettings = { enabled: false, intervalMinutes: 10, exitEnabled: true };
  const { refreshAutoSaveExitSnapshot } = loadBackgroundAutoSaveBindings(chrome);

  await refreshAutoSaveExitSnapshot();

  assert.equal(storageData.sessions.length, 1);
  assert.equal(storageData.sessions[0].metadata.saveTrigger, 'exit');
  assert.deepEqual(
    storageData.sessions[0].windows[0].tabs.map((tab) => tab.url),
    ['https://example.com/work']
  );

  windows[0].tabs[0].url = 'https://example.com/updated';
  windows[0].tabs[0].title = 'Updated';
  await refreshAutoSaveExitSnapshot();

  assert.equal(storageData.sessions.length, 1);
  assert.deepEqual(
    storageData.sessions[0].windows[0].tabs.map((tab) => tab.url),
    ['https://example.com/updated']
  );
});
