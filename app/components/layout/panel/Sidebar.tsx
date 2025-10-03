'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { User2, X, Settings } from 'lucide-react';
import { User } from '@/app/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { getImageUrl, isValidImageUrl } from '@/app/lib/utils/image';

interface MenuItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  isGroupTitle?: boolean;
  subItems?: MenuItem[];
}

interface SidebarProps {
  menuItems: MenuItem[];
  user?: User;
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  loading?: boolean;
}

function SidebarSkeleton() {
  return (
    <aside className="flex h-full w-64 flex-col bg-white shadow-lg dark:border-l dark:border-gray-800 dark:bg-gray-900">
      <div className="flex h-[80px] items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Image src="/logo.svg" alt="logo" width={40} height={40} />
          <span className="from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-gradient-to-l bg-clip-text text-xl font-black text-transparent">
            کاکتوس
          </span>
        </Link>
      </div>

      {/* Skeleton avatar section */}
      <div className="flex items-center gap-3 border-b border-gray-100 p-3 dark:border-gray-800">
        <div className="relative flex-shrink-0">
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border border-white bg-gray-300 dark:border-gray-900 dark:bg-gray-600"></div>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="mb-1 h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="h-6 w-6 flex-shrink-0 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      {/* Skeleton menu items */}
      <div className="flex-1 space-y-6 overflow-y-auto p-3">
        {/* First group */}
        <div className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mr-2 space-y-2 border-r border-gray-200 pr-2 dark:border-gray-700">
            <div className="h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        {/* Second group */}
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mr-2 space-y-2 border-r border-gray-200 pr-2 dark:border-gray-700">
            <div className="h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        {/* Third group */}
        <div className="space-y-2">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mr-2 space-y-2 border-r border-gray-200 pr-2 dark:border-gray-700">
            <div className="h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function Sidebar({
  menuItems,
  user,
  children,
  isOpen,
  onClose,
  loading = false,
}: SidebarProps) {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  // Close sidebar when route changes
  useEffect(() => {
    if (pathname !== previousPathname.current && isOpen && onClose) {
      onClose();
    }
    previousPathname.current = pathname;
  }, [pathname, isOpen, onClose]);

  if (loading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden lg:block">
          <SidebarSkeleton />
        </div>

        {/* Mobile skeleton with overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed inset-y-0 right-0 z-50 w-64 lg:hidden"
              >
                <SidebarSkeleton />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  if (!user) return null;

  const isActive = (href?: string) => {
    if (!href) return false;

    // Exact match
    if (pathname === href) return true;

    // Parent path match (e.g., /shop matches /shop/123)
    if (href !== '/' && pathname.startsWith(href + '/')) return true;

    // Special case for index routes (e.g., /shop matches /shop)
    return href !== '/' && pathname === href.slice(0, -1);
  };

  // Check if avatar URL is valid
  const hasValidAvatar = isValidImageUrl(user.profile_picture);

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    if (item.isGroupTitle) {
      return (
        <div key={item.title} className="space-y-1">
          <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
            {item.title}
          </div>
          {item.subItems && (
            <div className="mr-2 space-y-1 border-r border-gray-200 pr-2 dark:border-gray-700">
              {item.subItems.map((subItem) =>
                renderMenuItem(subItem, depth + 1)
              )}
            </div>
          )}
        </div>
      );
    }

    return item.href ? (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
          isActive(item.href)
            ? 'bg-primary-100 border-primary-600 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 border-l-2 font-medium'
            : 'hover:bg-primary-100/90 dark:hover:bg-primary-900/10 text-gray-700 dark:text-gray-200'
        }`}
        style={{ paddingLeft: `${depth}rem` }}
      >
        {item.icon && <span>{item.icon}</span>}
        {item.title}
      </Link>
    ) : null;
  };

  const sidebarContent = (
    <aside className="flex h-full w-64 flex-col bg-white shadow-lg dark:border-l dark:border-gray-800 dark:bg-gray-900">
      {/* Logo section */}
      <div className="flex h-[80px] items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Image src="/logo.svg" alt="کاکتوس" width={40} height={40} priority />
          <span className="from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-gradient-to-l bg-clip-text text-xl font-black text-transparent">
            کاکتوس
          </span>
        </Link>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 lg:hidden dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-5 w-5 cursor-pointer" />
        </button>
      </div>

      {/* User avatar section */}
      <div className="flex items-center gap-3 border-b border-gray-100 p-3 dark:border-gray-800">
        <div className="relative flex-shrink-0">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-50 ring-2 ring-gray-100 dark:bg-gray-800 dark:ring-gray-800">
            {hasValidAvatar ? (
              <Image
                src={getImageUrl(user.profile_picture) || ''}
                alt={`${user.first_name} ${user.last_name}`}
                fill
                className="object-cover"
                unoptimized={true}
              />
            ) : (
              <User2 className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            )}
          </div>
          <div className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border border-white bg-green-500 dark:border-gray-900"></div>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">{`${user.first_name} ${user.last_name}`}</h3>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              آنلاین
            </div>
          </div>
          <Link
            href="/user/profile"
            className="flex-shrink-0 p-1.5 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Settings className="text-primary-500 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Menu items */}
      <div className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {menuItems.map((item) => renderMenuItem(item))}
      </div>

      {children && (
        <div className="mt-4 border-t border-gray-100 p-4 dark:border-gray-800">
          {children}
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">{sidebarContent}</div>

      {/* Mobile sidebar with overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-64 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
