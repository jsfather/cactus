'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/hooks/useUser';
import Header from '@/app/components/layout/panel/Header';
import Sidebar from '@/app/components/layout/panel/Sidebar';

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { loading, error, isAuthenticated } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Public pages may be switched to English. Panel routes intentionally use
    // a fixed Persian/RTL presentation without changing the saved public locale.
    document.documentElement.lang = 'fa';
    document.documentElement.dir = 'rtl';
    document.body.classList.remove('font-dana');
    document.body.classList.add('font-dana-fanum');
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!loading && !isAuthenticated) {
      router.push('/send-otp');
      return;
    }

    if (error?.message.includes('401')) {
      router.push('/send-otp');
    }
  }, [loading, isAuthenticated, error, router, mounted]);

  if (typeof window === 'undefined') {
    return null;
  }

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div dir="rtl" lang="fa" className="flex h-dvh min-w-0 overflow-hidden">
        <Sidebar
          menuItems={[]}
          isOpen={false}
          onClose={() => {}}
          loading={true}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header user={null} onMenuClick={() => {}} loading={true} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div dir="rtl" lang="fa" className="contents">
      {children}
    </div>
  );
}
