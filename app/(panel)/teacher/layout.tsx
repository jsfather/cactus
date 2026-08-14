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
        href: '/teacher/dashboard',
      },
    ],
  },
  {
    title: 'آموزش',
    isGroupTitle: true,
    subItems: [
      {
        title: 'ترم ها',
        href: '/teacher/terms',
      },
      {
        title: 'تکلیف ها',
        href: '/teacher/homeworks',
      },
      {
        title: 'حضور و غیاب',
        href: '/teacher/attendances',
      },
      {
        title: 'کلاس های آفلاین',
        href: '/teacher/offline-sessions',
      },
      {
        title: 'گزارش ها',
        href: '/teacher/reports',
      },
    ],
  },
  {
    title: 'کاربران',
    isGroupTitle: true,
    subItems: [
      {
        title: 'دانش‌پژوهان',
        href: '/teacher/students',
      },
    ],
  },
  {
    title: 'ارتباطات',
    isGroupTitle: true,
    subItems: [
      {
        title: 'تیکت ها',
        href: '/teacher/tickets',
      },
      {
        title: 'اعلان‌های من',
        href: '/user/notifications',
      },
      {
        title: 'راهنمای پنل',
        href: '/user/guides',
      },
      {
        title: 'تغییر رمز عبور',
        href: '/user/security',
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
    <RoleGuard allowedRoles={['teacher']}>
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
    </RoleGuard>
  );
}
