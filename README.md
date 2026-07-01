<div align="center">

<img src="./Chrome-extension/img-128128.png" alt="Tabs Session Saver logo" width="96" height="96" />

# Tabs Session Saver

Save, restore, and manage your Chrome tab sessions — stored locally, no account needed.

<p>
  <a href="https://chromewebstore.google.com/detail/tabs-session-saver/njbmclamamhckchdanoobkhadhmbdobp?authuser=0&hl=en">
    <img alt="Download on Chrome Web Store" src="https://img.shields.io/badge/Download-Chrome%20Web%20Store-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" />
  </a>
</p>

<p>
  <img alt="Version" src="https://img.shields.io/badge/version-7.12.8-111827?style=flat-square" />
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

## What it does

Tabs Session Saver lets you snapshot your entire browsing state in one click and bring it back exactly as you left it — all windows, tabs, and tab groups included.

Sessions are saved directly on your device using Chrome's built-in storage. No account, no cloud sync, no data leaving your browser.

**Key features:**

- Save your current tabs as a named session from the popup
- Restore sessions in new windows or merge them into your current window
- Auto Save on a schedule or automatically when Chrome closes
- Live search across session names, tab titles, URLs, and domains
- Preview a session before restoring it, restore individual windows
- Add custom URLs to saved sessions and remove single tabs from saved sessions
- Rename, delete, and reorder sessions
- Export and import sessions as JSON for backup or transfer
- Preserves Chrome tab groups (colors and names) during save and restore
- Multi-language UI: English, Italian, Spanish, French, German

---

## Quick Start

### Install from Chrome Web Store (recommended)

The easiest way — just click Install and you're ready.

[→ Install from Chrome Web Store](https://chromewebstore.google.com/detail/tabs-session-saver/njbmclamamhckchdanoobkhadhmbdobp?authuser=0&hl=en)

### Install from GitHub (Load Unpacked)

If you prefer to install directly from source:

1. Download or clone this repository
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the [`Chrome-extension`](./Chrome-extension) folder

That's it — the extension will appear in your toolbar.

---

## Permissions

Tabs Session Saver requests only what it needs to function. Here's exactly what each permission is for — no hidden access, no tracking.

| Permission | What it's used for |
| --- | --- |
| `tabs` | Read open tab URLs, titles, and state so they can be saved and restored |
| `storage` | Save sessions and settings locally on your device |
| `windows` | Read open windows and recreate them when restoring a session |
| `tabGroups` | Preserve Chrome tab group names and colors during save and restore |
| `alarms` | Schedule periodic Auto Save at the interval you configure |

All data stays in `chrome.storage.local` — on your machine only.

---

## Repository Structure

```
tabs-session-saver/
├── Chrome-extension/          # Extension source (load this folder as unpacked)
│   ├── manifest.json          # Manifest V3 configuration
│   ├── background.js          # Service worker: capture, storage, restore, auto save
│   ├── popup.html             # Popup UI markup
│   ├── popup.js               # Popup logic: sessions, search, import/export, settings
│   ├── welcome.html           # Onboarding page shown on first install
│   ├── welcome.js             # Onboarding behavior and translations
│   ├── browser-support.js     # Browser detection utility (Chrome vs Chromium)
│   └── img-*.png              # Extension icons (16, 32, 48, 128px)
├── tests/                     # Automated test suite
├── docs/                      # Feature plans and design specs
├── .github/                   # GitHub Actions workflows
└── README.md
```

---

## Changelog

<details>
<summary>View full changelog</summary>

### 7.12.8
- added the ability to append a custom URL to an existing saved session
- updated extension version to `7.12.8`

### 7.12.7
- added an automated GitHub release workflow with a packaged Chrome extension zip
- updated extension version to `7.12.7`

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
- regenerated extension icon assets so the artwork uses more of the available Chrome toolbar canvas
- added the top-level `icons` declaration alongside the toolbar `action.default_icon` entries
- updated extension version to `7.10.2`

### 7.10.1
- fixed: explicitly create restored tab groups in their destination window instead of relying on Chrome's current-window default
- added regression coverage for the first restored window so grouped tabs cannot be moved into the previously active window
- updated extension version to `7.10.1`

### 7.10.0
- added animated live-search control beside Save current tabs
- search filters saved sessions by session name, tab title, full URL, or domain without repeated storage reads
- added keyboard Escape handling, focus states, reduced-motion support, and a dedicated no-results state
- translated search controls and feedback in English, Spanish, Italian, French, and German
- updated extension version to `7.10.0`

### 7.9.0
- added a Restore behavior setting with separate new-window and current-window modes
- current-window mode inserts the last saved window before existing tabs while preserving saved order, groups, pinned tabs, muted tabs, and active tab
- applied the selected behavior to full-session restore and preview window restore
- translated both restore modes in English, Spanish, Italian, French, and German
- updated extension version to `7.9.0`

### 7.8.0
- replaced the generic Resources tile grid with explicit Chrome Web Store and GitHub extension links
- moved developer and privacy URLs into a quieter secondary link row
- split version and copyright information into two aligned footer lines
- updated extension version to `7.8.0`

### 7.7.0
- reorganized Settings into separate Language, Appearance, Backup, and Browser Support groups
- rebuilt the settings footer as an aligned two-column resource grid with cleaner release metadata
- added consistent focus-visible states and responsive wrapping for settings controls and links
- updated extension version to `7.7.0`

### 7.6.0
- removed the configurable saved-session limit from Settings and onboarding
- saving and importing now preserves every session without pruning older entries, subject only to the browser's normal local storage capacity
- added regression coverage for collections larger than the previous ten-session default
- updated extension version to `7.6.0`

### 7.5.0
- clicking a session card now opens or closes its preview, while the dedicated Restore button remains the only direct full-session restore action
- full and single-window restores now always create new browser windows and never reuse or modify an existing window
- added regression coverage for preview interactions and new-window-only multi-window restores
- updated extension version to `7.5.0`

### 7.4.2
- stabilized popup root sizing and scroll containment so the popup renders at the intended size across Chromium browsers and zoom levels
- updated extension version to `7.4.2`

### 7.4.1
- hardened session restore reliability, import validation, and extension UI performance
- updated extension version to `7.4.1`

### 7.4.0
- improved restore logging and disposable startup-window detection so empty new-tab windows are safely reused during multi-window restores
- moved browser support detection into a shared utility used by both popup settings and the welcome page
- added concise Browser Support explanation in Settings for Chrome vs Chromium-derived browsers
- removed duplicate popup vertical scrollbar by tightening popup root sizing and scroll containment
- resolved code scanning warnings for empty block statements and unnecessary boolean casts
- updated extension version to `7.4.0`

### 7.3.1
- empty Chrome startup window is now reused for the first restored session window instead of being left open alongside the restored windows
- session restore loop now isolates per-window errors so a single failing window no longer aborts the entire restore
- added browser compatibility detection covering Brave, Edge, Opera, Vivaldi, and Chromium
- added dismissible unsupported-browser warning banner in the extension popup
- added "Browser Support" section to popup settings showing official browser, detected browser, and support status
- updated extension version to `7.3.1`

### 7.2.2
- added per-window restore actions in the session preview
- reused the existing restore pipeline for single-window restores
- fixed README links that pointed to an old local folder path
- updated extension version to `7.2.2`

### 7.2.1
- added a restore-in-progress lock in the background service worker to prevent concurrent session restores
- disabled restore controls while a restore request is in flight to avoid duplicate large-session restores
- updated extension version to `7.2.1`

### 7.2.0
- fixed removal of individual tabs from saved sessions so repeated removals stay consistent in UI and storage
- revised session capture flow to bind capture more explicitly to the popup window and improve fallback handling
- added repository documentation and AGPL-3.0 licensing
- updated extension version to `7.2.0`

### 7.1.0
- initial public release
- session save and restore for Chrome windows and tabs
- tab group preservation during save and restore
- session preview, rename, and delete actions
- JSON import and export support
- onboarding page and multi-language popup

</details>

---

## License

Licensed under the GNU Affero General Public License v3.0.

Full text: [`Chrome-extension/LICENSE`](./Chrome-extension/LICENSE)
