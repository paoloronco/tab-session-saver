const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'Chrome-extension', 'popup.js'), 'utf8');
const helpers = source.slice(source.indexOf('  function setCloudSyncBusy('), source.indexOf('  function loadCloudSyncSettings('));

test('Cloud Sync login stays disabled while connected, including after requests, and re-enables after disconnect', () => {
  const login = {};
  const actions = [{}, {}, {}];
  const context = vm.createContext({
    cloudSyncLoginBtn: login,
    cloudSyncPushBtn: actions[0],
    cloudSyncPullBtn: actions[1],
    cloudSyncDisconnectBtn: actions[2],
    cloudSyncAccount: null,
    cloudSyncSettingsState: null,
    setCloudSyncStatus() {},
    setCloudSyncErrorStatus() {}
  });
  vm.runInContext(helpers, context);
  for (const configured of [false, true, false]) {
    context.renderCloudSyncState({ success: true, settings: { configured }, state: {} });
    assert.equal(login.disabled, configured);
    assert.ok(actions.every(button => button.disabled === !configured));
    context.setCloudSyncBusy(true);
    assert.ok([login, ...actions].every(button => button.disabled));
    context.setCloudSyncBusy(false);
    context.renderCloudSyncState({ success: false });
    assert.equal(login.disabled, configured);
    assert.ok(actions.every(button => button.disabled === !configured));
  }
});
