'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { UserRole } from '@/app/lib/types';

interface RoleBasedComponentProps {
  children: ReactNode;
  allowedRoles?: UserRole | UserRole[];
  requiredPermission?: string;
  fallback?: ReactNode;
  requireAuth?: boolean;
}

export function RoleBasedComponent({
  children,
  allowedRoles,
  requiredPermission,
  fallback = null,
  requireAuth = false,
}: RoleBasedComponentProps) {
  const { isAuthenticated, hasRole, hasPermission } = useAuth();

  // اگر نیاز به احراز هویت دارد و کاربر لاگین نکرده
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  // بررسی نقش
  if (allowedRoles && !hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  // بررسی مجوز
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// کامپوننت‌های کمکی برای سادگی استفاده

export function AdminOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleBasedComponent allowedRoles="admin" fallback={fallback}>
      {children}
    </RoleBasedComponent>
  );
}

export function ManagerOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleBasedComponent allowedRoles="manager" fallback={fallback}>
      {children}
    </RoleBasedComponent>
  );
}

export function StudentOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleBasedComponent allowedRoles="student" fallback={fallback}>
      {children}
    </RoleBasedComponent>
  );
}

export function AdminOrManager({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleBasedComponent allowedRoles={['admin', 'manager']} fallback={fallback}>
      {children}
    </RoleBasedComponent>
  );
}

export function AuthenticatedOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleBasedComponent requireAuth={true} fallback={fallback}>
      {children}
    </RoleBasedComponent>
  );
}
