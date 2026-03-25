
const DEFAULT_SESSION_NAME = 'Session';

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
          const snapshot = await captureCurrentDesktopSnapshot();
          sendResponse({ success: true, ...snapshot });
          break;
        }
        case 'get_sessions': {
          const sessions = await loadSessionsFromStorage();
          sendResponse(sessions);
          break;
        }
        case 'save_tabs': {
          const snapshot = await captureCurrentDesktopSnapshot();
          await appendSessionToStorage(
            normalizeSessionForStorage({
              name: DEFAULT_SESSION_NAME,
              timestamp: new Date().toISOString(),
              windows: snapshot.windows,
              metadata: buildMetadataFromSnapshot(snapshot),
              desktopKey: snapshot.desktopKey,
              desktopStrategy: snapshot.desktopStrategy,
              platform: snapshot.platform
            })
          );
          sendResponse({ success: true });
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

async function captureCurrentDesktopSnapshot() {
  try {
    const currentWindow = await chrome.windows.getCurrent();
    const allWindows = await chrome.windows.getAll({ populate: true, windowTypes: ['normal'] });

    const enrichedCurrent =
      (typeof currentWindow?.id === 'number'
        ? allWindows.find((win) => win.id === currentWindow.id)
        : null) || currentWindow || null;

    const desktopKey = deriveDesktopKey(enrichedCurrent);
    const desktopStrategy = desktopKey ? 'workspace' : null;
    const filteredWindows = filterWindowsForCurrentDesktop(allWindows, enrichedCurrent, desktopKey);

    const snapshots = filteredWindows.map((win) =>
      buildWindowSnapshot(win, { focusedWindowId: enrichedCurrent?.id })
    );

    const platform =
      (globalThis.navigator &&
        (globalThis.navigator.userAgentData?.platform || globalThis.navigator.platform)) ||
      'unknown';

    return {
      windows: snapshots,
      desktopKey: desktopKey ?? null,
      desktopStrategy,
      heuristics: desktopKey ? 'native' : 'fallback',
      platform
    };
  } catch (error) {
    console.warn('[background] primary capture failed, using fallback', error);
    return captureFallbackSnapshot(error);
  }
}

function buildMetadataFromSnapshot(snapshot) {
  const meta = {};
  if (Object.prototype.hasOwnProperty.call(snapshot, 'desktopKey')) {
    meta.desktopKey = snapshot.desktopKey ?? null;
  }
  if (snapshot.desktopStrategy) {
    meta.desktopStrategy = snapshot.desktopStrategy;
  }
  if (snapshot.platform) {
    meta.platform = snapshot.platform;
  }
  if (snapshot.heuristics) {
    meta.heuristics = snapshot.heuristics;
  }
  return meta;
}
async function captureFallbackSnapshot(reason) {
  const allWindows = await chrome.windows.getAll({ populate: true, windowTypes: ['normal'] });
  let snapshots = allWindows.map((win) => buildWindowSnapshot(win, {}));

  const hasTabs = snapshots.some((win) => Array.isArray(win.tabs) && win.tabs.length > 0);
  if (!hasTabs) {
    const tabs = await chrome.tabs.query({});
    if (tabs.length > 0) {
      snapshots = [
        buildWindowSnapshot(
          {
            state: 'normal',
            focused: true,
            tabs
          },
          {}
        )
      ];
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
    heuristics: `fallback:${reason ? reason.message || String(reason) : 'unknown'}`,
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
  return allWindows.filter((win) => {
    if (win.type && win.type !== 'normal') return false;
    if (!Array.isArray(win.tabs) || win.tabs.length === 0) return false;

    const winKey = deriveDesktopKey(win);
    if (desktopKey && winKey) {
      return winKey === desktopKey;
    }

    if (currentWindow && typeof currentWindow.id === 'number' && win.id === currentWindow.id) {
      return true;
    }

    // Without desktop identifiers, include all normal browser windows.
    return true;
  });
}

function buildWindowSnapshot(windowLike, options = {}) {
  const { focusedWindowId = null } = options;
  const tabs = Array.isArray(windowLike.tabs) ? windowLike.tabs : [];

  const sanitizedTabs = tabs
    .map((tab) => sanitizeTabSnapshot(tab))
    .filter((tab) => tab !== null);

  return {
    state: windowLike.state || 'normal',
    focused:
      typeof focusedWindowId === 'number'
        ? windowLike.id === focusedWindowId
        : Boolean(windowLike.focused),
    left: Number.isFinite(windowLike.left) ? windowLike.left : null,
    top: Number.isFinite(windowLike.top) ? windowLike.top : null,
    width: Number.isFinite(windowLike.width) ? windowLike.width : null,
    height: Number.isFinite(windowLike.height) ? windowLike.height : null,
    incognito: Boolean(windowLike.incognito),
    alwaysOnTop: Boolean(windowLike.alwaysOnTop),
    tabs: sanitizedTabs
  };
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
    index: Number.isInteger(tab.index) ? tab.index : null
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

async function appendSessionToStorage(sessionObject) {
  const sessions = await loadSessionsFromStorage();
  sessions.push(sessionObject);
  await chrome.storage.local.set({ sessions });
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
    .map((win) => buildWindowSnapshot(win || {}, {}))
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
    throw new Error('No windows to restore in this session.');
  }

  const orderedWindows = [...windows].sort((a, b) => Number(a.focused) - Number(b.focused));
  for (const winSnapshot of orderedWindows) {
    await restoreSingleWindow(winSnapshot);
  }
}

async function restoreSingleWindow(windowSnapshot) {
  const tabs = Array.isArray(windowSnapshot.tabs) ? windowSnapshot.tabs : [];
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
