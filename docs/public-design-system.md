# Cactus public design system

The public UI follows the supplied `cactus-robotics-full-site-v4.zip` reference: a floating rounded header, dark illustrated introductions, emerald actions, pale green page backgrounds, white cards, compact grids, a dark footer, and a fixed mobile navigation bar. The styles live in `components/public/public.css` and are scoped to `.public-site` so authentication and role panels retain their own primitives.

## Tokens

| Purpose          | Light     | Dark      |
| ---------------- | --------- | --------- |
| Page background  | `#f5f9f8` | `#0c1d19` |
| Card surface     | `#ffffff` | `#132722` |
| Text             | `#14211f` | `#eef7f3` |
| Secondary text   | `#62776f` | `#a1b8b0` |
| Interactive text | `#008653` | `#63d6a3` |
| Accent           | `#04c37e` | `#04c37e` |
| Border           | `#e3ece7` | `#28443b` |

Use the existing local Vazirmatn font, shared locale cookie, and shared system/light/dark preference. Do not load the ZIP's demonstration fonts or standalone theme scripts. Content spacing and positioning use logical properties, including mirrored icons and localized content fallbacks.

## Components and content

`SiteHeader`, `SiteFooter`, `PageIntro`, `SectionHeading`, `ClosingInvitation`, `PublicIcon`, and `CourseCard` provide shared structure. Existing product, article, instructor, and achievement cards use the same tokens. Product details separate media, information, and purchase controls. The mobile menu uses a native modal dialog with focus restoration, Escape/backdrop dismissal, and scroll locking.

Header reading and keyboard order is brand → navigation → search → language → theme → cart → account, left to right in English and right to left in Persian. The brand, utility group, and popup anchors mirror with the document direction. On mobile, the menu trigger sits at the trailing edge. The header uses the public variant of `PreferencesMenu`: a dark sun/moon pill opens the system/light/dark choices, alongside a visible FA / EN language link. The active language is emphasized, theme selection restores trigger focus, and the popup closes on selection, outside interaction, or Escape. It reuses the shared preference storage and synchronization. At narrow mobile widths, search remains available through the bottom navigation.

Home, courses, shop, blog, instructors, achievements, prerequisites, about, search, checkout, and their existing detail routes use the design. Search, filters, variants, prices, stock, cart persistence, checkout validation, comments, and authenticated actions remain connected to the existing application.

Six SVGs from the reference are stored in `public/images/reference-v4/`. They are concept artwork, never presented as photographs of actual school facilities, students, instructors, or products. Actual managed media remains authoritative. The ZIP's example prices, statistics, testimonials, partner endorsements, demo videos, OTP, cart, and newsletter handlers are not application data or production behavior.

Motion uses CSS transforms, opacity, image clipping, and the existing intersection observer. Content stays visible before JavaScript; `prefers-reduced-motion` disables animation and transitions.
