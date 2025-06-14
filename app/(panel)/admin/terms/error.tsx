'use client';

import { useEffect } from 'react';
import { Button } from '@/app/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">خطایی رخ داده است!</h2>
      <Button className="mt-4" onClick={() => reset()}>
        تلاش مجدد
      </Button>
    </main>
  );
}
