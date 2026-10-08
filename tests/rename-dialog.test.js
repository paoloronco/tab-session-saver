const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'Chrome-extension', 'popup.js'), 'utf8');

function renameUI() {
  const elements = Object.fromEntries(['dialog','form','input','prompt','error','cancel','submit'].map(name => [`rename-${name}`, {
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
  const context = vm.createContext({URL, window:{}, console:{error() {}}, localStorage:{getItem() {return null;}},
    document:{addEventListener() {}, getElementById(id) {return elements[id];}},
    sessionFolders:[], latestSessions:[], searchInput:null, renderSessionList() {}, loadSessions() {},
    async sendRuntimeMessage(message) {
      messages.push(message);
      if(context.fail) throw new Error('Storage failure');
      return {success:true,folders:message.folders,sessions:message.sessions};
    }
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../Chrome-extension/diagnostics.js'), 'utf8'), context);
  vm.runInContext(source,context);
  context.getTranslation = key => key;
  context.getFolderById = id => context.sessionFolders.find(folder => folder.id === id);
  const persistStart = source.indexOf('  async function persistFolderAndSessionChanges(');
  vm.runInContext(source.slice(persistStart,source.indexOf('  function persistSessionReorder(',persistStart)),context);
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

test('folder rename validates, cancels, retries failures and preserves folder identity and session contents', async () => {
  const h=renameUI();
  const folder={id:'work',name:'Work',createdAt:'2026-10-05T10:00:00Z'};
  h.context.sessionFolders=[folder,{...folder,id:'other',name:'Other'}];
  const session={name:'Workspace',timestamp:folder.createdAt,
    windows:[{tabs:[{url:'https://example.com/',pinned:true,groupId:7}],groups:[{id:7,title:'Work',color:'blue'}]}],
    metadata:{folderId:'work',folderName:'Work',saveType:'manual'}};
  h.context.latestSessions=[session,{...session,metadata:{...session.metadata,saveType:'auto'}},
    {...session,metadata:{saveType:'manual'}}];
  const original=JSON.parse(JSON.stringify(h.context.latestSessions));
  h.context.openRenameDialog(null,'Work','work');
  assert.equal(h.elements['rename-prompt'].textContent,'rename_folder_prompt');
  assert.equal(h.elements['rename-input'].maxLength,80);
  h.elements['rename-cancel'].click();
  await h.submit();
  assert.equal(h.messages.length,0);

  h.context.openRenameDialog(null,'Work','work');
  h.elements['rename-input'].value='  ';
  await h.submit();
  assert.equal(h.elements['rename-error'].textContent,'rename_folder_empty_error');
  assert.equal(h.messages.length,0);
  h.elements['rename-input'].value=' New folder ';
  h.context.fail=true;
  await h.submit();
  assert.ok(h.dialog.open);
  assert.equal(h.elements['rename-error'].textContent,'error_update');
  assert.equal(h.elements['rename-input'].disabled,false);
  assert.equal(h.context.sessionFolders[0].name,'Work');
  assert.deepEqual(JSON.parse(JSON.stringify(h.context.latestSessions)),original);

  h.context.fail=false;
  h.elements['rename-input'].value=' '+ 'x'.repeat(90)+' ';
  await h.submit();
  const renamed=h.context.sessionFolders[0];
  assert.equal(renamed.name,'x'.repeat(80));
  assert.equal(renamed.id,folder.id);
  assert.equal(renamed.createdAt,folder.createdAt);
  assert.equal(h.context.sessionFolders[1].name,'Other');
  assert.deepEqual(h.messages.slice(-2).map(message=>message.action),['replace_session_folders','replace_sessions']);
  assert.ok(h.messages.slice(-2).every(message=>message.reason==='rename_session_folder'));
  for (const [index,member] of h.context.latestSessions.entries()) {
    assert.equal(member.name,original[index].name);
    assert.equal(member.timestamp,original[index].timestamp);
    if(index<2) {
      assert.equal(member.metadata.folderName,renamed.name);
      assert.equal(member.metadata.folderId,folder.id);
      assert.equal(member.metadata.saveType,original[index].metadata.saveType);
      assert.deepEqual(JSON.parse(JSON.stringify(member.windows)),JSON.parse(JSON.stringify(h.context.normalizeSessionSnapshot(original[index]).windows)));
    } else assert.deepEqual(JSON.parse(JSON.stringify(member)),original[index]);
  }
  assert.equal(h.dialog.open,false);
  h.context.openRenameDialog(0,'Workspace');
  assert.equal(h.elements['rename-prompt'].textContent,'rename_prompt');
  assert.equal(h.elements['rename-input'].maxLength,160);
});

test('failed rename stays editable; cancel discards the edit and does not save', async () => {
  const h=renameUI();
  h.context.openRenameDialog(0,'Original');
  h.context.fail=true;
  await h.submit();
  assert.ok(h.dialog.open);
  assert.equal(h.elements['rename-error'].textContent,'error_update');
  assert.equal(h.elements['rename-input'].disabled,false);
  h.elements['rename-cancel'].click();
  await h.submit();
  assert.equal(h.messages.length,1);
  assert.equal(h.dialog.open,false);
  assert.doesNotMatch(source,/prompt\(getTranslation\('rename_prompt'\)/);
});
