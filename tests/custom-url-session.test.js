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

test('every language includes custom URL session copy', () => {
  const { translations } = loadCustomUrlBindings();
  const keys = [
    'add_url_button',
    'add_url_prompt',
    'add_url_invalid',
    'add_url_failed'
  ];

  for (const language of ['en', 'es', 'it', 'fr', 'de']) {
    for (const key of keys) {
      assert.equal(typeof translations[language][key], 'string', `${language}.${key}`);
      assert.ok(translations[language][key].trim().length > 0, `${language}.${key}`);
    }
  }
});
