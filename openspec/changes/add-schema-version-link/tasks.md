## 1. Expose the active version string

- [ ] 1.1 In `src/schema/activeSchema.ts`, export the active version string (e.g. `export const activeSchemaVersion = activeVersion.version`) alongside the existing `activeSchema` export.
- [ ] 1.2 In `src/schema/index.ts`, re-export `activeSchemaVersion` alongside `cvSchema`.

## 2. Add i18n labels

- [ ] 2.1 Add `nav.schemaVersionLabel` ("Schema version") to `src/i18n/locales/en.json`.
- [ ] 2.2 Add the French equivalent to `src/i18n/locales/fr.json`.

## 3. Render the version link

- [ ] 3.1 In `src/App.tsx`, add a link between the "YAML preview" heading and `CopyYamlButton` (`src/App.tsx:46-52`) showing `activeSchemaVersion` as its text.
- [ ] 3.2 Build the `href` as `` `https://github.com/germainlefebvre4/cvwonder/blob/refs/tags/${activeSchemaVersion}/internal/validator/schema.json` ``.
- [ ] 3.3 Set `target="_blank"` and `rel="noopener noreferrer"`; set an accessible name from `nav.schemaVersionLabel` (e.g. `aria-label` combining the label and version) distinguishing the link from its plain version-string text.

## 4. Verify

- [ ] 4.1 Run the app, confirm the version link renders next to "YAML preview" and shows the value from `schemas/active-version.json`.
- [ ] 4.2 Click the link, confirm it opens the correct tag's `schema.json` on GitHub in a new tab.
- [ ] 4.3 Switch language (FR/EN) and confirm the accessible label updates while the visible version text stays the same.
