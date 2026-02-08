# CVForge
A Laravel 12 + Inertia React application for crafting polished resumes and cover letters with reusable sections, classic/modern templates, and fast exports.

Readme in German: [README.de.md](README.de.md)

## Vision
- Streamline CV and resume creation with guided sections (experience, education, skills, projects, links).
- Offer multiple Tailwind-powered themes with Radix UI building blocks and reusable layout primitives.
- Support duplication/versioning so users can keep tailored resumes per role.
- Deliver exports (print-friendly web, PDF-ready), shareable links, and localized content where needed.
- Keep the editor responsive, accessible, and performant on both desktop and mobile.

## Tech Stack
- Backend: PHP 8.4, Laravel 12, Inertia Laravel v2, Fortify for auth, Wayfinder for typed routes.
- Frontend: React 19 with TypeScript, Inertia React v2, Tailwind CSS v4, Radix UI components, Vite 7.
- Tooling: PHPUnit 11 for tests, ESLint 9, Prettier 3, Laravel Pint, TypeScript 5.
- Database: MySQL (Eloquent-first design with relationships).
- Dev/runtime: Laravel Sail (Docker), Vite dev server.

## Core Modules
- Profile data model for resume and cover-letter content (JSON) with typed sections.
- Classic + modern templates for both resume and cover letter (preview + PDF export).
- Guided section editor with validation and duplication via Inertia.
- Export layer using Browsershot (HTML → PDF) with print styling.
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

## Roadmap (initial)
- Sharing controls (private, view-only link) and audit history/versioning.
- Localization and timezone-aware date rendering.
