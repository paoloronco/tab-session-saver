# Footer Resource Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the settings footer explain where to install and inspect the extension without using a card grid.

**Architecture:** Replace the four equal resource tiles with a two-level footer: primary extension acquisition links followed by secondary developer/privacy links. Keep styling flat and text-led, then split release metadata into two explicit lines.

**Tech Stack:** Manifest V3, HTML, CSS, browser JavaScript, Node.js built-in test runner.

---

### Task 1: Footer Regression Tests

**Files:**
- Modify: `tests/settings-layout.test.js`

- [x] Require `extension-primary-links` containing the Chrome Web Store and GitHub URLs.
- [x] Require `footer-secondary-links` containing developer and privacy URLs.
- [x] Reject `footer-link-grid` and `footer-link-tile` markup.
- [x] Require separate `footer-version-line` and `footer-copyright-line` elements.
- [x] Require translated `github_link` and `developer_website_link` labels in all five languages.
- [x] Run `node --test tests/settings-layout.test.js`; expect failure against the existing tile grid.

### Task 2: Flat Link Hierarchy

**Files:**
- Modify: `Chrome-extension/popup.html:765-843,1018-1040`
- Modify: `Chrome-extension/popup.js:5-280`

- [x] Change `resources_title` translations to Get the extension equivalents.
- [x] Change `chrome_store_link` translations to explicit install actions.
- [x] Add translated GitHub and developer-website labels.
- [x] Build primary and secondary link groups without card backgrounds or enclosing borders.
- [x] Split version and copyright into two lines using a middle dot between copyright and rights.
- [x] Add flat hover, focus, wrapping, and dark-mode-compatible styles.
- [x] Run `node --test tests/settings-layout.test.js`; expect all footer tests to pass.

### Task 3: Release And Verification

**Files:**
- Modify: `Chrome-extension/manifest.json`
- Modify: `Chrome-extension/popup.html`
- Modify: `Chrome-extension/welcome.html`
- Modify: `README.md`

- [x] Change current release references from 7.7.0 to 7.8.0.
- [x] Add a README 7.8.0 changelog entry for the footer hierarchy.
- [x] Run all tests, syntax checks, ESLint, manifest validation, and `git diff --check`.
- [x] Render and inspect the footer in light and dark modes at popup width.
- [x] Commit, integrate remote changes without force pushing, and push `main` to `origin`.
