# AGENTS.md

## Objective

This project aims to facilitate the writing of CV Wonder YAML files by human.

CV Wonder repository is located at https://github.com/germainlefebvre4/cvwonder.

The YAML schema for CV Wonder is vendored under `schemas/`, at a specific `cvwonder` Git tag rather than tracking `main`. `schemas/active-version.json` names the active version (e.g. `v0.10.1`), and `src/schema/activeSchema.ts` resolves it to the matching `schemas/cvwonder.<version>.json` file, consumed by both form rendering and validation. To pull a newer `cvwonder` release, run `npm run schema:update -- <tag>` (e.g. `npm run schema:update -- v0.10.2`), which fetches that tag's `schema.json` from `https://raw.githubusercontent.com/germainlefebvre4/cvwonder/refs/tags/<tag>/internal/validator/schema.json`, vendors it, and updates the active version — do not edit `schemas/*.json` or `active-version.json` by hand.

## Features

* Form based interface to create CV Wonder YAML files.

## Details

* Form based interface to create CV Wonder YAML files.
* Real-time preview of the YAML file.
* Validation of the YAML files against the CV Wonder schema.
* Export of the YAML file to save on disk.
* Import of existing YAML files for editing.
* Full client-side rendering, no server-side processing required.
* The application is designed to be a single-page application (SPA) with a responsive layout.
* The form is divided into sections corresponding to the different parts of a CV, such as personal information, education, work experience, skills, and projects.
* The form fields are dynamically generated based on the CV Wonder schema, allowing for easy updates and modifications.
* The real-time preview of the YAML file is displayed alongside the form, allowing users to see the changes they make in real-time.

### Design

* Modern and clean design with a focus on usability and accessibility.
* Responsive layout that adapts to different screen sizes and devices.
* Light color scheme with a white background and black text for readability.
* Light and dark mode options for user preference.
* Internalization support for multiple languages, with English as the default language.

## Technologies

### Frontend

* React for the front-end.
* Vite for the build tool and development server.
* Radix UI for the UI components.
* Tailwind CSS for styling and layout.

### Data Format

* YAML for the data format.

## Appendix

### Spoken Languages

English is the main language.

Everything is written in English:

* Code
* Documentation
* User interface
