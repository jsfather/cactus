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

## Reference Implementation Examples
- **Blog Section**: Complete CRUD with RTL design, summary stats, proper form validation
  - Types: `lib/types/blog.ts`
  - Service: `lib/services/blog.service.ts`
  - Store: `lib/stores/blog.store.ts`
  - Hook: `lib/hooks/use-blog.ts`
  - Listing: `(panel)/admin/blogs/page.tsx`
  - Form: `(panel)/admin/blogs/[id]/page.tsx`

- **Terms Section**: Complete CRUD implementation following established patterns
  - Types: `lib/types/term.ts` with API structure: `{title, duration, number_of_sessions, level_id, start_date, end_date, type, capacity, price}`
  - Term types: 'normal' (عادی), 'capacity_completion' (تکمیل ظرفیت), 'project_based' (پروژه محور(ویژه)), 'specialized' (گرایش تخصصی), 'ai' (هوش مصنوعی)
  - API expects capacity and price as strings, not numbers
  - Service: `lib/services/term.service.ts` using `/admin/terms` endpoint
  - Store: `lib/stores/term.store.ts` with full CRUD operations
  - Hook: `lib/hooks/use-term.ts` with callback optimization
  - Listing: `(panel)/admin/terms/page.tsx` with RTL design, breadcrumbs, summary stats
  - Form: `(panel)/admin/terms/[id]/page.tsx` using DatePicker, Select, and proper validation

- **Products Section**: Another complete reference following the same patterns
  - Full CRUD with proper state management
  - RTL design with summary statistics
  - Form validation with Zod and proper error handling

## Implementation Patterns for New Sections
**کوپایلت باید این الگو را برای ایجاد بخش‌های جدید دنبال کند:**

1. **Types Definition**: 
   - Main interface with all fields from API response
   - Separate Request interfaces for Create/Update
   - Response wrapper interfaces

2. **Service Layer**:
   - Class-based service with CRUD methods
   - Use `apiClient` from `lib/api/client.ts`
   - Export singleton instance

3. **Zustand Store**:
   - State: list, current item, loading, error
   - Actions: CRUD operations with proper error handling
   - Optimistic updates for better UX

4. **Hook Layer**:
   - Wrapper around store with useCallback optimization
   - Clean API for components

5. **Listing Page**:
   - RTL design with breadcrumbs
   - Summary stats cards with icons
   - Table with proper columns and rendering
   - Delete confirmation modal
   - Loading states

6. **Form Page**:
   - Proper form validation with Zod
   - **CRITICAL**: Use DatePicker for dates, MarkdownEditor for content
   - Grid layout with responsive design
   - Breadcrumbs and navigation
   - Loading and error states

## UI Components & Standards
- **Date/Time Inputs**: ALWAYS use `DatePicker` from `@/app/components/ui/DatePicker` for any date/time input fields
  - Usage: `<Controller name="date_field" control={control} render={({ field }) => (<DatePicker id="date_field" label="تاریخ" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.date_field?.message} required />)} />`
- **Rich Text/Markdown**: ALWAYS use `MarkdownEditor` from `@/app/components/ui/MarkdownEditor` for large text content like descriptions, articles, content
  - Usage: `<Controller name="description" control={control} render={({ field }) => (<MarkdownEditor id="description" label="محتوای متن" value={field.value} onChange={field.onChange} error={errors.description?.message} required />)} />`
- **Basic Inputs**: Use standard `Input` and `Textarea` components for simple text fields
- **Form Structure**: Always wrap custom components in `Controller` for react-hook-form integration

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
  - **CRITICAL**: همیشه از `DatePicker` برای تاریخ و `MarkdownEditor` برای محتوای بزرگ استفاده کن.
  - UI/Layout مطابق الگوی مشخص شده باشد.
  - RTL و Dark/Light mode رعایت شود.
  - Token management در zustand.
  - همه صفحات panel و main مطابق الگوی blog استانداردسازی شوند.
