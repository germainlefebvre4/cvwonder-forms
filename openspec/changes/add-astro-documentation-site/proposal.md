## Why

CV Wonder Forms has no user-facing documentation: newcomers have no guide explaining what the form covers, how the live preview and validation work, or how to export/import a YAML file. `docs/AGENTS.md` already states the intent to document the app with Astro, but nothing has been built yet. Adding a documentation site now, while the feature set is still small, keeps the docs from falling behind as the form grows.

## What Changes

- Add a new Astro documentation site under `docs/`, built with the Starlight theme, as a standalone npm project (its own `package.json`, independent from the app's Vite/React project).
- Cover the user guide only: introduction, getting started, the form sections (personal info, education, experience, skills, projects), live preview, schema validation, export/import, themes, and language switching. No contributor/architecture docs.
- Write content in English and French in parallel (mirroring the app's existing `en`/`fr` locales in `src/i18n/locales/`), using Starlight's built-in i18n routing.
- Re-theme Starlight's CSS custom properties to match the app's existing palette (violet-600 accent, neutral-* grays, light/dark mode) instead of using Starlight's default look.
- Update the root `.gitignore` to exclude `docs/node_modules` and `docs/dist`.

## Capabilities

### New Capabilities
- `docs-site`: A Starlight-based documentation site under `docs/` providing a bilingual (EN/FR) user guide for CV Wonder Forms, themed to match the app.

### Modified Capabilities
<!-- none: this change adds a new, separate documentation site and does not alter the behavior of the CV Wonder Forms application itself -->

## Impact

- **New directory**: `docs/` becomes a second, independent npm project (own `package.json`, `astro.config.mjs`, `src/content/docs/en/`, `src/content/docs/fr/`).
- **Root repo files**: `.gitignore` updated to cover `docs/node_modules` and `docs/dist`. No changes to the existing app's `src/`, `package.json`, or `vite.config.ts`.
- **No runtime impact** on the CV Wonder Forms application itself; this is documentation-only.
- **Deployment**: not decided yet - out of scope for this change beyond noting the docs site builds independently of the app.
