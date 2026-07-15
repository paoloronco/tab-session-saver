# Cloudflare Worker

This folder contains the HTTP API used by the optional Tabs Session Saver Cloud Sync feature.

## Responsibilities

The Worker:

- validates Google OAuth access tokens through Google UserInfo;
- creates or refreshes a Cloud Sync account in D1;
- stores and returns the latest full session snapshot;
- enforces the current server-side Cloud Sync limits;
- returns structured quota errors to the extension.

The Worker does not trust the extension for limit enforcement. The extension is open source and can be modified by users, so quotas must stay server-side.

## Files

```text
cloudflare-worker/
├── README.md
├── src/index.js
├── wrangler.toml
├── wrangler.example.toml
├── package.json
└── docs/
    ├── api.md
    ├── oauth.md
    └── operations.md
```

## Local Checks

```bash
npm install
npm run check
```

## Deploy

Dashboard deploy:

1. Open the Cloudflare Worker editor.
2. Paste `src/index.js`.
3. Confirm the Worker has a D1 binding named `DB`.
4. Deploy.

Wrangler deploy:

```bash
npm run deploy
```

## D1 Schema

The D1 schema lives outside this folder:

```text
../cloudflare-d1/schema.sql
```

Wrangler helper scripts already point to that file:

```bash
npm run db:schema:remote
```

## Public API

See [docs/api.md](./docs/api.md).
