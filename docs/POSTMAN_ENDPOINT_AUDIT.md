# Postman endpoint audit

Source: `Cactos.postman_collection.json`  
API base URL: `https://la.ecactus.co/api`

## Scope

The collection contains 191 requests:

- Authentication and onboarding: 4
- Admin panel: 112
- Student panel: 19
- Teacher panel: 29
- Shared user endpoints: 13
- Public/home endpoints: 14

All collection groups now have a frontend client/service path. Existing screens were retained where their contracts matched; incorrect methods, paths, payloads, or missing workflows were corrected.

## Material corrections

- Fixed the legacy request wrapper so POST, PUT, PATCH, and DELETE requests are no longer silently sent as GET.
- Corrected public course and teacher routes to `/home/courses` and `/home/teachers`.
- Replaced the old course-page placeholder API with `/admin/courses` and added the required core course fields.
- Corrected student registration to POST `/student/pay` with `term_teacher_id`.
- Corrected placement-exam start to POST `/student/placement-exam/start` without an exam ID.
- Corrected student, teacher, and user admin updates to PATCH.
- Corrected admin order status to POST.
- Corrected admin ticket creation to singular `/admin/ticket`.
- Added missing admin attendance, teacher offline-session, notification, security, guide, and classroom workflows.
- Added blog and product comment moderation, reply, and delete workflows.
- Added multipart blog image creation and student document upload handling.
- Corrected product comment creation payload from `content` to `comment`.

## Live validation

Authenticated and public checks were run against the deployed API using schema-only output (no personal record values were logged). The following route groups returned successful responses with the expected JSON shapes:

- Public: FAQs, courses, teachers, products, blogs, blog tags, certificates, settings, and a live blog detail.
- Admin collections: dashboard, blogs, courses, certificates, exams, FAQs, levels, offline sessions, orders, panel guides, product categories, products, reports, students, teachers, term teachers, terms, tickets, teacher tickets, ticket departments, users, and attendance absences.
- Admin details: live records for blogs, certificates, exams, FAQs, offline sessions, orders, panel guides, product categories, products, students, teachers, term teachers, terms, and users.
- Shared and role routes: profile, notifications, panel guides, orders, student terms/tickets/attendance, and teacher terms/students/homeworks/offline sessions/reports/tickets/attendance.

A temporary FAQ was used to validate the complete write lifecycle. `POST`, detail `GET`, `PUT`, and `DELETE` returned `201/200/200/200`; the fixture was removed immediately.

Mutations that could affect real users or money (payments, order changes, notifications, classrooms, attendance, and student/teacher records) were intentionally not executed on production.

## Backend contract drift

- The deployed backend has no public `GET /products/{id}` route even though
  public product records are returned by `GET /home/products` and authenticated
  comment creation uses `POST /products/{id}/comments`. The frontend has a
  real-data list fallback, but Laravel should add the public detail route.
- The collection documents `GET/POST/DELETE /admin/comments`, but the deployed backend currently returns `404` for `/admin/comments`. The admin product-comment screen now falls back to comments embedded in `/admin/products`, while approve, reject, answer, and delete continue to use the deployed `/admin/product_comments/{id}/...` action routes.
- Several numeric IDs hard-coded in the collection are no longer present. Missing student/teacher example IDs cause a backend `500` instead of a safe `404`; current live IDs return `200`. This error handling must be fixed in the backend application, which is not part of this frontend repository.

## Collection issue

The request named `certificate-categories` points to `/home/blogs`. This is a duplicated/mislabeled Postman entry, not a separate certificate-category endpoint, so no invented route was added.

## Verification

- `npx tsc --noEmit`: passes
- `npx eslint app lib --quiet`: passes
- `npm run build`: passes
- `git diff --check`: passes
- Next application pages/routes: 108
