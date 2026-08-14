'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Circle,
  CircleHelp,
  ClipboardCheck,
  FileQuestion,
  GraduationCap,
  Info,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  MessageSquare,
  Newspaper,
  Package,
  PanelRightClose,
  PanelRightOpen,
  Settings,
  ShieldCheck,
  ShoppingBag,
  User2,
  UserCog,
  UserRound,
  UsersRound,
  Video,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { User } from '@/app/lib/types';
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

const COLLAPSED_STORAGE_KEY = 'panel-sidebar-collapsed';

function menuIcon(href = ''): LucideIcon {
  if (href.includes('dashboard')) return LayoutDashboard;
  if (href.includes('tickets')) return LifeBuoy;
  if (href.includes('notifications')) return Bell;
  if (href.includes('security')) return ShieldCheck;
  if (href.includes('profile')) return UserCog;
  if (href.includes('students')) return UserRound;
  if (href.includes('teachers')) return GraduationCap;
  if (href.includes('/users')) return UsersRound;
  if (href.includes('attendances')) return ClipboardCheck;
  if (href.includes('offline-sessions')) return Video;
  if (href.includes('reports')) return BarChart3;
  if (href.includes('exams')) return FileQuestion;
  if (href.includes('blogs')) return Newspaper;
  if (href.includes('product-comments')) return MessageSquare;
  if (href.includes('products')) return Package;
  if (href.includes('orders')) return ShoppingBag;
  if (href.includes('certificates')) return Award;
  if (href.includes('faqs')) return CircleHelp;
  if (href.includes('guides')) return Megaphone;
  if (href.includes('about')) return Info;
  if (
    href.includes('terms') ||
    href.includes('homeworks') ||
    href.includes('course-pages')
  ) {
    return BookOpen;
  }
  return Circle;
}

function SidebarSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      className={`flex h-full flex-col border-l border-gray-100 bg-white shadow-lg transition-[width] duration-200 dark:border-gray-800 dark:bg-gray-900 ${compact ? 'w-20' : 'w-64'}`}
    >
      <div className="flex h-20 items-center justify-center border-b border-gray-100 dark:border-gray-800">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="flex items-center justify-center border-b border-gray-100 p-3 dark:border-gray-800">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        {!compact && (
          <div className="mr-3 flex-1 space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        )}
      </div>
      <div className="flex-1 space-y-2 p-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className={`h-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 ${compact ? 'w-12' : 'w-full'}`}
          />
        ))}
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsCollapsed(localStorage.getItem(COLLAPSED_STORAGE_KEY) === 'true');
  }, []);

  useEffect(() => {
    if (pathname !== previousPathname.current && isOpen && onClose) onClose();
    previousPathname.current = pathname;
  }, [isOpen, onClose, pathname]);

  const toggleCollapsed = () => {
    setIsCollapsed((current) => {
      const next = !current;
      localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
      return next;
    });
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return (
      pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
    );
  };

  const hasValidAvatar = isValidImageUrl(user?.profile_picture);

  const renderMenuItem = (item: MenuItem, expanded: boolean) => {
    if (item.isGroupTitle) {
      return (
        <div
          key={item.title}
          className={expanded ? 'space-y-1' : 'space-y-1.5'}
        >
          {expanded && (
            <div className="px-3 pt-3 pb-1 text-xs font-semibold text-gray-400 dark:text-gray-500">
              {item.title}
            </div>
          )}
          <div className={expanded ? 'space-y-1' : 'space-y-1.5'}>
            {item.subItems?.map((subItem) => renderMenuItem(subItem, expanded))}
          </div>
        </div>
      );
    }

    if (!item.href) return null;
    const Icon = menuIcon(item.href);
    const active = isActive(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        title={!expanded ? item.title : undefined}
        className={`group flex h-10 items-center rounded-lg text-sm transition-colors ${
          expanded ? 'gap-3 px-3' : 'mx-auto w-12 justify-center px-0'
        } ${
          active
            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-medium'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
        }`}
      >
        {item.icon || (
          <Icon
            className={`h-5 w-5 shrink-0 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'}`}
          />
        )}
        {expanded && <span className="truncate">{item.title}</span>}
      </Link>
    );
  };

  const sidebarContent = (expanded: boolean, mobile = false) => (
    <aside
      className={`relative flex h-full flex-col border-l border-gray-100 bg-white shadow-lg transition-[width] duration-200 dark:border-gray-800 dark:bg-gray-900 ${expanded ? 'w-64' : 'w-20'}`}
    >
      <div className="relative flex h-20 shrink-0 items-center border-b border-gray-100 px-4 dark:border-gray-800">
        <Link
          href="/"
          className={`flex min-w-0 items-center transition-opacity hover:opacity-80 ${expanded ? 'gap-2' : 'mx-auto'}`}
        >
          <Image src="/logo.svg" alt="کاکتوس" width={40} height={40} priority />
          {expanded && (
            <span className="from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-gradient-to-l bg-clip-text text-xl font-black text-transparent">
              کاکتوس
            </span>
          )}
        </Link>
        {mobile ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن منوی کناری"
            className="mr-auto rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={
              isCollapsed ? 'باز نگه داشتن سایدبار' : 'کوچک کردن سایدبار'
            }
            title={isCollapsed ? 'باز نگه داشتن سایدبار' : 'حالت مینی'}
            className="absolute top-7 -left-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-white"
          >
            {isCollapsed ? (
              <PanelRightOpen className="h-4 w-4" />
            ) : (
              <PanelRightClose className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {user && (
        <div
          className={`flex shrink-0 items-center border-b border-gray-100 p-3 dark:border-gray-800 ${expanded ? 'gap-3' : 'justify-center'}`}
        >
          <div className="relative shrink-0">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-50 ring-2 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
              {hasValidAvatar ? (
                <Image
                  src={getImageUrl(user.profile_picture) || ''}
                  alt={`${user.first_name} ${user.last_name}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <User2 className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border border-white bg-emerald-500 dark:border-gray-900" />
          </div>
          {expanded && (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  آنلاین
                </p>
              </div>
              <Link
                href="/user/profile"
                aria-label="تنظیمات حساب"
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <Settings className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      <nav
        className={`flex-1 overflow-y-auto py-2 ${expanded ? 'px-3' : 'px-1'}`}
      >
        {menuItems.map((item) => renderMenuItem(item, expanded))}
      </nav>

      {children && expanded && (
        <div className="border-t border-gray-100 p-4 dark:border-gray-800">
          {children}
        </div>
      )}
    </aside>
  );

  const desktopExpanded = !isCollapsed || isHovered;

  return (
    <>
      <div
        className={`relative hidden h-full shrink-0 transition-[width] duration-200 lg:block ${isCollapsed ? 'w-20' : 'w-64'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-y-0 right-0 z-30">
          {loading ? (
            <SidebarSkeleton compact={!desktopExpanded} />
          ) : user ? (
            sidebarContent(desktopExpanded)
          ) : null}
        </div>
      </div>

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
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 right-0 z-50 w-64 lg:hidden"
            >
              {loading ? (
                <SidebarSkeleton />
              ) : user ? (
                sidebarContent(true, true)
              ) : null}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
