'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  menuItems: MenuItem[];
  children?: React.ReactNode;
}

export default function Sidebar({ menuItems, children }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-white p-4">
      <div className="flex-1 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 p-3 transition-colors ${
              isActive(item.href)
                ? 'bg-primary-200 text-primary-600 border-l-4'
                : 'hover:bg-primary-100 text-gray-800'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.title}
          </Link>
        ))}
      </div>
      <div className="mt-4 border-t border-gray-100 pt-4">{children}</div>
    </aside>
  );
}
