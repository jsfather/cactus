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
        href: '/user/password',
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
    <div className="flex h-screen">
      <Sidebar
        user={user || undefined}
        menuItems={menuItems}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        loading={loading}
      />
      <div className="flex flex-1 flex-col">
        <Header
          user={user}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          loading={loading}
        />
        <main className="flex-1 overflow-y-auto p-4 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
