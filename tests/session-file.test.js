const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const source = fs.readFileSync(path.join(__dirname, '..', 'Chrome-extension', 'popup.js'), 'utf8');

function harness(existing = []) {
  const listeners = {};
  const alerts = [];
  const writes = [];
  const classes = new Set();
  let stored = existing;
  let downloaded;
  const context = vm.createContext({
    URL: class extends URL {
      static createObjectURL(blob) { downloaded = blob; return 'blob:test'; }
      static revokeObjectURL() {}
    },
    Blob, console, setTimeout() {},
    alert(message) { alerts.push(message); },
    confirm() { throw new Error('Dropping files must never ask to replace sessions'); },
    document: {
      addEventListener(name, callback, capture) { listeners[name] = { callback, capture }; },
      querySelectorAll() { return []; },
      getElementById() { return null; },
      createElement() { return { click() {}, remove() {} }; },
      body: { appendChild() {}, classList: { add(name) { classes.add(name); }, remove(name) { classes.delete(name); } } }
    },
    localStorage: { getItem() { return null; }, setItem() {} },
    window: {},
    chrome: { runtime: { sendMessage(message, callback) {
      if (message.action === 'get_sessions') callback(stored);
      else {
        writes.push(message);
        stored = message.sessions;
        callback({ success: true, sessions: stored });
      }
    } } }
  });
  vm.runInContext(source, context);
  // Execute the actual backup/drop wiring without initializing unrelated popup controls.
  const block = source.slice(source.indexOf('  // Backups and individual sessions'), source.indexOf('  // SETTINGS PAGE'));
  const runtimeHelper = source.slice(source.indexOf('  function sendRuntimeMessage('), source.indexOf('  function persistFolderCollection('));
  vm.runInContext(`
    const searchInput = null;
    function setActiveSessionCategory() {}
    function setAutoSaveTriggerFilter() {}
    function loadSessions() {}
    ${runtimeHelper}
    ${block}
  `, context);
  return { context, listeners, alerts, writes, classes, download: () => downloaded };
}

const session = {
  name: 'Work', timestamp: '2026-10-05T10:00:00Z',
  windows: [
    { tabs: [{ url: 'https://example.com/', pinned: true, groupId: 7 }], groups: [{ id: 7, title: 'Work', color: 'blue' }] },
    { tabs: [{ url: 'https://example.org/' }], groups: [] }
  ]
};

function dropEvent(files, types = ['Files']) {
  return {
    dataTransfer: { files, types },
    prevented: false, stopped: false,
    preventDefault() { this.prevented = true; },
    stopPropagation() { this.stopped = true; }
  };
}

function jsonFile(text) { return { size: Buffer.byteLength(text), async text() { return text; } }; }

test('exported JSON imports on drop, preserving existing sessions, windows and groups', async () => {
  const h = harness([{ name: 'Existing', windows: [] }]);
  h.context.downloadSessions([session], 'Work.json');
  const text = await h.download().text();
  const event = dropEvent([jsonFile(text), jsonFile(text)]);
  h.listeners.dragover.callback(event);
  assert.equal(event.dataTransfer.dropEffect, 'copy');
  assert.ok(h.classes.has('import-drag-over'));
  await h.listeners.drop.callback(event);
  assert.equal(h.listeners.drop.capture, true);
  assert.ok(event.prevented && event.stopped);
  assert.equal(h.classes.size, 0);
  assert.equal(h.writes.length, 2);
  const result = h.writes.at(-1).sessions;
  assert.equal(result.length, 3);
  assert.equal(result[0].name, 'Existing');
  assert.equal(result[1].windows.length, 2);
  assert.equal(result[1].windows[0].tabs[0].pinned, true);
  assert.equal(result[1].windows[0].tabs[0].groupId, 7);
  assert.equal(result[1].windows[0].groups[0].title, 'Work');
  assert.equal(h.alerts.length, 2);
});

test('invalid, oversized and unreadable files never write; internal drags stay untouched', async () => {
  const h = harness();
  for (const file of [jsonFile('{'), jsonFile('{}'), jsonFile('[null]'), jsonFile('[]'),
    jsonFile('[{"tabs":[{"url":"javascript:alert(1)"}]}]'),
    { size: 6 * 1024 * 1024, text() { throw new Error('Must not read'); } },
    { size: 1, async text() { throw new Error('Read failed'); } }]) {
    await h.listeners.drop.callback(dropEvent([file]));
  }
  assert.equal(h.writes.length, 0);
  assert.equal(h.alerts.length, 7);
  const internal = dropEvent([], ['text/plain']);
  await h.listeners.drop.callback(internal);
  assert.equal(internal.prevented, false);
  assert.equal(internal.stopped, false);
  assert.match(source, /downloadSessions\(\[sessionPayload\],/);
  assert.match(source, /menu\.appendChild\(exportSessionBtn\)/);
});
