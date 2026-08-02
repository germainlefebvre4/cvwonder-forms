## 1. Lock scroll-spy during click-triggered scroll

- [x] 1.1 Add an `isProgrammaticScroll` ref to `SectionNav`, set to `true` at the start of `scrollToSection` (before calling `scrollIntoView`)
- [x] 1.2 In the `onScroll` handler, skip calling `updateActive` entirely while `isProgrammaticScroll.current` is `true`
- [x] 1.3 Register a one-shot `scrollend` listener (on the scrolling element/window, matching how `scroll`/`resize` are currently attached) each time `scrollToSection` runs, which clears `isProgrammaticScroll` and clean up any previous pending listener before attaching a new one so a second click while the first animation is still running re-arms correctly
- [x] 1.4 Ensure the effect's cleanup function also removes the `scrollend` listener alongside the existing `scroll`/`resize` listeners

## 2. Verify behavior

- [x] 2.1 Manually verify: clicking between adjacent sections no longer flickers back to the previous section's highlight before settling
- [x] 2.2 Manually verify: clicking a section, then scrolling manually before the animation finishes, immediately hands control back to scroll-spy (highlight follows the manual scroll position)
- [x] 2.3 Manually verify: free scrolling (no prior nav click) is unaffected - highlight still updates on every scroll as before
- [x] 2.4 Manually verify: clicking a second nav item while the first click's scroll animation is still in progress highlights the second (most recently clicked) item, not the first
