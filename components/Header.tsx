import Link from 'next/link';
import Image from 'next/image';
import { Bell, Search, CircleHelp } from 'lucide-react';

const Header = async () => {
  return (
    <header className="flex h-[80px] flex-row bg-white shadow-xs">
      <div className="flex w-64 items-center justify-center">
        <Link href="/admin">
          <Image src="/logo.png" alt="logo" width={56} height={48} />
        </Link>
      </div>
      <nav className="flex w-[calc(100%-256px)] items-center justify-between p-4">
        <div className="flex w-full items-center">
          <div>آرسین عزیز، خوش آمدی 👋</div>
          <div className="px-2">|</div>
          <div>شنبه، 25 فرودین 1403</div>
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
