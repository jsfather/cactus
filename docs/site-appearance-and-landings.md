# Site appearance and landing builder

## Administration

- `/panel/admin/settings`: independent loading icon, existing header/footer identity and SEO settings. Empty loading image uses the original Cactus mark.
- `/panel/admin/settings/appearance`: independent light/dark palettes. Semantic controls identify page backgrounds, cards, text, buttons, links, hover, footer, and borders. Additional controls expose the original public stylesheet's design colors and their selectors. Color swatches and editable six-digit HEX values share preserved state. Original transparency remains in the stylesheet.
- Typography controls scale the public stylesheet's fixed text sizes and line heights, and configure heading/button weights and button size. Responsive viewport-based headings retain their responsive sizes. The bundled Vazirmatn font is preserved. These settings intentionally do not restyle administrative or authentication workspaces, assets, or uploaded imagery.
- `/panel/admin/landings`: searchable, paginated list, create, edit, publication, and confirmed deletion. Deletion cascades landing comments; uploaded media is not deleted automatically.
- `/panel/admin/comments`: landing filter, moderation, bilingual replies and deletion use the existing comment workflow. Only authenticated users can submit; new comments require approval.

## Public pages

- Persian pages resolve at `/<slug>` and English pages at `/en/<slug>`. Built-in root names are reserved. Drafts cannot be viewed publicly. Published pages appear in the bilingual sitemap and have page-specific metadata.
- Main rich content → editable CTA banner → continuation rich content. Both content areas use the shared editor and sanitized renderer. An empty CTA link hides the banner.
- Featured images use the existing media selector/upload. MP4 upload reuses the authenticated, signature-checked attachment pipeline (20 MB); direct HTTP(S) video URLs are also supported. Only administrator-uploaded MP4 attachments can be assigned. Anonymous access is granted only while referenced by a published landing. Other private attachments retain their existing authorization.
- The loading icon is supplied through the public root layout to lightweight loading components, without a database request inside the loading fallback.
- Footer columns stack on mobile, wrap long addresses and links, and preserve the trust seal's aspect ratio. Honors render sanitized rich HTML instead of printing tags; their metadata uses plain text.

## Deployment and verification boundary

Migration `0027_yummy_kat_farrell.sql` adds landing pages and their comment relationship. A once-only seed marker installs a draft example during database setup without recreating intentionally deleted entries.

At the user's request, no database migration, database setup, test suite, browser checks, or Docker verification was run for this stage. The migration was generated only. Production requires applying committed migrations before these database-backed features can run. Build compilation is the verification scope requested for this stage; it does not validate live CRUD or mobile rendering.
