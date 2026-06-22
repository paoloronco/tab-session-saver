const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadBackground(chrome) {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'Chrome-extension', 'background.js'),
    'utf8'
  );
  const context = vm.createContext({ chrome, console, setTimeout, URL });
  vm.runInContext(
    `${source}\n;globalThis.__backgroundTest = { restoreSessionFromSnapshot, restoreWindowWithLock };`,
    context
  );
  return context.__backgroundTest;
}

function createChromeHarness() {
  let nextWindowId = 100;
  let nextTabId = 1000;
  let nextGroupId = 500;
  const windows = new Map([
    [42, {
      id: 42,
      type: 'normal',
      tabs: [{
        id: 420,
        windowId: 42,
        index: 0,
        url: 'https://example.com/current',
        pinned: false,
        active: true,
        mutedInfo: { muted: false }
      }]
    }]
  ]);
  const calls = {
    createdWindows: [],
    createdTabs: [],
    groupedTabs: [],
    groupUpdates: [],
    windowGets: [],
    windowUpdates: []
  };

  function reindex(windowId) {
    windows.get(windowId).tabs.forEach((tab, index) => {
      tab.index = index;
    });
  }

  function findTab(tabId) {
    for (const browserWindow of windows.values()) {
      const tab = browserWindow.tabs.find((candidate) => candidate.id === tabId);
      if (tab) return tab;
    }
    return null;
  }

  const chrome = {
    runtime: {
      OnInstalledReason: { INSTALL: 'install' },
      onInstalled: { addListener() {} },
      onMessage: { addListener() {} },
      setUninstallURL() {},
      getURL(value) { return value; }
    },
    tabs: {
      create: async ({ windowId, url, index, active = false }) => {
        const browserWindow = windows.get(windowId);
        if (!browserWindow) throw new Error(`Unknown window ${windowId}`);
        const insertionIndex = Number.isInteger(index)
          ? Math.max(0, Math.min(index, browserWindow.tabs.length))
          : browserWindow.tabs.length;
        const tab = {
          id: nextTabId++,
          windowId,
          index: insertionIndex,
          url,
          pinned: false,
          active,
          mutedInfo: { muted: false }
        };
        browserWindow.tabs.splice(insertionIndex, 0, tab);
        reindex(windowId);
        calls.createdTabs.push({ windowId, url, index: insertionIndex, tabId: tab.id });
        return tab;
      },
      query: async ({ windowId }) => windows.get(windowId)?.tabs || [],
      update: async (tabId, changes) => {
        const tab = findTab(tabId);
        if (!tab) throw new Error(`Unknown tab ${tabId}`);
        if (changes.active) {
          windows.get(tab.windowId).tabs.forEach((candidate) => {
            candidate.active = candidate.id === tabId;
          });
        }
        if (typeof changes.muted === 'boolean') {
          tab.mutedInfo = { muted: changes.muted };
        }
        Object.assign(tab, Object.fromEntries(
          Object.entries(changes).filter(([key]) => key !== 'muted')
        ));
        return tab;
      },
      group: async ({ tabIds }) => {
        calls.groupedTabs.push([...tabIds]);
        return nextGroupId++;
      }
    },
    tabGroups: {
      update: async (groupId, changes) => {
        calls.groupUpdates.push({ groupId, changes });
      }
    },
    windows: {
      get: async (windowId) => {
        calls.windowGets.push(windowId);
        const browserWindow = windows.get(windowId);
        if (!browserWindow) throw new Error(`Unknown window ${windowId}`);
        return browserWindow;
      },
      create: async (createData) => {
        const id = nextWindowId++;
        const tab = {
          id: nextTabId++,
          windowId: id,
          index: 0,
          url: createData.url,
          pinned: false,
          active: true,
          mutedInfo: { muted: false }
        };
        const browserWindow = { id, type: 'normal', tabs: [tab] };
        windows.set(id, browserWindow);
        calls.createdWindows.push({ id, createData });
        return browserWindow;
      },
      update: async (windowId, changes) => {
        calls.windowUpdates.push({ windowId, changes });
        return windows.get(windowId);
      }
    }
  };

  return { chrome, calls, windows };
}

function createTwoWindowSession() {
  return {
    name: 'Two windows',
    timestamp: Date.now(),
    windows: [
      {
        focused: false,
        state: 'normal',
        tabs: [{ url: 'https://example.com/a', groupId: -1, active: true }],
        groups: []
      },
      {
        focused: true,
        state: 'maximized',
        tabs: [
          { url: 'https://example.com/b-one', groupId: 7, active: false, pinned: true },
          { url: 'https://example.com/b-two', groupId: 7, active: true, muted: true }
        ],
        groups: [{ id: 7, title: 'B group', color: 'blue', collapsed: false }]
      }
    ]
  };
}

test('new-window mode creates every saved window without changing the current window', async () => {
  const { chrome, calls, windows } = createChromeHarness();
  const { restoreSessionFromSnapshot } = loadBackground(chrome);

  await restoreSessionFromSnapshot(createTwoWindowSession(), {
    restoreMode: 'new_windows',
    targetWindowId: 42
  });

  assert.equal(calls.windowGets.length, 0);
  assert.equal(calls.createdWindows.length, 2);
  assert.deepEqual(windows.get(42).tabs.map((tab) => tab.url), ['https://example.com/current']);
});

test('current-window mode creates A separately and inserts B before existing C', async () => {
  const { chrome, calls, windows } = createChromeHarness();
  const { restoreSessionFromSnapshot } = loadBackground(chrome);

  await restoreSessionFromSnapshot(createTwoWindowSession(), {
    restoreMode: 'current_window',
    targetWindowId: 42
  });

  assert.deepEqual(calls.windowGets, [42]);
  assert.equal(calls.createdWindows.length, 1);
  assert.equal(calls.createdWindows[0].createData.url, 'https://example.com/a');
  assert.deepEqual(windows.get(42).tabs.map((tab) => tab.url), [
    'https://example.com/b-one',
    'https://example.com/b-two',
    'https://example.com/current'
  ]);
  assert.equal(windows.get(42).tabs[0].pinned, true);
  assert.equal(windows.get(42).tabs[1].mutedInfo.muted, true);
  assert.equal(windows.get(42).tabs[1].active, true);
  assert.deepEqual(calls.groupedTabs, [[1001, 1002]]);
  assert.deepEqual(JSON.parse(JSON.stringify(calls.groupUpdates[0].changes)), {
    title: 'B group',
    color: 'blue',
    collapsed: false
  });
  assert.deepEqual(JSON.parse(JSON.stringify(calls.windowUpdates.at(-1))), {
    windowId: 42,
    changes: { focused: true }
  });
});

test('single-window restore merges into the current window when configured', async () => {
  const { chrome, calls, windows } = createChromeHarness();
  const { restoreWindowWithLock } = loadBackground(chrome);
  const windowSnapshot = createTwoWindowSession().windows[1];

  const result = await restoreWindowWithLock(windowSnapshot, {
    restoreMode: 'current_window',
    targetWindowId: 42
  });

  assert.equal(result.success, true);
  assert.equal(calls.createdWindows.length, 0);
  assert.deepEqual(windows.get(42).tabs.map((tab) => tab.url), [
    'https://example.com/b-one',
    'https://example.com/b-two',
    'https://example.com/current'
  ]);
});

test('current-window mode validates the target before creating anything', async () => {
  const { chrome, calls } = createChromeHarness();
  const { restoreSessionFromSnapshot } = loadBackground(chrome);

  await assert.rejects(
    restoreSessionFromSnapshot(createTwoWindowSession(), {
      restoreMode: 'current_window',
      targetWindowId: 999
    }),
    /target window/i
  );

  assert.equal(calls.createdWindows.length, 0);
  assert.equal(calls.createdTabs.length, 0);
});
