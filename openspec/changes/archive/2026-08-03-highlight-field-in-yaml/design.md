## Context

See proposal.md for motivation. Relevant current state:

- `documentSections` (one entry per top-level schema property) drives both `SchemaFormRenderer` (renders one `<section id="cv-section-<key>">` card per section) and `SectionNav` - the only place today that tracks anything like an "active" UI selection tied to a schema path, and only at section granularity.
- Every field in the form is rendered by `FieldNode` (`src/components/form/FieldNode.tsx`), which receives a `path: Path` (array of keys/indices) for every node in the schema tree - scalar leaves and containers alike - and dispatches to `TextField` / `NumberField` / `SliderField` / `ObjectGroup` / `RepeatableObjectList` / `PrimitiveArrayField`. `path` is already available at every level with no plumbing needed to obtain it.
- Array items that are objects share their `path` with the item itself: `RepeatableObjectList` renders each item via `<FieldNode descriptor={descriptor.items} path={[...path, index]} hideLabel />`, and the resulting `ObjectGroup`'s root element carries that same path. So a single per-node hover/click hookup, applied uniformly wherever `FieldNode` dispatches, already covers scalar fields, object groups, and repeatable-list items without separate wiring per component type.
- `YamlPreview` (`src/components/preview/YamlPreview.tsx`) renders the output of `serializeToYaml` (`src/yaml/serialize.ts`, which calls `yaml`'s `stringify` on a pruned copy of the document) as one `<div>` per line, each run through `highlightYamlLine` for syntax coloring only. There is currently no mapping from a schema path to a line or range in that output.
- The `yaml` package (already a dependency, used for `stringify`) also exposes `parseDocument`, which returns a CST/AST with character-offset `range`s per node/pair - usable to compute exact line ranges without a second dependency.

## Goals / Non-Goals

**Goals:**
- Compute an exact path → line-range mapping for the currently rendered YAML text, correct even when the same key name repeats across array items (e.g. multiple `company` keys across `career` entries).
- Wire hover/click at a single integration point that works uniformly for scalar fields, object groups, and repeatable-list items, rather than duplicating logic per field component.
- Keep the two highlight states (transient hover, persistent click-selection) simple to reason about and free of visible flicker when the pointer moves between nested fields.

**Non-Goals:**
- Reverse direction (interacting with the YAML preview affecting the form) - explicitly out of scope per proposal.md.
- Distinguishing hover and click visually - both use the same background-color treatment (decided in proposal.md).
- Highlighting anything for a field that currently renders no YAML (covered by the "highlights nothing" requirement, not a design problem to solve further).

## Decisions

### Path → line-range mapping: walk the pruned document against the `yaml` AST

`serializeToYaml` currently does: prune the document, then `stringify(pruned)`. To get exact ranges, add a sibling function (e.g. `serializeToYamlWithRanges`) that:
1. Prunes the document (existing `pruneEmpty`, unchanged).
2. Calls `stringify(pruned)` to get `yamlText` (unchanged output, so no risk of regressing the existing preview rendering).
3. Calls `parseDocument(yamlText)` from the same `yaml` package to get an AST of that exact text.
4. Walks the pruned JS value and the AST's `contents` together, recursively, mirroring the shape (`YAMLMap` pairs ↔ object entries, `YAMLSeq` items ↔ array elements) to build a `Map<string, {startLine: number, endLine: number}>` keyed by the same dot/bracket path string already used elsewhere (`errorsByPath`, `path.join('.')`-style keys).
5. Converts each node's character-offset `range` to a 1-based line range using a small cumulative offset→line index built once from `yamlText` (same line-splitting `yamlText.split('\n')` already used by `YamlPreview`).

This walk only needs to handle the shapes the CV document actually produces (objects, arrays, scalars) - the same restricted shape `pruneEmpty` already assumes (no anchors, tags, or flow style), so it can be as simple as `pruneEmpty` itself.

**Alternative considered:** regex-scan the rendered text for `key:` lines (the approach that suffices for section-level granularity, since top-level keys are unique and always at column 0). Rejected for field-level granularity because repeated key names inside different array items (e.g. `company:` in every `career` entry) are indistinguishable by text pattern alone - only a real tree walk paired with the AST can tell which occurrence belongs to which path.

### Hover/click integration point: a shared hook keyed by path

Introduce a hook (e.g. `useFieldHighlight(path)`) that each field component (`TextField`, `NumberField`, `SliderField`, `ObjectGroup`, `RepeatableObjectList`, `PrimitiveArrayField`) calls once and spreads the returned `onMouseEnter` / `onMouseLeave` / `onClick` handlers onto its own existing root element - no additional wrapper `<div>` is introduced, avoiding any layout impact.

The hook reads/writes a small shared store (new, alongside the existing `store/` modules - e.g. `store/yamlHighlight.ts`) holding:
- `hoveredPath: string | null` - set on `onMouseEnter`, cleared on `onMouseLeave` (only if it still matches this field's path, to avoid a stale clear racing a newly-entered field).
- `selectedPath: string | null` - set on `onClick`, persists until a different field is clicked.

`YamlPreview` reads `hoveredPath ?? selectedPath` to decide which line range to highlight, and reads `selectedPath` alone to decide when to scroll (scrolling only happens on click, per proposal.md).

**Nested hover resolution:** native `mouseenter`/`mouseleave` do not bubble, so each nesting level's handler fires independently as the pointer physically crosses into that element's box. Moving into a deeply nested field crosses the outer box first, then the inner one, so `hoveredPath` is set to the outer path briefly before being overwritten by the inner (more specific) path - already resolving correctly to "the most specific field under the pointer" with no explicit priority logic needed. This mirrors how the existing `SectionNav` scroll-spy already reasons about competing state writes (see `fix-sectionnav-highlight-flicker`), just via event ordering instead of a scroll lock.

**Alternative considered:** wrap every `FieldNode` output in a single `<div>` carrying the handlers, at the `FieldNode` dispatch level, so only one file changes instead of six. Rejected: this adds an extra DOM node around every field in the tree (including deeply nested ones), which risks subtle layout shifts (flex/grid children gaining an extra wrapping level) for a codebase that currently has no such wrapper. Touching six field components to spread handlers onto their already-existing root elements is more code but zero layout risk.

### Visual treatment

Both hover and the persistent click-selection render the same highlighted-line background color (decided in proposal.md) - implemented as one CSS class applied to the `<div>` per line in `YamlPreview` whose line number falls within the resolved range, no separate "hover style" vs. "selected style" needed.

## Risks / Trade-offs

- **[Risk]** The AST walk in the new serialization helper must stay in sync with `pruneEmpty`'s notion of "empty" - if they ever diverge, a field could resolve to a range that doesn't exist (empty highlight) or crash on a missing map entry. Mitigation: both operate on the exact same pruned value in the same call, and the map lookup for a path with no entry simply means "nothing to highlight" (already a named requirement), not an error.
- **[Risk]** Six field components each need the same hook call wired onto possibly-different root element types (`<input>`, `<fieldset>`, etc.) - a missed spot silently means that one field type never highlights. Mitigation: this is a small, enumerable set of components (listed above), and can be checked by hovering one instance of each field kind during implementation.
- **[Trade-off]** Computing a full path → range map on every keystroke (the AST parse plus a tree walk) does more work than today's plain `stringify`. Given the document sizes this app deals with (a single person's CV, not a large dataset), this is expected to be well within a single frame; no lazy/memoized computation beyond the existing `useMemo` on the document value is planned unless profiling shows otherwise.
