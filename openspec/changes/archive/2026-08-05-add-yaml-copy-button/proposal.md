## Why

Users who want to paste their YAML somewhere else (an editor, a chat, a support ticket) currently have to export a file and open it, or manually select and copy the text from the preview pane. A one-click copy action removes that friction.

## What Changes

- Add a "Copy" button next to the "Preview" heading above the YAML preview pane.
- Clicking it copies the full current YAML output (same content as `ExportButton` writes to file) to the clipboard.
- The button label temporarily switches to a "Copied!" confirmation for ~1.5s, then reverts to "Copy".

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `cv-yaml-preview`: adds a requirement that the preview pane offers a one-click action to copy the current YAML output to the clipboard, with a transient confirmation.

## Impact

- Affected code: `src/components/preview/YamlPreview.tsx` (or a new sibling component) and its container in `src/App.tsx`; reuses `serializeToYaml` from `src/yaml/serialize.ts`.
- New i18n keys in `src/i18n/locales/en.json` and `fr.json` (e.g. `actions.copy`, `actions.copied`).
- No new dependencies; uses the browser `navigator.clipboard` API.
