'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LogoutButton from '@/app/components/layout/LogoutButton';
import { LayoutDashboard, GraduationCap, User, User2, Settings } from 'lucide-react';
import Link from 'next/link';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { useUser } from '@/app/hooks/useUser';
import { getImageUrl, isValidImageUrl } from '@/app/lib/utils/image';

interface UserMenuProps {
  userName: string;
}

export function UserMenu({ userName }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center gap-2 rounded-full transition-all duration-200 hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800/50 dark:active:bg-gray-800"
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
        <div className="absolute left-0 z-50 mt-2 w-56 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-200 transition-all dark:bg-gray-900 dark:shadow-gray-900/50 dark:ring-gray-800">
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
                      حساب کاربری
                    </div>
                  </div>
                </div>
                <Link
                  href="/user/profile"
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
                  className="text-primary-600 dark:text-primary-400 mr-3 h-5 w-5 transition-colors"
                  strokeWidth={1.7}
                />
                <span>داشبورد ادمین</span>
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
                  className="text-primary-600 dark:text-primary-400 mr-3 h-5 w-5 transition-colors"
                  strokeWidth={1.7}
                />
                <span>داشبورد مدرس</span>
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
                  className="text-primary-600 dark:text-primary-400 mr-3 h-5 w-5 transition-colors"
                  strokeWidth={1.7}
                />
                <span>داشبورد دانش‌پژوه</span>
              </button>
            )}
            <div className="px-3">
              <div className="my-1 h-px bg-gray-200 dark:bg-gray-800" />
            </div>
            <div onClick={() => setShowLogoutConfirm(true)}>
              <LogoutButton />
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="خروج از حساب کاربری"
        description="آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟"
        confirmText="خروج"
        cancelText="انصراف"
        loading={isLoggingOut}
        variant="danger"
      />
    </div>
  );
}
