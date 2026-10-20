const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'Chrome-extension', 'popup.js'), 'utf8');
const layoutStart = source.indexOf('      const queryText =', source.indexOf('  function renderSessionList('));
const layoutEnd = source.indexOf('      matchingSessions.forEach(({ sessionData: normalized, originalIndex: index }) => {', layoutStart);
const placementStart = source.indexOf('        const target = autoSaveTargets.', layoutEnd);
const placementEnd = source.indexOf('        target.appendChild(entry);', placementStart) + '        target.appendChild(entry);'.length;

test('auto-save grouping renders each mode without mixing user folders or losing search matches', () => {
  const element = name => ({ name, children: [], appendChild(child) { this.children.push(child); } });
  const sessions = [
    ['Older', '2026-07-15T08:00:00Z', 'run-one', ''],
    ['Newest', '2026-07-15T10:00:00Z', 'run-one', ''],
    ['Other run', '2026-07-15T09:00:00Z', 'run-two', ''],
    ['Filed', '2026-07-15T11:00:00Z', 'run-one', 'work'],
    ['Topic one', '2026-07-14T08:00:00Z', '', ''],
    ['Topic two', '2026-07-14T09:00:00Z', '', '']
  ].map(([name, timestamp, autoSaveRunId, folderId]) => ({ name, timestamp,
    metadata: { saveType: 'auto', autoSaveRunId, folderId },
    windows: [{ tabs: [{ url: 'https://example.com/docs' }] }]
  }));
  for (const mode of ['day', 'session', 'smart', 'none']) {
    for (const query of ['', 'Newest']) {
      const container = element('root');
      const groups = [];
      const context = vm.createContext({ URL, document: { addEventListener() {} },
        localStorage: { getItem() { return mode; } },
        query, activeSessionCategory: 'auto', sessions, sessionFolders: [{ id: 'work', name: 'Work' }],
        container, searchEmptyState: { style: {} }, createFolderEmptyState: () => element('empty'),
        createSessionFolderElement(folder) {
          const sessionsEl = element(folder.id);
          return { folderEl: { name: folder.name, sessionsEl }, sessionsEl };
        }
      });
      vm.runInContext(source, context);
      context.createAutoSaveFolderElement = group => {
        groups.push(group);
        const sessionsEl = element(group.key);
        return { folderEl: { name: group.key, sessionsEl }, sessionsEl };
      };
      vm.runInContext(`
        const matchingSessions = getMatchingSessions(sessions, query);
        ${source.slice(layoutStart, layoutEnd)}
        matchingSessions.forEach(({ sessionData: normalized, originalIndex: index }) => {
          const entry = { name: normalized.name, index };
          ${source.slice(placementStart, placementEnd)}
        });
      `, context);
      const flatten = node => node.sessionsEl ? flatten(node.sessionsEl) : node.children ? node.children.flatMap(flatten) : [node];
      const entries = flatten(container);
      assert.equal(entries.length, query ? 1 : sessions.length);
      assert.equal(new Set(entries.map(entry => entry.index)).size, entries.length);
      assert.equal(groups.length, mode === 'none' ? 0 : query ? 1 : mode === 'session' ? 3 : 3 + (mode === 'smart' ? 1 : 0));
      if (query) assert.equal(entries[0].name, 'Newest');
      else {
        assert.deepEqual(flatten(container.children.find(child => child.name === 'Work')).map(entry => entry.name), ['Filed']);
        const combined = groups.find(group => group.sessions.some(match => match.sessionData.name === 'Newest'));
        if (combined) assert.deepEqual(Array.from(combined.sessions, match => match.sessionData.name),
          mode === 'day' ? ['Newest', 'Other run', 'Older'] : ['Newest', 'Older']);
      }
    }
  }
});

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
        const context = vm.createContext({ URL, document: { addEventListener() {} }, localStorage: { getItem() { return 'none'; } },
          query, category, activeSessionCategory: category, sessions, sessionFolders, container, searchEmptyState: { style: {} },
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
          matchingSessions.forEach(({ sessionData: normalized, originalIndex: index }) => {
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
