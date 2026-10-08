const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const extension = path.join(__dirname, '../Chrome-extension');
const source = fs.readFileSync(path.join(extension, 'background.js'), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));
const bytes = data => Object.entries(data).reduce((sum, [key, value]) => sum + Buffer.byteLength(key + JSON.stringify(value)), 0);

function session(name, type = 'auto', trigger = 'scheduled', day = 1, url = 'https://private.example/account') {
  return { name, timestamp: `2026-10-${String(day).padStart(2, '0')}T10:00:00.000Z`, saveType: type,
    windows: [{ tabs: [{ url, title: 'Private title', pinned: true }], groups: [] }],
    metadata: { saveType: type, ...(type === 'auto' ? { saveTrigger: trigger } : {}) } };
}

function harness(initial = {}, options = {}) {
  let data = plain({ sessions: [], ...initial });
  let listener;
  const event = { addListener() {} };
  const chrome = {
    runtime: { onInstalled: event, onMessage: { addListener(fn) { listener = fn; } },
      getManifest: () => ({ version: '8.0.1' }) },
    storage: { local: {
      QUOTA_BYTES: options.quota || 10 * 1024 * 1024,
      async get(keys) {
        if (keys == null) return plain(data);
        if (typeof keys === 'string') return plain({ [keys]: data[keys] });
        return plain(Object.fromEntries(Object.entries(keys).map(([key, fallback]) => [key, data[key] ?? fallback])));
      },
      async getBytesInUse() { return bytes(data); },
      async set(values) {
        if (options.failWrite) throw new Error('Disk write failed');
        const next = plain({ ...data, ...values });
        if (bytes(next) > chrome.storage.local.QUOTA_BYTES) throw new Error('QUOTA_BYTES quota exceeded');
        data = next;
      }
    }, onChanged: event }
  };
  const context = vm.createContext({ chrome, Blob, URL, setTimeout, clearTimeout,
    console: { warn() {}, error() {}, log() {} },
    importScripts(file) { vm.runInContext(fs.readFileSync(path.join(extension, file), 'utf8'), context); }
  });
  vm.runInContext(source + '\n globalThis.api = { writeLocalStorage, persistSessions, planAutoSaveCleanup, storeAutoSaveSessionFromSnapshot, exportDiagnostics, diagnostics: SessionDiagnostics };', context);
  return { api: context.api, chrome, data: () => plain(data),
    request: request => new Promise(resolve => listener(request, {}, resolve)) };
}

test('cleanup stays inactive below 90% and never modifies manual sessions', async () => {
  const sessions = [session('Manual', 'manual'), session('Old'), session('New', 'auto', 'scheduled', 8)];
  const h = harness({ sessions });
  await h.api.persistSessions(sessions);
  assert.deepEqual(h.data().sessions, sessions);
  const plan = h.api.planAutoSaveCleanup(sessions, 899, 1000);
  assert.equal(plan.removed, 0);
  assert.equal(plan.sessions, sessions);
});

test('cleanup prefers exact duplicate autos, preserves manual data and latest saves for both triggers', () => {
  const manual = session('Keep manually', 'manual');
  const unique = session('Old unique', 'auto', 'scheduled', 1, 'https://unique.example');
  const duplicate = session('Duplicate', 'auto', 'scheduled', 2);
  const newest = session('Newest scheduled', 'auto', 'scheduled', 8);
  const exit = session('Newest exit', 'auto', 'exit', 7, 'https://exit.example');
  const sessions = [manual, unique, duplicate, newest, exit];
  const quota = 4000;
  const projected = quota * 0.85 + Buffer.byteLength(JSON.stringify(duplicate)) + 1;
  const plan = harness().api.planAutoSaveCleanup(sessions, projected, quota);
  assert.equal(plan.removed, 1);
  assert.deepEqual(plain(plan.sessions), [manual, unique, newest, exit]);
  assert.deepEqual(sessions, [manual, unique, duplicate, newest, exit]);
});

test('near-quota writes commit cleanup atomically, log it, and preserve the protected edited auto', async () => {
  const sessions = Array.from({ length: 20 }, (_, i) => session(`Auto ${i}`, 'auto', 'scheduled', i + 1));
  sessions.unshift(session('Manual', 'manual'));
  const initial = { sessions };
  const originalCount = sessions.length;
  const quota = Math.ceil(bytes(initial) / 0.95);
  const h = harness(initial, { quota });
  const protectedSession = sessions[1];
  await h.api.writeLocalStorage({ sessions }, { protectedSession });
  assert.ok(h.data().sessions.length < originalCount);
  assert.ok(h.data().sessions.some(s => s.name === 'Auto 0'));
  assert.ok(h.data().sessions.some(s => s.name === 'Auto 19'));
  assert.deepEqual(h.data().sessions[0], initial.sessions[0]);
  assert.ok(bytes(h.data()) <= quota * 0.85);
  const logs = await h.api.diagnostics.readLogs();
  assert.ok(logs.some(entry => entry.operation === 'auto_save_cleanup' && entry.metrics.removed > 0));
});

test('failed writes never delete existing automatic history or mutate the caller collection', async () => {
  const sessions = Array.from({ length: 15 }, (_, i) => session(`Auto ${i}`, 'auto', 'scheduled', i + 1));
  const before = plain(sessions);
  const h = harness({ sessions }, { quota: Math.ceil(bytes({ sessions }) / 0.96), failWrite: true });
  await assert.rejects(h.api.writeLocalStorage({ sessions }), /Disk write failed/);
  assert.deepEqual(h.data().sessions, before);
  assert.deepEqual(sessions, before);
});

test('full manual storage fails clearly, retains sessions, and still records diagnostics', async () => {
  const sessions = [session('Manual', 'manual')];
  const h = harness({ sessions }, { quota: bytes({ sessions }) + 20 });
  const response = await h.request({ action: 'replace_sessions', sessions: [...sessions, session('Another manual', 'manual')] });
  assert.equal(response.success, false);
  assert.equal(response.code, 'STORAGE_FULL');
  assert.deepEqual(h.data().sessions, sessions);
  assert.ok((await h.api.diagnostics.readLogs()).some(entry => entry.code === 'STORAGE_FULL'));
});

test('a cloud scheduling failure after a successful local save does not report save failure', async () => {
  const sessions = [session('Saved', 'manual')];
  const h = harness({ cloudSyncSettings: { enabled: true } });
  const set = h.chrome.storage.local.set;
  h.chrome.storage.local.set = async values => {
    if (values.cloudSyncState) throw new Error('Cloud status write failed');
    await set(values);
  };
  await h.api.persistSessions(sessions);
  assert.deepEqual(h.data().sessions, sessions);
  const logs = await h.api.diagnostics.readLogs();
  assert.ok(logs.some(entry => entry.operation === 'cloud_sync_failed'), JSON.stringify(logs));
});

test('anonymous diagnostics contain no URLs, titles, names, email, account IDs or tokens', async () => {
  const h = harness({ sessions: [session('Sensitive session name', 'manual')],
    cloudSyncSettings: { enabled: true, profile: { userId: 'private-user-id', email: 'private@example.com' }, accessToken: 'private-token' },
    newsletterSubscription: { email: 'newsletter@example.com' } });
  await h.api.diagnostics.record('capture_failed', new Error('Private title at https://secret.example/path?access_token=secret-token private@example.com'));
  const report = plain(await h.api.exportDiagnostics(true));
  const json = JSON.stringify(report);
  assert.doesNotMatch(json, /https?:|private\.example|secret\.example|Sensitive session name|Private title|@|private-user-id|private-token|secret-token/);
  assert.equal(report.sessions.details[0].name, '[Session 1]');
  assert.equal(report.logs[0].operation, 'capture_failed');
  assert.equal(report.logs[0].message, '[technical message omitted]');
  assert.equal(report.cloudSync.enabled, true);
  assert.equal(report.storage.usedBytes, bytes(h.data()));
  const full = await h.api.exportDiagnostics(false);
  assert.equal(full.sessions.details[0].name, 'Sensitive session name');
  assert.match(full.logs[0].message, /https:\/\/secret\.example/);
  assert.doesNotMatch(full.logs[0].message, /secret-token/);
});

test('logs are bounded and error classification distinguishes quota, transport, window and network failures', async () => {
  const { diagnostics } = harness().api;
  for (let i = 0; i < 205; i++) await diagnostics.record('sessions_saved', null, { sessions: i });
  const logs = await diagnostics.readLogs();
  assert.equal(logs.length, 200);
  assert.equal(logs[0].metrics.sessions, 5);
  for (const [message, code] of [
    ['QUOTA_BYTES quota exceeded', 'STORAGE_FULL'],
    ['Could not establish connection. Receiving end does not exist.', 'EXTENSION_UNAVAILABLE'],
    ['Extension context invalidated.', 'EXTENSION_UNAVAILABLE'],
    ['No active browser window', 'WINDOW_UNAVAILABLE'],
    ['Failed to fetch', 'NETWORK_ERROR'],
    ['An unexpected failure', 'UNKNOWN_ERROR']
  ]) assert.equal(diagnostics.errorCode({ message }), code);
});

test('invalid and over-limit replacement requests never silently truncate existing sessions', async () => {
  const sessions = [session('Keep', 'manual')];
  const h = harness({ sessions });
  for (const [candidate, code] of [[null, 'INVALID_SESSION'], [Array(10001).fill(sessions[0]), 'SESSION_LIMIT']]) {
    const result = await h.request({ action: 'replace_sessions', sessions: candidate });
    assert.equal(result.success, false);
    assert.equal(result.code, code);
    assert.deepEqual(h.data().sessions, sessions);
  }
});

test('concurrent manual and automatic saves append to the latest collection without overwriting each other', async () => {
  const h = harness({ sessions: [session('Existing', 'manual')], autoSaveRunId: 'run-test' });
  const snapshot = { windows: session('Snapshot').windows };
  const [auto, manual] = await Promise.all([
    h.api.storeAutoSaveSessionFromSnapshot(snapshot, 'scheduled'),
    h.request({ action: 'save_session', session: { ...session('Session', 'manual'), timestamp: '2026-10-08T15:00:00Z' } })
  ]);
  assert.equal(auto.success, true);
  assert.equal(manual.success, true);
  assert.equal(h.data().sessions.length, 3);
  assert.deepEqual(h.data().sessions.map(s => s.saveType), ['manual', 'auto', 'manual']);
});

test('stale replacements and index-based edits are rejected after cleanup or another save changes the list', async () => {
  const sessions = [session('Keep', 'manual')];
  const h = harness({ sessions });
  const collection = await h.request({ action: 'get_session_collection' });
  assert.equal(collection.revision, 0);
  await h.request({ action: 'save_session', session: session('Another', 'manual') });
  const before = h.data();
  for (const request of [
    { action: 'replace_sessions', sessions: [], revision: 0 },
    { action: 'delete_session', index: 0, revision: 0 },
    { action: 'rename_session', index: 0, newName: 'Wrong', revision: 0 },
    { action: 'update_session', index: 0, session: session('Wrong', 'manual'), revision: 0 }
  ]) {
    const result = await h.request(request);
    assert.equal(result.success, false);
    assert.equal(result.code, 'SESSION_CHANGED');
    assert.deepEqual(h.data(), before);
  }
});

test('ambiguous legacy type metadata never makes an explicitly manual session eligible for deletion', () => {
  const manual = session('Manual', 'manual');
  manual.metadata.saveTrigger = 'scheduled';
  const sessions = [manual, session('Older'), session('Newest', 'auto', 'scheduled', 8)];
  const plan = harness().api.planAutoSaveCleanup(sessions, 10000, 10000);
  assert.ok(plan.sessions.includes(manual));
});

test('diagnostics remain exportable when stored session records are malformed', async () => {
  const h = harness({ sessions: [null, { name: { privateUrl: 'https://secret.example' }, windows: {} }, { windows: [null, { tabs: {} }] }] });
  const report = await h.api.exportDiagnostics(true);
  assert.equal(report.sessions.total, 3);
  assert.ok(report.sessions.details.every(s => s.tabs === 0));
  assert.doesNotMatch(JSON.stringify(report), /secret\.example|privateUrl/);
});
