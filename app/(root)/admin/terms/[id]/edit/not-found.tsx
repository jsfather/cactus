import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">ترم مورد نظر یافت نشد</h2>
      <Link
        href="/admin/terms"
        className="bg-primary-600 hover:bg-primary-400 mt-4 rounded-md px-4 py-2 text-sm text-white transition-colors"
      >
        بازگشت به لیست ترم‌ها
      </Link>
    </main>
  );
} 