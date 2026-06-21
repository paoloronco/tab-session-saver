# Footer Resource Links Design

## Goal

Replace the generic Resources card grid with a footer that clearly explains how to obtain or inspect the extension.

## Link Hierarchy

- Rename the Resources heading to Get the extension in every supported language.
- Place `Install from Chrome Web Store` and `Source code on GitHub` together as the two primary links.
- Present these as clean text actions with accent emphasis, not bordered cards.
- Place `Developer website` and `Privacy Policy` below as quieter secondary text links.
- Preserve all current URLs, targets, and security attributes.

## Release Metadata

- Put `Version: 7.8.0` on its own first line.
- Put `© 2025 Paolo Ronco · All rights reserved` on the second line.
- Keep the block centered, compact, and readable in light and dark modes.

## Verification

- Update structural tests to reject resource tiles and require the new primary and secondary link groups.
- Verify translated link labels in all five supported languages.
- Render the footer at 420×600 in light and dark modes before publishing.
