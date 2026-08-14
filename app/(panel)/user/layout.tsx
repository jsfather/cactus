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
      className="flex h-dvh min-w-0 overflow-hidden bg-gray-50 dark:bg-gray-900"
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
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 dark:bg-gray-900">
          <div className="mx-auto w-full max-w-[1600px] min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
