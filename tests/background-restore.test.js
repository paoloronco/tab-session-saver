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
    `${source}\n;globalThis.__backgroundTest = { restoreSessionFromSnapshot };`,
    context
  );
  return context.__backgroundTest;
}

function createChromeHarness() {
  let nextWindowId = 100;
  let nextTabId = 1000;
  const windows = new Map([
    [42, {
      id: 42,
      type: 'normal',
      tabs: [{ id: 420, index: 0, url: 'chrome://newtab/', pinned: false }]
    }]
  ]);
  const calls = {
    createdWindows: [],
    sourceWindowGets: 0,
    sourceTabUpdates: 0
  };

  const chrome = {
    runtime: {
      OnInstalledReason: { INSTALL: 'install' },
      onInstalled: { addListener() {} },
      onMessage: { addListener() {} },
      setUninstallURL() {},
      getURL(value) { return value; }
    },
    tabs: {
      create: async ({ windowId, url, index = 0 }) => {
        const tab = { id: nextTabId++, windowId, url, index, pinned: false };
        windows.get(windowId).tabs.push(tab);
        return tab;
      },
      query: async ({ windowId }) => windows.get(windowId).tabs,
      update: async (tabId, changes) => {
        if (tabId === 420) calls.sourceTabUpdates += 1;
        for (const browserWindow of windows.values()) {
          const tab = browserWindow.tabs.find((candidate) => candidate.id === tabId);
          if (tab) Object.assign(tab, changes);
        }
      },
      group: async () => 1
    },
    tabGroups: {
      update: async () => {}
    },
    windows: {
      get: async (windowId) => {
        if (windowId === 42) calls.sourceWindowGets += 1;
        return windows.get(windowId);
      },
      create: async (createData) => {
        const id = nextWindowId++;
        const tab = {
          id: nextTabId++,
          windowId: id,
          index: 0,
          url: createData.url,
          pinned: false
        };
        const browserWindow = { id, type: 'normal', tabs: [tab] };
        windows.set(id, browserWindow);
        calls.createdWindows.push({ id, createData });
        return browserWindow;
      },
      update: async () => {}
    }
  };

  return { chrome, calls };
}

test('full restore creates every saved window without inspecting or changing the source window', async () => {
  const { chrome, calls } = createChromeHarness();
  const { restoreSessionFromSnapshot } = loadBackground(chrome);
  const session = {
    name: 'Two windows',
    timestamp: Date.now(),
    windows: [
      {
        focused: false,
        state: 'normal',
        tabs: [{ url: 'https://example.com/one', groupId: -1, active: false }],
        groups: []
      },
      {
        focused: true,
        state: 'normal',
        tabs: [{ url: 'https://example.com/two', groupId: -1, active: true }],
        groups: []
      }
    ]
  };

  await restoreSessionFromSnapshot(session, { sourceWindowId: 42 });

  assert.equal(calls.sourceWindowGets, 0);
  assert.equal(calls.sourceTabUpdates, 0);
  assert.equal(calls.createdWindows.length, 2);
  assert.deepEqual(
    calls.createdWindows.map(({ createData }) => createData.url),
    ['https://example.com/one', 'https://example.com/two']
  );
});
