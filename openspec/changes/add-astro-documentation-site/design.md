## Context

See proposal.md - Why. The app already has a real color system to mirror: `src/index.css` sets `color-scheme` via `:root[data-theme='dark']` (a manual toggle, not just `prefers-color-scheme`), and components use Tailwind's `neutral-*` scale for surfaces/text with `violet-600` as the accent (errors in `red-*`, success/validation in `emerald-*`). The app's locales live in `src/i18n/locales/{en,fr}.json` via `react-i18next`. There is no existing `docs/` implementation, no CI/deploy workflow, and no monorepo tooling (no workspaces) in this repo today.

## Goals / Non-Goals

**Goals:**
- Stand up a Starlight documentation site under `docs/` as its own npm project.
- Re-theme Starlight's CSS custom properties to the app's existing violet/neutral palette and dark-mode behavior.
- Structure content and Starlight's i18n config so English and French stay in parity by construction (new page = both locale files required).

**Non-Goals:**
- Contributor/architecture documentation (deferred - user guide only, per proposal).
- Deployment target and CI pipeline (explicitly left open in the proposal).
- npm workspaces / monorepo tooling - `docs/` is a standalone project with its own `package.json`, not a workspace member.
- Adding new languages beyond `en`/`fr` (matches the app's current locales; more can follow the same pattern later).

## Decisions

**Starlight over a bare Astro build.** Starlight ships sidebar navigation, search, and i18n routing out of the box. Building those by hand in a bare Astro project would duplicate work Starlight already does well. The trade-off - re-theming Starlight's default look - is bounded because Starlight exposes its palette as CSS custom properties (`--sl-color-*`) that can be overridden in one custom CSS file, without touching Starlight's markup or components.

**Theme via CSS custom property overrides, not a forked/ejected theme.** Mapping `--sl-color-accent*` to violet-600-based shades and `--sl-color-gray-*`/`--sl-color-bg*` to the app's neutral scale (for both the light and dark value sets Starlight defines) keeps the site upgradeable with future Starlight versions, versus forking components to hardcode colors.

**Starlight's built-in i18n routing, with `en` as the root/default locale and `fr` as a sibling locale.** This mirrors the app's own default-English-with-French-available setup and lets Starlight generate the locale switcher and per-locale routes automatically, instead of hand-rolling locale routing in a bare Astro project.

**`docs/` as an independent npm project, not a workspace.** The repo has no existing workspace tooling, and the docs site has a different framework (Astro) and release cadence from the app (Vite/React). Introducing npm/pnpm workspaces purely to host a second project would add tooling surface not currently justified. Running `docs/` as a sibling project with its own `package.json` (invoked via `npm --prefix docs <script>` or `cd docs && npm run <script>`) is simpler and matches the proposal's decision.

**Content organized by user-facing topic, not by form schema field.** Sidebar sections (Getting Started, Creating Your CV, Live Preview, Validation, Export/Import, Themes & Languages, FAQ) follow the mental model of someone using the app, rather than mirroring the YAML schema structure 1:1 - the schema is an implementation detail the user guide deliberately does not expose as its navigation.

## Risks / Trade-offs

- **Starlight upgrades could rename or remove CSS custom properties** → Mitigate by keeping the override file small and isolated (one custom CSS file) so a breaking Starlight upgrade is easy to diff and fix in one place.
- **Writing every page in English and French in parallel doubles per-page authoring effort and can slow down publishing** → Mitigate by keeping page scope small and consistent (the fixed topic list in specs/docs-site/spec.md) so parallel translation stays tractable; no page ships until both locale versions exist.
- **No deployment target decided yet means the site may sit unpublished after this change** → Accepted trade-off per the proposal; local `astro build`/`astro preview` is sufficient to validate the work in this change, and deployment is a deliberate follow-up decision.
- **Two independent npm projects in one repo (root app + `docs/`) increase the surface for someone to run the wrong install/build command** → Mitigate with clear instructions in `docs/README.md` (or the root README) on how to run the docs project.
