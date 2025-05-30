'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Suspense, useEffect } from 'react';
import DarkModeToggle from '@/app/components/DarkModeToggle';
import { useUser } from '@/app/hooks/useUser';
import { useRouter } from 'next/navigation';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex w-full flex-1 flex-col items-center justify-between gap-8 p-6 lg:w-1/2 lg:p-12">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="لوگو کاکتوس"
            width={100}
            height={100}
            className="rounded-xl"
          />
        </Link>

        {/* Welcome Text */}
        <div className="text-center">
          <h1 className="from-primary-600 to-primary-800 mb-2 bg-gradient-to-l bg-clip-text text-3xl font-bold text-transparent">
            به مجموعه کاکتوس خوش آمدید
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            برای ادامه وارد حساب کاربری خود شوید
          </p>
        </div>

        {/* Auth Form Container */}
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/50 p-8 shadow-lg backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50">
          <Suspense
            fallback={
              <div className="h-[300px] w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            }
          >
            {children}
          </Suspense>
        </div>

        {/* Back Link */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <div>بازگشت به وبسایت</div>
          <ArrowLeft width={16} strokeWidth={1.5} />
        </Link>
      </div>

      {/* Right Section - Background */}
      <div className="hidden lg:flex lg:w-1/2">
        <div className="bg-primary-200 dark:bg-primary-300 relative flex h-full w-full items-center justify-center">
          <div className="p-12">
            <Image
              src="/logo.svg"
              alt="لوگو کاکتوس"
              width={200}
              height={200}
              className="rounded-2xl opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Dark Mode Toggle - Fixed Position */}
      <div className="fixed right-6 bottom-6 z-50">
        <DarkModeToggle />
      </div>
    </div>
  );
}
