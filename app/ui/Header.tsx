'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Bell, Search, CircleHelp } from 'lucide-react';
import moment from 'jalali-moment';

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

const Header = ({ user }: { user: UserProfile | null }) => {
  const formattedDate = moment().locale('fa').format('dddd، D MMMM YYYY');

  return (
    <header className="flex h-[80px] flex-row bg-white shadow-xs">
      <div className="flex w-64 items-center justify-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={56} height={48} />
        </Link>
      </div>
      <nav className="flex w-[calc(100%-256px)] items-center justify-between p-4">
        <div className="flex w-full items-center">
          {!user ? (
            <div className="flex items-center gap-2">
              <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
              <div className="h-6 w-2 animate-pulse rounded-md bg-gray-200" />
              <div className="h-6 w-24 animate-pulse rounded-md bg-gray-200" />
            </div>
          ) : (
            <>
              <div>{user.first_name} عزیز، خوش آمدی 👋</div>
              <div className="px-2">|</div>
              <div>{formattedDate}</div>
            </>
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
