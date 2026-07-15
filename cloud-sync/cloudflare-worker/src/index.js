const SERVICE_NAME = 'tabs-session-saver-sync';
const GOOGLE_USERINFO_ENDPOINT = 'https://openidconnect.googleapis.com/v1/userinfo';
const DEFAULT_PLAN = 'free';
const HARD_MAX_SNAPSHOT_BYTES = 4 * 1024 * 1024;
const HARD_MAX_SESSIONS_PER_SNAPSHOT = 10000;
const SNAPSHOT_WRITE_MIN_INTERVAL_SECONDS = 120;
const PLAN_LIMITS = {
  free: {
    maxSessions: 10,
    maxUrls: 300,
    maxSnapshotBytes: 512 * 1024
  }
};

const CORS_HEADERS = {
  'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type'
};

function jsonResponse(payload, status = 200, origin = '*') {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': origin,
      ...CORS_HEADERS
    }
  });
}

function errorResponse(message, status = 400, origin = '*', extra = {}) {
  return jsonResponse({ success: false, error: message, ...extra }, status, origin);
}

function getRequestOrigin(request) {
  return request.headers.get('Origin') || '*';
}

function getBearerToken(request) {
  const authorization = request.headers.get('Authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

async function readJsonBody(request) {
  try {
    return await request.json();
  } catch (_) {
    return null;
  }
}

function estimateUtf8Bytes(value) {
  return new Blob([value]).size;
}

function normalizeSessions(value) {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, HARD_MAX_SESSIONS_PER_SNAPSHOT)
    .filter((session) => session && typeof session === 'object');
}

function getPlanLimits(plan) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS[DEFAULT_PLAN];
}

function countSnapshotUrls(sessions) {
  return sessions.reduce((total, session) => {
    const windows = Array.isArray(session?.windows) ? session.windows : [];
    return total + windows.reduce((windowTotal, win) => {
      const tabs = Array.isArray(win?.tabs) ? win.tabs : [];
      return windowTotal + tabs.filter((tab) => typeof tab?.url === 'string' && tab.url.trim()).length;
    }, 0);
  }, 0);
}

function getSnapshotUsage(sessions, snapshotBytes) {
  return {
    sessions: sessions.length,
    urls: countSnapshotUrls(sessions),
    bytes: snapshotBytes
  };
}

function enforcePlanLimits(plan, sessions, snapshotBytes) {
  const limits = getPlanLimits(plan);
  const usage = getSnapshotUsage(sessions, snapshotBytes);

  if (
    usage.sessions > limits.maxSessions ||
    usage.urls > limits.maxUrls ||
    usage.bytes > limits.maxSnapshotBytes
  ) {
    return {
      error: 'Cloud Sync limit exceeded.',
      status: 403,
      code: 'quota_exceeded',
      plan,
      limits,
      usage
    };
  }

  return null;
}

function getWriteRateLimitError(currentSnapshot, now) {
  const revision = Number(currentSnapshot?.revision || 0);
  if (revision <= 0 || !currentSnapshot?.updated_at) return null;

  const lastWriteMs = Date.parse(currentSnapshot.updated_at);
  const nowMs = Date.parse(now);
  if (!Number.isFinite(lastWriteMs) || !Number.isFinite(nowMs)) return null;

  const elapsedSeconds = Math.floor((nowMs - lastWriteMs) / 1000);
  if (elapsedSeconds >= SNAPSHOT_WRITE_MIN_INTERVAL_SECONDS) return null;

  return {
    error: 'Cloud Sync push rate limit exceeded.',
    status: 429,
    code: 'rate_limited',
    retryAfterSeconds: SNAPSHOT_WRITE_MIN_INTERVAL_SECONDS - Math.max(0, elapsedSeconds),
    minIntervalSeconds: SNAPSHOT_WRITE_MIN_INTERVAL_SECONDS
  };
}

function publicProfile(profile) {
  return {
    userId: profile.userId,
    email: profile.email,
    name: profile.name,
    picture: profile.picture
  };
}

function normalizeGoogleProfile(rawProfile) {
  const profile = rawProfile && typeof rawProfile === 'object' ? rawProfile : {};
  const providerUserId = typeof profile.sub === 'string' ? profile.sub.trim() : '';
  const email = typeof profile.email === 'string' ? profile.email.trim().toLowerCase() : '';

  return {
    userId: providerUserId ? `google:${providerUserId}` : '',
    provider: 'google',
    providerUserId,
    email,
    name: typeof profile.name === 'string' ? profile.name.trim() : '',
    picture: typeof profile.picture === 'string' ? profile.picture.trim() : ''
  };
}

async function fetchGoogleProfile(request) {
  const token = getBearerToken(request);
  if (!token) {
    return { error: 'Missing Google access token.', status: 401 };
  }

  const response = await fetch(GOOGLE_USERINFO_ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      error: payload?.error_description || payload?.error || 'Invalid Google access token.',
      status: 401
    };
  }

  const profile = normalizeGoogleProfile(payload);
  if (!profile.providerUserId || !profile.email) {
    return {
      error: 'Google profile is missing required identity fields.',
      status: 401
    };
  }

  return { profile };
}

async function upsertAccount(env, profile) {
  const now = new Date().toISOString();
  const existing = await env.DB.prepare(
    'SELECT user_id, plan, revision_seed FROM sync_accounts WHERE user_id = ?'
  ).bind(profile.userId).first();

  if (!existing) {
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO sync_accounts
          (user_id, provider, provider_user_id, email, name, picture, plan, revision_seed, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        profile.userId,
        profile.provider,
        profile.providerUserId,
        profile.email,
        profile.name,
        profile.picture,
        'free',
        0,
        now,
        now
      ),
      env.DB.prepare(
        `INSERT INTO sync_snapshots
          (user_id, revision, updated_at, updated_by_device, sessions_json)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(profile.userId, 0, now, '', '[]')
    ]);

    return { created: true, plan: DEFAULT_PLAN, revision: 0 };
  }

  await env.DB.prepare(
    `UPDATE sync_accounts
     SET email = ?, name = ?, picture = ?, updated_at = ?
     WHERE user_id = ?`
  ).bind(profile.email, profile.name, profile.picture, now, profile.userId).run();

  return {
    created: false,
    plan: existing.plan || DEFAULT_PLAN,
    revision: Number.isInteger(existing.revision_seed) ? existing.revision_seed : 0
  };
}

async function requireSignedInAccount(request, env) {
  const google = await fetchGoogleProfile(request);
  if (google.error) return google;

  const account = await upsertAccount(env, google.profile);
  return { profile: google.profile, plan: account.plan || DEFAULT_PLAN };
}

async function loadSnapshot(env, userId) {
  const row = await env.DB.prepare(
    `SELECT revision, updated_at, updated_by_device, sessions_json
     FROM sync_snapshots
     WHERE user_id = ?`
  ).bind(userId).first();

  if (!row) {
    return {
      revision: 0,
      updatedAt: null,
      updatedByDevice: '',
      sessions: []
    };
  }

  let sessions = [];
  try {
    sessions = JSON.parse(row.sessions_json || '[]');
  } catch (_) {
    sessions = [];
  }

  return {
    revision: row.revision || 0,
    updatedAt: row.updated_at || null,
    updatedByDevice: row.updated_by_device || '',
    sessions: normalizeSessions(sessions)
  };
}

async function saveSnapshot(env, account, payload) {
  const profile = account.profile;
  const plan = account.plan || DEFAULT_PLAN;
  const sessions = normalizeSessions(payload?.sessions);
  const sessionsJson = JSON.stringify(sessions);
  const snapshotBytes = estimateUtf8Bytes(sessionsJson);

  if (snapshotBytes > HARD_MAX_SNAPSHOT_BYTES) {
    return { error: 'Cloud Sync snapshot is too large.', status: 413 };
  }

  const quotaError = enforcePlanLimits(plan, sessions, snapshotBytes);
  if (quotaError) return quotaError;

  const current = await env.DB.prepare(
    'SELECT revision, updated_at FROM sync_snapshots WHERE user_id = ?'
  ).bind(profile.userId).first();

  const now = new Date().toISOString();
  const rateLimitError = getWriteRateLimitError(current, now);
  if (rateLimitError) return rateLimitError;

  const revision = (current?.revision || 0) + 1;
  const deviceId = typeof payload?.deviceId === 'string'
    ? payload.deviceId.slice(0, 128)
    : '';

  await env.DB.prepare(
    `INSERT INTO sync_snapshots (user_id, revision, updated_at, updated_by_device, sessions_json)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       revision = excluded.revision,
       updated_at = excluded.updated_at,
       updated_by_device = excluded.updated_by_device,
       sessions_json = excluded.sessions_json`
  ).bind(profile.userId, revision, now, deviceId, sessionsJson).run();

  await env.DB.prepare(
    'UPDATE sync_accounts SET revision_seed = ?, updated_at = ? WHERE user_id = ?'
  ).bind(revision, now, profile.userId).run();

  return { revision, updatedAt: now };
}

async function handleHealth(env, origin) {
  if (!env.DB) {
    return errorResponse('Cloud Sync database is not configured.', 500, origin);
  }
  return jsonResponse({ success: true, service: SERVICE_NAME }, 200, origin);
}

async function handleAuthSession(request, env, origin) {
  const google = await fetchGoogleProfile(request);
  if (google.error) return errorResponse(google.error, google.status, origin);

  const account = await upsertAccount(env, google.profile);
  const snapshot = await loadSnapshot(env, google.profile.userId);
  const plan = account.plan || DEFAULT_PLAN;

  return jsonResponse({
    success: true,
    profile: publicProfile(google.profile),
    plan,
    limits: getPlanLimits(plan),
    revision: snapshot.revision,
    updatedAt: snapshot.updatedAt
  }, account.created ? 201 : 200, origin);
}

async function handleGetSnapshot(request, env, origin) {
  const account = await requireSignedInAccount(request, env);
  if (account.error) return errorResponse(account.error, account.status, origin);

  const snapshot = await loadSnapshot(env, account.profile.userId);
  return jsonResponse({
    success: true,
    profile: publicProfile(account.profile),
    plan: account.plan,
    limits: getPlanLimits(account.plan),
    usage: getSnapshotUsage(snapshot.sessions, estimateUtf8Bytes(JSON.stringify(snapshot.sessions))),
    revision: snapshot.revision,
    updatedAt: snapshot.updatedAt,
    updatedByDevice: snapshot.updatedByDevice,
    sessions: snapshot.sessions
  }, 200, origin);
}

async function handlePutSnapshot(request, env, origin) {
  const account = await requireSignedInAccount(request, env);
  if (account.error) return errorResponse(account.error, account.status, origin);

  const payload = await readJsonBody(request);
  if (!payload) {
    return errorResponse('Invalid JSON body.', 400, origin);
  }

  const result = await saveSnapshot(env, account, payload);
  if (result.error) {
    return errorResponse(result.error, result.status, origin, {
      ...(result.code ? { code: result.code } : {}),
      ...(result.retryAfterSeconds ? { retryAfterSeconds: result.retryAfterSeconds } : {}),
      ...(result.minIntervalSeconds ? { minIntervalSeconds: result.minIntervalSeconds } : {}),
      ...(result.plan ? { plan: result.plan } : {}),
      ...(result.limits ? { limits: result.limits } : {}),
      ...(result.usage ? { usage: result.usage } : {})
    });
  }

  return jsonResponse({
    success: true,
    profile: publicProfile(account.profile),
    plan: account.plan,
    limits: getPlanLimits(account.plan),
    revision: result.revision,
    updatedAt: result.updatedAt
  }, 200, origin);
}

async function routeRequest(request, env, origin) {
  if (request.method === 'OPTIONS') {
    return jsonResponse({ success: true }, 200, origin);
  }

  const url = new URL(request.url);

  if (request.method === 'GET' && url.pathname === '/health') {
    return handleHealth(env, origin);
  }

  if (!env.DB) {
    return errorResponse('Cloud Sync database is not configured.', 500, origin);
  }

  if (request.method === 'POST' && url.pathname === '/v1/auth/session') {
    return handleAuthSession(request, env, origin);
  }

  if (request.method === 'GET' && url.pathname === '/v1/sync/snapshot') {
    return handleGetSnapshot(request, env, origin);
  }

  if (request.method === 'PUT' && url.pathname === '/v1/sync/snapshot') {
    return handlePutSnapshot(request, env, origin);
  }

  return errorResponse('Not found.', 404, origin);
}

export default {
  async fetch(request, env) {
    const origin = getRequestOrigin(request);

    try {
      return await routeRequest(request, env, origin);
    } catch (error) {
      return errorResponse(error?.message || 'Cloud Sync failed.', 500, origin);
    }
  }
};
