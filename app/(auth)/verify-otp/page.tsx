'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyOTP } from '@/app/lib/api/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { KeyRound, ArrowLeft, Lock } from 'lucide-react';
import { useUser } from '@/app/hooks/useUser';
import { useRoleRedirect } from '@/app/hooks/useRoleGuard';

// Get the password feature flag from environment
const isPasswordAuthEnabled =
  process.env.NEXT_PUBLIC_PASSWORD_AUTH_ENABLED === 'true';

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const identifier = searchParams.get('identifier') || '';
  const [otp, setOtp] = useState(searchParams.get('otp') || '');
  const [password, setPassword] = useState('1234567890');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { refetch } = useUser();
  const { redirectToRoleDashboard } = useRoleRedirect();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // If password auth is enabled, send the password, otherwise send empty string
      const result = await verifyOTP(
        identifier,
        isPasswordAuthEnabled ? password : '',
        otp
      );
      localStorage.setItem('authToken', result.token);
      await refetch();
      router.push('/onboarding/user-info');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'کد تایید اشتباه است. دوباره تلاش کنید.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          تایید کد یکبار مصرف
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          کد ارسال شده به شماره {identifier} را وارد کنید
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            کد تایید
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <KeyRound className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="focus:border-primary-500 focus:ring-primary-500/20 block w-full rounded-lg border border-gray-300 bg-white/50 p-3 pr-10 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-400"
              required
              placeholder="کد تایید را وارد کنید"
              dir="ltr"
            />
          </div>
        </div>

        {isPasswordAuthEnabled && (
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              رمز عبور
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus:border-primary-500 focus:ring-primary-500/20 block w-full rounded-lg border border-gray-300 bg-white/50 p-3 pr-10 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-400"
                required
                placeholder="رمز عبور را وارد کنید"
                dir="ltr"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/50 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
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
                درحال تایید...
              </>
            ) : (
              'ورود به حساب کاربری'
            )}
          </button>

          <Link
            href="/send-otp"
            className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center justify-center gap-2 text-sm text-gray-600 transition-colors dark:text-gray-400"
          >
            <ArrowLeft className="h-4 w-4" />
            اصلاح شماره همراه
          </Link>
        </div>
      </form>
    </div>
  );
}
