# Settings Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize Settings into four clear groups and rebuild the footer as an aligned resource grid.

**Architecture:** Keep all existing control IDs and behavior, changing only semantic markup, translations, and styles in the popup. Use reusable `settings-group-card` and `footer-link-tile` classes rather than one-off positioning.

**Tech Stack:** Manifest V3, HTML, CSS, browser JavaScript, Node.js built-in test runner.

---

### Task 1: Structural Regression Tests

**Files:**
- Create: `tests/settings-layout.test.js`
- Test: `Chrome-extension/popup.html`
- Test: `Chrome-extension/popup.js`

- [x] Assert the markup contains standalone `settings-language`, `settings-appearance`, `settings-backup`, and `browser-support-group` cards.
- [x] Assert Appearance contains `darkMode` and `accentColor`, while Backup contains `exportSessions` and `importSessions`.
- [x] Assert the footer contains four `footer-link-tile` anchors in a `footer-link-grid`.
- [x] Assert every supported translation includes `appearance_title`, `backup_title`, `backup_description`, and `resources_title`.
- [x] Run `node --test tests/settings-layout.test.js`; expect failure because the grouped layout does not exist.

### Task 2: Settings Groups And Footer

**Files:**
- Modify: `Chrome-extension/popup.html:611-738,861-922`
- Modify: `Chrome-extension/popup.js:5-270`

- [x] Add the four translation keys in English, Spanish, Italian, French, and German.
- [x] Wrap the existing Language control in a standalone group card.
- [x] Place Dark mode and Accent color inside the Appearance group card without changing their IDs.
- [x] Place Export and Import inside the Backup group card with translated supporting copy.
- [x] Keep Browser Support independent and hidden by default.
- [x] Replace line-break footer links with four aligned linked tiles and a wrapping metadata row.
- [x] Add responsive, dark-mode-compatible card, grid, hover, and focus styles.
- [x] Run `node --test tests/settings-layout.test.js`; expect all layout tests to pass.

### Task 3: Release And Verification

**Files:**
- Modify: `Chrome-extension/manifest.json`
- Modify: `Chrome-extension/popup.html`
- Modify: `Chrome-extension/welcome.html`
- Modify: `README.md`

- [x] Change current release references from 7.6.0 to 7.7.0.
- [x] Add a README 7.7.0 changelog entry for settings grouping and footer alignment.
- [x] Run every Node test, JavaScript syntax checks, ESLint, manifest/version validation, and `git diff --check`.
- [x] Inspect the rendered Settings layout at popup width and confirm grouping, wrapping, focus visibility, and dark-mode colors.
- [x] Commit the release, integrate remote changes without force pushing, and push `main` to `origin`.
