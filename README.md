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
  <img alt="Version" src="https://img.shields.io/badge/version-7.1.0-111827?style=flat-square" />
  <img alt="Manifest V3" src="https://img.shields.io/badge/Chrome-Manifest%20V3-34A853?style=flat-square&logo=googlechrome&logoColor=white" />
  <img alt="License AGPL-3.0" src="https://img.shields.io/badge/license-AGPL--3.0-F97316?style=flat-square" />
</p>

</div>

---

## Overview

`Tabs Session Saver` is a Chrome extension focused on quick session capture and restore.

It stores session data locally with `chrome.storage.local` and supports:

- full session save and restore
- tab group preservation
- preview, rename, and delete actions
- single-tab removal from saved sessions
- JSON export and import
- multi-language UI

## Quick Start

| Action | Path |
| --- | --- |
| Download extension | [Chrome Web Store](https://chromewebstore.google.com/detail/tabs-session-saver/njbmclamamhckchdanoobkhadhmbdobp?authuser=0&hl=en) |
| Load unpacked | `chrome://extensions` |
| Extension source | [`Chrome-extension`](/e:/Projects/BROWSERS-Extensions/Chrome-Extensions/Chrome-session-save/Chrome%20Extension/V7.1/Chome-Extension/Chrome-extension) |

## Highlights

| Feature | Details |
| --- | --- |
| Save sessions | Capture the current browsing state from the popup |
| Restore sessions | Reopen saved tabs into new Chrome windows |
| Tab groups | Preserve grouped tabs during save and restore |
| Session management | Rename, delete, preview, and edit saved sessions |
| Export and import | Move sessions via JSON |
| Local-first storage | Sessions are stored on-device with `chrome.storage.local` |

## Project Structure

The working extension files are in [`Chrome-extension`](/e:/Projects/BROWSERS-Extensions/Chrome-Extensions/Chrome-session-save/Chrome%20Extension/V7.1/Chome-Extension/Chrome-extension).

| File | Purpose |
| --- | --- |
| [`Chrome-extension/manifest.json`](/e:/Projects/BROWSERS-Extensions/Chrome-Extensions/Chrome-session-save/Chrome%20Extension/V7.1/Chome-Extension/Chrome-extension/manifest.json) | Manifest V3 configuration |
| [`Chrome-extension/background.js`](/e:/Projects/BROWSERS-Extensions/Chrome-Extensions/Chrome-session-save/Chrome%20Extension/V7.1/Chome-Extension/Chrome-extension/background.js) | background service worker, capture, storage, restore |
| [`Chrome-extension/popup.html`](/e:/Projects/BROWSERS-Extensions/Chrome-Extensions/Chrome-session-save/Chrome%20Extension/V7.1/Chome-Extension/Chrome-extension/popup.html) | popup UI |
| [`Chrome-extension/popup.js`](/e:/Projects/BROWSERS-Extensions/Chrome-Extensions/Chrome-session-save/Chrome%20Extension/V7.1/Chome-Extension/Chrome-extension/popup.js) | popup logic, preview, import/export, settings |
| [`Chrome-extension/welcome.html`](/e:/Projects/BROWSERS-Extensions/Chrome-Extensions/Chrome-session-save/Chrome%20Extension/V7.1/Chome-Extension/Chrome-extension/welcome.html) | onboarding page |
| [`Chrome-extension/welcome.js`](/e:/Projects/BROWSERS-Extensions/Chrome-Extensions/Chrome-session-save/Chrome%20Extension/V7.1/Chome-Extension/Chrome-extension/welcome.js) | onboarding behavior and translations |

## Local Development

### Load Unpacked

1. Open `chrome://extensions`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select [`Chrome-extension`](/e:/Projects/BROWSERS-Extensions/Chrome-Extensions/Chrome-session-save/Chrome%20Extension/V7.1/Chome-Extension/Chrome-extension)

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

### 7.1.0

- updated extension version to `7.1.0`
- fixed removal of individual tabs from saved sessions so repeated removals stay consistent in UI and storage
- revised session capture flow to bind capture more explicitly to the popup window and improve fallback handling
- added repository documentation and AGPL-3.0 licensing

### 7.0.0

- previous stable release
- session save and restore for Chrome windows and tabs
- tab group preservation during save and restore
- session preview, rename, and delete actions
- JSON import and export support
- onboarding page and multi-language popup

## License

This repository is licensed under the GNU Affero General Public License v3.0.

Full text: [`Chrome-extension/LICENSE`](/e:/Projects/BROWSERS-Extensions/Chrome-Extensions/Chrome-session-save/Chrome%20Extension/V7.1/Chome-Extension/Chrome-extension/LICENSE)
