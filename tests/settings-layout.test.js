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

test('settings controls are grouped in a clear feature order', () => {
  const markup = readExtensionFile('settings.html');

  assert.match(markup, /class="settings-group-card settings-language"[\s\S]*?id="language"[\s\S]*?<\/section>/);
  assert.match(markup, /class="settings-group-card settings-appearance"[\s\S]*?id="darkMode"[\s\S]*?id="accentColor"[\s\S]*?<\/section>/);
  assert.match(markup, /class="settings-group-card settings-autosave"[\s\S]*?id="autoSaveEnabled"[\s\S]*?id="autoSaveOnExitEnabled"[\s\S]*?id="autoSaveInterval"[\s\S]*?<\/section>/);
  assert.match(markup, /class="settings-group-card settings-backup"[\s\S]*?id="exportSessions"[\s\S]*?id="importSessions"[\s\S]*?<\/section>/);
  assert.match(markup, /class="settings-group-card settings-cloud-sync"[\s\S]*?data-translate="cloud_sync_limits_note"[\s\S]*?id="cloudSyncLogin"[\s\S]*?id="cloudSyncPush"[\s\S]*?id="cloudSyncPull"[\s\S]*?id="cloudSyncDisconnect"[\s\S]*?<\/section>/);
  assert.match(markup, /class="settings-group-card settings-newsletter"[\s\S]*?id="newsletterEmail"[\s\S]*?id="newsletterSubmit"[\s\S]*?<\/section>/);
  assert.doesNotMatch(markup, /id="newsletterUnsubscribe"/);
  assert.match(markup, /id="browser-support-group" class="settings-group-card settings-browser-support"/);
  assert.ok(markup.indexOf('settings-backup') < markup.indexOf('settings-cloud-sync'));
  assert.ok(markup.indexOf('settings-cloud-sync') < markup.indexOf('settings-newsletter'));
});

test('popup opens settings in a dedicated browser tab', () => {
  const popupMarkup = readExtensionFile('popup.html');
  const popupScript = readExtensionFile('popup.js');
  const manifest = JSON.parse(readExtensionFile('manifest.json'));

  assert.match(popupMarkup, /id="settings-icon"/);
  assert.doesNotMatch(popupMarkup, /id="settings-section"/);
  assert.match(popupScript, /chrome\.tabs\.create\(\{\s*url:\s*chrome\.runtime\.getURL\('settings\.html'\)\s*\}\)/);
  assert.equal(manifest.options_page, 'settings.html');
});

test('settings page uses a sidebar navigation for feature sections', () => {
  const markup = readExtensionFile('settings.html');

  assert.match(markup, /class="settings-shell"/);
  assert.match(markup, /class="settings-sidebar"/);
  assert.match(markup, /class="settings-nav"[\s\S]*href="#general"[\s\S]*href="#appearance"[\s\S]*href="#restore"[\s\S]*href="#automation"[\s\S]*href="#data"[\s\S]*href="#cloud"[\s\S]*href="#newsletter"[\s\S]*href="#resources"/);
});

test('settings page keeps controls readable and separates informational sections', () => {
  const markup = readExtensionFile('settings.html');

  assert.match(markup, /\.settings-appearance,\s*[\s\S]*?\.settings-restore,/);
  assert.match(markup, /\.setting-group\s*\{[\s\S]*?max-width:\s*520px;/);
  assert.match(markup, /\.settings-actions button,\s*[\s\S]*?\.newsletter-actions button\s*\{[\s\S]*?flex:\s*0 0 auto;/);
  assert.match(markup, /class="settings-info-break"/);
  assert.match(markup, /\.settings-browser-support,\s*[\s\S]*?\.footer-section\s*\{[\s\S]*?border:\s*1px dashed/);
});

test('huge popup size routes the extension action to a full browser tab', () => {
  const background = readExtensionFile('background.js');
  const popupScript = readExtensionFile('popup.js');

  assert.match(background, /chrome\.action\.setPopup\(\{\s*popup:\s*size === 'huge' \? '' : 'popup\.html'\s*\}\)/);
  assert.match(background, /chrome\.action\.onClicked\.addListener/);
  assert.match(background, /chrome\.tabs\.create\(\{\s*url:\s*chrome\.runtime\.getURL\('popup\.html\?view=tab'\)/);
  assert.match(popupScript, /isFullTabPopupView[\s\S]*?new URLSearchParams\(window\.location\.search\)\.get\('view'\) === 'tab'/);
  assert.match(popupScript, /selectedSize === 'huge' && isPopupPage && !isFullTabPopupView[\s\S]*?\? 'large'/);
  assert.match(popupScript, /chrome\.storage\.local\.set\(\{\s*popupSize:\s*storedSize\s*\}\)/);
});

test('popup uses a single vertical scroll owner per layout mode', () => {
  const markup = readExtensionFile('popup.html');
  const previewItemsRule = markup.match(/\.preview-items\s*\{[\s\S]*?\}/)?.[0] || '';

  assert.match(markup, /\.popup\s*\{[\s\S]*?overflow-y:\s*auto;[\s\S]*?overflow-x:\s*hidden;/);
  assert.match(markup, /body\.size-huge \.popup\s*\{[\s\S]*?overflow:\s*hidden;/);
  assert.match(markup, /body\.size-huge #main-section\s*\{[\s\S]*?overflow-y:\s*auto;[\s\S]*?overflow-x:\s*hidden;/);
  assert.doesNotMatch(previewItemsRule, /overflow-y:\s*auto/);
  assert.doesNotMatch(previewItemsRule, /max-height:/);
});

test('auto saved sessions expose scheduled and on-exit filters', () => {
  const markup = readExtensionFile('popup.html');

  assert.match(markup, /id="auto-save-trigger-filters"[\s\S]*?data-auto-save-trigger="all"[\s\S]*?data-auto-save-trigger="scheduled"[\s\S]*?data-auto-save-trigger="exit"/);
  assert.match(markup, /data-translate="auto_save_filter_all"/);
  assert.match(markup, /data-translate="auto_save_filter_scheduled"/);
  assert.match(markup, /data-translate="auto_save_filter_exit"/);
});

test('auto save on exit toggle uses the same simple layout as the main auto save toggle', () => {
  const markup = readExtensionFile('settings.html');
  const exitToggle = markup.match(
    /<div class="toggle-container">\s*<span data-translate="auto_save_on_exit_toggle_label">[\s\S]*?<input type="checkbox" id="autoSaveOnExitEnabled">[\s\S]*?<\/div>/
  )?.[0] || '';

  assert.ok(exitToggle, 'expected a simple label-plus-switch auto save on exit toggle');
  assert.doesNotMatch(exitToggle, /settings-description/);
  assert.doesNotMatch(exitToggle, /auto_save_on_exit_description/);
});

test('settings footer separates extension links from secondary links without resource cards', () => {
  const markup = readExtensionFile('settings.html');
  const footer = markup.match(/<section id="resources" class="footer-section">([\s\S]*?)<\/section>/)?.[1] || '';

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
    'popup_size_label',
    'popup_size_small',
    'popup_size_medium',
    'popup_size_large',
    'popup_size_huge',
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
    'newsletter_request_error',
    'cloud_sync_title',
    'cloud_sync_description',
    'cloud_sync_limits_note',
    'cloud_sync_auto_note',
    'cloud_sync_register_button',
    'cloud_sync_push_button',
    'cloud_sync_pull_button',
    'cloud_sync_disconnect_button',
    'cloud_sync_not_configured',
    'cloud_sync_registered',
    'cloud_sync_account_label',
    'cloud_sync_pushed',
    'cloud_sync_pulled',
    'cloud_sync_disconnected',
    'cloud_sync_request_error',
    'cloud_sync_quota_exceeded',
    'cloud_sync_rate_limited',
    'cloud_sync_no_pending_changes',
    'cloud_sync_status_idle',
    'cloud_sync_status_pending',
    'cloud_sync_status_synced'
  ];

  for (const language of ['en', 'es', 'it', 'fr', 'de']) {
    for (const key of keys) {
      assert.equal(typeof translations[language][key], 'string', `${language}.${key}`);
      assert.ok(translations[language][key].trim().length > 0, `${language}.${key}`);
    }
  }
});
