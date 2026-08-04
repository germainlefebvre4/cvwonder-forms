## 1. Palette Swap

- [ ] 1.1 In `src/index.css`, replace the 8 `--color-brand-*` hex values with the orange scale from design.md's mapping table, keeping the same step names
- [ ] 1.2 Update the comment above the `@theme` block to describe the new orange scale instead of the old cvwonder.fr blue provenance

## 2. Verification

- [ ] 2.1 Run the app locally (`npm run dev`) and visually check buttons, sliders, section nav, and the theme toggle in light mode
- [ ] 2.2 Repeat the check in dark mode (`data-theme="dark"`)
- [ ] 2.3 Check the YAML preview syntax highlighting (`yamlHighlight.ts` usage) for legibility against both light and dark preview backgrounds
- [ ] 2.4 Spot-check text/background contrast pairs that use `brand-500`/`brand-950`/`brand-50` together (e.g. `LanguageSwitch.tsx`, `YamlPreview.tsx`) for readability
