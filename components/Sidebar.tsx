'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface MenuItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface User {
  name: string;
  avatarUrl: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  user: User;
  children?: React.ReactNode;
}

export default function Sidebar({ menuItems, user, children }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Defensive check for avatarUrl
  let avatarSrc = '/default-avatar.jpg';
  if (user.avatarUrl && (user.avatarUrl.startsWith('http') || user.avatarUrl.startsWith('/'))) {
    avatarSrc = user.avatarUrl;
  }

  return (
    <aside className="flex h-full w-64 flex-col bg-white p-4">
      {/* User avatar section */}
      <div className="flex flex-col items-center bg-primary-200 py-6 mb-4">
        <div className="relative">
          <Image
            src={avatarSrc}
            alt={user.name}
            width={64}
            height={64}
            className="rounded-full border-4 border-white shadow-md"
          />
          {/* Green dot */}
          <span className="absolute bottom-1 right-1 block h-4 w-4 rounded-full border-2 border-white bg-green-500"></span>
        </div>
        <div className="mt-2 text-lg font-semibold text-gray-900">{user.name}</div>
      </div>
      {/* Menu items */}
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
