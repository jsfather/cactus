'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Check, ShieldCheck } from 'lucide-react';
import { Suspense, useEffect } from 'react';
import DarkModeToggle from '@/app/components/ui/DarkModeToggle';
import { useUser } from '@/app/hooks/useUser';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const isOnboarding = pathname.startsWith('/onboarding');
  const onboardingSteps = [
    { label: 'اطلاعات فردی', href: '/onboarding/information' },
    { label: 'مدارک', href: '/onboarding/documents' },
    { label: 'سوابق آموزشی', href: '/onboarding/previous-courses' },
  ];
  const activeStep = Math.max(
    0,
    onboardingSteps.findIndex((step) => pathname.startsWith(step.href))
  );

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || isAuthenticated) {
    return null;
  }

  return (
    <div className="app-shell flex min-h-dvh flex-col lg:flex-row">
      <div
        className={`flex w-full flex-1 flex-col items-center px-4 py-5 sm:px-8 sm:py-8 ${isOnboarding ? 'lg:w-3/5' : 'lg:w-1/2'}`}
      >
        <div className="flex w-full max-w-4xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl p-1 transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo.svg"
              alt="لوگو کاکتوس"
              width={48}
              height={42}
              priority
              className="transition-all duration-300 dark:brightness-0 dark:invert"
            />
            <span className="text-lg font-black text-gray-900 dark:text-white">
              کاکتوس
            </span>
          </Link>
          <DarkModeToggle />
        </div>

        <div
          className={`my-auto w-full py-8 ${isOnboarding ? 'max-w-4xl' : 'max-w-md'}`}
        >
          {isOnboarding && (
            <ol
              className="mb-6 grid grid-cols-3 gap-2"
              aria-label="مراحل تکمیل ثبت‌نام"
            >
              {onboardingSteps.map((step, index) => {
                const completed = index < activeStep;
                const active = index === activeStep;
                return (
                  <li key={step.href} className="min-w-0 text-center">
                    <div
                      className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${completed || active ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}
                    >
                      {completed ? (
                        <Check className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`block truncate text-xs ${active ? 'text-primary-700 dark:text-primary-300 font-bold' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      {step.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}

          <div className="auth-card w-full rounded-3xl border border-gray-200/90 bg-white p-5 shadow-xl shadow-gray-950/5 sm:p-8 dark:border-gray-800 dark:bg-gray-900">
            <Suspense
              fallback={
                <div className="h-[300px] w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
              }
            >
              {children}
            </Suspense>
          </div>
        </div>

        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <div>بازگشت به وبسایت</div>
          <ArrowLeft width={16} strokeWidth={1.5} />
        </Link>
      </div>

      <aside
        className={`bg-primary-950 relative hidden overflow-hidden text-white lg:flex ${isOnboarding ? 'lg:w-2/5' : 'lg:w-1/2'}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(74,222,139,0.3),transparent_35%),radial-gradient(circle_at_10%_90%,rgba(34,199,106,0.18),transparent_32%)]" />
        <div className="relative flex min-h-full w-full flex-col justify-between p-12 xl:p-16">
          <div className="text-primary-200 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-semibold">
              ورود امن به سامانه آموزشی
            </span>
          </div>
          <div className="max-w-lg">
            <p className="text-primary-300 text-sm font-bold">
              آکادمی رباتیک کاکتوس
            </p>
            <h2 className="mt-4 text-4xl leading-tight font-black xl:text-5xl">
              یادگیری، ساختن و تجربه‌کردن آینده
            </h2>
            <p className="text-primary-100/80 mt-5 max-w-md leading-8">
              مدیریت کلاس‌ها، تکالیف و مسیر آموزشی در یک فضای یکپارچه و ساده.
            </p>
          </div>
          <p className="text-primary-200/60 text-xs">
            حریم خصوصی و امنیت اطلاعات شما برای ما مهم است.
          </p>
        </div>
      </aside>
    </div>
  );
}
