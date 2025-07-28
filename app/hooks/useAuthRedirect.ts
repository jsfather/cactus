import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export function useAuthRedirect() {
  const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated && role) {
      // اگر کاربر لاگین است و در صفحات auth است، به داشبورد هدایت شود
      const currentPath = window.location.pathname;

      if (currentPath === '/send-otp' || currentPath === '/verify-otp') {
        switch (role) {
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
      }
    }
  }, [isAuthenticated, role, loading, router]);
}

export default useAuthRedirect;
