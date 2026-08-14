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

The following public routes were checked against the live API and returned the expected JSON envelope:

- `GET /home/faqs`
- `GET /home/courses`
- `GET /home/teachers`
- `GET /home/products`
- `GET /home/blogs`

Authenticated routes require a current bearer token for live response-shape and permission validation. Until that token is supplied, those routes are validated against the Postman contract, TypeScript, and the production build.

## Collection issue

The request named `certificate-categories` points to `/home/blogs`. This is a duplicated/mislabeled Postman entry, not a separate certificate-category endpoint, so no invented route was added.

## Verification

- `npx tsc --noEmit`: passes
- `npm run build`: passes
- Next production routes generated: 100+
