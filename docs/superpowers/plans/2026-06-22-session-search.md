# Session Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an animated live search beside Save current tabs that filters saved sessions by session name, tab title, or tab URL/domain.

**Architecture:** Keep the latest normalized session collection in popup memory and render a filtered view without re-reading storage on every keystroke. A pure `sessionMatchesQuery(session, query)` predicate owns matching, while `renderSessionList(sessions, query)` retains each session's original storage index for all card actions.

**Tech Stack:** Manifest V3, plain HTML/CSS/JavaScript, Chrome extension APIs, Node built-in test runner.

---

### Task 1: Search Predicate And Stable Indexes

**Files:**
- Create: `tests/session-search.test.js`
- Modify: `Chrome-extension/popup.js:960-1005`
- Modify: `Chrome-extension/popup.js:1398-1607`

- [ ] **Step 1: Write failing predicate tests**

Expose `sessionMatchesQuery` through the existing VM test pattern and assert that it matches case-insensitive session names, nested tab titles, complete URLs, and domains while rejecting unrelated text.

```js
assert.equal(sessionMatchesQuery(session, 'CLIENT WORK'), true);
assert.equal(sessionMatchesQuery(session, 'quarterly report'), true);
assert.equal(sessionMatchesQuery(session, 'docs.example.com'), true);
assert.equal(sessionMatchesQuery(session, 'unrelated'), false);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/session-search.test.js`

Expected: FAIL because `sessionMatchesQuery` is not defined.

- [ ] **Step 3: Implement the pure predicate**

Add a normalization helper and flatten the session name plus all nested tab titles and URLs into searchable strings.

```js
function normalizeSearchValue(value) {
  return typeof value === 'string' ? value.trim().toLocaleLowerCase() : '';
}

function sessionMatchesQuery(session, query) {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return true;
  const values = [session?.name];
  (session?.windows || []).forEach((win) => {
    (win?.tabs || []).forEach((tab) => values.push(tab?.title, tab?.url));
  });
  return values.some((value) => normalizeSearchValue(value).includes(normalizedQuery));
}
```

- [ ] **Step 4: Refactor list rendering around cached sessions**

Store `latestSessions`, separate `renderSessionList(sessionsRaw, query)` from `loadSessions()`, map entries as `{ sessionData, originalIndex }`, filter by the predicate, and pass `originalIndex` to rename/delete/update/restore card handlers.

- [ ] **Step 5: Verify GREEN**

Run: `node --test tests/session-search.test.js tests/popup-preview.test.js`

Expected: all focused tests PASS.

### Task 2: Expandable Search Toolbar

**Files:**
- Modify: `Chrome-extension/popup.html:174-191`
- Modify: `Chrome-extension/popup.html:1049-1055`
- Modify: `Chrome-extension/popup.js:4-330`
- Modify: `Chrome-extension/popup.js:1100-1140`
- Test: `tests/session-search.test.js`

- [ ] **Step 1: Add failing markup and localization tests**

Assert the toolbar, search button, input, no-results state, `aria-expanded`, translations in all five languages, and `prefers-reduced-motion` rule exist.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/session-search.test.js`

Expected: FAIL because search toolbar markup and translation keys do not exist.

- [ ] **Step 3: Add semantic toolbar markup and styling**

Create `.session-toolbar`, an expanding `.session-search`, a button with an inline magnifying-glass SVG, a labeled input, a close button, and `#search-empty-state`. Use opacity and transform transitions, keep the save button dominant while closed, and disable transitions under reduced motion.

- [ ] **Step 4: Wire live interaction**

On open, set `aria-expanded=true`, add `.is-open`, and focus the input. On every input, render cached sessions with the query. On Escape, close, clear, and restore all sessions. The active search toggle and close button perform the same reset.

- [ ] **Step 5: Translate the feature**

Add `search_sessions_label`, `search_sessions_placeholder`, `close_search_label`, `search_no_results_title`, and `search_no_results_description` in English, Spanish, Italian, French, and German.

- [ ] **Step 6: Verify GREEN and full regression suite**

Run: `node --check Chrome-extension/popup.js; node --test tests/*.test.js`

Expected: syntax check succeeds and all tests PASS.

### Task 3: Release 7.10.0 And Delivery

**Files:**
- Modify: `Chrome-extension/manifest.json`
- Modify: `Chrome-extension/popup.html`
- Modify: `Chrome-extension/welcome.html`
- Modify: `README.md`

- [ ] **Step 1: Update release metadata**

Set every current version reference to `7.10.0`, update the README badge and restore/search highlights, and prepend a changelog entry describing live matching by name, title, and URL/domain.

- [ ] **Step 2: Run final automated verification**

Run: `node --check Chrome-extension/background.js; node --check Chrome-extension/popup.js; node --test tests/*.test.js; git diff --check`

Expected: all commands succeed with no failing tests or whitespace errors.

- [ ] **Step 3: Verify rendered behavior**

Serve the repository locally, render the popup at 420 by 600 pixels, verify closed/open toolbar states, keyboard Escape, live filtering, no-results copy, light/dark themes, and reduced-motion behavior. Remove generated browser artifacts afterward.

- [ ] **Step 4: Commit only intended files**

Stage source, tests, README, manifest, spec, and plan explicitly. Do not stage `Chrome-extension.zip`.

```powershell
git add -- Chrome-extension README.md tests docs/superpowers
git commit -m "feat: add live session search"
```

- [ ] **Step 5: Push and confirm remote commit**

Run: `git push origin main; git status --branch --short; git ls-remote origin refs/heads/main`

Expected: `main` matches `origin/main`; only the pre-existing untracked `Chrome-extension.zip` remains local.
