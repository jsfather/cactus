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
        href: '/admin/dashboard',
      },
    ],
  },
  {
    title: 'کاربران',
    isGroupTitle: true,
    subItems: [
      {
        title: 'دانش پژوهان',
        href: '/admin/students',
      },
      {
        title: 'مدرسین',
        href: '/admin/teachers',
      },
      {
        title: 'همکاران',
        href: '/admin/users',
      },
    ],
  },
  {
    title: 'آموزش',
    isGroupTitle: true,
    subItems: [
      {
        title: 'ترم ها',
        href: '/admin/terms',
      },
      {
        title: 'ترم مدرسین',
        href: '/admin/term-teachers',
      },
      {
        title: 'ترم دانش پژوهان',
        href: '/admin/term-students',
      },
      {
        title: 'جلسات آفلاین',
        href: '/admin/offline-sessions',
      },
      {
        title: 'گزارشات',
        href: '/admin/reports',
      },
      {
        title: 'حضور و غیاب',
        href: '/admin/attendances',
      },
      {
        title: 'آزمون ها',
        href: '/admin/exams',
      },
    ],
  },
  {
    title: 'محتوا',
    isGroupTitle: true,
    subItems: [
      {
        title: 'بلاگ',
        href: '/admin/blogs',
      },
      {
        title: 'دوره‌ها',
        href: '/admin/course-pages',
      },
      {
        title: 'محصولات',
        href: '/admin/products',
      },
      {
        title: 'نظرات محصولات',
        href: '/admin/product-comments',
      },
      {
        title: 'سفارشات',
        href: '/admin/orders',
      },
      {
        title: 'افتخارات و گواهینامه‌ها',
        href: '/admin/certificates',
      },
      {
        title: 'سوالات متداول',
        href: '/admin/faqs',
      },
      {
        title: 'تابلوی اعلانات',
        href: '/admin/panel-guides',
      },
    ],
  },
  {
    title: 'ارتباطات',
    isGroupTitle: true,
    subItems: [
      {
        title: 'تیکت ها',
        href: '/admin/tickets',
      },
    ],
  },
  {
    title: 'تنظیمات',
    isGroupTitle: true,
    subItems: [
      {
        title: 'درباره ما',
        href: '/admin/about-us',
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
    <RoleGuard allowedRoles={['admin']}>
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
