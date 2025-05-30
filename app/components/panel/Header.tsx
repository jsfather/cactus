'use client';

import { Search, Menu } from 'lucide-react';
import moment from 'jalali-moment';
import { User } from '@/app/lib/types';
import DarkModeToggle from '@/app/components/DarkModeToggle';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { UserMenu } from '@/app/components/UserMenu';

interface HeaderProps {
  user: User | null;
  onMenuClick: () => void;
  loading?: boolean;
}

const Header = ({ user, onMenuClick, loading = false }: HeaderProps) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const pathname = usePathname();
  const formattedDate = moment().locale('fa').format('dddd، D MMMM YYYY');

  // Reset mobile search when route changes
  useEffect(() => {
    setShowMobileSearch(false);
  }, [pathname]);

  return (
    <div className="flex flex-col">
      <header className="flex h-[80px] flex-row bg-white shadow-sm dark:bg-gray-900 dark:border-b dark:border-gray-800">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="flex w-16 items-center justify-center border-l border-gray-100 dark:border-gray-800 lg:hidden"
        >
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300 cursor-pointer" />
        </button>

        <nav className="flex w-full items-center justify-between px-4 lg:px-6">
          <div className="flex w-full items-center">
            {loading ? (
              <div className="hidden lg:flex items-center gap-2">
                {/* Welcome text skeleton */}
                <div className="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-5 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mx-2 h-5 w-1 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                {/* Date skeleton */}
                <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ) : !user ? null : (
              <div className="hidden items-center text-gray-700 dark:text-gray-200 lg:flex">
                <span>وقت بخیر</span>
                <div className="mx-1">{user.first_name}</div>
                <span>عزیز</span>
                <span className="mx-2 text-gray-400 dark:text-gray-500">|</span>
                <span>{formattedDate}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile search toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 cursor-pointer dark:hover:text-white lg:hidden"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Desktop search */}
            {loading ? (
              <div className="relative hidden lg:block">
                <div className="w-64 h-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                <span className="absolute top-2.5 left-3 text-gray-400">
                  <Search className="h-5 w-5" />
                </span>
              </div>
            ) : (
              <div className="relative hidden lg:block">
                <input
                  type="text"
                  placeholder="جستجو ..."
                  className="w-64 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                />
                <span className="absolute top-2.5 left-3 text-gray-500 dark:text-gray-400">
                  <Search className="h-5 w-5" />
                </span>
              </div>
            )}

            {/* Dark mode toggle skeleton */}
            {loading ? (
              <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            ) : (
              <DarkModeToggle />
            )}

            {/* User menu skeleton */}
            {loading ? (
              <div className="h-10 w-40 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            ) : (
              <UserMenu userName={user?.first_name + ' ' + user?.last_name} />
            )}
          </div>
        </nav>
      </header>

      {/* Mobile search bar */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 lg:hidden"
          >
            <div className="container mx-auto p-4">
              <div className="relative">
                {loading ? (
                  <div className="w-full h-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="جستجو ..."
                      className="focus:ring-primary-500 w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                    />
                    <span className="absolute top-2.5 left-3 text-gray-500 dark:text-gray-400">
                      <Search className="h-5 w-5" />
                    </span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
