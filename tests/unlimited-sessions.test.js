const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const extensionRoot = path.join(__dirname, '..', 'Chrome-extension');

function readExtensionFile(filename) {
  return fs.readFileSync(path.join(extensionRoot, filename), 'utf8');
}

function loadSessionCollectionHelper() {
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
    `${source}\n;globalThis.__sessionTest = { combineSessionCollections };`,
    context
  );
  return context.__sessionTest.combineSessionCollections;
}

test('saving or importing sessions preserves every existing and new entry', () => {
  const combineSessionCollections = loadSessionCollectionHelper();
  const existing = Array.from({ length: 12 }, (_, index) => ({ name: `Existing ${index + 1}` }));
  const additions = Array.from({ length: 3 }, (_, index) => ({ name: `New ${index + 1}` }));

  const combined = combineSessionCollections(existing, additions);

  assert.equal(combined.length, 15);
  assert.deepEqual(
    Array.from(combined, (session) => session.name),
    [...existing, ...additions].map((session) => session.name)
  );
});

test('popup no longer exposes or reads a saved-session limit', () => {
  const popupScript = readExtensionFile('popup.js');
  const popupMarkup = readExtensionFile('popup.html');

  assert.doesNotMatch(popupScript, /maxSessions|sessions_limit_label|getMaxSessionsLimit|setMaxSessionsLimit/);
  assert.doesNotMatch(popupMarkup, /maxSessions|sessions_limit_label|Saved sessions limit/i);
});

test('onboarding no longer describes a configurable session limit', () => {
  const welcomeScript = readExtensionFile('welcome.js');
  const welcomeMarkup = readExtensionFile('welcome.html');

  assert.doesNotMatch(welcomeScript, /\blimit_caption\s*:|\blimit\s*:|\btip2\s*:/);
  assert.doesNotMatch(welcomeMarkup, /data-i18n="(?:limit|limit_caption|tip2)"|Saved sessions limit/i);
});
