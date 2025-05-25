'use client';

import Header from '@/app/ui/Header';
import Sidebar from '@/app/ui/Sidebar';
import { LayoutDashboard, Users, GraduationCap, Landmark } from 'lucide-react';
import { useEffect, useState } from 'react';
import request from '@/app/lib/api/client';
import { useRouter } from 'next/navigation';
import LogoutButton from '@/app/ui/LogoutButton';

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
    href: '/admin/dashboard',
    icon: <LayoutDashboard width={17} strokeWidth={1.7} />,
  },
  {
    title: 'کاربران',
    href: '/admin/users',
    icon: <Users width={17} strokeWidth={1.7} />,
  },
  {
    title: 'آموزش',
    href: '/admin/education',
    icon: <GraduationCap width={17} strokeWidth={1.7} />,
  },
  {
    title: 'مالی',
    href: '/admin/financial',
    icon: <Landmark width={17} strokeWidth={1.7} />,
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
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/auth/send-otp');
          return;
        }
        const data = await request<{ data: UserProfile }>('profile');
        setUserProfile(data.data);
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          localStorage.removeItem('authToken');
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
