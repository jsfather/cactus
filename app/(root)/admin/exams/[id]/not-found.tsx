import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">امتحان مورد نظر یافت نشد!</h2>
      <Button asChild className="mt-4">
        <Link href="/admin/exams">بازگشت به لیست امتحانات</Link>
      </Button>
    </main>
  );
}
