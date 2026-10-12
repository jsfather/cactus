# Panel design, commerce and system notifications

## Shared interface

All panel root layouts load the shared panel stylesheet. Page headers, surfaces, form sections, action footers and tables use the updated shared primitives, preserving bilingual RTL/LTR, themes, focus indicators, confirmations and toasts. Statistics share icon/value/detail cards across the administrative overview, tickets, orders, product analytics, student payment summaries and attendance registers.

Tables retain fixed columns with horizontal scrolling inside their region rather than compressing actions or overflowing the page. Attendance retains dedicated mobile cards. Navigation editors and checkout columns use narrower-width-safe grids. Each role's navigation is defined in `lib/panel/navigation.ts`: academic catalogs and software belong to education; departments and chat settings to support; landing pages to content. Mobile navigation closes on outside interaction or Escape, with focus restoration. The notification bell shows the current user's unread count.

## Orders

Physical orders: placed → processing → packing → shipped → delivered. Payment status is independent. Educational orders skip packing/shipping and can be completed as services.

Administrator updates authenticate, validate, lock the order, compare the expected status, require confirmed payment before fulfillment, and require a tracking code for physical shipment/delivery. Forward changes are sequential; backwards corrections require a reason. Payment callbacks cannot rewind an already-paid order.

`order_events` captures real transitions, actors, tracking snapshots and correction notes. Audit records are not editable CRUD content. Existing placement dates are known; historical fulfillment timestamps are not fabricated. No fake financial orders or audit events are seeded. Customers see a responsive timeline and copyable tracking code after shipment. Lists are paginated, with actionable statistics for awaiting payment, active, shipped, delivered and cancelled orders.

## Products

Product stock totals and filters include active variants. Low stock means 1–4 available units. Best sellers are the top five by units in paid, non-cancelled orders. Aggregate units sold and revenue per best seller are shown.

## Notifications

Events are created in the same transaction as their trigger where applicable:

- Admins: new registered/managed accounts, new physical/course orders, confirmed payments, new tickets/customer replies, homework submissions.
- Students: onboarding, confirmed enrollment, newly published learning materials, existing homework feedback, orders and support responses.
- Teachers: onboarding, new teaching assignments, class enrollments, homework submissions, assigned support requests and replies.
- Members: onboarding, orders/fulfillment and support requests/replies.

Only active recipients are notified. Messages have bilingual text and role-appropriate links. Users read their own messages individually or all at once. Administrators manage messages without marking other users' notifications read. Read/unread filters, timestamps, pagination and manual administrative CRUD are available.

## Site identity and appearance

Favicon upload uses the managed image picker and applies to public, authentication and panel metadata. Square PNG is recommended; ICO is intentionally excluded from the safe upload allowlist. Default colors are visual swatches; editable HEX values remain available for precision.

## Verification boundary

Migration `0028_flimsy_gertrude_yorkes.sql` was generated for the order audit table. At the user's request, no database connection, migration execution, test suite, browser/device run or deployment verification was performed. Build compilation is the requested boundary; it does not prove database behavior or certify every viewport. Source review covered the shared panel root, shared primitives/navigation, fixed-width grids, tables, attendance, cart, support and changed feature pages.
