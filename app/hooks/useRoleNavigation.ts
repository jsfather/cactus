import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { UserRole } from '@/app/lib/types';

export function useRoleNavigation() {
  const router = useRouter();
  const { role, isAuthenticated } = useAuth();

  const navigateToRoleDashboard = (userRole?: UserRole | null) => {
    const targetRole = userRole || role;

    if (!isAuthenticated || !targetRole) {
      router.push('/send-otp');
      return;
    }

    switch (targetRole) {
      case 'admin':
        router.push('/admin');
        break;
      case 'manager':
        router.push('/manager');
        break;
      case 'student':
        router.push('/student');
        break;
      default:
        router.push('/');
    }
  };

  const navigateToProfile = () => {
    if (!isAuthenticated) {
      router.push('/send-otp');
      return;
    }
    router.push('/user/profile');
  };

  const canNavigateTo = (path: string): boolean => {
    if (!isAuthenticated) return false;

    // بررسی دسترسی بر اساس نقش
    const roleBasedAccess: Record<UserRole, string[]> = {
      admin: ['/admin', '/manager', '/student', '/user'],
      manager: ['/manager', '/user'],
      student: ['/student', '/user'],
    };

    if (!role) return false;

    const allowedPaths = roleBasedAccess[role];
    return allowedPaths.some((allowedPath) => path.startsWith(allowedPath));
  };

  return {
    navigateToRoleDashboard,
    navigateToProfile,
    canNavigateTo,
    currentRole: role,
    isAuthenticated,
  };
}
