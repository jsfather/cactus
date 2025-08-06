'use client';

import { useRoleGuard } from '@/app/hooks/useRoleGuard';
import { UserRole } from '@/app/lib/types';
import { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
  redirectTo?: string;
}

export function RoleGuard({ children, allowedRoles, fallback, redirectTo }: RoleGuardProps) {
  const { user, loading, hasAccess } = useRoleGuard({ allowedRoles, redirectTo });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">دسترسی غیر مجاز</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">لطفاً وارد حساب کاربری خود شوید</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return fallback || (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">دسترسی محدود</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">شما مجوز دسترسی به این صفحه را ندارید</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
