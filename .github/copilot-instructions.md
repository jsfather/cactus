# Copilot Repository Instructions

## Project Overview
- **Frontend:** Next.js with App Router, SPA-style / client-side first.
- **Backend:** Laravel REST API.
- **Deployment:** Vercel.
- **Language:** فارسی، تمام وبسایت RTL.
- **Themes:** Dark & Light mode.
- **State Management:** Zustand (هدف: تمام دیتا fetchingها و stateها با همین فرم بهینه شوند).
- **Styling:** TailwindCSS.
- **Components:** تمام کامپوننت‌ها داخل `components` directory.

## Architecture
- دایرکتوری‌های اصلی:
  - `(auth)` → OTP login, verify, onboarding.
  - `(main)` → صفحات پابلیک (درباره ما، فروشگاه، بلاگ، footer فقط اینجا).
  - `(panel)` → صفحات یوزر بعد login، شامل `admin`, `student`, `teacher`.
- Navbar فیکس بالای صفحه، Sidebar فقط تو `(panel)`.
- Footer فقط تو `(main)`.
- RTL global در `<html>` ست شده.

## Data Fetching & API
- تمام API ها **REST** هستند، endpointها در `lib/api/endpoints.ts` تعریف شده‌اند.
- Client API در `lib/api/client.ts` با **axios** و interceptor برای bearer token.
- تمام fetchها **client-side** با **zustand stores** مدیریت شوند.
- کوپایلت باید:
  - تمام endpointها را تشخیص بده و store domain-specific برای هر بخش بسازه.
  - response structure را از context یا Postman Collection حدس بزنه.
  - از همان API client واحد استفاده کنه.
- Environment variable: `NEXT_PUBLIC_API_BASE_URL` برای fetcher کلاینت.

## State Management
- Zustand فقط فعلاً در فرم بلاگ استفاده شده.
- هدف: کوپایلت تمام دیتا fetchingها و state management را با همان فرم بهینه سازی و استاندارد کنه.
- هر domain باید یک store جداگانه داشته باشد (`useAuthStore`, `useBlogStore`, ...).

## Forms & Validation
- تمام فرم‌ها **Zod** برای ولیدیشن کلاینت‌ساید.
- پیام‌های خطا **فارسی** و یکدست.
- API errors باید با **toastify** نمایش داده شوند.
- الگوی فرم‌ها مشابه بلاگ، در تمام مسیرها اعمال شود.

## Auth & Security
- Authentication: شماره موبایل + OTP → access token.
- **Access token** ذخیره می‌شود، refresh token وجود ندارد.
- فعلاً توکن در localStorage است ولی باید به Zustand منتقل شود.
- Middleware موجود برای route protection کافی است.
- Logout فقط پاک کردن session از localStorage.

## UI / Layout
- **TailwindCSS** استفاده شود.
- Navbar فیکس بالا، Sidebar فقط تو `(panel)`.
- Footer فقط تو صفحات پابلیک `(main)`.
- Dark & Light mode هر دو فعال.
- RTL global روی `<html>`.

## Conventions
- TypeScript strict، ESLint + Prettier فعال.
- API fetching و state management با **zustand** یکدست.
- همه fetchها client-side.
- تمام مسیرها و صفحات باید از الگوی `(panel)/admin/blog` الگو بگیرند.
- Forms: Zod + toastify برای ارور API.
- فایل‌های کامپوننت در `components` directory نگه داشته شوند.

## Pull Requests
- PRها مسیر-به-مسیر، اتمیک و با commit message واضح.
- کوپایلت باید پلن مرحله‌ای در issue بنویسد و سپس کد را generate کند.
- تمام تغییرات باید با معماری، استایل و conventions یکسان باشند.

## Notes for Copilot
- باید به عنوان یک **intelligent contributor** عمل کند:
  - ساخت storeهای zustand برای هر domain.
  - استفاده از fetcher client-side برای همه endpointها.
  - فرم‌ها را یکدست با Zod پیاده کند.
  - UI/Layout مطابق الگوی مشخص شده باشد.
  - RTL و Dark/Light mode رعایت شود.
  - Token management در zustand.
  - همه صفحات panel و main مطابق الگوی blog استانداردسازی شوند.
