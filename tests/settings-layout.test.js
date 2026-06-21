const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const extensionRoot = path.join(__dirname, '..', 'Chrome-extension');

function readExtensionFile(filename) {
  return fs.readFileSync(path.join(extensionRoot, filename), 'utf8');
}

function loadTranslations() {
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

  vm.runInContext(`${source}\n;globalThis.__settingsTest = { translations };`, context);
  return context.__settingsTest.translations;
}

test('settings controls are grouped by language, appearance, backup, and browser support', () => {
  const markup = readExtensionFile('popup.html');

  assert.match(markup, /class="settings-group-card settings-language"[\s\S]*?id="language"[\s\S]*?<\/div>/);
  assert.match(markup, /class="settings-group-card settings-appearance"[\s\S]*?id="darkMode"[\s\S]*?id="accentColor"[\s\S]*?<\/section>/);
  assert.match(markup, /class="settings-group-card settings-backup"[\s\S]*?id="exportSessions"[\s\S]*?id="importSessions"[\s\S]*?<\/section>/);
  assert.match(markup, /id="browser-support-group" class="settings-group-card settings-browser-support"/);
});

test('settings footer uses four aligned resource tiles and no line-break layout', () => {
  const markup = readExtensionFile('popup.html');
  const footer = markup.match(/<div class="footer-section">([\s\S]*?)<\/div>\s*<\/section>/)?.[1] || '';

  assert.match(footer, /class="footer-link-grid"/);
  assert.equal((footer.match(/class="footer-link-tile"/g) || []).length, 4);
  assert.doesNotMatch(footer, /<br\s*\/?\s*>/i);
  assert.match(footer, /chromewebstore\.google\.com/);
  assert.match(footer, /paoloronco\.it/);
  assert.match(footer, /github\.com\/paoloronco\/tab-session-saver/);
  assert.match(footer, /sites\.google\.com\/view\/pp-tabssessionsaver/);
});

test('every language translates the new settings group headings', () => {
  const translations = loadTranslations();
  const keys = ['appearance_title', 'backup_title', 'backup_description', 'resources_title'];

  for (const language of ['en', 'es', 'it', 'fr', 'de']) {
    for (const key of keys) {
      assert.equal(typeof translations[language][key], 'string', `${language}.${key}`);
      assert.ok(translations[language][key].trim().length > 0, `${language}.${key}`);
    }
  }
});
