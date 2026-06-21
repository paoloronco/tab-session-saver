# Settings Layout Design

## Goal

Give Settings a clear visual hierarchy and replace the uneven footer links with a compact, aligned resource grid.

## Grouping

- Language is a standalone card with the language selector as its only control.
- Appearance is a card containing the dark/light toggle and accent-color selector.
- Backup is a card containing a short explanation plus Export and Import actions.
- Browser Support remains an independent fourth card and stays hidden in supported Chrome environments.
- Cards use the existing surfaces, borders, radii, and accent color so the redesign belongs to the current popup.

## Footer

- A Resources heading introduces a two-column grid.
- Chrome Web Store, Developer, GitHub, and Privacy Policy each occupy one consistently sized linked tile.
- The Developer tile links to the developer website and presents `Developer` and `Paolo Ronco` together.
- Version, copyright, and rights text move into a centered wrapping metadata row below the links.

## Accessibility And Responsive Behavior

- Existing form labels, input IDs, button IDs, URLs, and event behavior remain unchanged.
- Group headings use semantic headings or labels.
- Link and control focus states remain visible.
- The two-column footer grid collapses to one column if the popup width becomes constrained.

## Release And Verification

- Add translations for Appearance, Backup, the backup description, and Resources in all five supported languages.
- Publish as version 7.7.0.
- Add structural tests for all four settings groups, the resource grid, translations, and release metadata.
- Run all tests, syntax checks, ESLint, manifest parsing, and a rendered UI inspection before push.
