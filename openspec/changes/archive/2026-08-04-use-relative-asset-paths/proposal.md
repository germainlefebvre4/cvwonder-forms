## Why

The production build emits root-absolute asset paths (`/assets/...`), which resolve correctly when the site is served from a domain root but break when served from a sub-path — as is the case when hosting `dist/` directly in a Google Cloud Storage bucket (e.g. `https://storage.googleapis.com/<bucket-name>/index.html`). The browser resolves `/assets/...` against the storage origin instead of the bucket path, so CSS/JS 404.

## What Changes

- Set `base: './'` in `vite.config.ts` so the production build emits paths relative to `index.html` instead of root-absolute paths.
- No change to dev server behavior is expected (`vite`/`vite preview` continue to serve from `/`).

## Capabilities

This is a pure build-configuration change with no application-level requirement or behavior change — `skip_specs: true` is set in `.openspec.yaml`.

### New Capabilities
(none)

### Modified Capabilities
(none)

## Impact

- **Affected code**: `vite.config.ts` (single config option).
- **Affected output**: `dist/index.html` and all emitted `<script>`/`<link>` tags will use relative (`./assets/...`) instead of absolute (`/assets/...`) paths.
- **Deployment**: enables hosting `dist/` unmodified in a GCS bucket (or any static host serving from a sub-path) without post-build path rewriting.
- **No impact** on routing (the app has no client-side router) or on other deployment targets that serve from a domain root — relative paths resolve the same way there.
