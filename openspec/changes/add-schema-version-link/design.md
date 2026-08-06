## Context

`src/schema/activeSchema.ts` already reads `schemas/active-version.json` (`{ "version": "v0.10.1" }`) to resolve the active vendored schema file via `import.meta.glob`, but only exports `activeSchema` — the version string itself never leaves that module. `src/schema/index.ts` re-exports `cvSchema` and `documentSections` but not the version. The YAML preview header already has a flex row with the "YAML preview" title and `CopyYamlButton` (`src/App.tsx:46-52`) that a version link can join. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Surface the exact version string the app is already resolving (`activeVersion.version`), not a separately-maintained copy of it.
- Link directly to the vendored schema's source at the matching Git tag, using the same repository the update script already fetches from.

**Non-Goals:**
- No change to how the active version is chosen or vendored (`schema-version-sync` stays as-is).
- No fetching of schema metadata (title, description) from the file itself — only the version string is displayed.

## Decisions

### Export the version string from `src/schema/activeSchema.ts`, re-export from `src/schema/index.ts`
Add `export { activeVersion }` (or a named `activeSchemaVersion` export of the plain string) alongside `activeSchema` in `activeSchema.ts`, and re-export it from `index.ts` next to `cvSchema`. This keeps "the active version" resolved in exactly one place, consistent with the single-reference goal `schema-version-sync` already established — the UI reads the same value the validator and form renderer resolve against, so it can never drift from what's actually validating the document.

### Link URL: GitHub blob view, built directly from the version string
`https://github.com/germainlefebvre4/cvwonder/blob/refs/tags/${version}/internal/validator/schema.json` — the vendored version string already IS the Git tag name (confirmed in `scripts/update-schema.mjs`, which fetches `refs/tags/${tag}/...` from the same repo), so no lookup or transformation is needed beyond string interpolation. The blob view is chosen over the raw URL (`raw.githubusercontent.com`, what the update script itself fetches) because it renders syntax-highlighted in GitHub's UI rather than a plain-text JSON dump — better for a human clicking through, even though the raw URL would technically be the more "faithful" mirror of what the script vendors.

### Rendered as a plain link, not a new component
A single `<a>` element (version text, `target="_blank" rel="noopener noreferrer"`) inline in `App.tsx`'s existing header row is enough — this isn't reused elsewhere and doesn't warrant its own component file, consistent with how the header row already mixes a heading and a button directly.

### i18n: new key for the accessible label only
The visible text is just the version string (not translatable content), but the link needs an accessible name distinguishing it from the visible `v0.10.1`. Add `nav.schemaVersionLabel` (e.g. "Schema version" / "Version du schéma") to `en.json`/`fr.json`, used as `aria-label` or a visually-hidden prefix, following the existing pattern of `nav.preview`.

## Risks / Trade-offs

- **[Risk]** If a future vendored schema is introduced without going through `scripts/update-schema.mjs` (e.g. hand-edited), the version string might not correspond to a real upstream Git tag, and the link would 404. → **Mitigation**: this is already the exact failure mode `schema-vendoring-consistency`'s pre-commit hook guards against for the vendoring step itself; out of scope to re-guard here.

## Migration Plan

Single-PR change: add the export, add the link in `App.tsx`, add the two i18n keys. No data migration, no rollback complexity beyond reverting the diff.
