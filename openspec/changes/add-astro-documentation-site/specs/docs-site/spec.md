## Purpose

Provides a bilingual (English/French), Starlight-based user guide for CV Wonder Forms so that users can learn how to build their CV without relying on trial and error in the app itself.

## ADDED Requirements

### Requirement: User Guide Topic Coverage
The documentation site SHALL provide a page for each of the following user guide topics: introduction, getting started, creating a CV (personal information, education, experience, skills, projects), live preview, schema validation, export/import, themes and languages, and FAQ.

#### Scenario: Browsing the sidebar navigation
- **WHEN** a user opens the documentation site
- **THEN** the sidebar navigation lists a distinct page for every topic above, organized under clear sections

### Requirement: Bilingual Content Parity
The documentation SHALL be available in English and French, with every page that exists in one locale also existing in the other.

#### Scenario: Switching from English to French
- **WHEN** a user switches the site's language from English to French
- **THEN** the user lands on the French version of the page they were reading, not a 404 or the site's home page

#### Scenario: A new page is added in one locale
- **WHEN** a new user guide page is published in English
- **THEN** the corresponding French page SHALL be published as part of the same change, not left as a placeholder or missing page

### Requirement: Visual Consistency with the Application
The documentation site SHALL use the same accent and neutral color palette as the CV Wonder Forms application, and SHALL support light and dark mode matching the application's appearance in each mode.

#### Scenario: Viewing the site in dark mode
- **WHEN** a user switches the documentation site to dark mode
- **THEN** the site's background, text, and accent colors SHALL match the neutral/violet dark-mode palette used by the CV Wonder Forms application, rather than Starlight's default theme colors

### Requirement: Independent Build
The documentation site SHALL build, run, and be versioned as a project independent from the CV Wonder Forms application, without requiring changes to the application's build configuration or scripts.

#### Scenario: Building the documentation site
- **WHEN** the documentation site's build command is run from within its own project directory
- **THEN** the build SHALL succeed without invoking, modifying, or depending on the application's `package.json` scripts or `vite.config.ts`
