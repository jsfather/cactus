import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Newspaper, MessageCircleQuestion, Landmark , PenSquare } from 'lucide-react';

const menuItems = [
  {
    title: 'بلاگ',
    href: '/admin/blogs',
    icon: <Newspaper width={17} strokeWidth={1.7} />,
  },
  {
    title: 'امتحانات',
    href: '/admin/exams',
    icon: <PenSquare width={17} strokeWidth={1.7} />,
  },
  {
    title: 'سوالات متداول',
    href: '/admin/faq',
    icon: <MessageCircleQuestion width={17} strokeWidth={1.7} />,
  },
  {
    title: 'مالی',
    href: '/admin/financial',
    icon: <Landmark width={17} strokeWidth={1.7} />,
  },
];

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar menuItems={menuItems} />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
