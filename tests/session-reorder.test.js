const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const extensionRoot = path.join(__dirname, '..', 'Chrome-extension');

function readExtensionFile(filename) {
  return fs.readFileSync(path.join(extensionRoot, filename), 'utf8');
}

function loadReorderBindings() {
  const source = readExtensionFile('popup.js');
  const context = vm.createContext({
    URL,
    alert() {},
    chrome: {},
    console,
    document: {
      addEventListener() {},
      getElementById() { return null; },
      querySelectorAll() { return []; }
    },
    localStorage: {
      getItem() { return null; },
      setItem() {}
    },
    window: {}
  });

  vm.runInContext(
    `${source}\n;globalThis.__reorderTest = { moveSessionToFolderCollection, normalizeSessionFolders, reorderSessionCollection, translations };`,
    context
  );
  return context.__reorderTest;
}

function names(sessions) {
  return sessions.map((session) => session.name);
}

const sessions = [
  { name: 'A' },
  { name: 'B' },
  { name: 'C' },
  { name: 'D' }
];

test('session reorder moves items before and after visible targets', () => {
  const { reorderSessionCollection } = loadReorderBindings();

  assert.deepEqual(names(reorderSessionCollection(sessions, 0, 2, 'before')), ['B', 'A', 'C', 'D']);
  assert.deepEqual(names(reorderSessionCollection(sessions, 0, 2, 'after')), ['B', 'C', 'A', 'D']);
  assert.deepEqual(names(reorderSessionCollection(sessions, 3, 1, 'before')), ['A', 'D', 'B', 'C']);
  assert.deepEqual(names(reorderSessionCollection(sessions, 3, 1, 'after')), ['A', 'B', 'D', 'C']);
});

test('session reorder ignores invalid index requests without mutating input', () => {
  const { reorderSessionCollection } = loadReorderBindings();
  const result = reorderSessionCollection(sessions, 9, 1, 'before');

  assert.deepEqual(names(result), ['A', 'B', 'C', 'D']);
  assert.deepEqual(names(sessions), ['A', 'B', 'C', 'D']);
});

test('popup exposes drag handles and drop target styling for session reorder', () => {
  const popupScript = readExtensionFile('popup.js');
  const popupMarkup = readExtensionFile('popup.html');

  assert.match(popupScript, /className = 'session-drag-handle'/);
  assert.match(popupScript, /draggable = true/);
  assert.match(popupScript, /'reorder_sessions'/);
  assert.match(popupScript, /moveSessionToFolderCollection\(latestSessions, fromIndex, targetFolder, toIndex, placement\)/);
  assert.match(popupScript, /reorderSessionCollection\(latestSessions, fromIndex, toIndex, placement\)/);
  assert.match(popupMarkup, /\.session-entry\.drag-over-before::before/);
  assert.match(popupMarkup, /\.session-entry\.drag-over-after::after/);
  assert.match(popupMarkup, /\.session-drag-handle/);
});

test('session folders are normalized from saved folder state and session metadata', () => {
  const { normalizeSessionFolders } = loadReorderBindings();
  const folders = normalizeSessionFolders(
    [
      { id: 'project-a', name: 'Project A', createdAt: '2026-07-15T10:00:00.000Z' },
      { id: 'project-a', name: 'Duplicate' },
      { id: '', name: 'Invalid' }
    ],
    [
      { name: 'Research', metadata: { folderId: 'project-b', folderName: 'Project B' } },
      { name: 'No folder' }
    ]
  );

  assert.deepEqual(JSON.parse(JSON.stringify(folders.map((folder) => [folder.id, folder.name]))), [
    ['project-a', 'Project A'],
    ['project-b', 'Project B']
  ]);
});

test('moving a session into a folder assigns folder metadata and groups it after folder sessions', () => {
  const { moveSessionToFolderCollection } = loadReorderBindings();
  const folder = { id: 'work', name: 'Work' };
  const result = moveSessionToFolderCollection(
    [
      { name: 'A', metadata: { folderId: 'work', folderName: 'Work' } },
      { name: 'B' },
      { name: 'C' }
    ],
    2,
    folder
  );

  assert.deepEqual(names(result), ['A', 'C', 'B']);
  assert.equal(result[1].metadata.folderId, 'work');
  assert.equal(result[1].metadata.folderName, 'Work');
});

test('moving a foldered session to unfiled clears folder metadata', () => {
  const { moveSessionToFolderCollection } = loadReorderBindings();
  const result = moveSessionToFolderCollection(
    [
      { name: 'A', metadata: { folderId: 'work', folderName: 'Work' } },
      { name: 'B' }
    ],
    0,
    null
  );

  assert.deepEqual(names(result), ['B', 'A']);
  assert.equal(result[1].metadata.folderId, undefined);
  assert.equal(result[1].metadata.folderName, undefined);
});

test('popup exposes folder creation and folder drop target UI', () => {
  const popupScript = readExtensionFile('popup.js');
  const popupMarkup = readExtensionFile('popup.html');

  assert.match(popupScript, /const SESSION_FOLDERS_KEY = 'sessionFolders'/);
  assert.match(popupScript, /move_session_to_folder/);
  assert.match(popupScript, /move_session_to_unfiled/);
  assert.match(popupMarkup, /id="create-folder"/);
  assert.match(popupMarkup, /\.session-folder/);
  assert.match(popupMarkup, /\.session-folder-empty/);
});

test('popup exposes safe folder deletion controls and persistence paths', () => {
  const popupScript = readExtensionFile('popup.js');
  const popupMarkup = readExtensionFile('popup.html');

  assert.match(popupScript, /className = 'session-folder-delete'/);
  assert.match(popupScript, /handleDeleteFolder\(folder\.id\)/);
  assert.match(popupScript, /delete_folder_with_sessions_confirm/);
  assert.match(popupScript, /delete_session_folder_with_sessions/);
  assert.match(popupScript, /delete_session_folder_keep_sessions/);
  assert.match(popupScript, /action: 'replace_session_folders'/);
  assert.match(popupScript, /action: 'replace_sessions'/);
  assert.match(popupMarkup, /\.session-folder-delete/);
});

test('every language includes the reorder handle label', () => {
  const { translations } = loadReorderBindings();

  for (const language of ['en', 'es', 'it', 'fr', 'de']) {
    assert.equal(typeof translations[language].reorder_session_label, 'string', language);
    assert.ok(translations[language].reorder_session_label.trim().length > 0, language);
    assert.equal(typeof translations[language].create_folder_label, 'string', language);
    assert.ok(translations[language].create_folder_label.trim().length > 0, language);
    assert.equal(typeof translations[language].folder_empty, 'string', language);
    assert.ok(translations[language].folder_empty.trim().length > 0, language);
    assert.equal(typeof translations[language].delete_folder_label, 'string', language);
    assert.ok(translations[language].delete_folder_label.trim().length > 0, language);
    assert.equal(typeof translations[language].delete_folder_with_sessions_confirm, 'string', language);
    assert.match(translations[language].delete_folder_with_sessions_confirm, /\{name\}/, language);
    assert.match(translations[language].delete_folder_with_sessions_confirm, /\{count\}/, language);
  }
});
