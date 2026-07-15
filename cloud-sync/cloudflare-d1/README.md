# Cloudflare D1 Database

Database: Cloudflare D1.

Production D1 database ID:

```text
1c5d216a-fbaf-4199-990b-734ca0b0d7bf
```

Worker binding name:

```text
DB
```

Schema file:

```text
cloud-sync/cloudflare-d1/schema.sql
```

## Apply Schema

From the Cloudflare dashboard:

1. Open the D1 database `tabsessionsaver-sync`.
2. Open the query console.
3. Paste and run `schema.sql`.

With Wrangler:

```bash
cd cloud-sync/cloudflare-worker
npm run db:schema:remote
```

## Tables

### sync_accounts

One row per Google account that has enabled Cloud Sync.

Important columns:

| Column | Meaning |
| --- | --- |
| `user_id` | Internal ID, currently `google:<sub>`. |
| `provider` | OAuth provider, currently `google`. |
| `provider_user_id` | Google `sub` claim. |
| `email` | Google account email. |
| `name` | Google display name. |
| `picture` | Google profile picture URL. |
| `plan` | Internal account tier value. Currently `free`; the Worker uses it to enforce server-side limits. |
| `revision_seed` | Latest known snapshot revision. |
| `created_at` | Account creation timestamp. |
| `updated_at` | Last account/profile update timestamp. |

### sync_snapshots

One row per sync account.

Important columns:

| Column | Meaning |
| --- | --- |
| `user_id` | Foreign key to `sync_accounts.user_id`. |
| `revision` | Incremented on every successful push. |
| `updated_at` | Last cloud snapshot update timestamp. |
| `updated_by_device` | Extension-generated device ID that last pushed. |
| `sessions_json` | Full JSON snapshot of saved sessions. |

## Useful Queries

List accounts:

```sql
SELECT user_id, email, plan, created_at, updated_at
FROM sync_accounts
ORDER BY updated_at DESC;
```

Inspect snapshot sizes:

```sql
SELECT user_id, revision, updated_at, length(sessions_json) AS bytes
FROM sync_snapshots
ORDER BY updated_at DESC;
```

Inspect approximate Cloud Sync usage:

```sql
SELECT
  a.email,
  a.plan,
  s.revision,
  length(s.sessions_json) AS bytes,
  s.updated_at
FROM sync_accounts a
JOIN sync_snapshots s ON s.user_id = a.user_id
ORDER BY s.updated_at DESC;
```

Delete one user's cloud data:

```sql
DELETE FROM sync_snapshots WHERE user_id = 'google:USER_SUB';
DELETE FROM sync_accounts WHERE user_id = 'google:USER_SUB';
```

## Future Account Fields

The `plan` column is intentionally present now so the backend can evolve without changing account identity. Future account management can add fields such as:

- `stripe_customer_id`
- `stripe_subscription_id`
- `subscription_status`
- `current_period_end`
- custom cloud limit fields
