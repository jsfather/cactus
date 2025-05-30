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
        href: '/student/dashboard',
      }
    ]
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
    ]
  },
  {
    title: 'ارتباطات',
    isGroupTitle: true,
    subItems: [
      {
        title: 'تیکت ها',
        href: '/student/tickets',
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
