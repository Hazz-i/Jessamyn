# Jessamyn

## Project summary

Jessamyn is a fullstack web application using Laravel for the backend and Inertia + React (TypeScript) for the frontend. The project uses Tailwind CSS for styling and Vite as the frontend bundler. It is built as an example product/information platform (e.g. agricultural products) with a protected dashboard (auth) and public pages such as a landing page, products listing, and a 404 page.

## Main tech stack

- Backend: PHP 8.x, Laravel
- Frontend: React + TypeScript via Inertia.js
- Styling: Tailwind CSS
- Bundler: Vite
- Database: MySQL / MariaDB (Postgres supported with configuration changes)
- Package managers: npm / pnpm / yarn

## Requirements (Windows)

- PHP >= 8.1 with common extensions (pdo, mbstring, openssl, tokenizer, xml, ctype, json)
- Composer (PHP dependency manager)
- Node.js >= 16 and npm (or pnpm/yarn)
- MySQL / MariaDB (or another DB supported by Laravel)
- Git (optional)

## Installation (PowerShell on Windows)

1. Clone the repository

```powershell
cd C:\path\to\projects
git clone <repo-url> jasmine
cd jasmine
```

2. Install PHP dependencies (Composer)

```powershell
composer install --optimize-autoloader --no-interaction
```

3. Copy the environment file and configure

```powershell
copy .env.example .env
# Edit .env and set DB_DATABASE, DB_USERNAME, DB_PASSWORD, APP_URL, etc.
```

4. Generate the application key

```powershell
php artisan key:generate
```

5. Create the database and run migrations + seeders

Make sure your DB connection settings in `.env` are correct.

```powershell
php artisan migrate --seed
```

If you want to reset and seed during development:

```powershell
php artisan migrate:refresh --seed
```

6. Install frontend dependencies

```powershell
npm install
# or pnpm install, yarn
```

7. Run the frontend dev server (Vite) or build assets

Development (hot reload):

```powershell
npm run dev
```

Production build:

```powershell
npm run build
```

8. Run the Laravel application

```powershell
php artisan serve --host=127.0.0.1 --port=8000
# Open http://127.0.0.1:8000
```

Notes: If you use Valet for Windows, Docker, or another environment manager, adapt the commands accordingly.

## Important files & structure

- `resources/js/pages` — Inertia/React pages (e.g. `welcome.tsx`, `404.tsx`, `Dashboard/*`)
- `resources/js/layouts` — UI layouts (e.g. `auth-simple-layout.tsx`)
- `app/Http/Controllers` — Laravel controllers (e.g. `ProductController`)
- `routes/web.php` — Web routes (public and protected)
- `database/migrations` — Database migrations

## Running tests

If the project includes tests (Pest / PHPUnit):

```powershell
./vendor/bin/pest
# or
php artisan test
```

## Quick troubleshooting

- Composer errors: run `composer diagnose` and verify your PHP version and extensions.
- Vite/Node errors: try removing `node_modules` and running `npm install` again.
- Storage / uploads: run `php artisan storage:link` and ensure `storage` folders are writable.
- Inertia pages not rendering: check the browser console for JS errors and the Vite terminal for build errors.

## Next steps / recommended improvements

- Create an Inertia page at `resources/js/pages/Dashboard/Products/Create` (route already added in `routes/web.php`).
- Add `ProductController` with a `store` method if not present to handle product creation.
- Add server-side and client-side validation, image uploads, and optionally a media library (e.g. spatie/laravel-medialibrary).

## Need help?

I can assist with the following if you want:

- Scaffolding a basic `ProductController` and `store` method.
- Creating the Inertia form page `resources/js/pages/Dashboard/Products/Create.tsx`.
- Running a quick environment check if you paste terminal error output.

---

This README focuses on setup for Windows (PowerShell). For macOS / Linux or Docker, replace PowerShell commands with the equivalent shell commands.
