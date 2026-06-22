const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const extensionRoot = path.join(__dirname, '..', 'Chrome-extension');

function readExtensionFile(filename) {
  return fs.readFileSync(path.join(extensionRoot, filename), 'utf8');
}

function loadPopup(storageValues = {}) {
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
    `${source}\n;globalThis.__restoreSettingTest = { translations, getRestoreMode };`,
    context
  );
  return context.__restoreSettingTest;
}

test('restore mode defaults safely and accepts only supported values', () => {
  assert.equal(loadPopup().getRestoreMode(), 'new_windows');
  assert.equal(loadPopup({ restoreMode: 'current_window' }).getRestoreMode(), 'current_window');
  assert.equal(loadPopup({ restoreMode: 'invalid' }).getRestoreMode(), 'new_windows');
});

test('settings explain both restore behaviors with native radio inputs', () => {
  const markup = readExtensionFile('popup.html');

  assert.match(markup, /class="settings-group-card settings-restore"/);
  assert.match(markup, /type="radio" name="restoreMode" value="new_windows"/);
  assert.match(markup, /type="radio" name="restoreMode" value="current_window"/);
});

test('every language includes complete restore behavior copy', () => {
  const { translations } = loadPopup();
  const keys = [
    'restore_behavior_title',
    'restore_behavior_description',
    'restore_new_windows_label',
    'restore_new_windows_description',
    'restore_current_window_label',
    'restore_current_window_description'
  ];

  for (const language of ['en', 'es', 'it', 'fr', 'de']) {
    for (const key of keys) {
      assert.equal(typeof translations[language][key], 'string', `${language}.${key}`);
      assert.ok(translations[language][key].trim().length > 0, `${language}.${key}`);
    }
  }
});
