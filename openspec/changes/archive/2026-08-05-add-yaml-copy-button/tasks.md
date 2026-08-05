## 1. Copy button component

- [x] 1.1 Create a `CopyYamlButton` component (in `src/components/preview/`) that reads the current CV document via `useCvDocumentStore`, serializes it with `serializeToYaml`, and writes it to the clipboard via `navigator.clipboard.writeText` on click.
- [x] 1.2 On successful copy, switch the button label to a "Copied!" state for ~1.5s (via `setTimeout`, cleared on unmount), then revert to the normal "Copy" label.
- [x] 1.3 On clipboard write failure (rejected promise), leave the label unchanged (no success confirmation) rather than throwing an unhandled rejection.

## 2. Wiring and i18n

- [x] 2.1 Add `actions.copy` and `actions.copied` keys to `src/i18n/locales/en.json` and `src/i18n/locales/fr.json`.
- [x] 2.2 Render `CopyYamlButton` next to the "Preview" heading in `src/App.tsx` (the `<h2>` above `YamlPreview`, `App.tsx:46-47`).

## 3. Verification

- [x] 3.1 ~~Add a test (e.g. `CopyYamlButton.test.tsx`) that mocks `navigator.clipboard.writeText`, clicks the button, and asserts it was called with the serialized YAML and that the label reverts after the timeout.~~ Skipped: no component-testing setup (`@testing-library/react`/`jsdom`) exists in this repo, and adding one conflicts with the proposal's "no new dependencies" constraint. Covered instead by manual verification (3.2).
- [x] 3.2 Manually verify in the running app (`npm run dev`): click Copy, paste elsewhere, confirm content matches the preview pane; confirm label reverts.
