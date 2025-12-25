# CVForge
A Laravel 12 + Inertia React application for crafting polished CVs and resumes with reusable sections, modern templates, and fast exports.

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
- Database: MySQL (Eloquent-first design with relationships and factories).

## Core Modules
- Profile data model for personal info, experience, education, skills, achievements, and links.
- Template system to render multiple resume layouts using shared section components.
- Section editor with validation, ordering, and duplication; autosave-friendly data flows via Inertia.
- Export layer for PDF-ready rendering and print styling.
- Account and access controls built on Laravel authentication and policies.

## Development Notes
- Backend follows Laravel conventions: Form Requests for validation, Eloquent relationships, policies for authorization.
- Frontend uses Inertia pages under `resources/js/Pages`, with typed routes from Wayfinder and Tailwind v4 theming.
- Formatting and linting: Laravel Pint for PHP, ESLint/Prettier for React/TypeScript, and `tsc --noEmit` for types.
- Tests: prefer focused PHPUnit feature tests per area (auth, profile data, template rendering, exports).

## Roadmap (initial)
- MVP editor with live preview and structured sections.
- Theme library with switchable layouts and typography presets.
- Export to print/PDF with consistent spacing and typography scales.
- Sharing controls (private, view-only link) and audit history/versioning.
- Localization and timezone-aware date rendering.
