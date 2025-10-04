'use client';

import Header from '@/app/components/layout/panel/Header';
import Sidebar from '@/app/components/layout/panel/Sidebar';
import { RoleGuard } from '@/app/components/RoleGuard';
import { useState } from 'react';
import { useUser } from '@/app/hooks/useUser';

const menuItems = [
  {
    title: 'داشبورد',
    isGroupTitle: true,
    subItems: [
      {
        title: 'خلاصه عملکرد',
        href: '/student/dashboard',
      },
    ],
  },
  {
    title: 'آموزش',
    isGroupTitle: true,
    subItems: [
      {
        title: 'ترم ها',
        href: '/student/terms',
      },
      {
        title: 'تکلیف ها',
        href: '/student/homeworks',
      },
      {
        title: 'حضور و غیاب',
        href: '/student/attendances',
      },
    ],
  },
  {
    title: 'آزمون‌ها',
    isGroupTitle: true,
    subItems: [
      {
        title: 'آزمون تعیین سطح',
        href: '/student/placement-exam',
      },
    ],
  },
  {
    title: 'ارتباطات',
    isGroupTitle: true,
    subItems: [
      {
        title: 'تیکت ها',
        href: '/student/tickets',
      },
    ],
  },
  {
    title: 'فروشگاه',
    isGroupTitle: true,
    subItems: [
      {
        title: 'سفارشات',
        href: '/student/orders',
      },
    ],
  },
  {
    title: 'راهنما',
    isGroupTitle: true,
    subItems: [
      {
        title: 'راهنمای کار با پنل',
        href: '/student/guides',
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
    <RoleGuard allowedRoles={['student']}>
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
    </RoleGuard>
  );
}
