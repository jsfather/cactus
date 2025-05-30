'use client';

import Header from '@/app/components/panel/Header';
import Sidebar from '@/app/components/panel/Sidebar';
import { useEffect, useState } from 'react';
import request from '@/app/lib/api/client';
import { useRouter } from 'next/navigation';
import { User } from '@/app/lib/types';

const menuItems = [
  {
    title: 'داشبورد',
    isGroupTitle: true,
    subItems: [
      {
        title: 'خلاصه عملکرد',
        href: '/student/dashboard',
      }
    ]
  },
  {
    title: 'آموزش',
    isGroupTitle: true,
    subItems: [
      {
        title: 'ترم ها',
        href: '/student/terms',
      },
      {
        title: 'تکلیف ها',
        href: '/student/homeworks',
      },
      {
        title: 'حضور و غیاب',
        href: '/student/attendances',
      },
    ]
  },
  {
    title: 'ارتباطات',
    isGroupTitle: true,
    subItems: [
      {
        title: 'تیکت ها',
        href: '/student/tickets',
      }
    ]
  }
];

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

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
          router.push('/send-otp');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  return (
    <div className="flex h-screen">
      <Sidebar 
        user={user || undefined} 
        menuItems={menuItems}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        loading={loading}
      />
      <div className="flex flex-1 flex-col">
        <Header 
          user={user}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          loading={loading}
        />
        <main className="flex-1 overflow-y-auto p-4 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
