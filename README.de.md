# CVForge
Eine Laravel‑12‑ und Inertia‑React‑Anwendung zum Erstellen von Lebensläufen und Anschreiben mit wiederverwendbaren Abschnitten, klassischen/modernen Vorlagen und schnellen Exporten.

## Überblick
- Geführter Editor für Lebensläufe und Anschreiben mit wiederverwendbaren Abschnitten.
- Classic‑ und Modern‑Vorlagen für beide Dokumenttypen (Preview + PDF‑Export).
- Inertia‑UI mit typisierten Routes (Wayfinder) und Tailwind v4.

## Tech Stack
- Backend: PHP 8.4, Laravel 12, Inertia Laravel v2, Fortify für Auth, Wayfinder für typisierte Routes.
- Frontend: React 19 mit TypeScript, Inertia React v2, Tailwind CSS v4, Radix UI, Vite 7.
- Tooling: PHPUnit 11, ESLint 9, Prettier 3, Laravel Pint, TypeScript 5.
- Datenbank: MySQL (Eloquent‑first Design mit Beziehungen).
- Dev/Runtime: Laravel Sail (Docker), Vite‑Devserver.

## Kernmodule
- JSON‑Datenmodell für Resume‑ und Anschreiben‑Abschnitte.
- Classic‑ und Modern‑Vorlagen für Preview und PDF‑Export.
- Geführter Editor mit Validierung via Inertia.
- Export‑Layer via Browsershot (HTML → PDF).
- Zugriffskontrolle über Laravel‑Auth und Policies.

## Entwicklung (Sail + MySQL)
1. Container starten:
   - `./vendor/bin/sail up -d`
2. Migrationen ausführen:
   - `./vendor/bin/sail artisan migrate`
3. Vite starten:
   - `./vendor/bin/sail npm run dev`

Die App läuft standardmäßig unter `http://localhost`.

## Export‑Hinweis
PDF‑Export verwendet Browsershot + Puppeteer. Die Sail‑Runtime installiert Google Chrome und setzt:
- `PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable`
- `PUPPETEER_SKIP_DOWNLOAD=1`

## Status
- Keine öffentlichen Sharing‑Links oder Versionshistorie.
- Lokalisierung ist auf wenige Anschreiben‑Labels begrenzt; Resumes sind nicht lokalisiert.
