'use client';

import { Menu } from 'lucide-react';
import moment from 'jalali-moment';
import type { User } from '@/app/lib/types';
import DarkModeToggle from '@/app/components/ui/DarkModeToggle';
import { usePathname } from 'next/navigation';
import { UserMenu } from '@/app/components/layout/UserMenu';

interface HeaderProps {
  user: User | null;
  onMenuClick: () => void;
  loading?: boolean;
}

const routeTitles: Record<string, string> = {
  dashboard: 'داشبورد',
  students: 'دانش‌پژوهان',
  teachers: 'مدرسین',
  users: 'همکاران',
  terms: 'ترم‌ها',
  'term-teachers': 'ترم مدرسین',
  'term-students': 'ترم دانش‌پژوهان',
  homeworks: 'تکلیف‌ها',
  attendances: 'حضور و غیاب',
  'offline-sessions': 'جلسات آفلاین',
  reports: 'گزارش‌ها',
  exams: 'آزمون‌ها',
  blogs: 'بلاگ',
  'course-pages': 'دوره‌ها',
  products: 'محصولات',
  'product-comments': 'نظرات محصولات',
  orders: 'سفارش‌ها',
  certificates: 'گواهینامه‌ها',
  faqs: 'سوالات متداول',
  'panel-guides': 'تابلوی اعلانات',
  guides: 'راهنمای پنل',
  notifications: 'اعلان‌های من',
  tickets: 'تیکت‌ها',
  profile: 'اطلاعات کاربری',
  security: 'امنیت حساب',
  'about-us': 'درباره ما',
  'placement-exam': 'آزمون تعیین سطح',
};

function getPageTitle(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const section = segments[1] || segments[0] || 'dashboard';
  return routeTitles[section] || 'پنل کاربری';
}

export default function Header({
  user,
  onMenuClick,
  loading = false,
}: HeaderProps) {
  const pathname = usePathname();
  const formattedDate = moment().locale('fa').format('dddd، D MMMM');
  const title = getPageTitle(pathname);
  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : '';

  return (
    <header className="relative z-20 flex h-[72px] min-w-0 shrink-0 items-center border-b border-gray-200/80 bg-white/90 px-3 backdrop-blur-xl sm:px-5 dark:border-gray-800 dark:bg-gray-900/90">
      <button
        type="button"
        onClick={onMenuClick}
        className="icon-button ml-2 lg:hidden"
        aria-label="باز کردن منوی اصلی"
        aria-haspopup="dialog"
      >
        <Menu className="h-5.5 w-5.5" aria-hidden="true" />
      </button>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
        <div className="min-w-0">
          {loading ? (
            <div
              className="space-y-2"
              role="status"
              aria-label="در حال بارگذاری اطلاعات کاربر"
            >
              <div className="h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-20 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          ) : (
            <>
              <p className="truncate text-sm font-bold text-gray-900 sm:text-base dark:text-white">
                {title}
              </p>
              <p className="mt-0.5 hidden truncate text-xs text-gray-500 sm:block dark:text-gray-400">
                {fullName ? `${fullName}، ${formattedDate}` : formattedDate}
              </p>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {loading ? (
            <>
              <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
              <div className="h-11 w-24 animate-pulse rounded-xl bg-gray-100 sm:w-36 dark:bg-gray-800" />
            </>
          ) : (
            <>
              <DarkModeToggle />
              <UserMenu userName={fullName || 'حساب کاربری'} />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
