<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Cactus project guide

This repository is a production-oriented multilingual application for Cactus, a robotics school. Preserve these conventions when changing or adding features.

## Stack and deployment

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, PostgreSQL, and Drizzle ORM.
- Package manager: pnpm. Use the scripts in `package.json` rather than inventing parallel commands.
- Deployment target: Dokploy using the root `Dockerfile`. PostgreSQL is a separate private Dokploy service.
- The production image runs as the non-root `nextjs` user on port `3000`, exposes `/api/health`, runs committed migrations at startup when `RUN_MIGRATIONS=true`, and persists media in `/app/uploads`.
- Dokploy must mount a persistent volume at `/app/uploads` and set `UPLOAD_DIR=/app/uploads`. Local development defaults to `.data/uploads`.
- The Docker dependency stage intentionally uses a named BuildKit pnpm cache, reduced network concurrency, retries, and a long fetch timeout. Keep this resilience unless the deployment platform changes.
- Read the relevant Next.js 16 documentation in `node_modules/next/dist/docs/` before implementing framework behavior. Do not rely on older Next.js conventions.

## Route and layout architecture

- Persian public site: `app/(public-fa)`, with `/`, `/blog`, and `/shop`; document language is `fa` and direction is `rtl`.
- English public site: `app/(public-en)`, with `/en`, `/en/blog`, and `/en/shop`; document language is `en` and direction is `ltr`.
- Authentication: `app/(auth)`, currently `/login`.
- Protected role panels: `app/(panel)`, with admin, teacher, and student workspaces plus `/panel/profile`.
- Route groups use separate root layouts because each document needs its own `lang`, `dir`, typography, and metadata. Mount `AppFeedbackProvider` in every root layout.
- Language is one application-wide preference stored in the `cactus-locale` cookie at path `/` and mirrored to localStorage for cross-tab synchronization. Public routes keep localized URLs, while auth and panel layouts read the shared preference through `lib/i18n/server.ts`. Never introduce route-specific language cookies.
- Panel dictionaries live in `lib/i18n/panel.ts`, auth dictionaries in `lib/i18n/auth.ts`, and public dictionaries in `lib/i18n/dictionaries.ts`.
- Public, authentication, and panel header branding displays the localized short name: `کاکتوس` in Persian and `Cactus` in English. Do not restore the long school name in headers. The panel may display the signed-in role as a subtitle.

## Internationalization, RTL, and typography

- Persian is the primary language and global default. Every public feature and every panel feature must support both Persian and English.
- Set `lang` and `dir` at document roots and on localized content subtrees when their direction differs from the surrounding UI.
- Use Vazirmatn globally through the existing local font configuration. Do not add a runtime font CDN.
- Persian numerals are the default. Apply `nums-en` to any field or subtree that must use Latin digits; `nums-fa` is available for explicit Persian overrides.
- All layout and spacing must work in RTL and LTR. Prefer logical utilities and properties: `text-start`, `text-end`, `ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`, `border-s`, and `border-e`.
- Do not use direction-specific `ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `text-left`, or `text-right` unless physical direction is intentionally required and documented.
- Select chevrons and positioned adornments must use logical end spacing and positioning.

## Design system and feedback

- Panel pages must compose the shared primitives in `components/panel/ui.tsx` and `components/panel/form-controls.tsx`. Improve shared primitives instead of patching one page when the change should apply everywhere.
- Keep tables `table-fixed`, define explicit column widths, and use the shared header/cell padding and alignment so data remains directly under its heading.
- Render table row actions through the shared accessible icon-button primitives in `components/panel/ui.tsx`; keep localized `aria-label` and `title` text, and do not place large textual edit/delete/copy actions inside table cells.
- Global feedback lives in `components/feedback/feedback-provider.tsx`. Use `useFeedback()` for confirmation dialogs and toasts.
- Never use `window.confirm`, `window.alert`, or browser-native destructive confirmation. Call the global promise-based `confirm()` API with localized title, description, and action labels.
- Use localized toasts for operation-level success and failure. Keep field-level validation errors inline as well; toasts complement accessible form errors rather than replacing them.
- For action errors, use `useActionErrorToast`. For a server-rendered redirect success message, render `ToastOnMount` from a validated query-state value.
- Confirmation dialogs must remain accessible: `role="dialog"`, `aria-modal`, Escape/backdrop cancel, initial focus, focus restoration, and background scroll locking.
- Toasts must remain dismissible, time-limited, direction-safe, and announced through an appropriate live region.
- Theme selection is shared across public, authentication, and panel routes and supports `system`, `light`, and `dark`. Keep system preference as the default, persist through the common `cactus-theme` localStorage/cookie key, synchronize browser tabs, and preserve the pre-paint theme bootstrap.
- Selectable and actionable UI must show the pointer cursor. Dropdowns must close after a selection, on outside pointer interaction, and on Escape while preserving keyboard focus behavior.

## Forms and Server Actions

- Form labels, section headings, hints, and validation messages always inherit the active interface locale direction: right/start in Persian and left/start in English. Never put `dir="ltr"` or `dir="rtl"` on a field wrapper or `PanelFormSection` just to control its value.
- Apply content direction only to the editable control itself: English names, emails, passwords, slugs, and English content use `dir="ltr"`; Persian content uses `dir="rtl"`. Use the shared `PanelInput`, `PanelTextarea`, `FormLabel`, `PanelFormSection`, and `PanelFormFooter` primitives.
- Complex panel forms use a consistent responsive main/sidebar composition: primary information and multilingual content in the main column, media and publishing/access settings in the sidebar, and actions in the shared footer.
- Authenticate and authorize inside every Server Action. Rendering a form only to admins is not a security boundary.
- Validate all untrusted inputs with Zod before database work. Return small, explicit action-state objects; never return raw database errors or records.
- Every recoverable error must keep all user input intact. Controlled text inputs, textareas, and selects should use `components/forms/use-preserved-fields.ts`.
- Rich-text editors, upload fields, checkboxes, and other custom controls must maintain their own controlled state so a failed action cannot reset them.
- Forms should expose field-specific inline errors and an operation-level toast. A constraint such as a duplicate slug or email must not escape to an error boundary.
- Drizzle wraps PostgreSQL driver errors. Use `hasPostgresErrorCode` from `lib/db/errors.ts` for codes such as `23505` and `23503`; do not check only `error.code` at the top level.
- Revalidate every affected public and panel path before redirecting. Use localized success toast query values such as `created` and `updated`, not arbitrary user-provided message text.
- All managed features are expected to include complete create, list/read, update, and delete flows unless the domain explicitly forbids an operation.
- Destructive buttons call Server Actions from a React transition only after the shared confirmation dialog resolves positively, then show the returned localized toast result.

## Authentication and users

- Roles are `admin`, `teacher`, `student`, and `member`. Public registration always creates an active `member`; route every user to the correct role home and enforce role checks server-side.
- Admins have dedicated CRUD sections for administrators, teachers, students, and members, and may change any account's email and role. Keep at least one active administrator so the installation cannot lose administrative access.
- Every feature introduced for teachers, students, or members must include corresponding full admin CRUD access in the panel. Treat this as part of the feature's definition of done, not a later enhancement.
- Users have required `firstNameFa`, `lastNameFa`, `firstNameEn`, and `lastNameEn` values, plus avatars and Persian/English biographies. Always render the complete name matching the active locale via `getLocalizedUserName`; never show the Persian name on English pages as a fallback.
- User create/edit and self-service profile forms must collect both Persian and English names regardless of the currently active interface language.
- Never allow the current administrator to deactivate or delete their own active account.
- Passwords are hashed and must be at least 12 characters when created or changed. Never log credentials or include them in client-visible state.
- Initial administrator variables are bootstrap-only. `ADMIN_EMAIL` and `ADMIN_PASSWORD` must be provided together; the password minimum is 12 characters.

## Database, migrations, and starter content

- The canonical schema is `lib/db/schema.ts`. Generate and commit Drizzle migrations under `drizzle/` after schema changes.
- Run `pnpm db:migrate` or `pnpm db:setup` locally after adding a migration. Production startup applies committed migrations when enabled.
- Current core entities include users, sessions, posts, products, media assets, and seed markers.
- Every new database-backed feature must install one useful starter item once. Record a unique seed marker so an administrator can intentionally delete all items without startup recreating them.
- Keep starter data creation and initial administrator bootstrap idempotent.
- Use PostgreSQL internal service URLs in Dokploy. Do not expose the database port publicly.

## Media uploads

- Use the authenticated `/api/uploads` route and the reusable `ImageUploadField`; do not reintroduce manual image URL fields.
- Admins manage the complete media library under `/panel/admin/media` with create, list, metadata editing, URL copying, and guarded deletion. Shared image selectors must offer the existing library, instant upload, and a validated direct HTTP(S) link.
- Supported media categories are avatar, post, product, and rich-content images. Authorization differs by kind: content management requires admin, while a signed-in user may upload their own avatar.
- Validate file size, declared MIME type, and binary signature. Current supported types are JPEG, PNG, WebP, and GIF up to 5 MB.
- Store media metadata in `media_assets`; serve files through `/media/[...path]` with safe path resolution, MIME headers, immutable caching, and `nosniff` behavior.
- New storage filenames must be collision-resistant and opaque using `random UUID + upload timestamp + validated extension`. Keep the user-editable media display name in `media_assets.originalName`; display names are intentionally non-unique and may be duplicated.
- Never trust a client-provided filesystem path, and never serve the upload directory as an unrestricted static directory.
- Uploaded files require persistent storage in production. Changes to media storage must remain compatible with Dokploy volume replacement and the non-root UID/GID `1001`.

## Rich content

- Blog posts and products support Persian and optional English rich text for both create and edit flows.
- Use the shared TipTap editor in `components/content/rich-text-editor.tsx`; do not add feature-specific editors.
- Sanitize rich HTML on the server before storage and again through the shared renderer in `components/content/rich-content.tsx`.
- The sanitizer allowlist in `lib/content/rich-text.ts` is the security boundary. Expand it deliberately and never render unsanitized user HTML.
- Inline editor images must use the authenticated media pipeline, not base64 data URLs or arbitrary filesystem writes.
- Rich-text image insertion uses the shared media picker so editors can reuse library assets, upload immediately, or insert a validated remote image URL.

## Current public features

- Homepage: bilingual introduction, robotics-school value proposition, featured products, and latest posts.
- Blog: bilingual listing and detail pages with uploaded covers and sanitized rich content.
- Shop: bilingual listing and product pages with price, inventory, featured state, uploaded imagery, and sanitized rich descriptions.
- Preserve localized fallbacks: when optional English content is absent, English public pages may show the Persian content rather than an empty page.

## Verification before handoff

- Run `pnpm lint`.
- Run `pnpm build`; the repository intentionally builds with the configured webpack command.
- Run `git diff --check`.
- Apply new migrations against a local PostgreSQL database when schema changes are part of the task.
- Browser-test both Persian RTL and English LTR pages, authenticated panel access, language switching, dark/light/system behavior, form preservation after errors, modal confirmation, toasts, and affected CRUD flows.
- For deployment-sensitive changes, build the root Dockerfile and confirm the final image uses user `nextjs`, port `3000`, volume `/app/uploads`, and the `/api/health` healthcheck.
- Preserve unrelated user changes in the working tree and never use destructive Git commands to clean them.
