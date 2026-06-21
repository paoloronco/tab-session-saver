# Session Card And New-Window Restore Design

## Goal

Make session discovery intuitive and ensure a full restore never changes an already open browser window.

## Interaction

- Clicking the session card's information area toggles its preview.
- Keyboard activation with Enter or Space performs the same toggle.
- The Restore button remains the only direct full-session restore action on the collapsed card.
- The three-dot menu retains Preview, Rename, and Delete. Its Preview action uses the same toggle behavior as the card.
- Clicking Restore or the three-dot menu does not also toggle the preview.

## Restore Behavior

- Full-session restore creates one new Chrome window for every saved window.
- Single-window restore also creates a new window.
- Existing browser windows and tabs are never reused or modified during restore.
- Restore locking, batching, tab ordering, tab groups, pinned state, mute state, bounds, and focus behavior remain unchanged.

## Verification

- A popup regression test verifies card and menu preview toggling and event isolation.
- A background regression test verifies that a source window is not queried, updated, or reused and that each saved window is created separately.
- JavaScript syntax, ESLint, manifest JSON, and all regression tests are checked before release.
