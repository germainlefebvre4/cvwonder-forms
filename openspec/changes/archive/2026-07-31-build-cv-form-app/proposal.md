## Why

CV Wonder users currently hand-write YAML CVs against a JSON Schema they must know by heart, with no feedback until they run the CV Wonder renderer. There is no guided, validated way to author or edit a CV Wonder file. This change delivers a client-side form application that turns the CV Wonder schema into a guided editing experience with live YAML preview, so users can produce valid CV Wonder files without memorizing the schema or leaving their browser.

## What Changes

- Bootstrap the application: React 19 (minimum), Vite, Zustand, Radix UI + Tailwind CSS.
- Vendor the CV Wonder JSON Schema (`schemas/cvwonder.v0.10.1.json`) as the single source of truth for both form generation and validation.
- Build a schema-driven form renderer: walks the vendored JSON Schema and generates Radix/Tailwind form fields for each section (person, company, socialNetworks, abstract, career, technicalSkills, sideProjects, certifications, languages, education), including a special case for the `anyOf`-with-empty-string pattern used by `email`/`site`.
- Add a live YAML preview pane that reflects the in-memory CV document as the user edits the form.
- Add schema validation via `ajv` against the vendored schema, with inline error surfacing in the form and on file import.
- Add YAML file import (populate the form/store from an existing CV Wonder YAML file) and export (download the current CV document as a YAML file). Fully client-side, no server round-trip.
- Add local autosave of the in-progress CV document (Zustand persist middleware) so a refresh does not lose form progress.
- Add a French/English interface language switch (i18n).
- Add a light/dark theme switch.

## Capabilities

### New Capabilities
- `cv-form-editing`: Dynamically generated, sectioned form for editing a CV Wonder document, rendered from the vendored JSON Schema.
- `cv-yaml-preview`: Real-time YAML preview of the CV document reflecting current form state.
- `cv-yaml-file-io`: Import an existing CV Wonder YAML file into the form; export the current CV document as a downloadable YAML file.
- `cv-schema-validation`: Validate the CV document against the vendored CV Wonder JSON Schema and surface errors inline (during editing and on import).
- `app-persistence`: Automatically persist the in-progress CV document locally so it survives a page refresh.
- `app-i18n`: French/English interface language switch.
- `app-theme`: Light/dark interface theme switch.

### Modified Capabilities
- None (greenfield application; no existing specs).

## Impact

- New codebase: no existing application code is affected (repo currently has no `src/`, no `package.json`).
- New dependencies: `react`/`react-dom` (^19), `vite`, `zustand`, Radix UI primitives, `tailwindcss`, `ajv` (draft-07 support), a YAML parser/serializer, an i18n library.
- New vendored asset: `schemas/cvwonder.v0.10.1.json`, treated as a build-time/runtime input that drives both rendering and validation - upgrading it is the intended path for supporting future CV Wonder schema versions.
- No server/backend introduced; the application remains a fully static, client-side SPA.
