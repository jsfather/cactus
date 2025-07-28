'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export function AuthRedirectHandler() {
  const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // اگر کاربر لاگین است و در صفحات auth قرار دارد
    if (
      isAuthenticated &&
      role &&
      (pathname === '/send-otp' || pathname === '/verify-otp')
    ) {
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
  }, [isAuthenticated, role, loading, pathname, router]);

  return null; // این کامپوننت چیزی رندر نمی‌کند
}

export default AuthRedirectHandler;
