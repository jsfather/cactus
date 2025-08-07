import { UserRole } from '@/app/lib/types';

/**
 * Utility function to check if a user has permission to access a resource
 */
export function hasPermission(
  userRole: UserRole | undefined,
  allowedRoles: UserRole[]
): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

/**
 * Get the appropriate dashboard URL for a user role
 */
export function getDashboardUrl(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'teacher':
      return '/teacher/dashboard';
    case 'student':
      return '/student/dashboard';
    default:
      return '/';
  }
}

/**
 * Role-based route configurations
 */
export const ROLE_ROUTES = {
  admin: {
    dashboard: '/admin/dashboard',
    prefix: '/admin',
    allowedRoles: ['admin'] as UserRole[],
  },
  teacher: {
    dashboard: '/teacher/dashboard',
    prefix: '/teacher',
    allowedRoles: ['teacher'] as UserRole[],
  },
  student: {
    dashboard: '/student/dashboard',
    prefix: '/student',
    allowedRoles: ['student'] as UserRole[],
  },
} as const;

/**
 * Check if a path is protected and requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  return Object.values(ROLE_ROUTES).some((route) =>
    pathname.startsWith(route.prefix)
  );
}

/**
 * Get required roles for a given path
 */
export function getRequiredRoles(pathname: string): UserRole[] {
  const route = Object.values(ROLE_ROUTES).find((route) =>
    pathname.startsWith(route.prefix)
  );
  return route?.allowedRoles || [];
}
