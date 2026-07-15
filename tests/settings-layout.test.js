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
  assert.match(markup, /class="settings-group-card settings-autosave"[\s\S]*?id="autoSaveEnabled"[\s\S]*?id="autoSaveOnExitEnabled"[\s\S]*?id="autoSaveInterval"[\s\S]*?<\/section>/);
  assert.match(markup, /class="settings-group-card settings-newsletter"[\s\S]*?id="newsletterEmail"[\s\S]*?id="newsletterSubmit"[\s\S]*?<\/section>/);
  assert.doesNotMatch(markup, /id="newsletterUnsubscribe"/);
  assert.match(markup, /class="settings-group-card settings-backup"[\s\S]*?id="exportSessions"[\s\S]*?id="importSessions"[\s\S]*?<\/section>/);
  assert.match(markup, /id="browser-support-group" class="settings-group-card settings-browser-support"/);
});

test('auto saved sessions expose scheduled and on-exit filters', () => {
  const markup = readExtensionFile('popup.html');

  assert.match(markup, /id="auto-save-trigger-filters"[\s\S]*?data-auto-save-trigger="all"[\s\S]*?data-auto-save-trigger="scheduled"[\s\S]*?data-auto-save-trigger="exit"/);
  assert.match(markup, /data-translate="auto_save_filter_all"/);
  assert.match(markup, /data-translate="auto_save_filter_scheduled"/);
  assert.match(markup, /data-translate="auto_save_filter_exit"/);
});

test('auto save on exit toggle uses the same simple layout as the main auto save toggle', () => {
  const markup = readExtensionFile('popup.html');
  const exitToggle = markup.match(
    /<div class="toggle-container">\s*<span data-translate="auto_save_on_exit_toggle_label">[\s\S]*?<input type="checkbox" id="autoSaveOnExitEnabled">[\s\S]*?<\/div>/
  )?.[0] || '';

  assert.ok(exitToggle, 'expected a simple label-plus-switch auto save on exit toggle');
  assert.doesNotMatch(exitToggle, /settings-description/);
  assert.doesNotMatch(exitToggle, /auto_save_on_exit_description/);
});

test('settings footer separates extension links from secondary links without resource cards', () => {
  const markup = readExtensionFile('popup.html');
  const footer = markup.match(/<div class="footer-section">([\s\S]*?)<\/div>\s*<\/section>/)?.[1] || '';

  assert.match(footer, /class="extension-primary-links"/);
  assert.match(footer, /class="footer-secondary-links"/);
  assert.doesNotMatch(footer, /footer-link-grid|footer-link-tile/);
  assert.doesNotMatch(footer, /<br\s*\/?\s*>/i);
  assert.match(footer, /chromewebstore\.google\.com/);
  assert.match(footer, /github\.com\/paoloronco\/tab-session-saver/);
  assert.match(footer, /tabsessionsaver\.paoloronco\.it\//);
  assert.match(footer, /tabsessionsaver\.paoloronco\.it\/legal/);
  assert.match(footer, /tabsessionsaver\.paoloronco\.it\/privacy/);
  assert.match(footer, /tabsessionsaver\.paoloronco\.it\/terms/);
  assert.match(footer, /tabsessionsaver\.paoloronco\.it\/oauth-disclosure/);
  assert.match(footer, /tabsessionsaver\.paoloronco\.it\/data-deletion/);
  assert.match(footer, /class="footer-version-line"/);
  assert.match(footer, /class="footer-copyright-line"/);
  assert.ok(
    footer.indexOf('class="footer-version-line"') < footer.indexOf('class="footer-secondary-links"'),
    'expected website and legal links to appear below the version line'
  );
});

test('every language translates the new settings group headings', () => {
  const translations = loadTranslations();
  const keys = [
    'appearance_title',
    'backup_title',
    'backup_description',
    'resources_title',
    'github_link',
    'developer_website_link',
    'auto_save_on_exit_toggle_label',
    'auto_save_filter_group_label',
    'auto_save_filter_all',
    'auto_save_filter_scheduled',
    'auto_save_filter_exit',
    'newsletter_title',
    'newsletter_description',
    'newsletter_email_label',
    'newsletter_email_placeholder',
    'newsletter_subscribe_button',
    'newsletter_subscribed_status',
    'newsletter_duplicate_status',
    'newsletter_invalid_email',
    'newsletter_subscribe_loading',
    'newsletter_configuration_error',
    'newsletter_request_error'
  ];

  for (const language of ['en', 'es', 'it', 'fr', 'de']) {
    for (const key of keys) {
      assert.equal(typeof translations[language][key], 'string', `${language}.${key}`);
      assert.ok(translations[language][key].trim().length > 0, `${language}.${key}`);
    }
  }
});
