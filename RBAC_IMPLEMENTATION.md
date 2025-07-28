# سیستم نقش‌بندی (RBAC) - خلاصه پیاده‌سازی

## فایل‌های ایجاد شده:

### 1. Context و Hooks

- `app/contexts/AuthContext.tsx` - مدیریت نقش‌ها و دسترسی‌ها
- `app/hooks/useRoleNavigation.ts` - navigation بر اساس نقش

### 2. کامپوننت‌های محافظت

- `app/components/RouteGuard.tsx` - محافظت از routes
- `app/components/RoleBasedComponent.tsx` - نمایش محتوا بر اساس نقش

### 3. صفحات و Layout‌ها

- `app/unauthorized/page.tsx` - صفحه عدم دسترسی
- `app/(panel)/manager/layout.tsx` - layout مدیر
- `app/(panel)/manager/page.tsx` - صفحه اصلی مدیر

### 4. Middleware

- `middleware.ts` - محافظت در سطح Next.js

## فایل‌های بروزرسانی شده:

### 1. Types

- `app/lib/types/user.ts` - اضافه شدن UserRole

### 2. Layout‌ها

- `app/layout.tsx` - اضافه شدن AuthProvider
- `app/(panel)/admin/layout.tsx` - محافظت با RouteGuard
- `app/(panel)/student/layout.tsx` - محافظت با RouteGuard
- `app/(panel)/teacher/layout.tsx` - محافظت با RouteGuard
- `app/(panel)/user/layout.tsx` - محافظت با RouteGuard

### 3. Header

- `app/components/layout/Header.tsx` - منوهای بر اساس نقش

## نقش‌ها و دسترسی‌ها:

### Admin

- دسترسی به همه بخش‌ها
- `/admin/*` routes
- تمام مجوزها

### Manager

- دسترسی محدود به مدیریت
- `/manager/*` routes
- مجوزهای مدیریتی

### Student

- دسترسی دانشجویی
- `/student/*` routes
- فروشگاه و گواهینامه‌ها

## استفاده:

```tsx
// محافظت از route
<RouteGuard requiredRole="admin">
  <AdminContent />
</RouteGuard>

// نمایش محتوا بر اساس نقش
<AdminOnly>
  <AdminButton />
</AdminOnly>

// بررسی نقش در کامپوننت
const { role, hasRole, hasPermission } = useAuth();
if (hasRole('admin')) {
  // نمایش محتوای مخصوص ادمین
}
```

## مرحله بعدی:

آماده دریافت API‌های مختلف برای پیاده‌سازی کامل سیستم
