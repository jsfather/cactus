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
  const { t, locale } = useLocale();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

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
    setIsMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsDrawerOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDrawerOpen]);

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
        className={`fixed inset-x-0 top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl transition-[background-color,box-shadow] duration-200 dark:border-gray-800 dark:bg-gray-900/90 ${
          isScrolled ? 'shadow-lg shadow-gray-950/5' : ''
        }`}
      >
        <div className="mx-auto h-[72px] max-w-[1440px] px-3 sm:px-5 lg:px-6">
          <div className="flex h-full items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="icon-button xl:hidden"
              aria-label={
                locale === 'fa' ? 'باز کردن منوی اصلی' : 'Open main menu'
              }
              aria-haspopup="dialog"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex min-w-0 items-center gap-5 2xl:gap-8">
              <Link href="/" className="flex shrink-0 items-center gap-2">
                <Image
                  src="/logo.svg"
                  alt="کاکتوس"
                  width={46}
                  height={40}
                  priority
                  className="transition-all duration-300 dark:brightness-0 dark:invert"
                />
                <span className="from-primary-600 to-primary-800 hidden bg-gradient-to-l bg-clip-text text-xl font-black text-transparent 2xl:block">
                  {t.common.siteName}
                </span>
              </Link>

              <nav
                className="hidden items-center gap-3 xl:flex 2xl:gap-5"
                aria-label={locale === 'fa' ? 'منوی اصلی' : 'Main navigation'}
              >
                {menuItems.slice(0, 5).map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`relative rounded-lg px-2 py-2 text-sm font-semibold transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300'
                        : 'hover:text-primary-700 dark:hover:text-primary-300 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}

                {/* More menu for additional items */}
                {menuItems.length > 5 && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsMoreOpen((open) => !open)}
                      className="hover:text-primary-700 dark:hover:text-primary-300 flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                      aria-expanded={isMoreOpen}
                      aria-haspopup="menu"
                    >
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
                    {isMoreOpen && (
                      <div
                        role="menu"
                        className="absolute top-full right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-gray-200 bg-white p-1.5 shadow-xl shadow-gray-950/10 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <div className="py-2">
                          {menuItems.slice(5).map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
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
                    )}
                  </div>
                )}
              </nav>
            </div>

            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
              {/* Mobile Search Toggle */}
              <button
                type="button"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="icon-button xl:hidden"
                aria-label={locale === 'fa' ? 'جست‌وجو' : 'Search'}
                aria-expanded={showMobileSearch}
              >
                <Search className="h-6 w-6" />
              </button>

              {/* Desktop Search */}
              <form
                onSubmit={handleSearch}
                className="relative hidden 2xl:block"
              >
                <input
                  type="text"
                  placeholder={t.common.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="focus:border-primary-600 focus:ring-primary-100 dark:focus:ring-primary-950 h-11 w-56 rounded-xl border border-gray-200 bg-gray-50 px-4 pe-10 text-sm text-gray-900 placeholder-gray-500 focus:ring-4 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute end-3 top-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>

              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              <div className="hidden sm:block">
                <DarkModeToggle />
              </div>
              <CartMenu />

              {/* Auth Section */}
              <div className="flex justify-end">
                {!user && loading ? (
                  <div className="h-10 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                ) : user ? (
                  <UserMenu
                    userName={user.first_name + ' ' + user.last_name}
                    locale={locale}
                  />
                ) : !loading ? (
                  <Button asChild className="px-3 sm:px-5">
                    <Link href="/send-otp">
                      <span className="hidden sm:inline">{t.nav.login}</span>
                      <span className="sm:hidden">ورود</span>
                    </Link>
                  </Button>
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
              className="border-t border-gray-200 bg-white xl:hidden dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="container mx-auto p-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder={t.common.search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="focus:border-primary-600 focus:ring-primary-100 dark:focus:ring-primary-950 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 pe-10 text-sm text-gray-900 placeholder-gray-500 focus:ring-4 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute end-1 top-0 flex h-11 w-10 items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={
                      locale === 'fa' ? 'اجرای جست‌وجو' : 'Submit search'
                    }
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
              aria-hidden="true"
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              role="dialog"
              aria-modal="true"
              aria-label={locale === 'fa' ? 'منوی اصلی' : 'Main menu'}
              className="fixed top-0 right-0 bottom-0 z-50 w-[min(88vw,22rem)] overflow-y-auto overscroll-contain bg-white p-5 shadow-2xl dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/logo.svg"
                    alt="لوگو کاکتوس"
                    width={48}
                    height={42}
                    className="rounded-xl"
                  />
                  <span className="from-primary-600 to-primary-800 bg-gradient-to-l bg-clip-text text-xl font-black text-transparent">
                    {t.common.siteName}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="icon-button"
                  aria-label={locale === 'fa' ? 'بستن منو' : 'Close menu'}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav
                className="mt-7 space-y-1.5"
                aria-label={
                  locale === 'fa' ? 'منوی موبایل' : 'Mobile navigation'
                }
              >
                {menuItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`block rounded-lg px-4 py-2.5 font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300'
                        : 'text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>

              <div className="mt-7 border-t border-gray-200 pt-5 dark:border-gray-700">
                <div className="mb-5 flex items-center gap-2 sm:hidden">
                  <LanguageSwitcher />
                  <DarkModeToggle />
                </div>
                {!user && (
                  <Button asChild className="w-full px-6">
                    <Link href="/send-otp" className="block">
                      {t.nav.login}
                    </Link>
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
