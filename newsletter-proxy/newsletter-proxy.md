# Newsletter proxy

The newsletter webhook bearer token must not be committed inside the Chrome extension. Extension source, packaged files, and network calls are inspectable by users, so a client-side secret is not a secret.

Use a small server-side proxy instead:

1. Deploy `newsletter-proxy/cloudflare-worker.js` or an equivalent server endpoint.
2. Configure these environment variables on the server:
   - `TSS_N8N_SUBSCRIBE_WEBHOOK_URL`: the private n8n subscribe webhook URL
   - `TSS_N8N_BEARER_TOKEN`: the n8n bearer token
3. Set `NEWSLETTER_SUBSCRIBE_ENDPOINT` in `Chrome-extension/background.js` to the deployed proxy URL.
4. If the proxy uses a new public origin, update `host_permissions` in `Chrome-extension/manifest.json`.

The extension sends only this JSON body to the proxy:

```json
{
  "email": "email@email.com"
}
```

The proxy forwards the same JSON body to n8n and adds the bearer authorization header on the server.
