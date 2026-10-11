# Site settings and public redesign

## Administration

- `/panel/admin/settings`: shared header/footer logo, bilingual subtitles and navigation links. Links can be added, removed, edited and reordered. Internal paths are canonical, without `/en`; localization is automatic. Empty logo restores the original Cactus mark.
- Existing `/panel/admin/pages` and `/panel/admin/about` routes remain compatible, now grouped under **Site settings**. The settings overview links to both editors.
- The static-page editor manages event visibility, bilingual headings, main/secondary links, image, background image, colour theme and start time. Times entered there are Tehran wall-clock times, stored with `+03:30`. An empty start time hides the countdown. Its physical order is always days, hours, minutes, seconds, from left to right.
- Testimonial cards support bilingual student names, term names, achievements, image, video and optional student/parent satisfaction percentages. Empty percentages are not displayed. Legacy video-only entries remain compatible.
- `/panel/admin/resources/requirements`: complete software CRUD, image selection, bilingual summary/installation instructions, platforms, version, developer, license, system requirements, download size, documentation/download links and publishing/access controls.
- Product variants already have full CRUD. Initial product creation continues to redirect to the edit screen; the form now explains saving a draft first and adding variants there.

## Public pages

- `/requirements` and `/en/requirements`: searchable, platform/category-filtered software cards.
- `/requirements/[id]` and `/en/requirements/[id]`: individual software pages, downloads, installation instructions, specifications and localized SEO metadata/sitemap entries. Only published software addressed to everyone is exposed publicly.
- Uploaded attachment downloads are anonymous **only** when attached to a published `requirements` resource with audience `all`. Other attachment types keep their existing authenticated role checks.
- The homepage feature strip sits below the hero and retains all five links on mobile through horizontal scrolling. Why Cactus uses design-system cards. About shows up to three introductory paragraphs and links to the complete About page, alongside responsive video layouts.
- Product cards have variant selection, price updates, accessible icon-only cart buttons and detail links. Product details use media/information/purchase columns with technical specifications and quantity controls bounded by inventory.
- Course details use a title/summary/video main column, section anchors, collapsible syllabus and sticky enrollment sidebar. Existing instructors, FAQs, tools, certificates and comments are preserved.

## Storage and compatibility

No schema migration is required. Existing `resources`, `site_content.presentation` and `app_settings` tables are reused.

- Navigation: JSON text in `app_settings` under `site.navigation`.
- Software metadata: JSON text under `software.<resource UUID>`, saved/deleted transactionally with the resource.
- Existing seed markers and software starter entries remain unchanged; intentionally deleted starter content is not recreated.
- Referenced navigation, event, testimonial and software images are included in the media deletion guard.

## Verification

- `pnpm test`: six targeted tests for defaults, safe navigation, timezone-qualified deadlines, percentage bounds, HTML sanitation and software metadata round-tripping.
- `pnpm lint`: no errors; the eleven pre-existing unused-import warnings remain.
- Production webpack build and `git diff --check`.
- Temporary development preview used to inspect Persian RTL/English LTR, desktop/mobile, dark/light/system, physical countdown ordering, software filters/empty state and inventory-bounded quantity controls. Preview fixtures were removed; no sample identities or satisfaction scores were saved to application data.

### Remaining environment-dependent checks

This checkout has no configured `DATABASE_URL` and no detected local PostgreSQL listener. Before release, connect a development database and exercise actual admin saves/deletes, image uploads, anonymous published-software downloads versus protected attachments, variant persistence, language switching, and field preservation/toasts after failed actions. Product/course pages also need visual verification using the installation's real content and images.
