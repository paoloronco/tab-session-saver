
const DEFAULT_SESSION_NAME = 'Session';
const TAB_GROUP_COLORS = new Set(['grey', 'blue', 'red', 'yellow', 'green', 'cyan', 'orange', 'pink', 'purple']);

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.setUninstallURL('https://forms.gle/sbMUP5JrwYubSA2m6');
    const url = chrome.runtime.getURL('welcome.html');
    chrome.tabs.create({ url });
  }
});

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
        case 'open_session': {
          if (!request.session) throw new Error('No session payload provided.');
          await restoreSessionFromSnapshot(request.session);
          sendResponse({ success: true });
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

  let windowsToCapture = [];
  if (currentWindow && typeof currentWindow.id === 'number') {
    const matchingWindow = allWindows.find((win) => win.id === currentWindow.id) || currentWindow;
    windowsToCapture = [matchingWindow];
  }

  if (windowsToCapture.length === 0) {
    windowsToCapture = allWindows.filter((win) => Array.isArray(win.tabs) && win.tabs.length > 0).slice(0, 1);
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
    desktopStrategy: 'window',
    heuristics: `fallback-window:${reason ? reason.message || String(reason) : 'unknown'}`,
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

  if (currentWindow && typeof currentWindow.id === 'number') {
    const currentOnly = eligibleWindows.filter((win) => win.id === currentWindow.id);
    if (currentOnly.length > 0) {
      return {
        windows: currentOnly,
        desktopStrategy: 'window',
        heuristics: 'strict-window-fallback'
      };
    }
  }

  return {
    windows: [],
    desktopStrategy: 'window',
    heuristics: 'no-window-match'
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
    title: typeof group.title === 'string' ? group.title : '',
    color: TAB_GROUP_COLORS.has(color) ? color : 'grey',
    collapsed: Boolean(group.collapsed)
  };
}

function constructWindowSnapshot(windowLike = {}, options = {}) {
  const {
    focusedWindowId = null,
    ensureTabs = false,
    groupsOverride = null
  } = options;

  const tabs = Array.isArray(windowLike.tabs) ? windowLike.tabs : [];
  let sanitizedTabs = tabs.map((tab) => sanitizeTabSnapshot(tab)).filter((tab) => tab !== null);

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
    title: typeof group.title === 'string' ? group.title : ''
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
  if (!tab || typeof tab.url !== 'string') return null;

  return {
    title: typeof tab.title === 'string' ? tab.title : tab.url,
    url: tab.url,
    pinned: Boolean(tab.pinned),
    active: Boolean(tab.active),
    muted: tab.mutedInfo ? Boolean(tab.mutedInfo.muted) : Boolean(tab.muted),
    audible: Boolean(tab.audible),
    discarded: Boolean(tab.discarded),
    favIconUrl: typeof tab.favIconUrl === 'string' ? tab.favIconUrl : null,
    index: Number.isInteger(tab.index) ? tab.index : null,
    groupId: Number.isInteger(tab.groupId) ? tab.groupId : -1
  };
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
function normalizeSessionForStorage(rawSession, fallbackName = DEFAULT_SESSION_NAME) {
  const base = rawSession && typeof rawSession === 'object' ? rawSession : {};

  const timestamp =
    typeof base.timestamp === 'string' && base.timestamp
      ? base.timestamp
      : new Date().toISOString();

  const name =
    typeof base.name === 'string' && base.name.trim()
      ? base.name.trim()
      : fallbackName;

  const metadata =
    base.metadata && typeof base.metadata === 'object' ? { ...base.metadata } : {};

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

  const windowsSource = Array.isArray(base.windows)
    ? base.windows
    : Array.isArray(base.session)
    ? [{ tabs: base.session }]
    : Array.isArray(base.tabs)
    ? [{ tabs: base.tabs }]
    : [];

  const normalizedWindows = windowsSource
    .map((win) => constructWindowSnapshot(win || {}, {}))
    .filter((win) => Array.isArray(win.tabs) && win.tabs.length > 0);

  const metadataForStorage = {
    ...metadata,
    desktopKey
  };
  if (desktopStrategy) {
    metadataForStorage.desktopStrategy = desktopStrategy;
  }

  const sessionObject = {
    name,
    timestamp,
    windows: normalizedWindows,
    metadata: metadataForStorage,
    desktopKey,
    platform: base.platform ?? metadata.platform ?? null
  };

  if (desktopStrategy) {
    sessionObject.desktopStrategy = desktopStrategy;
  }

  return sessionObject;
}
async function restoreSessionFromSnapshot(rawSession) {
  const normalized = normalizeSessionForStorage(rawSession);
  const windows = Array.isArray(normalized.windows) ? normalized.windows : [];

  if (windows.length === 0) {
    if (Array.isArray(rawSession)) {
      await chrome.windows.create({ url: rawSession.map((tab) => tab.url) });
      return;
    }
    await chrome.windows.create({ url: ['chrome://newtab/'] });
    return;
  }

  const orderedWindows = [...windows].sort((a, b) => Number(a.focused) - Number(b.focused));
  for (const winSnapshot of orderedWindows) {
    await restoreSingleWindow(winSnapshot);
  }
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

  const createData = {
    url: urls,
    focused: Boolean(windowSnapshot.focused)
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
    createdWindow = await chrome.windows.create(createData);
  } catch (err) {
    console.warn('[background] windows.create failed, retrying without state/bounds', err);
    createdWindow = await chrome.windows.create({ url: urls, focused: Boolean(windowSnapshot.focused) });
    desiredState = 'normal';
  }

  const createdTabs = await chrome.tabs.query({ windowId: createdWindow.id });
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
            const groupId = await chrome.tabs.group({ tabIds: groupData.tabIds });
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
}
