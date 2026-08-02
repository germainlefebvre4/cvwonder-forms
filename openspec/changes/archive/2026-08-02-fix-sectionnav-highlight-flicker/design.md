## Context

`SectionNav` (`src/components/layout/SectionNav.tsx`) tracks `activeKey` as a single piece of `useState`, written from two independent places:
- `scrollToSection` sets it immediately to the clicked section, then calls `scrollIntoView({ behavior: 'smooth' })`.
- A `scroll` listener recomputes it every animation frame from the live scroll position (`updateActive`), regardless of whether the current scroll is user-driven or the result of that `scrollIntoView` call.

During the ~300-500ms smooth-scroll animation, `updateActive` keeps firing and briefly reports the previous section as active (since the clicked section's element hasn't crossed the `TRIGGER_OFFSET` line yet), producing a visible flicker before it settles back on the clicked section. See proposal.md for the full mechanism and why it's most visible between adjacent sections.

## Goals / Non-Goals

**Goals:**
- Eliminate the flicker for click-triggered navigation without changing free-scroll (scroll-spy) behavior at all.
- Keep the fix local to `SectionNav.tsx` - no new dependencies, no changes to how sections are rendered or identified.
- Preserve responsiveness to manual scrolling: if the user grabs the scroll during a click-triggered animation, scroll-spy must resume immediately.

**Non-Goals:**
- Changing `TRIGGER_OFFSET` or the "last section whose top crossed the line" selection logic itself - that part isn't broken.
- Adding a generic scroll-animation library or replacing `scrollIntoView`.

## Decisions

**Use a `scrollend`-based lock, with a rAF-driven fallback for browsers without it.**

Introduce a ref (e.g. `isProgrammaticScroll`) that is set to `true` right before `scrollIntoView` is called and cleared when the scroll is considered finished. While it's `true`, `onScroll`'s handler skips calling `updateActive` entirely - `activeKey` stays whatever `scrollToSection` set it to.

Detecting "finished" needs two considerations:
- `scrollend` fires for both programmatic and user-driven scrolls. That's fine here: we only care about clearing the lock, and a manual scroll firing `scrollend` just clears it a bit earlier than a natural animation end would - not a problem since a manual scroll already needs to clear the lock.
- A manual scroll (wheel/touch) *during* the animation must clear the lock immediately, not wait for `scrollend`, so scroll-spy resumes without a stale delay. This is handled by listening for `wheel`/`touchmove` (or, more simply, treating a large-enough jump in scroll delta between two `scroll` events as "this isn't the smooth-scroll animation anymore") - see alternatives below for why this project picks the simpler option.

Chosen approach: register a one-shot `scrollend` listener alongside the existing `scroll` listener. `scrollend` has been supported in all evergreen browsers (Chrome/Edge/Firefox since 2023, Safari 17.4+) long enough that this project's supported-browser bar doesn't need a fallback; if it's ever missing, `onScroll` simply keeps skipping `updateActive` until the tab is next scrolled by other means, which degrades to "highlight freezes on the clicked item" rather than flickering - an acceptable fallback failure mode, not a broken one.

Manual-scroll-interrupts-lock is handled for free: a manual scroll during the animation also fires `scroll` events and will itself trigger `scrollend` once it settles, clearing the lock and letting `updateActive` run again on the very next `scroll` event after that. No separate `wheel`/`touchmove` listener is needed.

**Alternatives considered:**
- *Fixed timeout (e.g. 500ms)* - simplest, but arbitrary: too short cuts off slower animations (long pages, reduced-performance devices), too long ignores a real manual scroll the user made right after. Rejected in favor of `scrollend`, which is exact.
- *Frame-to-frame position stabilization* (compare `scrollTop` across two rAF frames, consider "done" once it stops changing for N frames) - robust and needs no new browser API, but reimplements what `scrollend` already gives natively, with extra code. Rejected as more complex than the currently-supported `scrollend` for equivalent behavior.

## Risks / Trade-offs

- **[Risk]** `scrollend` support gap in older/uncommon browsers → the fix's fallback is "highlight stops updating until the current animation's implicit lock is cleared by any further scroll", not a crash or worse flicker - acceptable given the spec-relevant scenarios (see specs/form-section-navigation) are unaffected on supported browsers.
- **[Risk]** If a user clicks a second nav item while the first click's animation is still running, the new click must re-arm the lock and highlight the new target, not get stuck on the first. Mitigation: `scrollToSection` always re-sets `activeKey` and re-registers the `scrollend` handling on every call, so a fresh click always wins regardless of an in-flight previous one.
