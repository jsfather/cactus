'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoutButton from '@/app/components/layout/LogoutButton';
import { LayoutDashboard, GraduationCap, User, Settings } from 'lucide-react';
import Link from 'next/link';

interface UserMenuProps {
  userName: string;
}

export function UserMenu({ userName }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center gap-2 rounded-full transition-all duration-200 hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800/50 dark:active:bg-gray-800"
      >
        <div className="bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 flex h-9 w-9 items-center justify-center rounded-full font-semibold transition-colors">
          {userName.charAt(0).toUpperCase()}
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-200 transition-all dark:bg-gray-900 dark:shadow-gray-900/50 dark:ring-gray-800">
          <div className="py-2">
            <div className="border-b border-gray-200 px-4 py-3 text-sm text-gray-900 dark:border-gray-800 dark:text-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{userName}</div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    حساب کاربری
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
              <span>داشبورد دانش آموز</span>
            </button>
            <div className="px-3">
              <div className="my-1 h-px bg-gray-200 dark:bg-gray-800" />
            </div>
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
