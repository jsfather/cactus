'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/hooks/useUser';
import Header from '@/app/components/panel/Header';
import Sidebar from '@/app/components/panel/Sidebar';

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { loading, error, isAuthenticated, user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      <div className="flex h-screen">
        <Sidebar
          menuItems={[]}
          isOpen={false}
          onClose={() => {}}
          loading={true}
        />
        <div className="flex flex-1 flex-col">
          <Header user={null} onMenuClick={() => {}} loading={true} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
