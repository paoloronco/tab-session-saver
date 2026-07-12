# Google OAuth Setup

The extension uses Google OAuth only for Cloud Sync authentication.

## Required Scopes

Use only:

```text
openid
email
profile
```

Do not add Drive, Gmail, Calendar, Contacts, or other Google API scopes.

## Production Client

Create a Google OAuth client with:

```text
Application type: Chrome extension
Extension ID: njbmclamamhckchdanoobkhadhmbdobp
```

Then copy the generated OAuth client ID into `Chrome-extension/manifest.json`:

```json
"oauth2": {
  "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
  "scopes": ["openid", "email", "profile"]
}
```

The OAuth client ID is public configuration. It is safe to commit. Do not commit downloaded OAuth JSON files.

## Local Testing

Unpacked extensions often have a different ID.

For Chromium/local testing:

1. Open `chrome://extensions`.
2. Copy the local unpacked extension ID.
3. Create a second Google OAuth client with:

```text
Application type: Chrome extension
Extension ID: <local unpacked extension ID>
```

4. Temporarily put that local client ID in `manifest.json`.
5. Before Chrome Web Store release, restore the production client ID.

## Test vs Production OAuth App

During pre-prod, keep the Google OAuth app in Test mode and add test users.

Before releasing Cloud Sync broadly, publish the OAuth app to Production. With only `openid`, `email`, and `profile`, the review burden should stay low compared with sensitive or restricted scopes.
