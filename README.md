# CVForge
A Laravel 12 + Inertia React application for crafting polished resumes and cover letters with reusable sections, classic/modern templates, and fast exports.

Readme in German: [README.de.md](README.de.md)

## Overview
- Guided editor for resumes and cover letters with reusable sections.
- Classic + modern templates for both document types (preview + PDF export).
- Inertia-driven UI with typed routes (Wayfinder) and Tailwind v4 styling.

## Tech Stack
- Backend: PHP 8.4, Laravel 12, Inertia Laravel v2, Fortify for auth, Wayfinder for typed routes.
- Frontend: React 19 with TypeScript, Inertia React v2, Tailwind CSS v4, Radix UI components, Vite 7.
- Tooling: PHPUnit 11 for tests, ESLint 9, Prettier 3, Laravel Pint, TypeScript 5.
- Database: MySQL (Eloquent-first design with relationships).
- Dev/runtime: Laravel Sail (Docker), Vite dev server.

## Core Modules
- JSON content model for resume and cover-letter sections.
- Classic + modern templates for preview and PDF export.
- Guided section editor with validation via Inertia.
- Export layer using Browsershot (HTML → PDF).
- Account and access controls built on Laravel authentication and policies.

## Development Notes
- Backend follows Laravel conventions: Form Requests for validation, Eloquent relationships, policies for authorization.
- Frontend uses Inertia pages under `resources/js/pages`, with typed routes from Wayfinder and Tailwind v4 theming.
- Formatting and linting: Laravel Pint for PHP, ESLint/Prettier for React/TypeScript, and `tsc --noEmit` for types.
- Tests: focused PHPUnit feature tests per area (auth, documents, exports).

## Local Development (Sail + MySQL)
1. Start containers:
   - `./vendor/bin/sail up -d`
2. Run migrations:
   - `./vendor/bin/sail artisan migrate`
3. Start Vite:
   - `./vendor/bin/sail npm run dev`

The app is served on `http://localhost` by default.

## Export Notes
PDF export uses Browsershot + Puppeteer. The Sail runtime installs Google Chrome and sets:
- `PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable`
- `PUPPETEER_SKIP_DOWNLOAD=1`

## Status
- No public sharing links or version history yet.
- Localization is limited to a few cover-letter labels; resumes are not localized.
