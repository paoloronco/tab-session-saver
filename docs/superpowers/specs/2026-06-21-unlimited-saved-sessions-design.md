# Unlimited Saved Sessions Design

## Goal

Remove the extension's artificial saved-session count limit while retaining Chrome's normal storage behavior and permissions.

## Behavior

- Saving a session appends it to every existing saved session without pruning older entries.
- Merging an import appends every valid imported session without pruning.
- Replacing sessions during import still replaces the complete existing collection.
- Users continue to delete sessions explicitly through the existing session menu.
- Storage failures continue through the existing error paths; the extension does not request `unlimitedStorage`.

## Interface And Onboarding

- Remove the Saved sessions limit field from Settings.
- Remove its translation keys and all localStorage reads/writes for `maxSessions`.
- Remove onboarding cards, headings, captions, and tips that describe a configurable limit.
- Keep language, theme, accent color, export, import, and browser-support settings unchanged.

## Verification

- Test that combining more than ten sessions preserves every entry.
- Test that popup and onboarding sources contain no session-limit control or copy.
- Run all regression tests, JavaScript syntax checks, ESLint, manifest parsing, version checks, and diff checks before publishing.
