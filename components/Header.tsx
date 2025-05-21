'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Bell, Search, CircleHelp } from 'lucide-react';
import { useEffect, useState } from 'react';
import request from '@/lib/api/httpClient';
import moment from 'jalali-moment';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

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

const Header = () => {
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
        console.error('Error fetching profile:', error);
        if (error instanceof Error && error.message.includes('401')) {
          Cookies.remove('authToken');
          router.push('/auth/send-otp');
        } else {
          setError(
            error instanceof Error ? error.message : 'خطا در دریافت اطلاعات'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const formattedDate = moment().locale('fa').format('dddd، D MMMM YYYY');

  return (
    <header className="flex h-[80px] flex-row bg-white shadow-xs">
      <div className="flex w-64 items-center justify-center">
        <Link href="/admin">
          <Image src="/logo.png" alt="logo" width={56} height={48} />
        </Link>
      </div>
      <nav className="flex w-[calc(100%-256px)] items-center justify-between p-4">
        <div className="flex w-full items-center">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
              <div className="h-6 w-2 animate-pulse rounded-md bg-gray-200" />
              <div className="h-6 w-24 animate-pulse rounded-md bg-gray-200" />
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : userProfile ? (
            <>
              <div>{userProfile.first_name} عزیز، خوش آمدی 👋</div>
              <div className="px-2">|</div>
              <div>{formattedDate}</div>
            </>
          ) : (
            <div className="text-gray-500">اطلاعاتی یافت نشد</div>
          )}
        </div>
        <div className="flex items-center gap-6">
          <Bell width={16} strokeWidth={1.7} />
          <CircleHelp width={16} strokeWidth={1.7} />
          <Search width={16} strokeWidth={1.7} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
