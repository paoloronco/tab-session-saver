const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'Chrome-extension', 'popup.js'), 'utf8');

function renameUI() {
  const elements = Object.fromEntries(['dialog','form','input','error','cancel','submit'].map(name => [`rename-${name}`, {
    value:'', disabled:false, attributes:{}, addEventListener(event, handler) {this[event] = handler;},
    removeAttribute(name) {delete this.attributes[name];}, setAttribute(name,value) {this.attributes[name] = value;},
    focus() {}, select() {this.selected = true;}
  }]));
  const dialog = elements['rename-dialog'];
  const closeHandler = [];
  dialog.addEventListener = (name, fn) => {if(name === 'close') closeHandler.push(fn); else dialog[name] = fn;};
  dialog.showModal = () => {dialog.open = true;};
  dialog.close = () => {dialog.open = false;closeHandler.forEach(fn=>fn());};
  const messages = [];
  const context = vm.createContext({document:{getElementById(id) {return elements[id];}},
    getTranslation(key) {return key;}, loadSessions() {},
    async sendRuntimeMessage(message) {messages.push(message);if(context.fail) throw new Error('Storage failure');}
  });
  const start = source.indexOf("  const renameDialog = document.getElementById('rename-dialog');");
  vm.runInContext(source.slice(start,source.indexOf('  function applyPopupSize(',start)),context);
  return {context,elements,dialog,messages,submit:()=>elements['rename-form'].submit({preventDefault(){}})};
}

test('custom rename preselects the name, rejects whitespace and persists the trimmed name', async () => {
  const h=renameUI();
  h.context.openRenameDialog(3,'Old name');
  assert.ok(h.dialog.open && h.elements['rename-input'].selected);
  assert.equal(h.elements['rename-input'].value,'Old name');
  h.elements['rename-input'].value='   ';
  await h.submit();
  assert.equal(h.messages.length,0);
  assert.equal(h.elements['rename-input'].attributes['aria-invalid'],'true');
  h.elements['rename-input'].value=' New name ';
  await h.submit();
  assert.equal(h.messages[0].action,'rename_session');
  assert.equal(h.messages[0].index,3);
  assert.equal(h.messages[0].newName,'New name');
  assert.equal(h.dialog.open,false);
});

test('failed rename stays editable; cancel discards the edit and does not save', async () => {
  const h=renameUI();
  h.context.openRenameDialog(0,'Original');
  h.context.fail=true;
  await h.submit();
  assert.ok(h.dialog.open);
  assert.equal(h.elements['rename-error'].textContent,'rename_failed_error');
  assert.equal(h.elements['rename-input'].disabled,false);
  h.elements['rename-cancel'].click();
  await h.submit();
  assert.equal(h.messages.length,1);
  assert.equal(h.dialog.open,false);
  assert.doesNotMatch(source,/prompt\(getTranslation\('rename_prompt'\)/);
});
