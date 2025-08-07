import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from './useUser';
import { UserRole } from '@/app/lib/types';

interface UseRoleGuardOptions {
  allowedRoles: UserRole[];
  redirectTo?: string;
  loading?: boolean;
}

export function useRoleGuard({
  allowedRoles,
  redirectTo,
  loading,
}: UseRoleGuardOptions) {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while loading
    if (loading || userLoading) return;

    // If no user, redirect to login
    if (!user) {
      router.push('/send-otp');
      return;
    }

    // If user role is not allowed, redirect
    if (!allowedRoles.includes(user.role)) {
      const userDashboard = `/${user.role}/dashboard`;
      router.push(redirectTo || userDashboard);
      return;
    }
  }, [user, userLoading, loading, allowedRoles, redirectTo, router]);

  return {
    user,
    loading: loading || userLoading,
    hasAccess: user ? allowedRoles.includes(user.role) : false,
  };
}

export function useRoleRedirect() {
  const { user, loading } = useUser();
  const router = useRouter();

  const redirectToRoleDashboard = () => {
    if (!loading && user) {
      router.push(`/${user.role}/dashboard`);
    }
  };

  return {
    user,
    loading,
    redirectToRoleDashboard,
  };
}
