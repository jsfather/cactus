'use client';

import { useEffect } from 'react';

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
      <h2 className="text-center">خطایی رخ داده!</h2>
      <button
        className="bg-primary-600 hover:bg-primary-400 mt-4 rounded-md px-4 py-2 text-sm text-white transition-colors"
        onClick={() => reset()}
      >
        تلاش دوباره
      </button>
    </main>
  );
}
