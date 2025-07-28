'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User, UserRole } from '@/app/lib/types';
import { useUser } from '@/app/hooks/useUser';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  canAccessRoute: (route: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// تعریف نقش‌ها و مجوزهای آنها
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'manage_users',
    'manage_courses',
    'manage_teachers',
    'manage_students',
    'view_analytics',
    'manage_system',
    'manage_content',
    'access_admin_panel',
  ],
  manager: [
    'manage_courses',
    'manage_teachers',
    'manage_students',
    'view_analytics',
    'manage_content',
  ],
  student: [
    'view_courses',
    'enroll_courses',
    'view_profile',
    'submit_assignments',
    'view_grades',
  ],
};

// تعریف routes مجاز برای هر نقش
const ROLE_ROUTES: Record<UserRole, string[]> = {
  admin: [
    '/admin',
    '/admin/users',
    '/admin/courses',
    '/admin/teachers',
    '/admin/students',
    '/admin/analytics',
    '/admin/settings',
    '/courses',
    '/teachers',
    '/about',
    '/blog',
  ],
  manager: [
    '/manager',
    '/manager/courses',
    '/manager/teachers',
    '/manager/students',
    '/manager/analytics',
    '/courses',
    '/teachers',
    '/about',
    '/blog',
  ],
  student: [
    '/student',
    '/student/dashboard',
    '/student/courses',
    '/student/grades',
    '/student/assignments',
    '/courses',
    '/teachers',
    '/about',
    '/blog',
    '/shop',
    '/certifications',
  ],
};

// Routes عمومی که همه می‌توانند دسترسی داشته باشند
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/blog',
  '/courses',
  '/teachers',
  '/send-otp',
  '/verify-otp',
  '/onboarding',
];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, loading, isAuthenticated, logout: userLogout } = useUser();
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
    } else {
      setRole(null);
    }
  }, [user]);

  const hasRole = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!role) return false;

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role);
    }

    return role === requiredRole;
  };

  const hasPermission = (permission: string): boolean => {
    if (!role) return false;

    return ROLE_PERMISSIONS[role]?.includes(permission) || false;
  };

  const canAccessRoute = (route: string): boolean => {
    // اگر کاربر لاگین نکرده، فقط routes عمومی
    if (!isAuthenticated || !role) {
      return PUBLIC_ROUTES.some(
        (publicRoute) =>
          route === publicRoute || route.startsWith(publicRoute + '/')
      );
    }

    // بررسی routes عمومی
    const isPublicRoute = PUBLIC_ROUTES.some(
      (publicRoute) =>
        route === publicRoute || route.startsWith(publicRoute + '/')
    );

    if (isPublicRoute) return true;

    // بررسی routes خاص نقش
    const allowedRoutes = ROLE_ROUTES[role] || [];
    return allowedRoutes.some(
      (allowedRoute) =>
        route === allowedRoute || route.startsWith(allowedRoute + '/')
    );
  };

  const logout = () => {
    setRole(null);
    userLogout();
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    role,
    hasRole,
    hasPermission,
    canAccessRoute,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
