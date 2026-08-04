## 1. Configuration

- [x] 1.1 Add `base: './'` to the `defineConfig` call in `vite.config.ts`

## 2. Verification

- [x] 2.1 Run `npm run build` and confirm `dist/index.html` references assets as `./assets/...` (relative), not `/assets/...`
- [x] 2.2 Serve `dist/` from a non-root path locally (e.g. `npx serve dist` under a sub-folder, or open `dist/index.html` directly via `file://`) and confirm the app loads with no 404s for CSS/JS
- [x] 2.3 Run `npm run dev` and confirm the dev server still serves the app correctly at `/`
