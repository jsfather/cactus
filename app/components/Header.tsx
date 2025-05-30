'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserMenu } from '@/app/components/UserMenu';
import { Button } from '@/app/ui/button';
import { useEffect, useState } from 'react';
import request from '@/app/lib/api/client';
import { useRouter } from 'next/navigation';
import { User } from '@/app/lib/types';
import DarkModeToggle from '@/app/components/DarkModeToggle';
import { Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/app/hooks/useUser';

const menuItems = [
  { title: 'دوره‌ها', href: '/courses' },
  { title: 'مربیان', href: '/teachers' },
  { title: 'درباره ما', href: '/about' },
  { title: 'وبلاگ', href: '/blog' },
  { title: 'فروشگاه', href: '/shop' },
];

export default function Header() {
  const { user, loading, error } = useUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (error?.message.includes('401')) {
      router.push('/send-otp');
    }
  }, [error, router]);

  // Close drawer when route changes
  useEffect(() => {
    setIsDrawerOpen(false);
    setShowMobileSearch(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
        <div className="container mx-auto h-20 px-4">
          <div className="flex h-full items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="text-gray-600 hover:text-gray-900 cursor-pointer dark:text-gray-300 dark:hover:text-white lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="لوگو کاکتوس"
                  width={60}
                  height={60}
                  className="hidden rounded-xl lg:block"
                />
                <span className="from-primary-600 to-primary-800 mx-2 hidden bg-gradient-to-l bg-clip-text text-2xl font-black text-transparent lg:block">
                  کاکتوس
                </span>
              </Link>

              <nav className="hidden items-center gap-6 lg:flex">
                {menuItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`font-medium transition-colors duration-200 ${
                      pathname === item.href
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 cursor-pointer dark:hover:text-white lg:hidden"
              >
                <Search className="h-6 w-6" />
              </button>

              {/* Desktop Search */}
              <div className="relative hidden lg:block">
                <input
                  type="text"
                  placeholder="جستجو ..."
                  className="focus:ring-primary-500 w-64 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                />
                <span className="absolute top-2.5 left-3 text-gray-500 dark:text-gray-400">
                  <Search className="h-5 w-5" />
                </span>
              </div>

              <DarkModeToggle />

              {loading ? (
                <div className="h-10 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              ) : user ? (
                <UserMenu userName={user.first_name + ' ' + user.last_name} />
              ) : (
                <Link href="/send-otp">
                  <Button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transform rounded-full px-6 py-2 text-white transition-all duration-200 hover:scale-105">
                    ورود / ثبت نام
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
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
                  <input
                    type="text"
                    placeholder="جستجو ..."
                    className="focus:ring-primary-500 w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                  />
                  <span className="absolute top-2.5 left-3 text-gray-500 dark:text-gray-400">
                    <Search className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Drawer - Outside header */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 overflow-y-auto bg-white p-6 shadow-xl dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/logo.png"
                    alt="لوگو کاکتوس"
                    width={48}
                    height={48}
                    className="rounded-xl"
                  />
                  <span className="from-primary-600 to-primary-800 bg-gradient-to-l bg-clip-text text-xl font-black text-transparent">
                    کاکتوس
                  </span>
                </Link>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-gray-600 hover:text-gray-900 cursor-pointer dark:text-gray-300 dark:hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="mt-8 space-y-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`block rounded-lg px-4 py-2.5 font-medium transition-colors duration-200 ${
                      pathname === item.href
                        ? 'bg-primary-200 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>

              <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
                {!user && (
                  <Link href="/send-otp" className="block">
                    <Button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 w-full transform rounded-full px-6 py-2.5 text-white transition-all duration-200 hover:scale-105">
                      ورود / ثبت نام
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
