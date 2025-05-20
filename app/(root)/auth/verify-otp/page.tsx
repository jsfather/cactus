'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyOtp } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const identifier = searchParams.get('identifier') || '';
  const [otp, setOtp] = useState(searchParams.get('otp') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await verifyOtp(identifier, '1234567890', otp);
      Cookies.set('authToken', result.token, { expires: 28 })
      router.push('/admin');
    } catch (err) {
      console.log(err);
      setError('کد تایید اشتباه است. دوباره تلاش کنید.');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 flex max-w-md flex-col items-center">
      <h1 className="mb-6 font-bold">کد به شماره {identifier} ارسال شد.</h1>
      <Link href="/auth/send-otp" className="text-blue-600">
        اصلاح شماره همراه
      </Link>
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col items-center space-y-4"
      >
        <div>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mt-2 w-full rounded border border-gray-300 px-4 py-2"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 rounded-3xl bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:bg-gray-600"
        >
          {loading ? 'درحال تایید ...' : 'ورود'}
        </button>
      </form>
    </div>
  );
}
