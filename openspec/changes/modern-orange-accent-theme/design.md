## Context

`src/index.css` defines the app's only accent color scale as Tailwind v4 `@theme` custom properties:

```css
--color-brand-50: #ebf2fc;
--color-brand-100: #c2d7f7;
--color-brand-300: #9abcf2;
--color-brand-400: #72a1ed;
--color-brand-500: #3578e5;
--color-brand-600: #306cce;
--color-brand-700: #2554a0;
--color-brand-950: #102445;
```

Every consumer (`inputStyles.ts`, `SliderField.tsx`, `SectionNav.tsx`, `ThemeToggle.tsx`, `ErrorSummary.tsx`, `LanguageSwitch.tsx`, `YamlPreview.tsx`, `yamlHighlight.ts`) references these via Tailwind class names (`bg-brand-500`, `text-brand-400`, etc.), never raw hex values. The scale intentionally skips steps 200/800/900 — the replacement should keep the same 8 step names so no class name in any component needs to change.

## Goals / Non-Goals

**Goals:**
- Pick a modern, vibrant orange scale that reads as intentional (not a generic/dated orange) and preserves relative lightness steps so existing text/background contrast pairs stay legible.
- Change only `src/index.css`; zero component edits.

**Non-Goals:**
- Redesigning layout, spacing, or component structure.
- Touching status colors (errors/success) if any exist outside the `brand-*` scale — out of scope, this change is accent-only.
- Re-deciding the light/dark theme mechanism itself (`app-theme` spec) — unaffected.

## Decisions

**Use Tailwind's standard `orange` scale values as the new `brand-*` scale**, mapped 1:1 by step name:

| step | old (blue) | new (orange) |
|------|-----------|---------------|
| 50   | `#ebf2fc` | `#fff7ed` |
| 100  | `#c2d7f7` | `#ffedd5` |
| 300  | `#9abcf2` | `#fdba74` |
| 400  | `#72a1ed` | `#fb923c` |
| 500  | `#3578e5` | `#f97316` |
| 600  | `#306cce` | `#ea580c` |
| 700  | `#2554a0` | `#c2410c` |
| 950  | `#102445` | `#431407` |

Rationale: Tailwind's `orange` scale is a well-tested, accessible progression (used widely, "modern" in the sense of current design-system conventions) rather than a hand-picked hue, and it preserves the same kind of lightness curve as the original custom blue scale so existing contrast pairs (e.g. `brand-500` on white, `brand-950` text on `brand-50` background) stay legible without per-component tuning.

**Keep the step names identical** (50/100/300/400/500/600/700/950) rather than renaming to a new token (e.g. `--color-accent-*`). Renaming would require touching all ~10 consumer files for no functional benefit; the `brand` name is already generic enough to host any accent hue.

## Risks / Trade-offs

- **Orange has different perceptual lightness than blue at the same numeric step** (e.g. orange-500 reads lighter/more saturated than blue-500 to the eye) — mitigated by using Tailwind's pre-tuned scale rather than inventing custom values, and by the verification task below to spot-check real usage sites.
- **YAML syntax highlighting (`yamlHighlight.ts`) and slider/input focus rings depend on `brand-400`/`brand-500` for readability against both light and dark backgrounds** — flagged as a manual check in tasks.md rather than assumed safe.

## Migration Plan

Single-file, single-commit change: replace the 8 hex values and the provenance comment in `src/index.css`. No data migration, no feature flag — a plain CSS value swap that takes effect on next build/reload.
