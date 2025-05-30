'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/hooks/useUser';

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { loading, error, isAuthenticated } = useUser();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/send-otp');
      return;
    }

    if (error?.message.includes('401')) {
      router.push('/send-otp');
    }
  }, [loading, isAuthenticated, error, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
} 