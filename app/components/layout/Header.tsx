'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserMenu } from '@/app/components/layout/UserMenu';
import { Button } from '@/app/components/ui/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DarkModeToggle from '@/app/components/ui/DarkModeToggle';
import { Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/app/hooks/useUser';
import { CartMenu } from '@/app/components/layout/CartMenu';
import LanguageSwitcher from '@/app/components/ui/LanguageSwitcher';
import { useLocale } from '@/app/contexts/LocaleContext';

export default function Header() {
  const { user, loading, error } = useUser();
  const { t } = useLocale();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowMobileSearch(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e as unknown as React.FormEvent);
    }
  };

  const menuItems = [
    { title: t.nav.courses, href: '/courses' },
    { title: t.nav.teachers, href: '/teachers' },
    { title: t.nav.about, href: '/about' },
    { title: t.nav.blog, href: '/blog' },
    { title: t.nav.shop, href: '/shop' },
    { title: t.nav.certifications, href: '/certifications' },
    { title: t.nav.requirements, href: '/requirements' },
  ];

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

  const isActive = (href: string) => {
    // Exact match
    if (pathname === href) return true;

    // Parent path match (e.g., /shop matches /shop/123)
    if (href !== '/' && pathname.startsWith(href + '/')) return true;

    // Special case for index routes (e.g., /shop matches /shop)
    return href !== '/' && pathname === href.slice(0, -1);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900/80 ${
          isScrolled ? 'shadow-lg' : ''
        }`}
      >
        <div className="container mx-auto h-20 px-4">
          <div className="flex h-full items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="cursor-pointer rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-8">
              <Link href="/" className="hidden items-center gap-2 lg:flex">
                <Image
                  src="/logo.svg"
                  alt="کاکتوس"
                  width={56}
                  height={56}
                  priority
                  className="transition-all duration-300 dark:brightness-0 dark:invert"
                />
                <span className="from-primary-600 to-primary-800 mx-2 hidden bg-gradient-to-l bg-clip-text text-2xl font-black text-transparent lg:block">
                  {t.common.siteName}
                </span>
              </Link>

              <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
                {menuItems.slice(0, 5).map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`text-sm font-medium transition-colors duration-200 xl:text-base ${
                      isActive(item.href)
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'hover:text-primary-600 dark:hover:text-primary-400 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}

                {/* More menu for additional items */}
                {menuItems.length > 5 && (
                  <div className="group relative">
                    <button className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 text-sm font-medium text-gray-900 transition-colors duration-200 xl:text-base dark:text-gray-100">
                      {t.common.more}
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown menu */}
                    <div className="invisible absolute top-full right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800">
                      <div className="py-2">
                        {menuItems.slice(5).map((item) => (
                          <Link
                            key={item.title}
                            href={item.href}
                            className={`block px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                              isActive(item.href)
                                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                : 'text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="cursor-pointer text-gray-600 hover:text-gray-900 lg:hidden dark:text-gray-300 dark:hover:text-white"
              >
                <Search className="h-6 w-6" />
              </button>

              {/* Desktop Search */}
              <form
                onSubmit={handleSearch}
                className="relative hidden lg:block"
              >
                <input
                  type="text"
                  placeholder={t.common.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="focus:ring-primary-500 w-64 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 pe-10 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute end-3 top-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>

              <LanguageSwitcher />
              <DarkModeToggle />
              <CartMenu />

              {/* Auth Section */}
              <div className="flex justify-end">
                {!user && loading ? (
                  <div className="h-10 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                ) : user ? (
                  <UserMenu userName={user.first_name + ' ' + user.last_name} />
                ) : !loading ? (
                  <Link href="/send-otp">
                    <Button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transform rounded-full px-6 py-2 text-white transition-all duration-200 hover:scale-105">
                      {t.nav.login}
                    </Button>
                  </Link>
                ) : null}
              </div>
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
              className="border-t border-gray-200 bg-white lg:hidden dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="container mx-auto p-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder={t.common.search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="focus:ring-primary-500 w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 pe-10 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="absolute end-3 top-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </form>
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
                    {t.common.siteName}
                  </span>
                </Link>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="cursor-pointer text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
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
                      isActive(item.href)
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
                      {t.nav.login}
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
