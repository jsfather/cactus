'use client'

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const isAuthRoute = pathname?.startsWith('/auth');

    if (!token && !isAuthRoute) {
      router.push('/auth/send-otp');
    } else if (token && isAuthRoute) {
      router.push('/admin/dashboard');
    }

    setIsLoading(false);
  }, [router, pathname]);

  return { isLoading };
}
