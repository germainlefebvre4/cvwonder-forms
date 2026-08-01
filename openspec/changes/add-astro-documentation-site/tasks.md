## 1. Project Setup

- [ ] 1.1 Scaffold a new Astro project with the Starlight integration under `docs/` as its own npm project (own `package.json`, `astro.config.mjs`), independent from the root app's Vite project
- [ ] 1.2 Configure Starlight's i18n routing with `en` as the root/default locale and `fr` as the additional locale
- [ ] 1.3 Update the root `.gitignore` to exclude `docs/node_modules` and `docs/dist`
- [ ] 1.4 Document how to install/run/build the docs project independently (e.g. `docs/README.md` or a section in the root README)

## 2. Theming

- [ ] 2.1 Identify the app's palette values from `src/index.css` and component usage: `violet-600` accent, `neutral-*` grayscale for surfaces/text, `red-*`/`emerald-*` status colors, and the light/dark mode split
- [ ] 2.2 Add a custom CSS file overriding Starlight's `--sl-color-*` custom properties for light mode to match the app's light palette
- [ ] 2.3 Override the same custom properties for dark mode to match the app's dark palette
- [ ] 2.4 Verify the site renders correctly in both light and dark mode via Starlight's built-in theme toggle

## 3. Content Structure & Navigation

- [ ] 3.1 Define the Starlight sidebar configuration covering: Introduction, Getting Started, Creating Your CV (Personal Information, Education, Experience, Skills, Projects), Live Preview, Validation, Export/Import, Themes & Languages, FAQ
- [ ] 3.2 Create the content collection folder structure (`src/content/docs/en/`, `src/content/docs/fr/`) mirroring the sidebar

## 4. English Content

- [ ] 4.1 Write the Introduction page (en)
- [ ] 4.2 Write the Getting Started page (en)
- [ ] 4.3 Write the Creating Your CV pages: personal information, education, experience, skills, projects (en)
- [ ] 4.4 Write the Live Preview page (en)
- [ ] 4.5 Write the Validation page (en)
- [ ] 4.6 Write the Export/Import page (en)
- [ ] 4.7 Write the Themes & Languages page (en)
- [ ] 4.8 Write the FAQ page (en)

## 5. French Content

- [ ] 5.1 Write the Introduction page (fr)
- [ ] 5.2 Write the Getting Started page (fr)
- [ ] 5.3 Write the Creating Your CV pages: personal information, education, experience, skills, projects (fr)
- [ ] 5.4 Write the Live Preview page (fr)
- [ ] 5.5 Write the Validation page (fr)
- [ ] 5.6 Write the Export/Import page (fr)
- [ ] 5.7 Write the Themes & Languages page (fr)
- [ ] 5.8 Write the FAQ page (fr)

## 6. Verification

- [ ] 6.1 Run the docs project's build standalone and confirm it succeeds without invoking or depending on the root app's `package.json` scripts or `vite.config.ts`
- [ ] 6.2 Check every sidebar entry resolves to a real page in both locales, with no missing or placeholder pages
- [ ] 6.3 Verify light/dark mode rendering matches the app's palette on a representative page
