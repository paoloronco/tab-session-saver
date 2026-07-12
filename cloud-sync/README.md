# Tabs Session Saver Cloud Sync

Cloud Sync is the optional server-side sync backend for Tabs Session Saver.

The browser extension remains local-first: saved sessions stay in `chrome.storage.local` unless the user explicitly signs in and enables Cloud Sync. When enabled, the extension authenticates with Google through `chrome.identity`, sends the Google access token to the Worker, and the Worker stores the user's latest session snapshot in Cloudflare D1.

## Current Status

This is the current pre-production backend:

- real Google OAuth authentication;
- real Cloudflare D1 storage;
- full-snapshot sync;
- server-side `free` plan quota enforcement;
- last-write-wins conflict behavior across devices;
- no Stripe or paid plan enforcement yet.

## Free Plan

The Worker enforces these limits per Google account:

```text
max cloud sessions: 10
max URLs across the cloud snapshot: 300
max serialized snapshot size: 512 KB
```

These limits are enforced by the Worker, not by the extension UI. This means they still apply if someone modifies the open-source extension or calls the API directly.

## Structure

```text
cloud-sync/
├── README.md
├── cloudflare-worker/
│   ├── README.md
│   ├── src/index.js              # Worker HTTP API
│   ├── wrangler.toml             # Real deployment config
│   ├── wrangler.example.toml     # Template config without real IDs
│   ├── package.json              # Optional Wrangler scripts
│   └── docs/
│       ├── api.md                # Endpoint contracts
│       ├── oauth.md              # Google OAuth setup
│       └── operations.md         # Deploy and troubleshooting
└── cloudflare-d1/
    ├── README.md                 # D1 tables and useful queries
    └── schema.sql                # D1 schema
```

## Production Resources

Worker:

```text
https://tabsessionsaver-cloudsync.paolo-ronco2000.workers.dev
```

D1 database ID:

```text
1c5d216a-fbaf-4199-990b-734ca0b0d7bf
```

Required Worker binding:

```text
Variable name: DB
Resource type: D1 database
Database: tabsessionsaver-sync
```

## What You Need To Configure

For the current free-only model:

1. Google OAuth must have a Chrome Extension OAuth client for the production extension ID.
2. Cloudflare Worker must have the `DB` D1 binding.
3. Cloudflare D1 must have the schema from `cloudflare-d1/schema.sql`.
4. The Worker code in `cloudflare-worker/src/index.js` must be deployed.

No extra Google configuration, Stripe configuration, account tokens, or visible user endpoints are required.

## Dashboard Deploy Path

Use this path when Wrangler or `npx` is inconvenient on Windows.

1. Open Cloudflare Dashboard.
2. Go to `Workers & Pages`.
3. Open `tabsessionsaver-cloudsync`.
4. Open `Settings` -> `Bindings`.
5. Confirm there is a D1 binding named exactly `DB`.
6. Open the D1 database `tabsessionsaver-sync`.
7. Run `cloudflare-d1/schema.sql` in the D1 query console if the schema is not already installed.
8. Open the Worker editor.
9. Paste `cloudflare-worker/src/index.js`.
10. Deploy.
11. Verify `/health`.

Expected health response:

```json
{"success":true,"service":"tabs-session-saver-sync"}
```

## Wrangler Deploy Path

Use this only if Wrangler is authenticated locally.

```bash
cd cloud-sync/cloudflare-worker
npm install
npm run check
npm run db:schema:remote
npm run deploy
```

## Extension Integration

The extension points to the Worker in `Chrome-extension/background.js`:

```js
const CLOUD_SYNC_DEFAULT_API_BASE_URL = 'https://tabsessionsaver-cloudsync.paolo-ronco2000.workers.dev';
```

The same origin must be allowed in `Chrome-extension/manifest.json`:

```json
"host_permissions": [
  "https://tabsessionsaver-cloudsync.paolo-ronco2000.workers.dev/*"
]
```

The production Google OAuth Chrome Extension client must use this Chrome Web Store extension ID:

```text
njbmclamamhckchdanoobkhadhmbdobp
```

For local unpacked testing, create a separate Google OAuth Chrome Extension client for the temporary unpacked extension ID shown in `chrome://extensions`.

## Documentation

- [Worker README](./cloudflare-worker/README.md)
- [D1 README](./cloudflare-d1/README.md)
- [API](./cloudflare-worker/docs/api.md)
- [OAuth](./cloudflare-worker/docs/oauth.md)
- [Operations](./cloudflare-worker/docs/operations.md)
