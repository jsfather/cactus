'use client';

import Header from '@/app/components/layout/panel/Header';
import Sidebar from '@/app/components/layout/panel/Sidebar';
import { useState } from 'react';
import { useUser } from '@/app/hooks/useUser';

const menuItems = [
  {
    title: 'حساب کاربری',
    isGroupTitle: true,
    subItems: [
      {
        title: 'اطلاعات کاربری',
        href: '/user/profile',
      },
      {
        title: 'تغییر رمز عبور',
        href: '/user/security',
      },
      {
        title: 'اعلان‌های من',
        href: '/user/notifications',
      },
      {
        title: 'راهنمای پنل',
        href: '/user/guides',
      },
    ],
  },
];

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useUser();

  return (
    <div
      dir="rtl"
      lang="fa"
      className="app-shell flex h-dvh min-w-0 overflow-hidden"
    >
      <Sidebar
        user={user || undefined}
        menuItems={menuItems}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        loading={loading}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          user={user}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          loading={loading}
        />
        <main className="panel-content min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
          <div className="mx-auto w-full max-w-[1520px] min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
