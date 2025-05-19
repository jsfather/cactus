import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { LayoutDashboard, Users, GraduationCap, Landmark } from 'lucide-react';

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
    title: 'آموزش',
    href: '/admin/education',
    icon: <GraduationCap width={17} strokeWidth={1.7} />,
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
