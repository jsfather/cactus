import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/app/lib/api/client';

interface ApiErrorBoundaryProps {
  children: React.ReactNode;
}

export function ApiErrorBoundary({ children }: ApiErrorBoundaryProps) {
  const router = useRouter();

  useEffect(() => {
    // Global error handler for unhandled API errors
    const handleGlobalError = (event: any) => {
      if (event.error instanceof ApiError) {
        if (event.error.status === 401) {
          localStorage.removeItem('authToken');
          router.push('/login');
        }
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason instanceof ApiError) {
        if (event.reason.status === 401) {
          localStorage.removeItem('authToken');
          router.push('/login');
        }
      }
    });

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleGlobalError);
    };
  }, [router]);

  return <>{children}</>;
}