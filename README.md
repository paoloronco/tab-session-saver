<div align="center">

<img src="./Chrome-extension/img-128128.png" alt="Tabs Session Saver logo" width="96" height="96" />

# Tabs Session Saver

Save, manage, restore, export, and import Chrome tab sessions with a local-first workflow.

<p>
  <a href="https://chromewebstore.google.com/detail/tabs-session-saver/njbmclamamhckchdanoobkhadhmbdobp?authuser=0&hl=en">
    <img alt="Download on Chrome Web Store" src="https://img.shields.io/badge/Download-Chrome%20Web%20Store-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" />
  </a>
</p>

<p>
  <img alt="Version" src="https://img.shields.io/badge/version-7.12.6-111827?style=flat-square" />
  <img alt="Manifest V3" src="https://img.shields.io/badge/Chrome-Manifest%20V3-34A853?style=flat-square&logo=googlechrome&logoColor=white" />
  <img alt="License AGPL-3.0" src="https://img.shields.io/badge/license-AGPL--3.0-F97316?style=flat-square" />
</p>

<p>
  <a href="https://github.com/paoloronco/tab-session-saver">
    <img alt="Available on GitHub" src="https://img.shields.io/badge/Available_on-GitHub-181717?logo=github&logoColor=white" />
  </a>
  <a href="https://gitea.com/paoloronco/tab-session-saver">
    <img alt="Available on Gitea" src="https://img.shields.io/badge/Available_on-Gitea-609926?logo=gitea&logoColor=white" />
  </a>
</p>

</div>

---

## Overview

`Tabs Session Saver` is a Chrome extension focused on quick session capture and restore.

It stores session data locally with `chrome.storage.local` and supports:

- full session save with configurable restore behavior
- tab group preservation
- preview, rename, and delete actions
- live search by session name, tab title, or website URL
- single-tab removal from saved sessions
- JSON export and import
- multi-language UI

## Quick Start

| Action | Path |
| --- | --- |
| Download extension | [Chrome Web Store](https://chromewebstore.google.com/detail/tabs-session-saver/njbmclamamhckchdanoobkhadhmbdobp?authuser=0&hl=en) |
| Load unpacked | `chrome://extensions` |
| Extension source | [`Chrome-extension`](./Chrome-extension) |

## Highlights

| Feature | Details |
| --- | --- |
| Save sessions | Capture the current browsing state from the popup |
| Restore sessions | Reopen every saved window separately or merge the last one into the current window |
| Tab groups | Preserve grouped tabs during save and restore |
| Session management | Rename, delete, preview, and edit saved sessions |
| Session search | Filter saved sessions instantly by name, tab title, URL, or domain |
| Export and import | Move sessions via JSON |
| Local-first storage | Sessions are stored on-device with `chrome.storage.local` |

## Project Structure

The working extension files are in [`Chrome-extension`](./Chrome-extension).

| File | Purpose |
| --- | --- |
| [`Chrome-extension/manifest.json`](./Chrome-extension/manifest.json) | Manifest V3 configuration |
| [`Chrome-extension/background.js`](./Chrome-extension/background.js) | background service worker, capture, storage, restore |
| [`Chrome-extension/popup.html`](./Chrome-extension/popup.html) | popup UI |
| [`Chrome-extension/popup.js`](./Chrome-extension/popup.js) | popup logic, preview, import/export, settings |
| [`Chrome-extension/welcome.html`](./Chrome-extension/welcome.html) | onboarding page |
| [`Chrome-extension/welcome.js`](./Chrome-extension/welcome.js) | onboarding behavior and translations |

## Local Development

### Load Unpacked

1. Open `chrome://extensions`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select [`Chrome-extension`](./Chrome-extension)

### Permissions

| Permission | Why it is used |
| --- | --- |
| `tabs` | read and restore tab URLs, titles, and state |
| `storage` | persist saved sessions and settings |
| `windows` | inspect and recreate Chrome windows |
| `tabGroups` | preserve and rebuild Chrome tab groups |

## Notes

> Session capture depends on the Chrome APIs available to Manifest V3 extensions.

> When Chrome does not expose reliable desktop or workspace metadata, a standard extension cannot perfectly separate Windows virtual desktops.

## Changelog

### 7.12.6

- added contact email in the extension settings
- updated extension version to `7.12.6`

### 7.12.5

- moved footer secondary links below the extension version line
- updated extension version to `7.12.5`

### 7.12.4

- made Auto Save on Exit persist a rolling exit session before Chrome closes
- updated extension version to `7.12.4`

### 7.12.3

- simplified the Auto Save on Exit setting to match the main Auto Save toggle layout
- updated extension version to `7.12.3`

### 7.12.2

- synchronized active extension version references after preview polish
- updated extension version to `7.12.2`

### 7.12.1

- removed the redundant full-session restore button from the preview panel
- improved preview count alignment for tab and window summaries
- updated extension version to `7.12.1`

### 7.12.0

- added optional Auto Save on Exit with persistent exit snapshots
- added Auto Saved filters for all, scheduled, and on-exit sessions
- updated extension version to `7.12.0`

### 7.11.1

- fixed ESLint code scanning alerts for unused popup variables
- updated extension version to `7.11.1`

### 7.11.0

- added Auto Save with configurable intervals and separated automatic/manual session views
- updated extension version to `7.11.0`

### 7.10.2

- updated extension version to `7.10.2`
- **polish**: regenerated extension icon assets so the artwork uses more of the available Chrome toolbar canvas
- **manifest**: added the top-level `icons` declaration alongside the toolbar `action.default_icon` entries

### 7.10.1

- updated extension version to `7.10.1`
- **fix**: explicitly create restored tab groups in their destination window instead of relying on Chrome's current-window default
- **regression**: added coverage for the first restored window so grouped tabs cannot be moved into the previously active window

### 7.10.0

- updated extension version to `7.10.0`
- **feature**: added an animated live-search control beside Save current tabs
- **search**: filter saved sessions by session name, tab title, full URL, or domain without repeated storage reads
- **accessibility**: added keyboard Escape handling, focus states, reduced-motion support, and a dedicated no-results state
- **i18n**: translated search controls and feedback in English, Spanish, Italian, French, and German

### 7.9.0

- updated extension version to `7.9.0`
- **feature**: added a Restore behavior setting with separate new-window and current-window modes
- **restore**: current-window mode inserts the last saved window before existing tabs while preserving saved order, groups, pinned tabs, muted tabs, and active tab
- **consistency**: applied the selected behavior to full-session restore and preview window restore
- **i18n**: explained both restore modes in English, Spanish, Italian, French, and German

### 7.8.0

- updated extension version to `7.8.0`
- **improve**: replaced the generic Resources tile grid with explicit Chrome Web Store and GitHub extension links
- **improve**: moved developer and privacy URLs into a quieter secondary link row
- **polish**: split version and copyright information into two aligned footer lines

### 7.7.0

- updated extension version to `7.7.0`
- **improve**: reorganized Settings into separate Language, Appearance, Backup, and Browser Support groups
- **improve**: rebuilt the settings footer as an aligned two-column resource grid with cleaner release metadata
- **accessibility**: added consistent focus-visible states and responsive wrapping for settings controls and links

### 7.6.0

- updated extension version to `7.6.0`
- **improve**: removed the configurable saved-session limit from Settings and onboarding
- **change**: saving and importing now preserves every session without pruning older entries, subject only to the browser's normal local storage capacity
- **test**: added regression coverage for collections larger than the previous ten-session default

### 7.5.0

- updated extension version to `7.5.0`
- **improve**: clicking a session card now opens or closes its preview, while the dedicated Restore button remains the only direct full-session restore action
- **fix**: full and single-window restores now always create new browser windows and never reuse or modify an existing window
- **test**: added regression coverage for preview interactions and new-window-only multi-window restores

### 7.4.2

- updated extension version to `7.4.2`
- **fix**: stabilized popup root sizing and scroll containment so the popup renders at the intended size across Chromium browsers and zoom levels

### 7.4.1

- updated extension version to `7.4.1`
- **quality**: hardened session restore reliability, import validation, and extension UI performance

### 7.4.0

- updated extension version to `7.4.0`
- **fix**: improved restore logging and disposable startup-window detection so empty new-tab windows are safely reused during multi-window restores
- **feat**: moved browser support detection into a shared utility used by both popup settings and the welcome page
- **improve**: added concise Browser Support explanation in Settings for Chrome vs Chromium-derived browsers
- **fix**: removed duplicate popup vertical scrollbar by tightening popup root sizing and scroll containment
- **quality**: resolved code scanning warnings for empty block statements and unnecessary boolean casts

### 7.3.1

- updated extension version to `7.3.1`
- **fix**: empty Chrome startup window is now reused for the first restored session window instead of being left open alongside the restored windows — restoring an N-window session always results in exactly N windows
- **improve**: session restore loop now isolates per-window errors so a single failing window no longer aborts the entire restore
- **improve**: added `[restore]` debug log lines for disposable window detection, reuse/fallback decision, window count, and completion
- **feat**: added browser compatibility detection (`detectBrowserType`) covering Brave, Edge, Opera, Vivaldi, and Chromium; detection uses `navigator.brave.isBrave()`, UA string patterns, and `navigator.userAgentData.brands`
- **feat**: dismissible unsupported-browser warning banner in the extension popup (shown only on non-Chrome browsers, per-browser dismiss via localStorage)
- **feat**: "Browser Support" section added to popup settings showing official browser, detected browser, and support status
- **feat**: unsupported-browser warning shown on the welcome/install page with full multilingual support (EN, IT, ES, DE, FR)

### 7.2.2

- updated extension version to `7.2.2`
- added per-window restore actions in the session preview
- reused the existing restore pipeline for single-window restores
- fixed README links that pointed to an old local folder path

### 7.2.1

- updated extension version to `7.2.1`
- added a restore-in-progress lock in the background service worker to prevent concurrent session restores
- disabled restore controls while a restore request is in flight to avoid duplicate large-session restores

### 7.2.0

- updated extension version to `7.2.0`
- fixed removal of individual tabs from saved sessions so repeated removals stay consistent in UI and storage
- revised session capture flow to bind capture more explicitly to the popup window and improve fallback handling
- added repository documentation and AGPL-3.0 licensing

### 7.1.0

- previous stable release
- session save and restore for Chrome windows and tabs
- tab group preservation during save and restore
- session preview, rename, and delete actions
- JSON import and export support
- onboarding page and multi-language popup

## License

This repository is licensed under the GNU Affero General Public License v3.0.

Full text: [`Chrome-extension/LICENSE`](./Chrome-extension/LICENSE)
