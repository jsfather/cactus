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
        title: 'کاربران',
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
        title: 'محصولات',
        href: '/admin/products',
      },
      {
        title: 'سفارشات',
        href: '/admin/orders',
      },
      {
        title: 'سوالات متداول',
        href: '/admin/faqs',
      },
      {
        title: 'راهنماهای پنل',
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
];

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useUser();

  return (
    <RoleGuard allowedRoles={['admin']}>
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
