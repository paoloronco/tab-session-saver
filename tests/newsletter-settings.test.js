const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const projectRoot = path.join(__dirname, '..');
const extensionRoot = path.join(projectRoot, 'Chrome-extension');

function readProjectFile(...parts) {
  return fs.readFileSync(path.join(projectRoot, ...parts), 'utf8');
}

function readExtensionFile(filename) {
  return fs.readFileSync(path.join(extensionRoot, filename), 'utf8');
}

function loadPopupNewsletterBindings() {
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
    `${source}\n;globalThis.__newsletterTest = { translations, normalizeNewsletterEmail, normalizeNewsletterSubscription };`,
    context
  );
  return context.__newsletterTest;
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test('newsletter settings expose email, subscribe, and status controls', () => {
  const markup = readExtensionFile('popup.html');
  const manifest = JSON.parse(readExtensionFile('manifest.json'));

  assert.match(markup, /class="settings-group-card settings-newsletter"/);
  assert.match(markup, /<form id="newsletter-form"[\s\S]*?novalidate/);
  assert.match(markup, /id="newsletterEmail"[^>]*type="email"/);
  assert.match(markup, /id="newsletterSubmit"[^>]*type="submit"/);
  assert.doesNotMatch(markup, /id="newsletterUnsubscribe"/);
  assert.match(markup, /id="newsletterStatus"[^>]*role="status"/);
  assert.ok(manifest.permissions.includes('storage'));
  assert.ok(manifest.host_permissions.includes('https://tabsessionsaver-newslettersubscribe.paolo-ronco2000.workers.dev/*'));
  assert.ok(!manifest.host_permissions.includes('https://n8n.prhomelab.com/*'));
});

test('newsletter translations and state normalization are available for every language', () => {
  const { translations, normalizeNewsletterEmail, normalizeNewsletterSubscription } = loadPopupNewsletterBindings();
  const keys = [
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

  assert.equal(normalizeNewsletterEmail(' USER@Example.COM '), 'user@example.com');
  assert.equal(normalizeNewsletterEmail('not-an-email'), null);
  assert.deepEqual(
    plain(normalizeNewsletterSubscription({ subscribed: true, email: 'USER@Example.COM', subscribedAt: '2026-07-10T10:00:00.000Z' })),
    { subscribed: true, email: 'user@example.com', subscribedAt: '2026-07-10T10:00:00.000Z' }
  );
  assert.deepEqual(
    plain(normalizeNewsletterSubscription({ subscribed: true, email: 'invalid' })),
    { subscribed: false, email: '', subscribedAt: null }
  );
});

test('newsletter webhook secret is not committed to extension or proxy sources', () => {
  const background = readExtensionFile('background.js');
  const proxy = readProjectFile('newsletter-proxy', 'cloudflare-worker.js');
  const docs = readProjectFile('docs', 'newsletter-proxy.md');
  const combinedSource = [background, proxy, docs].join('\n');

  assert.doesNotMatch(combinedSource, /Bearer\s+[A-Za-z0-9_-]{16,}/);
  assert.match(background, /NEWSLETTER_SUBSCRIBE_ENDPOINT/);
  assert.doesNotMatch(background, /NEWSLETTER_UNSUBSCRIBE_ENDPOINT/);
  assert.match(proxy, /TSS_N8N_BEARER_TOKEN/);
  assert.match(proxy, /JSON\.stringify\(\{ email \}\)/);
});
