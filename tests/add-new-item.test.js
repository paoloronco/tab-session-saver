const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const extensionRoot = path.join(__dirname, '..', 'Chrome-extension');
const popupSource = fs.readFileSync(path.join(extensionRoot, 'popup.js'), 'utf8');

function loadAddItemHelper() {
  const context = vm.createContext({
    URL,
    chrome: {},
    console,
    document: { addEventListener() {}, querySelectorAll() { return []; } },
    localStorage: { getItem() { return null; }, setItem() {} },
    window: {}
  });
  vm.runInContext(`${popupSource}\n;globalThis.testHelper = addCustomUrlToSession;`, context);
  return context.testHelper;
}

test('the unified add-item flow targets an existing window or creates a new one', () => {
  const addCustomUrlToSession = loadAddItemHelper();
  const session = {
    windows: [
      { tabs: [{ url: 'https://first.test' }], groups: [] },
      { tabs: [{ url: 'https://second.test' }], groups: [] }
    ]
  };

  const inExistingWindow = addCustomUrlToSession(session, 'chosen.test', { windowIndex: 0 });
  assert.equal(inExistingWindow.windows[0].tabs.at(-1).url, 'https://chosen.test/');
  assert.equal(inExistingWindow.windows[1].tabs.length, 1);

  const inNewWindow = addCustomUrlToSession(session, 'new window search', { newWindow: true });
  assert.equal(inNewWindow.windows.length, 3);
  assert.equal(inNewWindow.windows[2].tabs[0].url, 'https://www.google.com/search?q=new%20window%20search');
});

test('the session menu has one add action backed by an in-extension dialog', () => {
  const popupHtml = fs.readFileSync(path.join(extensionRoot, 'popup.html'), 'utf8');
  assert.equal((popupSource.match(/menu\.appendChild\(addItemBtn\)/g) || []).length, 1);
  assert.doesNotMatch(popupSource, /addWindowBtn/);
  assert.match(popupHtml, /<dialog id="add-item-dialog"/);
  assert.match(popupHtml, /name="addItemDestination" value="existing"/);
  assert.match(popupHtml, /name="addItemDestination" value="new"/);
});
