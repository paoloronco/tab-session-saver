const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'Chrome-extension', 'popup.js'), 'utf8');
const layoutStart = source.indexOf('      const queryText =', source.indexOf('  function renderSessionList('));
const layoutEnd = source.indexOf('      matchingSessions.forEach(({ sessionData: normalized, originalIndex: index }) => {', layoutStart);
const placementStart = source.indexOf('        const target = folderTargets.', layoutEnd);
const placementEnd = source.indexOf('        target.appendChild(entry);', placementStart) + '        target.appendChild(entry);'.length;

test('unfiled sessions stay at the list root before and after folders exist, in both categories and search', () => {
  const folders = [{ id: 'work', name: 'Work' }, { id: 'empty', name: 'Empty' }];
  const sessions = ['manual', 'auto'].flatMap(saveType => [
    { name: 'Loose ' + saveType, metadata: { saveType } },
    { name: 'Grouped ' + saveType, metadata: { saveType, folderId: 'work', folderName: 'Work' } }
  ]);
  const element = name => ({ name, children: [], appendChild(child) { child.parent = this; this.children.push(child); } });
  for (const category of ['manual', 'auto']) {
    for (const query of ['', 'Loose', 'Grouped']) {
      for (const sessionFolders of [[], folders]) {
        const container = element('root');
        const context = vm.createContext({ URL, document: { addEventListener() {} }, localStorage: { getItem() { return null; } },
          query, category, sessions, sessionFolders, container, searchEmptyState: { style: {} },
          createFolderEmptyState: () => element('empty-state'),
          createSessionFolderElement(folder, count) {
            const sessionsEl = element(folder.id);
            return { folderEl: { name: folder.name, count, sessionsEl }, sessionsEl };
          }
        });
        vm.runInContext(source, context);
        vm.runInContext(`
          const matchingSessions = getMatchingSessions(getSessionsBySaveType(sessions, category), query);
          ${source.slice(layoutStart, layoutEnd)}
          matchingSessions.forEach(({ sessionData: normalized }) => {
            const entry = { name: normalized.name };
            ${source.slice(placementStart, placementEnd)}
          });
        `, context);
        const loose = container.children.filter(child => child.name.startsWith('Loose'));
        assert.equal(loose.length, query === 'Grouped' ? 0 : 1);
        assert.ok(loose.every(entry => entry.parent === container));
        const renderedFolders = container.children.filter(child => child.sessionsEl);
        assert.ok(renderedFolders.every(folder => ['Work', 'Empty'].includes(folder.name)));
        if (sessionFolders.length && query !== 'Loose') {
          const grouped = renderedFolders.find(folder => folder.name === 'Work').sessionsEl.children;
          assert.equal(grouped[0].name, 'Grouped ' + category);
        }
        assert.ok(sessions.filter(session => session.name.startsWith('Loose')).every(session => !session.metadata.folderId));
      }
    }
  }
});
