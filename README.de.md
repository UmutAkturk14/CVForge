# CVForge
Eine Laravel‑12‑ und Inertia‑React‑Anwendung zum Erstellen von Lebensläufen und Anschreiben mit wiederverwendbaren Abschnitten, klassischen/modernen Vorlagen und schnellen Exporten.

## Vision
- Erstellung von Lebensläufen mit geführten Abschnitten (Berufserfahrung, Ausbildung, Fähigkeiten, Projekte, Links).
- Mehrere Tailwind‑Themes mit Radix‑UI‑Bausteinen und wiederverwendbaren Layout‑Primitiven.
- Duplizieren/Versionieren für rollenbezogene Varianten.
- Exporte (druckfreundlich, PDF‑bereit), teilbare Links und Lokalisierung.
- Responsiver, zugänglicher und performanter Editor für Desktop und Mobile.

## Tech Stack
- Backend: PHP 8.4, Laravel 12, Inertia Laravel v2, Fortify für Auth, Wayfinder für typisierte Routes.
- Frontend: React 19 mit TypeScript, Inertia React v2, Tailwind CSS v4, Radix UI, Vite 7.
- Tooling: PHPUnit 11, ESLint 9, Prettier 3, Laravel Pint, TypeScript 5.
- Datenbank: MySQL (Eloquent‑first Design mit Beziehungen).
- Dev/Runtime: Laravel Sail (Docker), Vite‑Devserver.

## Kernmodule
- Datenmodell für Resume‑ und Anschreiben‑Inhalte (JSON) mit typisierten Abschnitten.
- Classic‑ und Modern‑Vorlagen für Resume und Anschreiben (Preview + PDF‑Export).
- Geführter Editor mit Validierung und Duplizieren per Inertia.
- Export‑Layer via Browsershot (HTML → PDF) mit Print‑Styling.
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

## Roadmap (initial)
- Sharing‑Controls (private, view‑only Link) und Versionshistorie.
- Lokalisierung und zeitzonenbewusste Datumsdarstellung.
