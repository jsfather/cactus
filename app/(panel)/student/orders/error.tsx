'use client';

export default function OrdersErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          خطا در بارگذاری سفارشات
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          متأسفانه خطایی در بارگذاری سفارشات رخ داده است
        </p>
      </div>
      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
      >
        تلاش مجدد
      </button>
    </div>
  );
}
