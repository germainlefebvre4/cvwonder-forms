## 1. Project Setup

- [x] 1.1 Scaffold the app with Vite (React 19 + TypeScript template); pin `react`/`react-dom` to `^19`
- [x] 1.2 Install and configure Tailwind CSS
- [x] 1.3 Install Radix UI primitives and set up a shared UI components folder
- [x] 1.4 Install Zustand, `ajv`, a YAML library, and an i18n library
- [x] 1.5 Move/confirm `schemas/cvwonder.v0.10.1.json` is bundled as a static import available at build time
- [x] 1.6 Set up base app shell (layout: form pane + preview pane, responsive breakpoints)

## 2. Schema Walking & Validation Core

- [x] 2.1 Write a schema-walking utility that turns a JSON Schema node into a typed field descriptor (type, widget kind, required flag, constraints)
- [x] 2.2 Add explicit handling for the `anyOf`-empty-string-or-format pattern (`person.email`, `person.site`) in the walker
- [x] 2.3 Set up `ajv` (draft-07) with the vendored schema and expose a `validate(document)` function returning field-keyed errors
- [x] 2.4 Unit test the walker and validator against representative valid/invalid documents covering every top-level section

## 3. CV Document Store

- [x] 3.1 Define the CV document's in-memory shape (mirrors the schema's top-level properties)
- [x] 3.2 Create the Zustand store: current document, per-field update actions, array add/remove/reorder actions
- [x] 3.3 Wire the store's document changes to the `ajv` validator, exposing current validation errors from the store

## 4. Schema-Driven Form Rendering (`cv-form-editing`)

- [x] 4.1 Build base field components (text, number/slider, textarea, repeatable list, repeatable object group) styled with Radix + Tailwind
- [x] 4.2 Build the `SchemaFormRenderer` that consumes the walker's field descriptors and the store, and renders one section per top-level schema property in schema order
- [x] 4.3 Wire required-field indication and inline error display to the descriptor's required flag and the store's validation errors
- [x] 4.4 Implement add/remove/reorder UI for repeatable sections (`abstract`, `career`, `career[].missions`, `technicalSkills.domains`, `technicalSkills.domains[].competencies`, `sideProjects`, `certifications`, `languages`, `education`)
- [x] 4.5 Render `person.email`/`person.site` as single text fields with conditional format validation (empty allowed, non-empty must match format)

## 5. Live YAML Preview (`cv-yaml-preview`)

- [x] 5.1 Implement document → YAML serialization that omits empty/unset optional properties
- [x] 5.2 Build the preview pane component that re-serializes and displays YAML on every store change
- [x] 5.3 Add syntax highlighting for the YAML preview

## 6. YAML Import/Export (`cv-yaml-file-io`)

- [x] 6.1 Implement file selection + `FileReader`-based YAML parsing for import
- [x] 6.2 On successful import, replace the store's document with the parsed content and run validation
- [x] 6.3 On parse failure, show an error and leave the current form state untouched
- [x] 6.4 Implement export: serialize the current document to YAML and trigger a client-side file download

## 7. Validation UX (`cv-schema-validation`)

- [x] 7.1 Ensure inline field-level errors are shown/cleared reactively as the user edits
- [x] 7.2 Ensure import-triggered validation errors are shown against the newly populated form (task 6.2 dependency)
- [x] 7.3 Add a validation summary (e.g. count of outstanding errors) visible at the app level

## 8. Local Persistence (`app-persistence`)

- [x] 8.1 Add Zustand `persist` middleware backed by `localStorage` for the CV document store
- [x] 8.2 Verify rehydration on load repopulates the form without a network request

## 9. Internationalization (`app-i18n`)

- [x] 9.1 Set up the i18n library with `fr` and `en` locale resources
- [x] 9.2 Extract all interface labels, buttons, and validation messages into translation keys
- [x] 9.3 Add a language switcher and persist the selected language locally

## 10. Theming (`app-theme`)

- [x] 10.1 Configure Tailwind dark mode and define light/dark color tokens
- [x] 10.2 Add a theme switcher and persist the selected theme locally
- [x] 10.3 Verify both themes meet basic accessibility contrast expectations

## 11. Verification

- [x] 11.1 Manually walk every schema section end-to-end: fill, preview, export, re-import the exported file, confirm round-trip equivalence
- [x] 11.2 Verify offline behavior (disable network) for import/export/autosave
- [x] 11.3 Verify language and theme selection survive a page reload
