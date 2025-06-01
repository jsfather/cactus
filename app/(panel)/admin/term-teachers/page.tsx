'use client';

import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ترم مدرسین
        </h1>
        <Button onClick={() => router.push('/admin/term-teachers/new')}>
          ایجاد ترم مدرس
        </Button>
      </div>
    </div>
  );
}
