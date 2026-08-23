# Cactus

This is the multilingual website and role-based application panel for Cactus Robotics School. It uses Next.js App Router, PostgreSQL, Drizzle ORM, server actions, and Docker deployment on Dokploy.

## Application areas

- `/`: Persian public landing page (`fa`, RTL)
- `/en`: English public landing page (`en`, LTR)
- `/blog` and `/en/blog`: published bilingual rich-text blog posts
- `/shop` and `/en/shop`: public multilingual product catalog
- `/login` and `/register`: mobile OTP login and member registration, with optional password login
- `/panel/admin`: protected administrator panel
- `/panel/admin/blog`: full blog CRUD, rich-text editing, and cover uploads
- `/panel/admin/products`: full product CRUD, inventory, rich-text descriptions, and image uploads
- `/panel/admin/media`: shared media-library CRUD, metadata, reusable URLs, and guarded deletion
- `/panel/admin/admins`: administrator account CRUD
- `/panel/admin/teachers`: teacher account CRUD
- `/panel/admin/students`: student account CRUD
- `/panel/admin/members`: regular member account CRUD
- `/panel/teacher`: protected teacher workspace
- `/panel/student`: protected student workspace
- `/panel/member`: protected regular member workspace
- `/panel/profile`: first-login profile completion, optional password, contact email, bilingual biography, and avatar upload

## Local development

Create a PostgreSQL database, copy the example environment file, and update `DATABASE_URL` and the initial admin credentials:

```bash
pnpm install
cp .env.example .env
pnpm db:setup
pnpm dev
```

To run the repository-managed PostgreSQL 18 data directory with automatic restart:

```bash
docker compose -f compose.local.yaml up -d postgres
```

The service binds only to `127.0.0.1:5432`, reuses `.data/postgres`, and uses `restart: unless-stopped`.

Open [http://localhost:3000](http://localhost:3000).

Useful database commands:

```bash
pnpm db:generate # generate a migration after changing lib/db/schema.ts
pnpm db:migrate  # apply pending migrations
pnpm db:setup    # migrate and bootstrap the initial admin
pnpm db:studio   # open Drizzle Studio
```

## Production build

```bash
pnpm build
pnpm start
```

## Language, direction, and typography

- Persian public, authentication, and panel documents use `lang="fa"` and `dir="rtl"`. English public pages use `lang="en"` and `dir="ltr"` at the document root.
- Vazirmatn is self-hosted through `next/font/local`; no font CDN is required at build time or runtime.
- Persian digit glyphs are enabled globally. Add `className="nums-en"` where Latin digit glyphs are required. Use `nums-fa` when an explicit local Persian-digit override improves clarity.
- Set both `lang` and `dir` on localized subtrees, for example `<section lang="en" dir="ltr">`.
- Use direction-safe CSS and Tailwind utilities: `text-start`/`text-end`, `ms-*`/`me-*`, `ps-*`/`pe-*`, `start-*`/`end-*`, and logical properties such as `margin-inline-start`. Avoid directional `left`/`right`, `ml-*`/`mr-*`, and `pl-*`/`pr-*` unless the design is intentionally physical rather than language-relative.

## Feature and form conventions

- Every new database-backed feature must install useful starter content once. A seed marker must prevent deleted starter content from being recreated after an administrator intentionally empties the feature.
- Forms backed by server actions must keep user-entered values after validation, uniqueness, or other recoverable errors. Use `usePreservedFields` from `components/forms/use-preserved-fields.ts` for text inputs, textareas, and selects.
- Blog and product bodies are stored as sanitized HTML and edited with the shared TipTap rich-text editor. Inline images, covers, product images, and avatars share one picker that supports instant upload, reuse from the media library, and validated HTTP(S) image links.
- Uploaded files are validated by size, declared MIME type, and file signature. Do not expose the upload directory through a generic static file server; the `/media/*` route serves validated paths with safe response headers.
- Administrators manage all stored uploads at `/panel/admin/media`. Deletion is blocked while an asset is referenced by a profile, post, product, or rich-text document.
- Physical upload filenames are opaque (`random UUID + upload timestamp + validated extension`). The separate media display name is user-editable and intentionally allows duplicates.
- Select indicators and other directional adornments must reserve logical inline space and use `start-*` or `end-*` positioning so they mirror correctly in RTL and LTR.
- Panel pages must compose the shared primitives in `components/panel/ui.tsx` and `components/panel/form-controls.tsx`. This keeps page headers, surfaces, tables, column alignment, buttons, form fields, and empty states consistent across every feature.
- Every managed feature must provide complete create, read/list, update, and delete flows unless its domain explicitly forbids an operation.
- Features added to teacher, student, or member workspaces must ship with corresponding admin CRUD controls. Administrators can move accounts between all four roles.
- User names are stored as separate Persian and English first and last names and rendered through `getLocalizedUserName`.
- Interactive controls and links use a pointer cursor; dropdowns close on selection, outside interaction, and Escape.

## Theme modes

The public website, login page, and every panel role expose the same theme selector with `system`, `light`, and `dark` modes. The choice is stored locally in the browser under `cactus-theme`; `system` continues to follow operating-system changes. The inline theme bootstrap applies the class before paint to avoid a light-theme flash.

## Deploy with Dokploy

This repository includes a multi-stage `Dockerfile` that produces a small, non-root standalone Next.js image.

> `compose.local.yaml` is only for the developer machine. In Dokploy, keep the application build type set to **Dockerfile**. Do not deploy the local Compose file and do not create a PostgreSQL container inside the application service.

### 1. Create PostgreSQL as a separate service

1. In the same Dokploy project and environment, create a **PostgreSQL Database** service named `cactus-postgres`, or reuse the existing PostgreSQL service for this application.
2. Choose a dedicated database name, user, and strong password, then deploy the database.
3. In the database **Connection** tab, copy its **Internal Connection URL**. Keep PostgreSQL private; the app does not require an external database port.
4. Configure database backups before production traffic.

### 2. Create the Next.js application

1. Create an **Application** and connect this Git repository.
2. Select the branch you want to deploy (for this version, `next`).
3. Set the build type to **Dockerfile**, the Dockerfile path to `Dockerfile`, and the Docker context path to `.`.
4. Leave **Docker Build Stage** empty so the final `runner` stage is used.
5. Add the domain with container/target port `3000`. You do not need to publish a host port when routing through a domain.

Add these application environment variables:

```dotenv
DATABASE_URL=<the PostgreSQL Internal Connection URL>
DATABASE_POOL_MAX=10
DATABASE_SSL=disable
RUN_MIGRATIONS=true
ADMIN_MOBILE=09121234567
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<a strong password with at least 8 characters>
ADMIN_NAME_FA=همکار کاکتوس
ADMIN_NAME_EN=Cactus Administrator
SMS_PROVIDER=kavenegar
KAVENEGAR_API_KEY=<server-only API key>
KAVENEGAR_VERIFY_TEMPLATE=<approved verification template name>
AUTH_OTP_SECRET=<a long random server-only secret>
SITE_URL=https://example.com
UPLOAD_DIR=/app/uploads
```

Set `SITE_URL` to the public HTTPS origin of the deployed site. It is used for canonical links, Open Graph metadata, `robots.txt`, and sitemap URLs.

In the application service, add a persistent Docker volume mounted at `/app/uploads`. Without this volume, uploaded blog covers, product images, rich-text images, and avatars will be lost when Dokploy replaces the container. A named volume works with the image's non-root user automatically; for a host bind mount, make the directory writable by UID/GID `1001`.

Deploy the application. The container applies committed Drizzle migrations before accepting traffic and creates the configured initial administrator only when no administrator account exists. If an administrator already exists, name, email, and password bootstrap values are ignored; `ADMIN_MOBILE` is used once only when that administrator still has a migration placeholder. After the first successful mobile login, you may remove the `ADMIN_*` bootstrap variables together; the existing account remains unchanged. `ADMIN_NAME` is still accepted as a legacy Persian-name fallback during upgrades.

Before the first deployment of the mobile-authentication upgrade, take a PostgreSQL backup and set `ADMIN_MOBILE` to the mobile number that should be assigned to the existing administrator. The migration preserves all existing users and data; legacy accounts receive temporary internal mobile placeholders until an administrator assigns their real numbers. Startup intentionally fails instead of deploying an administrator account that still has a placeholder mobile.

The readiness endpoint is `/api/health`. It returns a successful response only when the app can reach PostgreSQL.

> Keep one migration-enabled replica. If the application is later scaled horizontally, run migrations as a dedicated deployment job and set `RUN_MIGRATIONS=false` on normal replicas.

No custom start command is required; the image starts the standalone Next.js server on `0.0.0.0:3000`.

### Environment variables

Add server-only environment variables in Dokploy's environment settings. Variables prefixed with `NEXT_PUBLIC_` are compiled into the browser bundle. If you add one, declare a matching `ARG`/`ENV` in the Dockerfile's `builder` stage and set it under Dokploy's **Build Time Arguments**; changing it requires a redeploy. Never pass secrets as public variables or build arguments.

### Verify the image locally

```bash
docker build -t cactus .
docker volume create cactus-uploads
docker run --rm -p 3000:3000 --env-file .env -v cactus-uploads:/app/uploads cactus
```

Then open [http://localhost:3000](http://localhost:3000).
