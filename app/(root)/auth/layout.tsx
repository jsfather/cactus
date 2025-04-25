import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen">
      <div className="flex w-1/2 flex-col items-center justify-between p-6">
        <Image src="/logo.png" alt="logo" width={90} height={100} />
        <div className="text-xl font-bold">به مجموعه کاکتوس خوش آمدید.</div>
        <div className="rounded-xl p-8 shadow-md">{children}</div>
        <Link href="/" className="flex items-center gap-1 text-sm">
          <div>بازگشت به وبسایت</div>
          <ArrowLeft width={17} strokeWidth={1.7} />
        </Link>
      </div>
      <div className="bg-primary-200 w-1/2"></div>
    </div>
  );
}
