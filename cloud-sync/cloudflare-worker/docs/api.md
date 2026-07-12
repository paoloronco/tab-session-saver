# Cloud Sync API

Base URL production:

```text
https://tabsessionsaver-cloudsync.paolo-ronco2000.workers.dev
```

## Authentication

All sync endpoints, except `/health`, require:

```http
Authorization: Bearer <google-oauth-access-token>
```

The access token is obtained by the Chrome extension through `chrome.identity.getAuthToken`.

The Worker validates the token by calling:

```text
https://openidconnect.googleapis.com/v1/userinfo
```

The Worker uses the Google `sub` claim as the stable account identity.

## GET /health

Checks that the Worker is deployed and that the D1 binding exists.

Response:

```json
{
  "success": true,
  "service": "tabs-session-saver-sync"
}
```

If D1 is not bound:

```json
{
  "success": false,
  "error": "Cloud Sync database is not configured."
}
```

## POST /v1/auth/session

Creates or refreshes the user's sync account after Google sign-in.

Request:

```json
{
  "deviceId": "device_abcd"
}
```

Response:

```json
{
  "success": true,
  "profile": {
    "userId": "google:123",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://..."
  },
  "plan": "free",
  "limits": {
    "maxSessions": 10,
    "maxUrls": 300,
    "maxSnapshotBytes": 524288
  },
  "revision": 0,
  "updatedAt": "2026-07-12T00:00:00.000Z"
}
```

## GET /v1/sync/snapshot

Returns the user's current cloud snapshot.

Response:

```json
{
  "success": true,
  "profile": {
    "userId": "google:123",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://..."
  },
  "plan": "free",
  "limits": {
    "maxSessions": 10,
    "maxUrls": 300,
    "maxSnapshotBytes": 524288
  },
  "usage": {
    "sessions": 2,
    "urls": 45,
    "bytes": 32000
  },
  "revision": 3,
  "updatedAt": "2026-07-12T00:00:00.000Z",
  "updatedByDevice": "device_abcd",
  "sessions": []
}
```

## PUT /v1/sync/snapshot

Stores the full session snapshot for the signed-in user.

Request:

```json
{
  "deviceId": "device_abcd",
  "baseRevision": 2,
  "updatedAt": "2026-07-12T00:00:00.000Z",
  "sessions": []
}
```

Response:

```json
{
  "success": true,
  "profile": {
    "userId": "google:123",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://..."
  },
  "plan": "free",
  "limits": {
    "maxSessions": 10,
    "maxUrls": 300,
    "maxSnapshotBytes": 524288
  },
  "revision": 3,
  "updatedAt": "2026-07-12T00:00:00.000Z"
}
```

If the snapshot exceeds the server-side free plan quota:

```json
{
  "success": false,
  "error": "Free Cloud Sync limit exceeded.",
  "code": "quota_exceeded",
  "plan": "free",
  "limits": {
    "maxSessions": 10,
    "maxUrls": 300,
    "maxSnapshotBytes": 524288
  },
  "usage": {
    "sessions": 12,
    "urls": 330,
    "bytes": 410000
  }
}
```

## Limits

Current free plan limits:

- max sessions per cloud snapshot: `10`
- max URLs across all saved sessions in the snapshot: `300`
- max serialized snapshot size: `512 KB`

Current hard safety limits:

- max sessions per snapshot: `10000`
- max serialized snapshot size: `4 MB`

The free plan limits are enforced server-side. The hard safety limits are an additional protection against malformed or unexpectedly large payloads.
