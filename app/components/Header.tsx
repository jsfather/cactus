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

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) return;
        const data = await request<{ data: User }>('profile');
        setUser(data.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error instanceof Error && error.message.includes('401')) {
          localStorage.removeItem('authToken');
          router.push('/auth/send-otp');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
      <div className="container mx-auto h-20 px-4">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="لوگو کاکتوس"
                width={60}
                height={60}
                className="rounded-xl"
              />
              <span className="from-primary-600 to-primary-800 mx-2 bg-gradient-to-l bg-clip-text text-2xl font-black text-transparent">
                کاکتوس
              </span>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              {[
                { title: 'دوره‌ها', href: '/courses' },
                { title: 'مربیان', href: '/teachers' },
                { title: 'درباره ما', href: '/about' },
                { title: 'وبلاگ', href: '/blog' },
              ].map((item) => (
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
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="جستجو ..."
                className="focus:ring-primary-500 w-64 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
              />
              <span className="absolute top-2.5 left-3 text-gray-500 dark:text-gray-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>

            <DarkModeToggle />

            {loading ? (
              <div className="h-10 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            ) : user ? (
              <UserMenu userName={user.first_name + ' ' + user.last_name} />
            ) : (
              <Link href="/auth">
                <Button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transform rounded-full px-6 py-2 text-white transition-all duration-200 hover:scale-105">
                  ورود / ثبت نام
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
