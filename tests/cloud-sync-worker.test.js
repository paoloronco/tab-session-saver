const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { DatabaseSync } = require('node:sqlite');

function createWorker(t) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec(fs.readFileSync(path.join(__dirname, '../cloud-sync/cloudflare-d1/schema.sql'), 'utf8'));
  db.prepare(`INSERT INTO sync_accounts (user_id, provider, provider_user_id, email, revision_seed, created_at, updated_at)
    VALUES ('google:test', 'google', 'test', 'test@example.invalid', 5, '2020-01-01', '2020-01-01')`).run();
  db.prepare(`INSERT INTO sync_snapshots (user_id, revision, updated_at, sessions_json)
    VALUES ('google:test', 5, '2020-01-01', '[]')`).run();
  const env = { DB: {
    prepare(sql) {
      return { bind(...values) {
        return {
          async first() { return db.prepare(sql).get(...values) || null; },
          async run() { return { meta: { changes: Number(db.prepare(sql).run(...values).changes) } }; }
        };
      } };
    }
  } };
  const context = vm.createContext({ Blob, URL, Request, Response,
    fetch: async () => Response.json({ sub: 'test', email: 'test@example.invalid' })
  });
  const source = fs.readFileSync(path.join(__dirname, '../cloud-sync/cloudflare-worker/src/index.js'), 'utf8');
  vm.runInContext(source.replace('export default {', 'globalThis.worker = {'), context);
  return {
    db,
    request(payload, method = 'PUT', authenticated = true) {
      return context.worker.fetch(new Request('https://sync.example.invalid/v1/sync/snapshot', {
        method, headers: { 'Content-Type': 'application/json', ...(authenticated ? { Authorization: 'Bearer test' } : {}) },
        ...(method === 'PUT' ? { body: JSON.stringify(payload) } : {})
      }), env);
    }
  };
}

test('concurrent HTTP uploads atomically accept one revision and reject the other', async t => {
  const { db, request } = createWorker(t);
  const snapshots = ['First device', 'Second device'].map(name => ({ baseRevision: 5, deviceId: name,
    sessions: [{ name, timestamp: '2026-07-15T08:00:00.000Z', windows: [{ tabs: [{ url: 'https://example.com' }] }] }]
  }));
  const responses = await Promise.all(snapshots.map(payload => request(payload)));
  assert.deepEqual(responses.map(response => response.status).sort(), [200, 409]);
  const accepted = responses.findIndex(response => response.status === 200);
  assert.equal((await responses[accepted].json()).revision, 6);
  assert.equal((await responses[1 - accepted].json()).code, 'conflict');
  const stored = db.prepare('SELECT revision, sessions_json FROM sync_snapshots').get();
  assert.equal(stored.revision, 6);
  assert.equal(JSON.parse(stored.sessions_json).sessions[0].name, snapshots[accepted].sessions[0].name);
  const pulled = await (await request(null, 'GET')).json();
  assert.equal(pulled.revision, 6);
  assert.equal(pulled.sessions[0].name, snapshots[accepted].sessions[0].name);
  const stale = await request(snapshots[1 - accepted]);
  assert.equal(stale.status, 409);
  assert.equal((await stale.json()).code, 'conflict');
  const tooSoon = await request({ ...snapshots[accepted], baseRevision: 6 });
  assert.equal(tooSoon.status, 429);
  assert.ok(Number(tooSoon.headers.get('Retry-After')) > 0);
});

test('missing, malformed and stale base revisions never overwrite the snapshot', async t => {
  const { db, request } = createWorker(t);
  for (const baseRevision of [undefined, null, -1, 1.5, '5']) {
    assert.equal((await request({ baseRevision, sessions: [] })).status, 400);
  }
  assert.equal((await request({ baseRevision: 4, sessions: [] })).status, 409);
  assert.equal((await request({ baseRevision: 5, sessions: [] }, 'PUT', false)).status, 401);
  assert.equal(db.prepare('SELECT revision FROM sync_snapshots').get().revision, 5);
});
