# Newsletter Proxy

This folder contains the small Cloudflare Worker proxy used by the extension newsletter signup form.

The extension must not call the private newsletter provider directly, because any endpoint, bearer token, or webhook URL bundled in a Chrome extension can be inspected by users. The extension calls only the public proxy endpoint, and the proxy adds the private provider authorization server-side.

## Files

```text
newsletter-proxy/
├── README.md
├── cloudflare-worker.js     # Worker source
└── newsletter-proxy.md      # Security notes kept for project tests/docs
```

## Required Server Environment Variables

Configure these on the deployed Worker, not in the extension source:

```text
TSS_N8N_SUBSCRIBE_WEBHOOK_URL
TSS_N8N_BEARER_TOKEN
```

Do not commit real values for either variable.

## Extension Integration

The extension sends newsletter subscriptions to:

```js
const NEWSLETTER_SUBSCRIBE_ENDPOINT = 'https://tabsessionsaver-newslettersubscribe.paolo-ronco2000.workers.dev';
```

The extension should only need host permission for that public proxy origin, not for the private provider origin.

## Local Check

```bash
node --check newsletter-proxy/cloudflare-worker.js
```
