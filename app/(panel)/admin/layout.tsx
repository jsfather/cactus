'use client';

import Header from '@/app/components/panel/Header';
import Sidebar from '@/app/components/panel/Sidebar';
import { useState } from 'react';
import { useUser } from '@/app/hooks/useUser';

const menuItems = [
  {
    title: 'داشبورد',
    isGroupTitle: true,
    subItems: [
      {
        title: 'خلاصه عملکرد',
        href: '/dashboard/summary',
      }
    ]
  },
  {
    title: 'کاربران',
    isGroupTitle: true,
    subItems: [
      {
        title: 'دانش پژوهان',
        href: '/users/students',
      },
      {
        title: 'مدرسین',
        href: '/users/teachers',
      },
      {
        title: 'همکاران',
        href: '/users/colleagues',
      },
      {
        title: 'نمایندگی ها',
        href: '/users/agencies',
      }
    ]
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
        title: 'کلاس های آنلاین',
        href: '/education/online-classes',
      },
      {
        title: 'دوره های آفلاین',
        href: '/admin/offline-courses',
      },
      {
        title: 'سیستم آزمون',
        href: '/education/exam-system',
      }
    ]
  }
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
