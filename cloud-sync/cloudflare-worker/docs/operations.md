# Cloud Sync Operations

## Dashboard Deploy Path

Use this when Wrangler cannot authenticate locally.

1. Open Cloudflare Dashboard.
2. Go to `Workers & Pages`.
3. Open `tabsessionsaver-cloudsync`.
4. Open `Settings` -> `Bindings`.
5. Add D1 binding:

```text
Variable name: DB
D1 database: tabsessionsaver-sync
```

6. Open the D1 database.
7. Run [../../cloudflare-d1/schema.sql](../../cloudflare-d1/schema.sql) in the D1 query console.
8. Open Worker `Edit code`.
9. Paste [../src/index.js](../src/index.js).
10. Deploy.

## Wrangler Deploy Path

Use this only when Wrangler is authenticated.

```bash
cd cloud-sync/cloudflare-worker
npm install
npm run check
npm run db:schema:remote
npm run deploy
```

## Health Check

```bash
curl https://tabsessionsaver-cloudsync.paolo-ronco2000.workers.dev/health
```

Expected:

```json
{"success":true,"service":"tabs-session-saver-sync"}
```

## Common Errors

### Cloud Sync database is not configured

The Worker does not have a D1 binding named `DB`.

Fix:

- add D1 binding in Worker settings;
- variable name must be exactly `DB`;
- redeploy if needed.

### Missing Google access token

The extension called an authenticated endpoint without `Authorization: Bearer ...`.

Fix:

- check `chrome.identity.getAuthToken`;
- reload the extension;
- confirm OAuth client ID in `manifest.json`.

### Invalid Google access token

Google rejected the token.

Fix:

- remove cached token by signing out/reloading;
- verify OAuth app test users;
- verify correct OAuth client for the current extension ID.

### bad client id

Chrome rejected the OAuth client before the Worker was called.

Fix:

- verify `manifest.json` client ID;
- verify Google OAuth client type is `Chrome extension`;
- verify the OAuth client was created for the actual extension ID shown in `chrome://extensions`;
- for unpacked testing, use a separate local OAuth client.

### quota_exceeded

The signed-in account exceeded the current server-side Cloud Sync limits.

Current Cloud Sync limits:

- max `10` saved sessions in the cloud snapshot;
- max `300` URLs across all saved sessions;
- max `512 KB` serialized snapshot JSON.

Fix:

- delete or reduce saved sessions locally, then push again;
- increase `PLAN_LIMITS.free` in [../src/index.js](../src/index.js) if the current limits should change for everyone.
