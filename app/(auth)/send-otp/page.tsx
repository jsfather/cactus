'use client';

import { useState } from 'react';
import { sendOTP } from '@/app/lib/api/auth';
import { useRouter } from 'next/navigation';
import { Phone } from 'lucide-react';

export default function SendOtpPage() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await sendOTP(identifier).then((res) => {
        router.push(
          `/verify-otp?identifier=${encodeURIComponent(identifier)}&otp=${encodeURIComponent(res.data.otp)}`
        );
      });
    } catch (err) {
      console.log(err);
      setError('مشکلی در ارسال کد تایید به وجود آمده است. دوباره تلاش کنید.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          ورود به حساب کاربری
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          برای ورود به پنل کاربری، شماره همراه خود را وارد کنید
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="identifier"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            شماره همراه
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="identifier"
              type="tel"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="focus:border-primary-500 focus:ring-primary-500/20 block w-full rounded-lg border border-gray-300 bg-white/50 p-3 pr-10 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-400"
              required
              placeholder="09123456789"
              dir="ltr"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/50 dark:text-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600 relative w-full transform rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </span>
              درحال ارسال...
            </>
          ) : (
            'ارسال کد یک‌بار مصرف'
          )}
        </button>
      </form>
    </div>
  );
}
