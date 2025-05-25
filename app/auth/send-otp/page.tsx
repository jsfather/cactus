'use client';

import { useState } from 'react';
import { sendOTP } from '@/app/lib/api/auth';
import { useRouter } from 'next/navigation';

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
          `/auth/verify-otp?identifier=${encodeURIComponent(identifier)}&otp=${encodeURIComponent(res.data.otp)}`
        );
      });
    } catch (err) {
      console.log(err);
      setError('مشکلی در ارسال کد تایید به وجود آمده است. دوباره تلاش کنید.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 font-bold">
        برای ورود به پنل کاربری، شماره همراه خود را وارد کنید.
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4"
      >
        <div>
          <label htmlFor="identifier" className="mb-1 block">
            شماره همراه <span className="text-red-500">*</span>
          </label>
          <input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="mt-2 w-full rounded border border-gray-300 px-4 py-2"
            required
            placeholder="09123456789"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 rounded-3xl bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:bg-gray-600"
        >
          {loading ? 'درحال ارسال ...' : 'ارسال کد یک‌بار مصرف'}
        </button>
      </form>
    </div>
  );
}
