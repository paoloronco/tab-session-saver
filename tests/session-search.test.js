const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const extensionRoot = path.join(__dirname, '..', 'Chrome-extension');

function readExtensionFile(filename) {
  return fs.readFileSync(path.join(extensionRoot, filename), 'utf8');
}

function loadSearchBindings(documentOverride) {
  const source = readExtensionFile('popup.js');
  const context = vm.createContext({
    URL,
    alert() {},
    chrome: {},
    console,
    document: documentOverride || {
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
    `${source}\n;globalThis.__sessionSearchTest = { translations, translatePage, sessionMatchesQuery, getMatchingSessions };`,
    context
  );
  return context.__sessionSearchTest;
}

const sessions = [
  {
    name: 'Client Work',
    windows: [{
      tabs: [
        { title: 'Quarterly Report', url: 'https://docs.example.com/reports/q2' },
        { title: 'Inbox', url: 'https://mail.example.net/' }
      ]
    }]
  },
  {
    name: 'Personal',
    windows: [{ tabs: [{ title: 'Recipes', url: 'https://food.test/pasta' }] }]
  },
  {
    name: 'Research',
    windows: [{ tabs: [{ title: 'Web Platform', url: 'https://developer.mozilla.org/' }] }]
  }
];

test('session search matches names, tab titles, URLs, and domains case-insensitively', () => {
  const { sessionMatchesQuery } = loadSearchBindings();

  assert.equal(sessionMatchesQuery(sessions[0], 'CLIENT WORK'), true);
  assert.equal(sessionMatchesQuery(sessions[0], 'quarterly report'), true);
  assert.equal(sessionMatchesQuery(sessions[0], 'REPORTS/Q2'), true);
  assert.equal(sessionMatchesQuery(sessions[0], 'docs.example.com'), true);
  assert.equal(sessionMatchesQuery(sessions[0], 'unrelated'), false);
  assert.equal(sessionMatchesQuery(sessions[0], '   '), true);
});

test('toolbar provides an accessible expandable search and a no-results state', () => {
  const markup = readExtensionFile('popup.html');

  assert.match(markup, /class="session-toolbar"/);
  assert.match(markup, /id="session-search-toggle"[^>]*aria-expanded="false"/);
  assert.match(markup, /id="session-search-input"[^>]*type="search"/);
  assert.match(markup, /id="session-search-close"/);
  assert.match(markup, /id="search-empty-state"/);
  assert.match(markup, /@media \(prefers-reduced-motion: reduce\)/);
});

test('every language includes complete search copy', () => {
  const { translations } = loadSearchBindings();
  const keys = [
    'search_sessions_label',
    'search_sessions_placeholder',
    'close_search_label',
    'search_no_results_title',
    'search_no_results_description'
  ];

  for (const language of ['en', 'es', 'it', 'fr', 'de']) {
    for (const key of keys) {
      assert.equal(typeof translations[language][key], 'string', `${language}.${key}`);
      assert.ok(translations[language][key].trim().length > 0, `${language}.${key}`);
    }
  }
});

test('changing language updates search placeholder and accessible labels', () => {
  const attributes = new Map([
    ['data-translate-placeholder', 'search_sessions_placeholder'],
    ['data-translate-aria-label', 'search_sessions_label']
  ]);
  const searchElement = {
    getAttribute(name) { return attributes.get(name); },
    setAttribute(name, value) { attributes.set(name, value); }
  };
  const documentStub = {
    addEventListener() {},
    getElementById() { return null; },
    querySelectorAll(selector) {
      if (selector === '[data-translate-placeholder]' || selector === '[data-translate-aria-label]') {
        return [searchElement];
      }
      return [];
    }
  };
  const { translatePage } = loadSearchBindings(documentStub);

  translatePage('it');

  assert.equal(attributes.get('placeholder'), 'Cerca sessioni, schede o siti');
  assert.equal(attributes.get('aria-label'), 'Cerca nelle sessioni salvate');
});

test('filtered sessions retain their original storage indexes', () => {
  const { getMatchingSessions } = loadSearchBindings();

  const matches = getMatchingSessions(sessions, 'developer.mozilla');

  assert.equal(matches.length, 1);
  assert.equal(matches[0].originalIndex, 2);
  assert.equal(matches[0].sessionData.name, 'Research');
});
