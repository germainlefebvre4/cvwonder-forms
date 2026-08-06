## 1. Update the grid layout

- [x] 1.1 In `src/App.tsx`, update the `<main>` grid template: swap the form column to `minmax(0,42rem)` and the YAML preview column to `minmax(20rem,1fr)` for both `lg:` and `2xl:` breakpoints.
- [x] 1.2 In `src/App.tsx`, remove `max-w-[100rem]` from `<main>` (keep `mx-auto` only if still needed for centering fixed-width content below `lg:`; otherwise remove it too).

## 2. Verify against spec scenarios

- [x] 2.1 Verify at `1280px` viewport width: nav, form, and YAML preview render side by side with no horizontal scrollbar.
- [x] 2.2 Verify at `2560px` viewport width: form and nav widths are unchanged from `1280px`, and the YAML preview column has visibly grown to fill the extra space, still with no horizontal scrollbar.
- [x] 2.3 Verify narrowing toward `1024px`: the YAML preview column does not shrink below its `20rem` floor and the layout does not overflow.
- [x] 2.4 Verify below `1024px`: layout still stacks to a single column as before (unaffected by this change).
- [x] 2.5 Spot-check the `2xl` breakpoint (`1536px`+) nav width switch still behaves as before (unaffected by this change).
