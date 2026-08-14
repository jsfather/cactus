'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LogoutButton from '@/app/components/layout/LogoutButton';
import {
  LayoutDashboard,
  GraduationCap,
  User,
  User2,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { useUser } from '@/app/hooks/useUser';
import { getImageUrl, isValidImageUrl } from '@/app/lib/utils/image';

interface UserMenuProps {
  userName: string;
  locale?: 'fa' | 'en';
}

const menuTranslations = {
  fa: {
    account: 'حساب کاربری',
    adminDashboard: 'داشبورد ادمین',
    teacherDashboard: 'داشبورد مدرس',
    studentDashboard: 'داشبورد دانش‌پژوه',
    logout: 'خروج',
    loggingOut: 'در حال خروج...',
    logoutTitle: 'خروج از حساب کاربری',
    logoutDescription:
      'آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟',
    cancel: 'انصراف',
    close: 'بستن',
    settings: 'تنظیمات حساب',
  },
  en: {
    account: 'User account',
    adminDashboard: 'Admin dashboard',
    teacherDashboard: 'Teacher dashboard',
    studentDashboard: 'Student dashboard',
    logout: 'Log out',
    loggingOut: 'Logging out...',
    logoutTitle: 'Log out of your account',
    logoutDescription: 'Are you sure you want to log out of your account?',
    cancel: 'Cancel',
    close: 'Close',
    settings: 'Account settings',
  },
} as const;

export function UserMenu({ userName, locale = 'fa' }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useUser();
  const copy = menuTranslations[locale];
  const direction = locale === 'en' ? 'ltr' : 'rtl';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      localStorage.removeItem('authToken');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  // Check if avatar URL is valid
  const hasValidAvatar = isValidImageUrl(user?.profile_picture);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="icon-button rounded-full"
        aria-label={copy.account}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-50 ring-2 ring-gray-100 dark:bg-gray-800 dark:ring-gray-800">
          {hasValidAvatar ? (
            <Image
              src={getImageUrl(user?.profile_picture) || ''}
              alt={`${user?.first_name} ${user?.last_name}`}
              fill
              className="object-cover"
              unoptimized={true}
            />
          ) : (
            <User2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          )}
        </div>
      </button>

      {isOpen && (
        <div
          dir={direction}
          role="menu"
          className={`absolute z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-white text-start shadow-xl ring-1 shadow-gray-950/10 ring-gray-200 transition-all dark:bg-gray-900 dark:shadow-gray-950/40 dark:ring-gray-800 ${locale === 'en' ? 'right-0' : 'left-0'}`}
        >
          <div className="py-2">
            <div className="border-b border-gray-200 px-4 py-3 text-sm text-gray-900 dark:border-gray-800 dark:text-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-50 ring-2 ring-gray-100 dark:bg-gray-800 dark:ring-gray-800">
                      {hasValidAvatar ? (
                        <Image
                          src={getImageUrl(user?.profile_picture) || ''}
                          alt={`${user?.first_name} ${user?.last_name}`}
                          fill
                          className="object-cover"
                          unoptimized={true}
                        />
                      ) : (
                        <User2 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">{userName}</div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {copy.account}
                    </div>
                  </div>
                </div>
                <Link
                  href="/user/profile"
                  aria-label={copy.settings}
                  className="p-1.5 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Settings className="text-primary-500 h-4 w-4" />
                </Link>
              </div>
            </div>
            {user?.role === 'admin' && (
              <button
                onClick={() => {
                  router.push('/admin/dashboard');
                  setIsOpen(false);
                }}
                className="flex w-full cursor-pointer items-center gap-2 p-3 text-gray-900 transition-colors hover:bg-gray-50/80 active:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800/50 dark:active:bg-gray-800"
              >
                <LayoutDashboard
                  className="text-primary-600 dark:text-primary-400 h-5 w-5 transition-colors"
                  strokeWidth={1.7}
                />
                <span>{copy.adminDashboard}</span>
              </button>
            )}
            {user?.role === 'teacher' && (
              <button
                onClick={() => {
                  router.push('/teacher/dashboard');
                  setIsOpen(false);
                }}
                className="flex w-full cursor-pointer items-center gap-2 p-3 text-gray-900 transition-colors hover:bg-gray-50/80 active:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800/50 dark:active:bg-gray-800"
              >
                <GraduationCap
                  className="text-primary-600 dark:text-primary-400 h-5 w-5 transition-colors"
                  strokeWidth={1.7}
                />
                <span>{copy.teacherDashboard}</span>
              </button>
            )}
            {user?.role === 'student' && (
              <button
                onClick={() => {
                  router.push('/student/dashboard');
                  setIsOpen(false);
                }}
                className="flex w-full cursor-pointer items-center gap-2 p-3 text-gray-900 transition-colors hover:bg-gray-50/80 active:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800/50 dark:active:bg-gray-800"
              >
                <User
                  className="text-primary-600 dark:text-primary-400 h-5 w-5 transition-colors"
                  strokeWidth={1.7}
                />
                <span>{copy.studentDashboard}</span>
              </button>
            )}
            <div className="px-3">
              <div className="my-1 h-px bg-gray-200 dark:bg-gray-800" />
            </div>
            <div onClick={() => setShowLogoutConfirm(true)}>
              <LogoutButton
                loading={isLoggingOut}
                label={copy.logout}
                loadingLabel={copy.loggingOut}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title={copy.logoutTitle}
        description={copy.logoutDescription}
        confirmText={copy.logout}
        cancelText={copy.cancel}
        closeLabel={copy.close}
        direction={direction}
        loading={isLoggingOut}
        variant="danger"
      />
    </div>
  );
}
