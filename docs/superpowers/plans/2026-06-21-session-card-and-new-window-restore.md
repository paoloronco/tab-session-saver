# Session Card And New-Window Restore Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Toggle session previews from the card while guaranteeing that restores create only new browser windows.

**Architecture:** Reuse a single popup preview-toggle function for both the session label and menu command. Remove the source-window reuse path from the background restore pipeline so all saved windows flow through the existing `chrome.windows.create` implementation.

**Tech Stack:** Manifest V3, browser JavaScript, Chrome Extensions APIs, Node.js built-in test runner.

---

### Task 1: Regression Tests

**Files:**
- Create: `tests/popup-preview.test.js`
- Create: `tests/background-restore.test.js`

- [x] Write a popup test that loads `popup.js` with a minimal DOM and proves clicking the session label toggles preview state without sending a restore message.
- [x] Run `node --test tests/popup-preview.test.js` and verify it fails because the label currently triggers restore.
- [x] Write a background test that restores two saved windows while supplying an existing source window ID.
- [x] Run `node --test tests/background-restore.test.js` and verify it fails because the source window is currently inspected and reused.

### Task 2: Popup Preview Interaction

**Files:**
- Modify: `Chrome-extension/popup.js:1432-1526`

- [x] Extract the existing preview open/close code into a local `togglePreview` function.
- [x] Bind `togglePreview` to the session label click and keyboard handlers.
- [x] Bind the menu Preview button to the same function while preserving event propagation guards.
- [x] Run `node --test tests/popup-preview.test.js` and verify it passes.

### Task 3: New-Window-Only Restore

**Files:**
- Modify: `Chrome-extension/background.js:7-13,52-56,620-755,849-852`

- [x] Remove source-window inspection and reuse state.
- [x] Restore every normalized saved window through `restoreSingleWindow` without a reuse option.
- [x] Keep per-window failure isolation and restore logging.
- [x] Run `node --test tests/background-restore.test.js` and verify it passes.

### Task 4: Release Metadata And Verification

**Files:**
- Modify: `Chrome-extension/manifest.json`
- Modify: `Chrome-extension/popup.html`
- Modify: `Chrome-extension/welcome.html`
- Modify: `README.md`

- [x] Change all current release references from `7.4.2` to `7.5.0`.
- [x] Add a `7.5.0` changelog entry describing card preview toggling and new-window-only restores.
- [x] Run all Node tests, `node --check` on extension scripts, ESLint, and manifest JSON parsing.
- [x] Delete the local Gmail PDF and temporary PDF extraction directory.
- [x] Review the final diff, commit the intended release files, and push `main` to `origin`.
