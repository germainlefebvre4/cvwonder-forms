## Why

Clicking a section in the left navigation menu briefly highlights the wrong item before settling on the clicked section: the scroll-spy listener recomputes the active section from the live scroll position on every animation frame of the smooth-scroll, and during the short window before the target section crosses the trigger line it reports the previous (or another) section as active. This is most visible between adjacent sections, where that window is proportionally large relative to the whole scroll animation.

## What Changes

- The navigation's scroll-spy no longer overrides the active section while a click-triggered scroll animation is in flight; the clicked section stays highlighted for the full duration of that animation.
- If the user scrolls manually while a click-triggered animation is still running, the scroll-spy regains control immediately and highlights based on the real scroll position again.
- No change to free-scroll behavior: manually scrolling the form (not preceded by a nav click) continues to update the highlight exactly as it does today.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `form-section-navigation`: "Navigation highlights the section currently in view" gains an exception for the duration of a click-triggered scroll: the clicked item stays active until the scroll finishes or the user scrolls manually, instead of tracking the live scroll position on every frame.

## Impact

- `src/components/layout/SectionNav.tsx`: scroll-spy effect (`updateActive`, `onScroll`) and `scrollToSection` need to coordinate via a "navigating" state instead of writing to `activeKey` independently.
- No API, schema, or dependency changes. No other components consume `SectionNav`'s internal active-section state.
