'use client';

import Header from '@/app/components/layout/panel/Header';
import Sidebar from '@/app/components/layout/panel/Sidebar';
import { useState } from 'react';
import { useUser } from '@/app/hooks/useUser';
import { RouteGuard } from '@/app/components/RouteGuard';

const menuItems = [
  {
    title: 'داشبورد',
    isGroupTitle: true,
    subItems: [
      {
        title: 'خلاصه عملکرد',
        href: '/manager/dashboard',
      },
    ],
  },
  {
    title: 'کاربران',
    isGroupTitle: true,
    subItems: [
      {
        title: 'دانش پژوهان',
        href: '/manager/students',
      },
      {
        title: 'مدرسین',
        href: '/manager/teachers',
      },
    ],
  },
  {
    title: 'آموزش',
    isGroupTitle: true,
    subItems: [
      {
        title: 'دوره ها',
        href: '/manager/courses',
      },
      {
        title: 'ترم ها',
        href: '/manager/terms',
      },
    ],
  },
  {
    title: 'گزارش‌ها',
    isGroupTitle: true,
    subItems: [
      {
        title: 'آنالیتیکس',
        href: '/manager/analytics',
      },
    ],
  },
  {
    title: 'ارتباطات',
    isGroupTitle: true,
    subItems: [
      {
        title: 'تیکت ها',
        href: '/manager/tickets',
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
    <RouteGuard requiredRole="manager">
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
    </RouteGuard>
  );
}
