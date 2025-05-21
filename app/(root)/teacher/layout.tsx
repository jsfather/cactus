'use client';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { LayoutDashboard, BookType, Ticket, UserCheck } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';
import { useEffect, useState } from 'react';
import request from '@/lib/api/httpClient';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface UserFile {
  type: 'certificate' | 'national_card';
  file_path: string;
}

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  national_code: string | null;
  profile_picture: string | null;
  files: UserFile[];
}

const menuItems = [
  {
    title: 'داشبورد',
    href: '/teacher/dashboard',
    icon: <LayoutDashboard width={17} strokeWidth={1.7} />,
  },
  {
    title: 'تیکت ها',
    href: '/teacher/tickets',
    icon: <Ticket width={17} strokeWidth={1.7} />,
  },
  {
    title: 'حضور و غیاب',
    href: '/teacher/attendances',
    icon: <UserCheck width={17} strokeWidth={1.7} />,
  },
  {
    title: 'ترم ها',
    href: '/teacher/terms',
    icon: <BookType width={17} strokeWidth={1.7} />,
  },
];

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = Cookies.get('authToken');
        if (!token) {
          router.push('/auth/send-otp');
          return;
        }
        const data = await request<{ data: UserProfile }>('profile');
        setUserProfile(data.data);
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          Cookies.remove('authToken');
          router.push('/auth/send-otp');
        } else {
          setError(error instanceof Error ? error.message : 'خطا در دریافت اطلاعات');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  let sidebarUser = null;
  if (userProfile) {
    sidebarUser = {
      name: `${userProfile.first_name} ${userProfile.last_name}`,
      avatarUrl: userProfile.profile_picture || '/default-avatar.png',
    };
  }

  return (
    <div className="flex h-screen flex-col">
      <Header user={userProfile} />
      <div className="flex flex-1 overflow-hidden">
        {sidebarUser ? (
          <Sidebar user={sidebarUser} menuItems={menuItems}>
            <LogoutButton />
          </Sidebar>
        ) : (
          <div className="w-64 bg-white p-4 flex flex-col items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-gray-200 animate-pulse mb-4" />
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-2" />
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
