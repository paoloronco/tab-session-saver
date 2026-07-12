-- One row per Google account that has enabled Cloud Sync.
CREATE TABLE IF NOT EXISTS sync_accounts (
  user_id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  provider_user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  picture TEXT NOT NULL DEFAULT '',
  plan TEXT NOT NULL DEFAULT 'free',
  revision_seed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Prevent duplicate accounts for the same OAuth provider identity.
CREATE UNIQUE INDEX IF NOT EXISTS idx_sync_accounts_provider_user
  ON sync_accounts(provider, provider_user_id);

CREATE INDEX IF NOT EXISTS idx_sync_accounts_email ON sync_accounts(email);
CREATE INDEX IF NOT EXISTS idx_sync_accounts_plan ON sync_accounts(plan);

-- Current cloud snapshot for each user.
-- This pre-prod implementation stores the whole sessions array as JSON.
CREATE TABLE IF NOT EXISTS sync_snapshots (
  user_id TEXT PRIMARY KEY,
  revision INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  updated_by_device TEXT NOT NULL DEFAULT '',
  sessions_json TEXT NOT NULL DEFAULT '[]',
  FOREIGN KEY (user_id) REFERENCES sync_accounts(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sync_snapshots_updated_at ON sync_snapshots(updated_at);
