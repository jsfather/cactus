import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">۴۰۴ پیدا نشد</h2>
      <p>کاربر مورد نظر پیدا نشد</p>
      <Link
        href="/admin/users"
        className="bg-primary-600 hover:bg-primary-400 mt-4 rounded-md px-4 py-2 text-sm text-white transition-colors"
      >
        بازگشت
      </Link>
    </main>
  );
}
