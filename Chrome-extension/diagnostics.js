/* exported SessionDiagnostics */
const SessionDiagnostics = (() => {
  const LOG_LIMIT = 200;
  const ERROR_CODES = new Set(['STORAGE_FULL', 'STORAGE_UNAVAILABLE', 'EXTENSION_UNAVAILABLE', 'WINDOW_UNAVAILABLE', 'PERMISSION_DENIED', 'NETWORK_ERROR', 'INVALID_SESSION', 'SESSION_LIMIT', 'SESSION_CHANGED', 'RESTORE_IN_PROGRESS', 'UNKNOWN_ERROR', 'quota_exceeded', 'rate_limited', 'payload_too_large', 'unauthorized', 'conflict']);
  const OPERATIONS = new Set(['background_error', 'popup_error', 'request_failed', 'storage_write', 'auto_save_cleanup', 'sessions_saved', 'cloud_sync_push', 'cloud_sync_pull', 'cloud_sync_failed', 'auto_save_failed', 'capture_failed', 'restore_failed', 'capture_current_desktop', 'get_sessions', 'get_session_collection', 'save_session', 'replace_sessions', 'update_session', 'delete_session', 'rename_session', 'replace_session_folders', 'update_auto_save_settings', 'cloud_sync_login', 'get_diagnostics', 'open_session', 'restore_window']);
  let database;
  let logQueue = Promise.resolve();
  let memoryLogs = [];

  function errorCode(error) {
    if (ERROR_CODES.has(error?.code)) return error.code;
    const message = String(error?.message || error?.error || error || '');
    if (/QUOTA_BYTES|quota.*exceed|storage.*(?:full|limit)/i.test(message)) return 'STORAGE_FULL';
    if (/context invalidated|receiving end does not exist|message (?:port|channel).*closed|could not establish connection/i.test(message)) return 'EXTENSION_UNAVAILABLE';
    if (/no (?:active |current |browser )*window|window.*(?:not found|closed)|invalid window|no tab with id/i.test(message)) return 'WINDOW_UNAVAILABLE';
    if (/permission|access denied|not allowed/i.test(message)) return 'PERMISSION_DENIED';
    if (/failed to fetch|network|offline|timed? ?out/i.test(message)) return 'NETWORK_ERROR';
    return 'UNKNOWN_ERROR';
  }

  function openDatabase() {
    if (!database) {
      database = new Promise((resolve, reject) => {
        const request = indexedDB.open('tab-session-saver-diagnostics', 1);
        request.onupgradeneeded = () => request.result.createObjectStore('logs');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    return database;
  }

  async function readStoredLogs() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const request = db.transaction('logs').objectStore('logs').get('entries');
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  function record(operation, error = null, metrics = {}) {
    const message = error ? String(error.message || error.error || error).slice(0, 2048)
      .replace(/Bearer\s+[^\s"']+/gi, 'Bearer [redacted]')
      .replace(/((?:access_token|refresh_token|id_token|token|password|client_secret)["']?\s*[=:]\s*["']?)[^\s&"']+/gi, '$1[redacted]')
      .replace(/(?:authorization|cookie|set-cookie)["']?\s*[:=]\s*[^\r\n]+/gi, '[credentials redacted]') : '';
    const entry = {
      timestamp: new Date().toISOString(),
      operation: OPERATIONS.has(operation) ? operation : 'background_error',
      level: error ? 'error' : 'info',
      code: error ? errorCode(error) : '',
      ...(message ? { message } : {}),
      metrics: Object.fromEntries(Object.entries(metrics).filter(([key, value]) => /^[a-zA-Z]+$/.test(key) && (typeof value === 'boolean' || Number.isFinite(value))))
    };
    logQueue = logQueue.then(async () => {
      let entries;
      try { entries = await readStoredLogs(); } catch (_) { entries = memoryLogs; }
      memoryLogs = [...entries, entry].slice(-LOG_LIMIT);
      try {
        const db = await openDatabase();
        await new Promise((resolve, reject) => {
          const transaction = db.transaction('logs', 'readwrite');
          transaction.objectStore('logs').put(memoryLogs, 'entries');
          transaction.oncomplete = resolve;
          transaction.onerror = () => reject(transaction.error);
          transaction.onabort = () => reject(transaction.error);
        });
      } catch (_) {
        // ponytail: if IndexedDB is unavailable, logs last only until this worker stops.
      }
    }).catch(() => {});
    return logQueue;
  }

  async function readLogs() {
    await logQueue;
    try { return await readStoredLogs(); } catch (_) { return memoryLogs; }
  }

  function anonymizeLogs(entries) {
    return entries.map(entry => ({
      timestamp: entry.timestamp,
      operation: OPERATIONS.has(entry.operation) ? entry.operation : 'background_error',
      level: entry.level,
      code: ERROR_CODES.has(entry.code) ? entry.code : '',
      ...(entry.message ? { message: '[technical message omitted]' } : {}),
      metrics: entry.metrics
    }));
  }

  return { errorCode, record, readLogs, anonymizeLogs, logLimit: LOG_LIMIT };
})();
