# Unlimited Saved Sessions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the extension's ten-session pruning behavior and all UI that configures it.

**Architecture:** Add one small collection helper used by save and merge-import paths so both preserve all sessions. Delete the obsolete setting, translations, localStorage handling, and onboarding explanations, then publish the behavior as version 7.6.0.

**Tech Stack:** Manifest V3, browser JavaScript, Chrome Storage API, Node.js built-in test runner.

---

### Task 1: Regression Coverage

**Files:**
- Create: `tests/unlimited-sessions.test.js`
- Test: `Chrome-extension/popup.js`
- Test: `Chrome-extension/popup.html`
- Test: `Chrome-extension/welcome.js`
- Test: `Chrome-extension/welcome.html`

- [x] Expose and test `combineSessionCollections(existing, additions)` with twelve existing and three new sessions; expect all fifteen in order.
- [x] Assert popup and onboarding sources contain no `maxSessions`, `sessions_limit_label`, or limit-specific onboarding keys.
- [x] Run `node --test tests/unlimited-sessions.test.js`; expect failure because the helper is missing and the limit UI still exists.

### Task 2: Unlimited Save And Import

**Files:**
- Modify: `Chrome-extension/popup.js:20-358,1032-1061,1131-1136,1251-1255,1547-1572`
- Modify: `Chrome-extension/popup.html:894-897`

- [x] Add `combineSessionCollections(existing, additions)` returning normalized array concatenation without slicing.
- [x] Use it when merging imports and saving new sessions.
- [x] Remove the maximum-session helpers, translations, setting event handler, restore logic, and HTML input.
- [x] Run `node --test tests/unlimited-sessions.test.js`; expect all tests to pass.

### Task 3: Onboarding And Release

**Files:**
- Modify: `Chrome-extension/welcome.js`
- Modify: `Chrome-extension/welcome.html`
- Modify: `Chrome-extension/manifest.json`
- Modify: `Chrome-extension/popup.html`
- Modify: `README.md`

- [x] Remove all onboarding limit headings, captions, cards, and tips while keeping the surrounding layout valid.
- [x] Change current release references from `7.5.0` to `7.6.0`.
- [x] Add a README `7.6.0` changelog entry documenting unlimited session counts within normal browser storage capacity.
- [x] Run all Node tests, syntax checks, ESLint, manifest parsing, version checks, and `git diff --check`.
- [x] Commit the release, integrate any new remote commits without force pushing, and push `main` to `origin`.
