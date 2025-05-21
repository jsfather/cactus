'use client';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import {
  Newspaper,
  MessageCircleQuestion,
  BookType,
  PenSquare,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

const menuItems = [
  {
    title: 'داشبورد',
    href: '/admin/dashboard',
    icon: <LayoutDashboard width={17} strokeWidth={1.7} />,
  },
  {
    title: 'کاربران',
    href: '/admin/users',
    icon: <Users width={17} strokeWidth={1.7} />,
  },
  {
    title: 'بلاگ',
    href: '/admin/blogs',
    icon: <Newspaper width={17} strokeWidth={1.7} />,
  },
  {
    title: 'ترم ها',
    href: '/admin/terms',
    icon: <BookType width={17} strokeWidth={1.7} />,
  },
  {
    title: 'آزمون ها',
    href: '/admin/exams',
    icon: <PenSquare width={17} strokeWidth={1.7} />,
  },
  {
    title: 'سوالات متداول',
    href: '/admin/faq',
    icon: <MessageCircleQuestion width={17} strokeWidth={1.7} />,
  },
];

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar menuItems={menuItems}>
          <LogoutButton />
        </Sidebar>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
