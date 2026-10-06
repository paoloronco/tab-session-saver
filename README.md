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
  <img alt="Version" src="https://img.shields.io/badge/version-7.18.1-111827?style=flat-square" />
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

Sessions are saved directly on your device using Chrome's built-in storage by default. Optional Cloud Sync can be enabled through the included Cloudflare Worker and D1 backend.

## Feature Overview

| Area | What users can do |
| --- | --- |
| Manual sessions | Save the current browser workspace as a named session. |
| Restore | Reopen sessions in new windows or merge the last saved window into the current window. |
| Preview | Inspect saved tabs before restoring, restore individual windows, and remove saved windows from a session. |
| Search | Filter saved sessions by session name, tab title, full URL, or domain. |
| Auto Save | Capture sessions on a schedule or when Chrome closes, with grouping by smart topic, day, browser session, or no grouping. |
| Session editing | Rename through a themed in-extension dialog, delete, reorder, organize sessions into folders with rename/delete menus, remove individual tabs/windows, and add custom URLs or search items to saved sessions. |
| Tab groups | Preserve Chrome tab group names, colors, and membership during save and restore. |
| Backup | Export all sessions or an individual session as JSON; drag JSON files onto the popup to import without replacing existing sessions. |
| Appearance | Choose from six themes with palette previews and light/dark variants, customize the Classic theme accent color, and select popup size, full-tab mode, and UI language. |
| Cloud Sync | Sign in with Google to sync only the 10 most recent manually saved sessions. Auto Save and Save on Exit remain local. |
| Newsletter | Subscribe from Settings to receive product updates. |
| Browser support | Shows Chrome support status and warns when running on unsupported Chromium-derived browsers. |

## Local Storage, Backup, and Cloud Sync

The core extension is local-first:

- No account is needed to save, preview, search, restore, import, or export sessions.
- Local sessions are stored in `chrome.storage.local`.
- JSON export/import is the full manual backup path.
- Cloud Sync is optional and must be enabled by the user with Google Sign-In.

Current hosted Cloud Sync limits:

| Limit | Current value |
| --- | --- |
| Synced sessions | 10 sessions |
| Synced URLs | 300 total URLs across synced sessions |
| Snapshot size | 512 KB |
| Conflict handling | Latest update wins |
| Automatic push cadence | Local changes are pushed after about 10 minutes |
| Manual Push throttle | Push is skipped when there are no pending changes and rate-limited when repeated too quickly |

These limits apply only to Cloud Sync. Local sessions and JSON backups are separate.

To export one session, open its **⋮ menu → Export session (JSON)**. Drop the downloaded file onto the open extension popup to add it back, preserving its windows and tab groups. Full backups remain available in **Settings → Backup**; imports accept JSON files up to 5 MB.

In **Settings → Appearance**, select **Classic, Ocean, Forest, Lavender, Rose, or Sand**. Each theme changes backgrounds, surfaces, text, and accents across the popup and Settings. The **Dark mode** toggle switches to the theme's dark palette. **Accent color** is available only for Classic and disappears for the other themes, which use their preset palette. Choosing a new theme resets a custom accent.

Settings opens in its own browser tab. Use the sidebar to switch between Appearance, Language, Restore behavior, Auto Save, Backup, Cloud Sync, Newsletter, and About & support. Each section has a direct link, supports browser back/forward navigation, and adapts to narrow windows. Preferences save as you change them.

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
| `identity` | Let users sign in with Google for optional Cloud Sync |

By default, session data stays in `chrome.storage.local` on your machine only. If Cloud Sync is enabled, only the 10 most recent manually saved sessions are sent to the configured sync endpoint; Auto Save and Save on Exit remain local.

---

## Repository Structure

```
tabs-session-saver/
├── Chrome-extension/          # Extension source (load this folder as unpacked)
│   ├── manifest.json          # Manifest V3 configuration
│   ├── background.js          # Service worker: capture, storage, restore, auto save
│   ├── popup.html             # Popup UI markup
│   ├── popup.js               # Popup logic: sessions, search, import/export, settings
│   ├── settings.html          # Dedicated extension settings page
│   ├── settings.css           # Responsive settings layout and controls
│   ├── settings.js            # Settings navigation and page-specific translations
│   ├── themes.css             # Shared light/dark palettes and theme previews
│   ├── welcome.html           # Onboarding page shown on first install
│   ├── welcome.js             # Onboarding behavior and translations
│   ├── browser-support.js     # Browser detection utility (Chrome vs Chromium)
│   └── img-*.png              # Extension icons (16, 32, 48, 128px)
├── tests/                     # Automated test suite
├── Website/                   # Static website and legal pages
├── cloud-sync/                # Optional Cloudflare Worker + D1 sync backend
│   ├── cloudflare-worker/     # Worker API source and deploy config
│   └── cloudflare-d1/         # D1 schema and database notes
├── newsletter-proxy/          # Server-side newsletter webhook proxy
├── .github/                   # GitHub Actions workflows
└── README.md
```

---

## Changelog

<details>
<summary>View full changelog</summary>

### 7.18.1
- removed the automatic "Other sessions" folder: unfiled manual and automatic sessions remain directly in the list
- preserved explicit drag into folders and drag back into the main list; updated extension version to `7.18.1`

### 7.18.0
- added a three-dot menu to each saved folder with Rename and Delete folder actions
- folder renaming updates manual and automatic session metadata; deletion retains the choice to keep or delete contained sessions
- kept empty folders accessible even when no sessions remain; updated extension version to `7.18.0`

### 7.17.3
- replaced garbled folder disclosure symbols with simple arrows using encoding-safe CSS escapes
- updated extension version to `7.17.3`

### 7.17.2
- replaced the popup header illustration with the extension's own logo
- updated extension version to `7.17.2`

### 7.17.1
- removed the automatic-save notice and newsletter promotional copy and illustration from Settings
- replaced the settings button artwork with a conventional gear icon
- updated extension version to `7.17.1`

### 7.17.0
- redesigned Settings as a dedicated browser tab with grouped sidebar navigation and one focused section at a time
- rebuilt theme previews, display controls, illustrated restore choices, backup cards, Cloud Sync, newsletter, and support sections
- added direct section links, browser history navigation, keyboard focus, reduced-motion support, and responsive horizontal navigation
- translated all new settings copy in English, Italian, Spanish, French, and German
- preserved existing session, backup, theme, and sync behavior; updated extension version to `7.17.0`

### 7.16.3
- made the session menu a compact 180 px wide, with longer labels wrapping while preserving button alignment
- updated extension version to `7.16.3`

### 7.16.2
- reduced the space between category tabs and sessions while keeping manual and automatic lists aligned
- removed extra scrollbar gutters on non-scrolling containers to eliminate the light strip beside the popup scrollbar in dark mode
- updated extension version to `7.16.2`

### 7.16.1
- show Accent color only for the default Classic theme, in both light and dark mode
- keep the other themes on their preset accent, including when older custom preferences are stored
- updated extension version to `7.16.1`

### 7.16.0
- added individual session JSON export to the session menu and drag-and-drop JSON import without replacing existing sessions
- added six complete themes with palette previews, light/dark variants, and an optional custom accent color
- aligned manual and automatic session layouts, reserved filter/scrollbar space, and prevented long session titles from changing card sizes
- anchored session menus to the clicked button using their actual dimensions, including edge positioning and scrolling
- replaced Chrome's rename prompt with a themed in-extension dialog supporting Save, Cancel, Enter, Escape, validation, and retry on save errors
- disabled and muted the Cloud Sync login button for connected accounts, re-enabling it after disconnect
- separated the newsletter Subscribe button from the email field
- updated extension version to `7.16.0`

### 7.15.6
- unified the saved-session add actions into one clear "Add a new item" command
- added an in-extension dialog for choosing an existing saved window or creating a new one
- added explicit window selection for sessions containing multiple windows
- updated extension version to `7.15.6`

### 7.15.5
- changed Save on Exit to retain one dated snapshot per browser run instead of overwriting the previous browser run
- kept the active run snapshot rolling so tab and window changes do not create duplicates before the browser closes
- used Chromium session storage to detect browser restarts even when the extension service worker is recreated
- preserved session rename support for custom Save on Exit names
- kept scheduled Auto Save and Save on Exit independent across every on/off combination, including separate naming and scheduling
- showed the interval control only when scheduled Auto Save is enabled
- limited Cloud Sync to the 10 most recent manually saved sessions while keeping automatic and exit saves local
- preserved local automatic and exit saves when pulling manual sessions from the cloud
- made first sign-in pull and merge an existing cloud snapshot before any push, preventing an empty new device from overwriting cloud data
- limited synced folder metadata to folders referenced by the selected manual sessions while preserving local-only folders on pull
- clarified the Cloud Sync scope and limits in Settings in all supported languages
- updated extension version to `7.15.5`

### 7.15.4
- added saved session folders with drag-and-drop organization
- added folder deletion with separate choices for keeping or deleting contained sessions
- added saved-window removal from multi-window session previews
- added menu actions to append URLs, searches, or new saved windows to existing sessions
- fixed duplicate vertical scrolling by keeping one scroll owner per popup layout
- updated extension version to `7.15.4`

### 7.15.3
- added conservative automatic Cloud Sync push after local session changes
- added client-side manual Push throttling so repeated clicks do not create unnecessary sync writes
- added server-side Cloud Sync snapshot write rate limiting in the Cloudflare Worker
- documented automatic sync cadence and push rate limits
- updated extension version to `7.15.3`

### 7.15.2
- clarified the public website with a local-first workflow section and visible Cloud Sync limits
- reorganized extension Settings so backup and sync controls are easier to understand
- added Cloud Sync limit copy directly inside Settings
- completed Cloud Sync translations for Spanish, French, and German
- expanded README feature documentation so recent features are not only listed in the changelog
- updated extension version to `7.15.2`

### 7.15.1
- updated footer links to the official Tabs Session Saver website and legal pages
- replaced the promotional website mark with the real extension logo
- clarified Cloud Sync documentation to describe current usage limits without introducing paid-plan language
- updated extension version to `7.15.1`

### 7.15.0
- added optional Cloud Sync client settings with Google sign-in
- added the Cloudflare Worker and D1 backend for real cloud sync storage
- reorganized the Cloud Sync backend into separate Cloudflare Worker and D1 folders
- documented the current Cloud Sync usage limits and quota behavior
- removed the direct newsletter provider host permission from the extension manifest
- updated extension version to `7.15.0`

### 7.14.0
- added Newsletter signup in extension settings through a secure server-side proxy
- updated extension version to `7.14.0`

### 7.13.0
- added configurable popup size: Small (340×480), Medium (420×600, default), Large (520×740), Huge (full browser tab with sidebar layout)
- Huge mode opens as a dedicated tab with sessions panel on the left and settings sidebar always visible on the right
- popup size persists across sessions; Huge mode opens directly as a tab on extension click
- updated extension version to `7.13.0`

### 7.12.9
- added configurable Auto Save grouping by smart topic, day, browser session, or no grouping
- updated extension version to `7.12.9`

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
