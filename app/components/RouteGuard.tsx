'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { UserRole } from '@/app/lib/types';

interface RouteGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: string;
  fallbackRoute?: string;
  requireAuth?: boolean;
}

export function RouteGuard({
  children,
  requiredRole,
  requiredPermission,
  fallbackRoute,
  requireAuth = false,
}: RouteGuardProps) {
  const {
    isAuthenticated,
    role,
    hasRole,
    hasPermission,
    canAccessRoute,
    loading,
  } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // اگر کاربر لاگین نکرده و نیاز به احراز هویت دارد
    if (
      !isAuthenticated &&
      (requiredRole || requiredPermission || requireAuth)
    ) {
      router.push('/send-otp');
      return;
    }

    // بررسی نقش مورد نیاز
    if (requiredRole && !hasRole(requiredRole)) {
      const redirectRoute = fallbackRoute || getRoleDefaultRoute(role);
      router.push(redirectRoute);
      return;
    }

    // بررسی مجوز مورد نیاز
    if (requiredPermission && !hasPermission(requiredPermission)) {
      const redirectRoute = fallbackRoute || getRoleDefaultRoute(role);
      router.push(redirectRoute);
      return;
    }

    // بررسی دسترسی کلی به route
    if (!canAccessRoute(pathname)) {
      if (!isAuthenticated) {
        router.push('/send-otp');
      } else {
        const redirectRoute = fallbackRoute || getRoleDefaultRoute(role);
        router.push(redirectRoute);
      }
    }
  }, [
    isAuthenticated,
    role,
    pathname,
    requiredRole,
    requiredPermission,
    requireAuth,
    loading,
    hasRole,
    hasPermission,
    canAccessRoute,
    router,
    fallbackRoute,
  ]);

  // در حین بارگذاری نمایش Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // اگر همه شرایط برقرار است، children را نمایش بده
  return <>{children}</>;
}

// تابع کمکی برای تعیین route پیش‌فرض هر نقش
function getRoleDefaultRoute(role: UserRole | null): string {
  if (!role) return '/';

  switch (role) {
    case 'admin':
      return '/admin';
    case 'manager':
      return '/manager';
    case 'student':
      return '/student';
    default:
      return '/';
  }
}
