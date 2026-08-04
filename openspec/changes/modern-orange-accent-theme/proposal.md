## Why

HOM-3 asks to "change the colors to modern orange." The app's entire accent color is a single Tailwind `brand-*` scale defined once in `src/index.css` (currently a blue extracted from cvwonder.fr, `--color-brand-500: #3578e5`) and consumed by class name across ~10 components (buttons, sliders, nav, YAML preview highlighting, theme toggle, etc.). Swapping the scale's values is enough to re-theme the whole app to orange without touching component code.

## What Changes

- Replace the 8 `--color-brand-*` custom properties in `src/index.css` (`50, 100, 300, 400, 500, 600, 700, 950`) with a modern orange scale, keeping the same step names so every existing `brand-*` Tailwind class (`bg-brand-500`, `text-brand-600`, `border-brand-300`, etc.) keeps working unchanged.
- Update the CSS comment above the `@theme` block, which currently documents the blue scale's provenance (cvwonder.fr brand blue), to describe the new orange scale instead.
- No component files change — this is a token-value-only swap because every consumer already goes through the semantic `brand-*` scale rather than hardcoded hex values.

## Capabilities

### Modified Capabilities
- `app-theme`: the light/dark theme mechanics (`spec.md`) are unaffected — only the underlying accent hue changes, not the theming behavior. No spec deltas needed.

## Impact

- **Affected file**: `src/index.css` only (the `@theme` custom property block and its preceding comment).
- **No behavior change**: light/dark mode switching, persistence, and every component's structure/logic stay identical; only the rendered accent hue changes app-wide (buttons, sliders, links, focus rings, section nav, YAML syntax highlighting accents, theme toggle icon).
- **Visual regression risk**: contrast pairs (e.g. `brand-500` text/background combos used for readability) should be spot-checked after the swap since orange has different luminance characteristics than the current blue at the same scale position.
