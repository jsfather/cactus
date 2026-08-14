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
    title: 'اعلانات',
    isGroupTitle: true,
    subItems: [
      {
        title: 'تابلوی اعلانات',
        href: '/student/guides',
      },
      {
        title: 'اعلان‌های من',
        href: '/user/notifications',
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
    <RoleGuard allowedRoles={['student']}>
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
    </RoleGuard>
  );
}
