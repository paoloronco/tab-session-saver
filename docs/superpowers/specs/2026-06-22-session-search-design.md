# Session Search Design

## Goal

Add a compact, live session search beside the primary save action. Search must match saved session names, tab titles, full tab URLs, and therefore URL domains.

## Toolbar Interaction

- Place the primary Save current tabs button and a square search icon button in one toolbar row.
- Keep the save action dominant, using at least three quarters of the available row while search is closed.
- Clicking search expands a text field toward the left with a short, restrained animation and focuses it.
- While open, the search control may take space from the save button but must keep both controls usable within the 420-pixel popup.
- Clicking the close control, clicking the active search icon, or pressing Escape closes search, clears the query, and restores the complete session list.
- Respect `prefers-reduced-motion` by disabling nonessential transitions.

## Search Behavior

- Filter immediately on every input event; Enter is not required.
- Normalize both the query and searchable values with trimming and lowercase conversion.
- Match a session when the normalized query is a substring of any of these values:
  - session name;
  - tab title;
  - full tab URL.
- Search across every window and tab in a saved session.
- Preserve the original session order and original storage index so rename, delete, edit, and restore actions keep targeting the correct stored session.
- An empty query shows every saved session.

## List States

- Keep the existing empty state when no sessions are stored.
- Show a distinct localized no-results state when sessions exist but none match the current query.
- Do not automatically open session previews or highlight substrings in this version.

## Accessibility And Localization

- Use a button with an accessible localized label for opening and closing search.
- Give the input a localized label and placeholder.
- Keep visible keyboard focus styles and logical tab order: save, search toggle, search input/close when open, then session cards.
- Add copy for English, Spanish, Italian, French, and German.
- Preserve equivalent light and dark theme contrast.

## Implementation Shape

- Add a small pure search predicate that accepts a normalized session and query.
- Cache the latest loaded session array in popup state.
- Split list rendering from storage loading so input changes filter cached data without repeated storage reads.
- Reuse the current session-card construction and pass through each item’s original storage index.

## Verification

- Unit-test matching by session name, tab title, full URL/domain, case-insensitivity, and non-matches.
- Test that filtered entries retain their original storage indexes.
- Test toolbar markup, localized copy, and reduced-motion styling.
- Run the complete Node test suite and JavaScript syntax checks.
- Render the popup at 420 by 600 pixels in light and dark themes without using a visual preview during design.

## Release

- Publish as version `7.10.0` because this is a new user-facing feature.
- Update manifest, popup footer, welcome page, README badge, highlights, and changelog.
- Commit only feature, test, documentation, and release files; exclude `Chrome-extension.zip` and other local artifacts.
