const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const extensionRoot = path.join(__dirname, '..', 'Chrome-extension');

function readExtensionFile(filename) {
  return fs.readFileSync(path.join(extensionRoot, filename), 'utf8');
}

function loadCustomUrlBindings() {
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
      getItem() { return null; },
      setItem() {}
    },
    window: {}
  });

  vm.runInContext(
    `${source}\n;globalThis.__customUrlTest = { addCustomUrlToSession, getCustomUrlTabFromInput, translations };`,
    context
  );
  return context.__customUrlTest;
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test('custom URL input creates a restorable tab with an inferred https protocol', () => {
  const { getCustomUrlTabFromInput } = loadCustomUrlBindings();

  assert.deepEqual(plain(getCustomUrlTabFromInput('example.com/docs')), {
    title: 'example.com/docs',
    url: 'https://example.com/docs',
    pinned: false,
    active: false,
    muted: false,
    favIconUrl: null,
    audible: false,
    discarded: false,
    index: null,
    groupId: -1
  });
});

test('custom URL input rejects unsupported explicit protocols', () => {
  const { getCustomUrlTabFromInput } = loadCustomUrlBindings();

  assert.equal(getCustomUrlTabFromInput('mailto:hello@example.com'), null);
  assert.equal(getCustomUrlTabFromInput('javascript:alert(1)'), null);
});

test('plain text session item input becomes a restorable search URL', () => {
  const { getCustomUrlTabFromInput } = loadCustomUrlBindings();
  const tab = getCustomUrlTabFromInput('quarterly planning notes');

  assert.equal(tab.title, 'quarterly planning notes');
  assert.equal(tab.url, 'https://www.google.com/search?q=quarterly%20planning%20notes');
});

test('custom URL can be appended to the last saved window in a session', () => {
  const { addCustomUrlToSession } = loadCustomUrlBindings();
  const session = {
    name: 'Work',
    timestamp: '2026-06-30T10:00:00.000Z',
    windows: [
      {
        tabs: [{ title: 'Existing', url: 'https://existing.test', groupId: -1 }],
        groups: []
      }
    ]
  };

  const updated = addCustomUrlToSession(session, 'https://new.test/page');

  assert.notEqual(updated, session);
  assert.equal(updated.windows[0].tabs.length, 2);
  assert.deepEqual(
    updated.windows[0].tabs.map((tab) => tab.url),
    ['https://existing.test', 'https://new.test/page']
  );
  assert.equal(updated.windows[0].tabs[1].title, 'https://new.test/page');
});

test('custom item input can be added as a new saved window', () => {
  const { addCustomUrlToSession } = loadCustomUrlBindings();
  const session = {
    name: 'Work',
    timestamp: '2026-06-30T10:00:00.000Z',
    windows: [
      {
        tabs: [{ title: 'Existing', url: 'https://existing.test', groupId: -1 }],
        groups: []
      }
    ]
  };

  const updated = addCustomUrlToSession(session, 'project roadmap', { newWindow: true });

  assert.equal(updated.windows.length, 2);
  assert.equal(updated.windows[1].tabs.length, 1);
  assert.equal(updated.windows[1].tabs[0].url, 'https://www.google.com/search?q=project%20roadmap');
});

test('session menu exposes item and window add actions', () => {
  const popupScript = readExtensionFile('popup.js');

  assert.match(popupScript, /addItemBtn\.textContent = getTranslation\('add_session_item_button'\)/);
  assert.match(popupScript, /addWindowBtn\.textContent = getTranslation\('add_session_window_button'\)/);
  assert.match(popupScript, /addCustomUrlToSession\(sessionPayload, itemInput, \{ newWindow: true \}\)/);
});

test('every language includes custom URL session copy', () => {
  const { translations } = loadCustomUrlBindings();
  const keys = [
    'add_url_button',
    'add_session_item_button',
    'add_session_window_button',
    'add_url_prompt',
    'add_url_invalid',
    'add_url_failed',
    'remove_window_button',
    'remove_window_confirm',
    'remove_tab_confirm'
  ];

  for (const language of ['en', 'es', 'it', 'fr', 'de']) {
    for (const key of keys) {
      assert.equal(typeof translations[language][key], 'string', `${language}.${key}`);
      assert.ok(translations[language][key].trim().length > 0, `${language}.${key}`);
    }
  }
});
