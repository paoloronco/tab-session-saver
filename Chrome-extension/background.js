
const DEFAULT_SESSION_NAME = 'Session';
const TAB_GROUP_COLORS = new Set(['grey', 'blue', 'red', 'yellow', 'green', 'cyan', 'orange', 'pink', 'purple']);
const RESTORE_IN_PROGRESS_ERROR = 'RESTORE_IN_PROGRESS';
const RESTORE_MODE_NEW_WINDOWS = 'new_windows';
const RESTORE_MODE_CURRENT_WINDOW = 'current_window';
const RESTORE_TAB_BATCH_SIZE = 25;
const AUTO_SAVE_ALARM_NAME = 'auto-save-session';
const AUTO_SAVE_SETTINGS_KEY = 'autoSaveSettings';
const AUTO_SAVE_EXIT_SNAPSHOT_KEY = 'autoSaveExitSnapshot';
const AUTO_SAVE_RUN_ID_KEY = 'autoSaveRunId';
const AUTO_SAVE_MIN_INTERVAL_MINUTES = 10;
const SAVE_TYPE_AUTO = 'auto';
const SAVE_TYPE_MANUAL = 'manual';
const AUTO_SAVE_TRIGGER_SCHEDULED = 'scheduled';
const AUTO_SAVE_TRIGGER_EXIT = 'exit';
const AUTO_SAVE_EXIT_SESSION_MARKER = 'rolling-exit-snapshot';
const AUTO_SAVE_EXIT_DEBOUNCE_MS = 1000;
const MAX_STORED_STRING_LENGTH = 4096;
const SAFE_RESTORE_PROTOCOLS = new Set([
  'http:',
  'https:',
  'file:',
  'chrome:',
  'chrome-extension:',
  'edge:',
  'brave:',
  'opera:',
  'vivaldi:'
]);

let activeRestoreToken = null;
let activeAutoSaveSettings = null;
let exitSnapshotRefreshTimer = null;

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.setUninstallURL('https://forms.gle/sbMUP5JrwYubSA2m6');
    const url = chrome.runtime.getURL('welcome.html');
    chrome.tabs.create({ url });
  }
  initializeAutoSaveSchedule().catch((error) => {
    console.warn('[background] auto save schedule initialization failed:', error);
  });
});

if (chrome.runtime.onStartup) {
  chrome.runtime.onStartup.addListener(() => {
    resetAutoSaveRunId().then(() => initializeAutoSaveSchedule()).catch((error) => {
      console.warn('[background] auto save startup scheduling failed:', error);
    });
  });
}

if (chrome.alarms?.onAlarm) {
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm?.name !== AUTO_SAVE_ALARM_NAME) return;
    runAutoSaveNow().catch((error) => {
      console.warn('[background] auto save failed:', error);
    });
  });
}

if (chrome.tabs) {
  [
    'onCreated',
    'onUpdated',
    'onAttached',
    'onDetached',
    'onMoved',
    'onReplaced'
  ].forEach((eventName) => {
    const event = chrome.tabs[eventName];
    if (event?.addListener) {
      event.addListener(() => {
        scheduleAutoSaveExitSnapshotRefresh();
      });
    }
  });
  if (chrome.tabs.onRemoved?.addListener) {
    chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
      if (!removeInfo?.isWindowClosing) {
        scheduleAutoSaveExitSnapshotRefresh();
      }
    });
  }
}

if (chrome.windows) {
  [
    'onCreated',
    'onFocusChanged',
    'onBoundsChanged'
  ].forEach((eventName) => {
    const event = chrome.windows[eventName];
    if (event?.addListener) {
      event.addListener(() => {
        scheduleAutoSaveExitSnapshotRefresh();
      });
    }
  });
  if (chrome.windows.onRemoved?.addListener) {
    chrome.windows.onRemoved.addListener(() => {
      handleWindowRemovedForAutoSaveExit().catch((error) => {
        console.warn('[background] exit auto save failed:', error);
      });
    });
  }
}

if (chrome.storage?.onChanged) {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local' || !changes[AUTO_SAVE_SETTINGS_KEY]) return;
    applyAutoSaveSchedule(changes[AUTO_SAVE_SETTINGS_KEY].newValue).catch((error) => {
      console.warn('[background] auto save reschedule failed:', error);
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    try {
      switch (request.action) {
        case 'capture_current_desktop': {
          const snapshot = await captureCurrentDesktopSnapshot({
            sourceWindowId: Number.isInteger(request?.sourceWindowId) ? request.sourceWindowId : null
          });
          sendResponse({ success: true, ...snapshot });
          break;
        }
        case 'get_sessions': {
          const sessions = await loadSessionsFromStorage();
          sendResponse(sessions);
          break;
        }
        case 'get_auto_save_settings': {
          const settings = await loadAutoSaveSettings();
          sendResponse({ success: true, settings });
          break;
        }
        case 'update_auto_save_settings': {
          const settings = normalizeAutoSaveSettings(request.settings);
          await chrome.storage.local.set({ [AUTO_SAVE_SETTINGS_KEY]: settings });
          await applyAutoSaveSchedule(settings);
          sendResponse({ success: true, settings });
          break;
        }
        case 'open_session': {
          if (!request.session) throw new Error('No session payload provided.');
          const result = await restoreSessionWithLock(request.session, {
            restoreMode: request.restoreMode,
            targetWindowId: request.targetWindowId
          });
          sendResponse(result);
          break;
        }
        case 'restore_window': {
          if (!request.windowSnapshot) throw new Error('No window payload provided.');
          const result = await restoreWindowWithLock(request.windowSnapshot, {
            restoreMode: request.restoreMode,
            targetWindowId: request.targetWindowId
          });
          sendResponse(result);
          break;
        }
        case 'delete_session': {
          const success = await deleteSessionAtIndex(request.index);
          sendResponse({ success });
          break;
        }
        case 'rename_session': {
          const success = await renameSessionAtIndex(request.index, request.newName);
          sendResponse({ success });
          break;
        }
        case 'update_session': {
          const { index, session } = request;
          const success = await updateSessionAtIndex(index, session);
          sendResponse({ success });
          break;
        }
        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('[background] action error:', request.action, error);
      sendResponse({ success: false, error: error?.message || String(error) });
    }
  })();
  return true;
});

async function restoreSessionWithLock(session, options = {}) {
  return runRestoreWithLock(() => restoreSessionFromSnapshot(session, options));
}

async function restoreWindowWithLock(windowSnapshot, options = {}) {
  return runRestoreWithLock(async () => {
    const normalizedWindow = constructWindowSnapshot(windowSnapshot || {}, {});
    const restoreOptions = normalizeRestoreOptions(options);
    if (restoreOptions.restoreMode === RESTORE_MODE_CURRENT_WINDOW) {
      await validateRestoreTargetWindow(restoreOptions.targetWindowId);
      await restoreWindowIntoExistingWindow(normalizedWindow, restoreOptions.targetWindowId);
      return;
    }
    await restoreSingleWindow(normalizedWindow);
  });
}

function normalizeRestoreOptions(options = {}) {
  const restoreMode = options.restoreMode === RESTORE_MODE_CURRENT_WINDOW
    ? RESTORE_MODE_CURRENT_WINDOW
    : RESTORE_MODE_NEW_WINDOWS;
  return {
    restoreMode,
    targetWindowId: Number.isInteger(options.targetWindowId) ? options.targetWindowId : null
  };
}

async function validateRestoreTargetWindow(targetWindowId) {
  if (!Number.isInteger(targetWindowId)) {
    throw new Error('A valid target window is required for this restore mode.');
  }
  try {
    const targetWindow = await chrome.windows.get(targetWindowId);
    if (!targetWindow || targetWindow.type !== 'normal') {
      throw new Error('The target window is not a normal browser window.');
    }
    return targetWindow;
  } catch (error) {
    throw new Error(`The target window is no longer available: ${error?.message || error}`);
  }
}

async function runRestoreWithLock(restoreOperation) {
  if (activeRestoreToken) {
    return {
      success: false,
      error: 'A session restore is already in progress.',
      code: RESTORE_IN_PROGRESS_ERROR
    };
  }

  const restoreToken = Symbol('restore');
  activeRestoreToken = restoreToken;

  try {
    await restoreOperation();
    return { success: true };
  } finally {
    if (activeRestoreToken === restoreToken) {
      activeRestoreToken = null;
    }
  }
}

async function captureCurrentDesktopSnapshot(options = {}) {
  try {
    const allWindows = await chrome.windows.getAll({ populate: true, windowTypes: ['normal'] });
    const enrichedCurrent = await resolveCaptureWindow(allWindows, options.sourceWindowId);
    if (!enrichedCurrent) {
      throw new Error('No active browser window available for capture.');
    }

    const desktopKey = deriveDesktopKey(enrichedCurrent);
    const { windows: filteredWindows, desktopStrategy, heuristics } =
      filterWindowsForCurrentDesktop(allWindows, enrichedCurrent, desktopKey);

    const snapshots = await Promise.all(filteredWindows.map(async (win) =>
      buildWindowSnapshot(win, { focusedWindowId: enrichedCurrent?.id })
    ));

    const platform =
      (globalThis.navigator &&
        (globalThis.navigator.userAgentData?.platform || globalThis.navigator.platform)) ||
      'unknown';

    return {
      windows: snapshots,
      desktopKey: desktopKey ?? null,
      desktopStrategy,
      heuristics,
      platform
    };
  } catch (error) {
    console.warn('[background] primary capture failed, using fallback', error);
    return captureFallbackSnapshot(error, options);
  }
}

async function resolveCaptureWindow(allWindows, sourceWindowId = null) {
  if (Number.isInteger(sourceWindowId)) {
    const explicitWindow = allWindows.find((win) => win.id === sourceWindowId);
    if (explicitWindow) {
      return explicitWindow;
    }
    try {
      const fetchedWindow = await chrome.windows.get(sourceWindowId, { populate: true });
      if (fetchedWindow?.type === 'normal') {
        return fetchedWindow;
      }
    } catch (error) {
      console.warn('[background] Failed to resolve source window', sourceWindowId, error);
    }
  }

  try {
    const lastFocused = await chrome.windows.getLastFocused({ populate: true, windowTypes: ['normal'] });
    if (typeof lastFocused?.id === 'number') {
      return allWindows.find((win) => win.id === lastFocused.id) || lastFocused;
    }
  } catch (error) {
    console.warn('[background] Failed to resolve last focused window', error);
  }

  return allWindows.find((win) => Array.isArray(win.tabs) && win.tabs.length > 0) || null;
}

async function captureFallbackSnapshot(reason, options = {}) {
  const allWindows = await chrome.windows.getAll({ populate: true, windowTypes: ['normal'] });
  const currentWindow = await resolveCaptureWindow(allWindows, options.sourceWindowId);

  let windowsToCapture = allWindows.filter((win) => Array.isArray(win.tabs) && win.tabs.length > 0);
  if (windowsToCapture.length === 0 && currentWindow && typeof currentWindow.id === 'number') {
    const matchingWindow = allWindows.find((win) => win.id === currentWindow.id) || currentWindow;
    windowsToCapture = matchingWindow ? [matchingWindow] : [];
  }

  let snapshots = await Promise.all(
    windowsToCapture.map((win) =>
      buildWindowSnapshot(win, { focusedWindowId: currentWindow?.id ?? null })
    )
  );

  const hasTabs = snapshots.some((win) => Array.isArray(win.tabs) && win.tabs.length > 0);
  if (!hasTabs) {
    const tabs = currentWindow && typeof currentWindow.id === 'number'
      ? await chrome.tabs.query({ windowId: currentWindow.id })
      : await chrome.tabs.query({});
    if (tabs.length > 0) {
      const fallbackWindow = await buildWindowSnapshot(
        {
          state: 'normal',
          focused: true,
          tabs
        },
        {}
      );
      snapshots = [fallbackWindow];
    }
  }

  const platform =
    (globalThis.navigator &&
      (globalThis.navigator.userAgentData?.platform || globalThis.navigator.platform)) ||
    'unknown';

  return {
    windows: snapshots,
    desktopKey: null,
    desktopStrategy: null,
    heuristics: `fallback-global:${reason ? reason.message || String(reason) : 'unknown'}`,
    platform
  };
}

function deriveDesktopKey(win) {
  if (!win) return null;
  if (typeof win.workspaceId !== 'undefined' && win.workspaceId !== null) {
    return `workspace:${win.workspaceId}`;
  }
  if (typeof win.virtualDesktopId !== 'undefined' && win.virtualDesktopId !== null) {
    return `virtual:${win.virtualDesktopId}`;
  }
  if (typeof win.deskId !== 'undefined' && win.deskId !== null) {
    return `desk:${win.deskId}`;
  }
  return null;
}

function filterWindowsForCurrentDesktop(allWindows, currentWindow, desktopKey) {
  const eligibleWindows = allWindows.filter((win) => {
    if (win.type && win.type !== 'normal') return false;
    return Array.isArray(win.tabs) && win.tabs.length > 0;
  });

  if (desktopKey) {
    const desktopWindows = eligibleWindows.filter((win) => deriveDesktopKey(win) === desktopKey);
    if (desktopWindows.length > 0) {
      return {
        windows: desktopWindows,
        desktopStrategy: 'workspace',
        heuristics: 'native'
      };
    }
  }

  const windowsWithDesktopIds = eligibleWindows.filter((win) => deriveDesktopKey(win));
  if (windowsWithDesktopIds.length === 0) {
    return {
      windows: eligibleWindows,
      desktopStrategy: null,
      heuristics: 'global-fallback-no-desktop-id'
    };
  }

  return {
    windows:
      currentWindow && typeof currentWindow.id === 'number'
        ? eligibleWindows.filter((win) => win.id === currentWindow.id)
        : [],
    desktopStrategy: 'window',
    heuristics: 'mixed-desktop-metadata-window-fallback'
  };
}

function sanitizeGroupSnapshot(group) {
  if (!group || typeof group !== 'object') return null;

  const candidateIds = [group.id, group.groupId];
  let normalizedId = null;
  for (const value of candidateIds) {
    if (Number.isInteger(value)) {
      normalizedId = value;
      break;
    }
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number.parseInt(value, 10);
      if (Number.isInteger(parsed)) {
        normalizedId = parsed;
        break;
      }
    }
  }

  if (normalizedId === null) {
    return null;
  }

  const color = typeof group.color === 'string' ? group.color.toLowerCase() : 'grey';

  return {
    id: normalizedId,
    title: clampString(typeof group.title === 'string' ? group.title : '', 256),
    color: TAB_GROUP_COLORS.has(color) ? color : 'grey',
    collapsed: Boolean(group.collapsed)
  };
}

function clampString(value, maxLength = MAX_STORED_STRING_LENGTH) {
  if (typeof value !== 'string') return '';
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

function normalizeRestorableUrl(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_STORED_STRING_LENGTH) return null;

  const lower = trimmed.toLowerCase();
  if (lower === 'about:blank' || lower === 'about:newtab') {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    return SAFE_RESTORE_PROTOCOLS.has(parsed.protocol) ? trimmed : null;
  } catch (_) {
    return null;
  }
}

function constructWindowSnapshot(windowLike = {}, options = {}) {
  const {
    focusedWindowId = null,
    ensureTabs = false,
    groupsOverride = null
  } = options;

  const tabs = Array.isArray(windowLike.tabs) ? windowLike.tabs : [];
  let sanitizedTabs = tabs.map((tab) => sanitizeTabSnapshot(tab)).filter((tab) => tab !== null);
  if (sanitizedTabs.some((tab) => Number.isInteger(tab.index))) {
    sanitizedTabs = sanitizedTabs.sort((a, b) => {
      const leftIndex = Number.isInteger(a.index) ? a.index : Number.MAX_SAFE_INTEGER;
      const rightIndex = Number.isInteger(b.index) ? b.index : Number.MAX_SAFE_INTEGER;
      return leftIndex - rightIndex;
    });
  }

  if (ensureTabs && sanitizedTabs.length === 0) {
    sanitizedTabs = [
      {
        title: 'New Tab',
        url: 'chrome://newtab/',
        pinned: false,
        active: true,
        muted: false,
        audible: false,
        discarded: false,
        favIconUrl: null,
        index: 0,
        groupId: -1
      }
    ];
  }

  const groupSource = Array.isArray(groupsOverride)
    ? groupsOverride
    : Array.isArray(windowLike.groups)
    ? windowLike.groups
    : Array.isArray(windowLike.tabGroups)
    ? windowLike.tabGroups
    : [];

  const sanitizedGroups = groupSource.map((group) => sanitizeGroupSnapshot(group)).filter((group) => group !== null);

  const focusedValue =
    typeof focusedWindowId === 'number'
      ? windowLike.id === focusedWindowId
      : typeof windowLike.focused === 'boolean'
      ? windowLike.focused
      : sanitizedTabs.some((tab) => tab.active);

  return {
    state: typeof windowLike.state === 'string' ? windowLike.state : 'normal',
    focused: Boolean(focusedValue),
    left: Number.isFinite(windowLike.left) ? windowLike.left : null,
    top: Number.isFinite(windowLike.top) ? windowLike.top : null,
    width: Number.isFinite(windowLike.width) ? windowLike.width : null,
    height: Number.isFinite(windowLike.height) ? windowLike.height : null,
    incognito: Boolean(windowLike.incognito),
    alwaysOnTop: Boolean(windowLike.alwaysOnTop),
    tabs: sanitizedTabs,
    groups: sanitizedGroups
  };
}

function buildTabGroupUpdatePayload(group) {
  if (!group || typeof group !== 'object') return {};
  const payload = {
    title: clampString(typeof group.title === 'string' ? group.title : '', 256)
  };
  const color = typeof group.color === 'string' ? group.color.toLowerCase() : null;
  if (color && TAB_GROUP_COLORS.has(color)) {
    payload.color = color;
  }
  if (typeof group.collapsed === 'boolean') {
    payload.collapsed = group.collapsed;
  }
  return payload;
}

async function buildWindowSnapshot(windowLike, options = {}) {
  let groupsOverride = null;
  if (windowLike && typeof windowLike.id === 'number' && chrome.tabGroups) {
    try {
      const windowGroups = await chrome.tabGroups.query({ windowId: windowLike.id });
      groupsOverride = windowGroups;
    } catch (e) {
      // Tab groups unsupported or query failed; fall back to provided data.
      groupsOverride = null;
    }
  }

  return constructWindowSnapshot(windowLike, {
    ...options,
    ensureTabs: true,
    groupsOverride
  });
}

function sanitizeTabSnapshot(tab) {
  const url = normalizeRestorableUrl(tab?.url);
  if (!url) return null;

  return {
    title: clampString(typeof tab.title === 'string' ? tab.title : url),
    url,
    pinned: Boolean(tab.pinned),
    active: Boolean(tab.active),
    muted: tab.mutedInfo ? Boolean(tab.mutedInfo.muted) : Boolean(tab.muted),
    audible: Boolean(tab.audible),
    discarded: Boolean(tab.discarded),
    favIconUrl: typeof tab.favIconUrl === 'string' ? clampString(tab.favIconUrl) : null,
    index: Number.isInteger(tab.index) ? tab.index : null,
    groupId: Number.isInteger(tab.groupId) ? tab.groupId : -1
  };
}

function normalizeAutoSaveSettings(rawSettings = {}) {
  const settings = rawSettings && typeof rawSettings === 'object' ? rawSettings : {};
  const parsedInterval = Number.parseInt(settings.intervalMinutes, 10);
  const intervalMinutes = Number.isFinite(parsedInterval)
    ? Math.max(AUTO_SAVE_MIN_INTERVAL_MINUTES, parsedInterval)
    : AUTO_SAVE_MIN_INTERVAL_MINUTES;

  return {
    enabled: settings.enabled === true,
    intervalMinutes,
    exitEnabled: settings.exitEnabled === true
  };
}

async function loadAutoSaveSettings() {
  if (!chrome.storage?.local) {
    return activeAutoSaveSettings || normalizeAutoSaveSettings();
  }
  const stored = await chrome.storage.local.get(AUTO_SAVE_SETTINGS_KEY);
  return stored[AUTO_SAVE_SETTINGS_KEY]
    ? normalizeAutoSaveSettings(stored[AUTO_SAVE_SETTINGS_KEY])
    : activeAutoSaveSettings || normalizeAutoSaveSettings();
}

async function initializeAutoSaveSchedule() {
  if (!chrome.alarms || !chrome.storage?.local) return;
  const settings = await loadAutoSaveSettings();
  await applyAutoSaveSchedule(settings);
}

async function applyAutoSaveSchedule(rawSettings = {}) {
  if (!chrome.alarms) return normalizeAutoSaveSettings(rawSettings);

  const settings = normalizeAutoSaveSettings(rawSettings);
  activeAutoSaveSettings = settings;
  await chrome.alarms.clear(AUTO_SAVE_ALARM_NAME);
  if (settings.enabled) {
    await chrome.alarms.create(AUTO_SAVE_ALARM_NAME, {
      delayInMinutes: settings.intervalMinutes,
      periodInMinutes: settings.intervalMinutes
    });
  }
  if (settings.exitEnabled) {
    await refreshAutoSaveExitSnapshot();
  }
  return settings;
}

function getSessionSaveType(session) {
  const metadataType = session?.metadata?.saveType;
  const topLevelType = session?.saveType;
  return topLevelType === SAVE_TYPE_AUTO || metadataType === SAVE_TYPE_AUTO
    ? SAVE_TYPE_AUTO
    : SAVE_TYPE_MANUAL;
}

function createAutoSaveRunId() {
  return `run-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function resetAutoSaveRunId() {
  if (!chrome.storage?.local) return null;
  const runId = createAutoSaveRunId();
  await chrome.storage.local.set({ [AUTO_SAVE_RUN_ID_KEY]: runId });
  return runId;
}

async function getCurrentAutoSaveRunId() {
  if (!chrome.storage?.local) return createAutoSaveRunId();
  const stored = await chrome.storage.local.get(AUTO_SAVE_RUN_ID_KEY);
  const existing = stored[AUTO_SAVE_RUN_ID_KEY];
  if (typeof existing === 'string' && existing.trim()) {
    return existing.trim();
  }
  return resetAutoSaveRunId();
}

function getAutoSaveBaseDomain(url) {
  if (typeof url !== 'string') return '';
  try {
    const hostname = new URL(url).hostname.replace(/^www\./i, '').toLowerCase();
    if (!hostname) return '';
    if (hostname === 'localhost' || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) {
      return hostname;
    }
    const parts = hostname.split('.').filter(Boolean);
    return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
  } catch (_) {
    return '';
  }
}

function getAutoSaveTopicSignature(snapshot) {
  const counts = new Map();
  const windows = Array.isArray(snapshot?.windows) ? snapshot.windows : [];
  windows.forEach((browserWindow) => {
    const tabs = Array.isArray(browserWindow?.tabs) ? browserWindow.tabs : [];
    tabs.forEach((tab) => {
      const domain = getAutoSaveBaseDomain(tab?.url);
      if (!domain) return;
      counts.set(domain, (counts.get(domain) || 0) + 1);
    });
  });

  if (!counts.size) return null;
  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))[0][0];
}

async function runAutoSaveNow() {
  const settings = await loadAutoSaveSettings();
  if (!settings.enabled) {
    return { success: false, skipped: true, reason: 'disabled' };
  }

  const snapshot = await captureCurrentDesktopSnapshot({});
  return storeAutoSaveSessionFromSnapshot(snapshot, AUTO_SAVE_TRIGGER_SCHEDULED);
}

async function refreshAutoSaveExitSnapshot() {
  if (!chrome.storage?.local) {
    return { success: false, skipped: true, reason: 'storage_unavailable' };
  }
  const settings = await loadAutoSaveSettings();
  if (!settings.exitEnabled) {
    return { success: false, skipped: true, reason: 'disabled' };
  }

  const snapshot = await captureCurrentDesktopSnapshot({});
  const hasTabs = snapshotHasTabs(snapshot);
  if (!hasTabs) {
    return { success: false, skipped: true, reason: 'empty' };
  }

  await chrome.storage.local.set({ [AUTO_SAVE_EXIT_SNAPSHOT_KEY]: snapshot });
  return storeAutoSaveSessionFromSnapshot(snapshot, AUTO_SAVE_TRIGGER_EXIT, {
    upsertExitSnapshot: true
  });
}

function scheduleAutoSaveExitSnapshotRefresh() {
  if (!chrome.storage?.local) return;
  if (exitSnapshotRefreshTimer) clearTimeout(exitSnapshotRefreshTimer);
  exitSnapshotRefreshTimer = setTimeout(() => {
    exitSnapshotRefreshTimer = null;
    refreshAutoSaveExitSnapshot().catch((error) => {
      console.warn('[background] exit snapshot refresh failed:', error);
    });
  }, AUTO_SAVE_EXIT_DEBOUNCE_MS);
}

async function handleWindowRemovedForAutoSaveExit() {
  const settings = await loadAutoSaveSettings();
  if (!settings.exitEnabled) {
    return { success: false, skipped: true, reason: 'disabled' };
  }

  const remainingWindows = chrome.windows?.getAll
    ? await chrome.windows.getAll({ populate: true, windowTypes: ['normal'] })
    : [];
  const hasRemainingNormalWindows = remainingWindows.some((win) =>
    (!win.type || win.type === 'normal') && Array.isArray(win.tabs) && win.tabs.length > 0
  );
  if (hasRemainingNormalWindows) {
    scheduleAutoSaveExitSnapshotRefresh();
    return { success: false, skipped: true, reason: 'windows_remaining' };
  }

  return runAutoSaveOnExit();
}

async function runAutoSaveOnExit() {
  const settings = await loadAutoSaveSettings();
  if (!settings.exitEnabled) {
    return { success: false, skipped: true, reason: 'disabled' };
  }

  const stored = chrome.storage?.local
    ? await chrome.storage.local.get(AUTO_SAVE_EXIT_SNAPSHOT_KEY)
    : {};
  const snapshot = stored[AUTO_SAVE_EXIT_SNAPSHOT_KEY] || await captureCurrentDesktopSnapshot({});
  const result = await storeAutoSaveSessionFromSnapshot(snapshot, AUTO_SAVE_TRIGGER_EXIT, {
    upsertExitSnapshot: true
  });
  if (result.success && chrome.storage?.local) {
    await chrome.storage.local.set({ [AUTO_SAVE_EXIT_SNAPSHOT_KEY]: null });
  }
  return result;
}

function snapshotHasTabs(snapshot) {
  return Array.isArray(snapshot?.windows) && snapshot.windows.some((win) =>
    Array.isArray(win.tabs) && win.tabs.length > 0
  );
}

async function storeAutoSaveSessionFromSnapshot(snapshot, trigger, options = {}) {
  const hasTabs = snapshotHasTabs(snapshot);
  if (!hasTabs) {
    return { success: false, skipped: true, reason: 'empty' };
  }

  const sessions = await loadSessionsFromStorage();
  const { upsertExitSnapshot = false } = options;
  const timestamp = new Date().toISOString();
  const saveTrigger = trigger === AUTO_SAVE_TRIGGER_EXIT ? AUTO_SAVE_TRIGGER_EXIT : AUTO_SAVE_TRIGGER_SCHEDULED;
  const autoSaveRunId = await getCurrentAutoSaveRunId();
  const autoSaveTopicSignature = getAutoSaveTopicSignature(snapshot);
  const existingExitIndex =
    upsertExitSnapshot && saveTrigger === AUTO_SAVE_TRIGGER_EXIT
      ? findRollingExitSessionIndex(sessions)
      : -1;
  const autoSaveCount = sessions.filter((session) => getSessionSaveType(session) === SAVE_TYPE_AUTO).length;
  const existingExitSession = existingExitIndex >= 0 ? sessions[existingExitIndex] : null;
  const metadata = {
    desktopKey: snapshot.desktopKey ?? null,
    saveType: SAVE_TYPE_AUTO,
    saveTrigger,
    autoSaveRunId,
    ...(autoSaveTopicSignature ? { autoSaveTopicSignature } : {}),
    ...(upsertExitSnapshot && saveTrigger === AUTO_SAVE_TRIGGER_EXIT ? { snapshotRole: AUTO_SAVE_EXIT_SESSION_MARKER } : {}),
    ...(snapshot.desktopStrategy ? { desktopStrategy: snapshot.desktopStrategy } : {}),
    ...(snapshot.heuristics ? { heuristics: snapshot.heuristics } : {})
  };
  const autoSession = normalizeSessionForStorage({
    name:
      existingExitSession?.name ||
      `${saveTrigger === AUTO_SAVE_TRIGGER_EXIT ? 'Exit Save' : 'Auto Save'} ${autoSaveCount + 1}`,
    timestamp,
    windows: snapshot.windows,
    metadata,
    desktopKey: snapshot.desktopKey ?? null,
    desktopStrategy: snapshot.desktopStrategy ?? null,
    platform: snapshot.platform ?? null,
    saveType: SAVE_TYPE_AUTO
  });

  if (!autoSession.windows.length) {
    return { success: false, skipped: true, reason: 'empty' };
  }

  if (existingExitIndex >= 0) {
    sessions[existingExitIndex] = autoSession;
  } else {
    sessions.push(autoSession);
  }
  await chrome.storage.local.set({ sessions });
  return { success: true, session: autoSession };
}

function findRollingExitSessionIndex(sessions) {
  return (Array.isArray(sessions) ? sessions : []).findIndex((session) =>
    getSessionSaveType(session) === SAVE_TYPE_AUTO &&
    session?.metadata?.saveTrigger === AUTO_SAVE_TRIGGER_EXIT &&
    session?.metadata?.snapshotRole === AUTO_SAVE_EXIT_SESSION_MARKER
  );
}

async function loadSessionsFromStorage() {
  const stored = await chrome.storage.local.get({ sessions: [] });
  const sessions = Array.isArray(stored.sessions) ? stored.sessions : [];

  const needsMigration = sessions.some((session) => {
    if (!Array.isArray(session?.windows)) return true;
    const strategy = session?.desktopStrategy || session?.metadata?.desktopStrategy;
    return strategy === 'best-effort' || strategy === 'global' || strategy === 'unknown';
  });

  if (!needsMigration) {
    return sessions;
  }

  const migrated = sessions.map((session, index) =>
    normalizeSessionForStorage(session, `${DEFAULT_SESSION_NAME} ${index + 1}`)
  );

  await chrome.storage.local.set({ sessions: migrated });
  return migrated;
}

async function deleteSessionAtIndex(index) {
  const sessions = await loadSessionsFromStorage();
  if (index < 0 || index >= sessions.length) return false;
  sessions.splice(index, 1);
  await chrome.storage.local.set({ sessions });
  return true;
}

async function renameSessionAtIndex(index, newName) {
  const sessions = await loadSessionsFromStorage();
  if (index < 0 || index >= sessions.length) return false;
  if (typeof newName !== 'string' || !newName.trim()) return false;
  sessions[index].name = newName.trim();
  await chrome.storage.local.set({ sessions });
  return true;
}

async function updateSessionAtIndex(index, sessionObject) {
  const sessions = await loadSessionsFromStorage();
  if (index < 0 || index >= sessions.length) return false;
  // Normalize/validate session object before storing
  const normalized = normalizeSessionForStorage(sessionObject, sessions[index]?.name || DEFAULT_SESSION_NAME);
  sessions[index] = normalized;
  await chrome.storage.local.set({ sessions });
  return true;
}
function normalizeSessionForStorage(rawSession, fallbackName = DEFAULT_SESSION_NAME, options = {}) {
  const base = rawSession && typeof rawSession === 'object' ? rawSession : {};
  const { includeEmptyWindows = false } = options;

  const timestamp =
    typeof base.timestamp === 'string' && base.timestamp
      ? base.timestamp
      : new Date().toISOString();

  const name =
    typeof base.name === 'string' && base.name.trim()
      ? clampString(base.name.trim(), 160)
      : fallbackName;

  const metadata =
    base.metadata && typeof base.metadata === 'object' ? { ...base.metadata } : {};
  const saveType = getSessionSaveType(base);

  const desktopKey =
    base.desktopKey ??
    metadata.desktopKey ??
    null;

  let desktopStrategy =
    base.desktopStrategy ??
    metadata.desktopStrategy ??
    null;
  if (desktopStrategy === 'unknown' || desktopStrategy === 'best-effort' || desktopStrategy === 'global') {
    desktopStrategy = null;
  }
  if (metadata.desktopStrategy === 'unknown' || metadata.desktopStrategy === 'best-effort' || metadata.desktopStrategy === 'global') {
    delete metadata.desktopStrategy;
  }

  const windowsSource = Array.isArray(rawSession)
    ? [{ tabs: rawSession }]
    : Array.isArray(base.windows)
    ? base.windows
    : Array.isArray(base.session)
    ? [{ tabs: base.session }]
    : Array.isArray(base.tabs)
    ? [{ tabs: base.tabs }]
    : [];

  const normalizedWindows = windowsSource
    .map((win) => constructWindowSnapshot(win || {}, {}))
    .filter((win) => includeEmptyWindows || (Array.isArray(win.tabs) && win.tabs.length > 0));

  const metadataForStorage = {
    ...metadata,
    desktopKey,
    saveType
  };
  if (saveType === SAVE_TYPE_AUTO) {
    metadataForStorage.saveTrigger =
      metadata.saveTrigger === AUTO_SAVE_TRIGGER_EXIT ? AUTO_SAVE_TRIGGER_EXIT : AUTO_SAVE_TRIGGER_SCHEDULED;
  } else {
    delete metadataForStorage.saveTrigger;
  }
  if (desktopStrategy) {
    metadataForStorage.desktopStrategy = desktopStrategy;
  }

  const sessionObject = {
    name,
    timestamp,
    windows: normalizedWindows,
    metadata: metadataForStorage,
    desktopKey,
    platform: base.platform ?? metadata.platform ?? null,
    saveType
  };

  if (desktopStrategy) {
    sessionObject.desktopStrategy = desktopStrategy;
  }

  return sessionObject;
}

async function restoreSessionFromSnapshot(rawSession, options = {}) {
  const normalized = normalizeSessionForStorage(rawSession, DEFAULT_SESSION_NAME, { includeEmptyWindows: true });
  const windows = Array.isArray(normalized.windows) ? normalized.windows : [];
  const restoreOptions = normalizeRestoreOptions(options);

  console.log('[restore] expected new window count:', windows.length);

  if (windows.length === 0) {
    await chrome.windows.create({ url: ['chrome://newtab/'] });
    return;
  }

  if (restoreOptions.restoreMode === RESTORE_MODE_CURRENT_WINDOW) {
    await validateRestoreTargetWindow(restoreOptions.targetWindowId);

    const windowsForNewWindows = windows.slice(0, -1);
    for (const winSnapshot of windowsForNewWindows) {
      try {
        await restoreSingleWindow({ ...winSnapshot, focused: false });
      } catch (err) {
        console.warn('[restore] window restore failed, continuing with remaining windows:', err);
      }
    }

    await restoreWindowIntoExistingWindow(windows.at(-1), restoreOptions.targetWindowId);
    return;
  }

  // Unfocused windows first so the focused window ends up on top.
  const orderedWindows = [...windows].sort((a, b) => Number(a.focused) - Number(b.focused));

  let windowsRestored = 0;
  const restoredWindowIds = [];
  for (const winSnapshot of orderedWindows) {
    try {
      const restoreResult = await restoreSingleWindow(winSnapshot);
      windowsRestored++;
      if (Number.isInteger(restoreResult?.windowId)) {
        restoredWindowIds.push(restoreResult.windowId);
      }
    } catch (err) {
      // One window failing should not abort the entire restore.
      console.warn('[restore] window restore failed, continuing with remaining windows:', err);
    }
  }
  console.log(
    '[restore] completed:',
    windowsRestored,
    '/',
    orderedWindows.length,
    'windows restored | actual restored window IDs:',
    restoredWindowIds.join(',') || 'none'
  );
}

async function restoreSingleWindow(windowSnapshot) {
  const tabs = Array.isArray(windowSnapshot.tabs) ? windowSnapshot.tabs : [];
  const groups = Array.isArray(windowSnapshot.groups) ? windowSnapshot.groups : [];
  const urls = tabs.length > 0 ? tabs.map((tab) => tab.url || 'chrome://newtab/') : ['chrome://newtab/'];

  const hasValidBounds =
    Number.isFinite(windowSnapshot.left) &&
    Number.isFinite(windowSnapshot.top) &&
    Number.isFinite(windowSnapshot.width) &&
    Number.isFinite(windowSnapshot.height);

  const sanitizeState = (state) => {
    const allowed = new Set(['normal', 'minimized', 'maximized', 'fullscreen']);
    return allowed.has(state) ? state : 'normal';
  };

  let desiredState = sanitizeState(windowSnapshot.state || 'normal');
  const createState = desiredState === 'minimized' ? 'normal' : desiredState;
  const shouldFocusWindow = windowSnapshot.focused === true;

  const createData = {
    url: urls[0],
    focused: shouldFocusWindow
  };
  if (createState !== 'normal') {
    createData.state = createState;
  }
  if (hasValidBounds && createState === 'normal') {
    createData.left = windowSnapshot.left;
    createData.top = windowSnapshot.top;
    createData.width = windowSnapshot.width;
    createData.height = windowSnapshot.height;
  }

  let createdWindow;
  try {
    createdWindow = await createWindowWithBatchedTabs(createData, urls);
  } catch (err) {
    console.warn('[background] windows.create failed, retrying without state/bounds', err);
    createdWindow = await createWindowWithBatchedTabs({ url: urls[0], focused: shouldFocusWindow }, urls);
    desiredState = 'normal';
  }

  const createdTabs = (await chrome.tabs.query({ windowId: createdWindow.id })).sort((a, b) => a.index - b.index);
  await restoreTabDetails(tabs, groups, createdTabs, createdWindow.id);

  const tryUpdateState = async (state) => {
    if (!state || state === 'normal') return;
    try {
      await chrome.windows.update(createdWindow.id, { state });
    } catch (err) {
      console.warn('[background] windows.update state failed', state, err);
    }
  };

  if (hasValidBounds && (!desiredState || desiredState === 'normal')) {
    try {
      await chrome.windows.update(createdWindow.id, {
        left: windowSnapshot.left,
        top: windowSnapshot.top,
        width: windowSnapshot.width,
        height: windowSnapshot.height
      });
    } catch (err) {
      console.warn('[background] windows.update bounds failed', err);
    }
  }

  if (desiredState === 'minimized') {
    await tryUpdateState('minimized');
  } else if (desiredState === 'maximized' || desiredState === 'fullscreen') {
    await tryUpdateState(desiredState);
  }

  return {
    windowId: createdWindow.id
  };
}

async function restoreWindowIntoExistingWindow(windowSnapshot, targetWindowId) {
  const tabs = Array.isArray(windowSnapshot.tabs) ? windowSnapshot.tabs : [];
  const groups = Array.isArray(windowSnapshot.groups) ? windowSnapshot.groups : [];
  const tabsToRestore = tabs.length > 0 ? tabs : [{ url: 'chrome://newtab/', active: true, groupId: -1 }];
  const createdTabs = [];

  for (let i = 0; i < tabsToRestore.length; i += 1) {
    const targetTab = tabsToRestore[i];
    try {
      createdTabs.push(await chrome.tabs.create({
        windowId: targetWindowId,
        url: targetTab.url || 'chrome://newtab/',
        active: false,
        index: i
      }));
    } catch (err) {
      console.warn('[restore] tab URL failed, opening new tab placeholder instead:', err);
      createdTabs.push(await chrome.tabs.create({
        windowId: targetWindowId,
        url: 'chrome://newtab/',
        active: false,
        index: i
      }));
    }
    if ((i + 1) % RESTORE_TAB_BATCH_SIZE === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  await restoreTabDetails(tabsToRestore, groups, createdTabs, targetWindowId);
  await chrome.windows.update(targetWindowId, { focused: true });
  return { windowId: targetWindowId };
}

async function restoreTabDetails(tabs, groups, createdTabs, targetWindowId) {
  for (let i = 0; i < tabs.length && i < createdTabs.length; i += 1) {
    const targetTab = tabs[i];
    const actualTab = createdTabs[i];
    if (!actualTab) continue;

    const updateProps = {};
    if (targetTab.pinned && !actualTab.pinned) {
      updateProps.pinned = true;
    }
    if (typeof targetTab.muted === 'boolean' && targetTab.muted !== actualTab.mutedInfo?.muted) {
      updateProps.muted = targetTab.muted;
    }

    if (Object.keys(updateProps).length > 0) {
      await chrome.tabs.update(actualTab.id, updateProps);
    }
  }

  // Restore tab groups
  if (groups.length > 0 && chrome.tabGroups) {
    try {
      // Group tabs by their groupId
      const groupMap = new Map();
      groups.forEach(group => {
        groupMap.set(group.id, { ...group, tabIds: [] });
      });

      // Assign tabs to groups
      for (let i = 0; i < tabs.length && i < createdTabs.length; i += 1) {
        const targetTab = tabs[i];
        const actualTab = createdTabs[i];
        if (targetTab.groupId !== -1 && groupMap.has(targetTab.groupId)) {
          groupMap.get(targetTab.groupId).tabIds.push(actualTab.id);
        }
      }

      // Create groups and assign tabs
      for (const group of groups) {
        const groupData = groupMap.get(group.id);
        if (groupData && groupData.tabIds.length > 0) {
          try {
            // Group the tabs
            const groupId = await chrome.tabs.group({
              tabIds: groupData.tabIds,
              createProperties: { windowId: targetWindowId }
            });
            // Update group properties
            const updatePayload = buildTabGroupUpdatePayload(groupData);
            if (Object.keys(updatePayload).length > 0) {
              await chrome.tabGroups.update(groupId, updatePayload);
            }
          } catch (e) {
            console.warn('[background] Failed to create tab group', e);
          }
        }
      }
    } catch (e) {
      console.warn('[background] Tab groups restoration failed', e);
    }
  }

  const activeIndex = tabs.findIndex((tab) => tab.active);
  if (activeIndex >= 0 && activeIndex < createdTabs.length) {
    await chrome.tabs.update(createdTabs[activeIndex].id, { active: true });
  }
}

async function createWindowWithBatchedTabs(createData, urls) {
  let createdWindow;
  try {
    createdWindow = await chrome.windows.create(createData);
  } catch (err) {
    if (createData.url === 'chrome://newtab/') throw err;
    console.warn('[restore] first tab URL failed, opening new tab placeholder instead:', err);
    createdWindow = await chrome.windows.create({ ...createData, url: 'chrome://newtab/' });
  }
  if (urls.length > 1) {
    await appendTabsInBatches(createdWindow.id, urls, 1);
  }
  return createdWindow;
}

async function appendTabsInBatches(windowId, urls, startIndex) {
  for (let i = startIndex; i < urls.length; i += 1) {
    try {
      await chrome.tabs.create({
        windowId,
        url: urls[i],
        active: false,
        index: i
      });
    } catch (err) {
      console.warn('[restore] tab URL failed, opening new tab placeholder instead:', err);
      try {
        await chrome.tabs.create({
          windowId,
          url: 'chrome://newtab/',
          active: false,
          index: i
        });
      } catch (fallbackErr) {
        console.warn('[restore] fallback tab creation failed:', fallbackErr);
      }
    }
    if ((i - startIndex + 1) % RESTORE_TAB_BATCH_SIZE === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
}
