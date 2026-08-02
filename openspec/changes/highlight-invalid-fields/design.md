## Context

See proposal.md - Why. `TextField`, `NumberField`, and `PrimitiveArrayField`'s textarea all currently share a single fixed `textInputClass` string (`src/components/form/fields/inputStyles.ts`) regardless of validation state; each already receives an `errors?: ValidationIssue[]` prop (from `FieldNode`, sourced from `useCvValidation().errorsByPath`) that it currently only forwards to `FieldWrapper` for the error text, never uses on its own input element. There is no per-field touched/dirty state - error visibility is already gated only at the section level (`resolveSectionStatus`). The glow reuses that exact same `errors` prop and condition, so it appears and disappears in lockstep with the existing error text, with no new state.

## Goals / Non-Goals

**Goals:**
- Make an invalid field's own input box visibly distinct (a soft colored glow), not just the text below it.
- Keep the three call sites' error condition identical to what already drives their error text (`errors?.length` truthy) - no new gating logic.
- Keep light/dark parity consistent with the rest of `inputStyles.ts`.

**Non-Goals:**
- Animation/pulsing - a static glow is sufficient and avoids motion-sensitivity concerns; not addressed here.
- `SliderField`, `ObjectGroup`, `RepeatableObjectList` - none of them render a single leaf text-style input via `textInputClass`, so they're out of scope for this change.
- Changing what counts as an error, or when a section is "touched" - unchanged.

## Decisions

**Glow rendering: blurred `box-shadow`, not the `ring` utility.**
Tailwind's `ring-*` utilities render a crisp, uniform-width outline with no blur - visually a hard-edged frame, not a "halo". A halo/glow reads as soft and diffused, which requires an actual blurred box-shadow (non-zero blur radius, zero spread), e.g. `shadow-[0_0_10px_rgba(239,68,68,0.45)]`, paired with a red border for definition. The existing `focus:ring-*` pattern is left alone for the non-error case.

**Error-state class as a small helper, not three duplicated conditionals.**
Add a function (e.g. `textInputClass(hasError: boolean)`) in `inputStyles.ts` that returns the right composed class string, instead of exporting a second static string and making each of the three call sites concatenate/override classes themselves. Considered pulling in `clsx`/`cva` for class composition, but rejected - the project has no such dependency today and a single boolean branch doesn't warrant adding one.

**Invalid focus ring switches to red.**
When a field is invalid, its `focus:` ring/border color changes from `brand` to `red` so focus and error reinforce each other instead of a blue ring sitting on top of a red glow. The glow itself is not a pseudo-class, so it stays visible regardless of focus.

**Dark mode gets its own, less saturated glow.**
Following the existing `dark:` variant pattern already used throughout `inputStyles.ts`, dark mode uses a dimmer/lower-opacity red (e.g. `red-400` at lower alpha) so the glow doesn't overwhelm the dark background.

## Risks / Trade-offs

- [A freshly loaded form with a touched-but-incomplete section could show several glowing fields at once] → Mitigation: this is the same visibility condition the error text already uses today (shipped, accepted UX); the glow adds no new noise beyond what's already surfaced.
- [Colored glow could read as low-contrast or muddy against varying backgrounds/themes] → Mitigation: pair the glow with a solid red border (not glow alone) so the signal doesn't depend on shadow rendering alone; verify visually in both themes before merging.
- [Glow is a purely visual/decorative signal] → Mitigation: it is strictly additive to the existing text-based error message, which remains the authoritative, non-color-dependent indicator - nothing relies on the glow alone.

## Migration Plan

Purely additive presentational change (a CSS class swap on three components) - no data migration, no feature flag needed. Revert by reverting the `inputStyles.ts` and three field-component changes.
