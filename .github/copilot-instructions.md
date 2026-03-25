# Guidance for AI coding assistants

Short, focused guidance to help an AI agent be immediately productive in this Chrome Extension (Manifest V3).

1. Big picture
   - This is a small Chrome Extension (Manifest V3) named "Tabs Session Saver". Entry points:
     - `manifest.json` — declares permissions (`tabs`, `storage`), `action` popup (`popup.html`), and a background service worker `background.js`.
     - `background.js` — the service worker that handles persistent storage and operations via `chrome.runtime.onMessage`.
     - `popup.html` + `popup.js` — the UI displayed when the extension action is clicked; it sends messages to `background.js` and uses `chrome.storage.local` and `localStorage`.

2. Key data flows and contracts
   - Inter-component communication uses `chrome.runtime.sendMessage` / `onMessage`. Messages use an `action` string: `save_tabs`, `get_sessions`, `open_session`, `delete_session`, `rename_session`.
   - Storage schema (in `chrome.storage.local`): an object with key `sessions` which is an array of session objects: `{ timestamp: string, session: Array<{title, url}>, name: string }`.
   - `popup.js` sometimes reads/writes `localStorage` for UI preferences (`language`, `accentColor`, `darkMode`, `maxSessions`). These are UI-only and not part of `chrome.storage.local` sessions.

3. Project-specific conventions
   - Language/localization is handled in `popup.js` by a `translations` object and `data-translate` attributes in `popup.html`. When changing UI text, update both `translations` and the HTML `data-translate` keys.
   - Session names: session objects may include a `name` property; fallback in UI uses `Session ${index+1}`. When adding or mutating sessions, keep the array ordering consistent — UI expects stable indexes.
   - UI and storage limits: `popup.js` enforces a `maxSessions` localStorage setting and trims sessions with `slice(-max)` when saving.

4. Files to edit for common tasks
   - Add new UI controls: `popup.html` (template/style) and `popup.js` (event handlers, translation keys).
   - Modify background behavior (session persistence/opening): `background.js` — preserve use of asynchronous callbacks or keep returning `true` in listener when sending async responses.
   - Change manifest/permissions: update `manifest.json` (remember MV3 service worker and that some APIs require host permissions or different scopes).

5. Testing & debugging steps (practical, reproducible)
   - Manual quick test cycle (DevTools -> Extensions):
     1. Load unpacked extension: open `chrome://extensions` → Load unpacked → select repo folder.
     2. Open popup (click toolbar icon) to exercise `popup.js` flows: Save, Rename, Delete, Open.
     3. Inspect service worker console: on `chrome://extensions` find the extension, click `background service worker` (inspect) to see logs and runtime errors.
   - When editing `background.js` (service worker), remember MV3 service worker unloads when idle — use console.logs and re-open the worker to view logs.

6. Common pitfalls to avoid
   - Do not assume synchronous returns from `chrome.*` APIs — `chrome.storage` and `chrome.tabs.query` are asynchronous; `onMessage` handlers must `return true` when they will call `sendResponse` asynchronously.
   - Keep UI translations and `data-translate` keys in sync; missing keys should fall back to English (`translations.en`).
   - Avoid mutating the sessions array without re-saving it via `chrome.storage.local.set`.

7. Example edits
   - Add a new message `export_sessions` in `popup.js` that asks `background.js` for sessions and downloads a JSON file. Implement `if (request.action === 'export_sessions')` in `background.js` returning `sessions`.
   - To change default accent color, edit the default `option` values in `popup.html` and ensure `popup.js` persists the value to `localStorage`.

8. Where to look for additional context
   - `manifest.json` — permissions and chrome MV3 specifics.
   - `background.js` — message handlers and storage operations.
   - `popup.js` / `popup.html` — UI flows, translations, localStorage prefs, and event handlers.

If anything here is unclear or you'd like me to add quick automated tests or a README section describing how to load & test the extension locally, tell me which you'd prefer and I'll update this file.
