## Why

Since `add-schema-version-sync`, the app resolves exactly one active vendored schema version (`schemas/active-version.json`), but nothing in the UI tells the user which version their document is being validated against, or gives them a way to inspect that schema's actual rules. A user hitting a validation error has no path from "this field is required" to "here is the schema rule that says so."

## What Changes

- Display the active schema version (e.g. `v0.10.1`) next to the "YAML preview" heading, between the title and the existing Copy button.
- Make the version a link that opens the corresponding `schema.json` on GitHub, at the exact vendored Git tag, in a new tab (`https://github.com/germainlefebvre4/cvwonder/blob/refs/tags/<version>/internal/validator/schema.json`).
- Re-export the active version string from the schema module (currently `activeVersion` is only imported inside `src/schema/activeSchema.ts` and not exposed alongside `cvSchema`), so both the validator/renderer and this new UI element read the same single reference.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `cv-yaml-preview`: adds a requirement that the preview pane's header displays the active schema version as a link to that version's source on GitHub.

## Impact

- `src/schema/activeSchema.ts` / `src/schema/index.ts` — expose the active version string as a named export.
- `src/App.tsx` — render the version link in the YAML preview column header (`src/App.tsx:46-52`).
- `src/i18n/locales/en.json`, `src/i18n/locales/fr.json` — new label/aria-text for the link.
- No changes to validation behavior or schema resolution itself (`schema-version-sync` capability is unaffected).
