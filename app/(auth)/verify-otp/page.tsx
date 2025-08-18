'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/lib/stores/auth.store';
import Link from 'next/link';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { convertToEnglishNumbers, isNumeric } from '@/app/lib/utils/persian';

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const identifier = searchParams.get('identifier') || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);
  const { verifyOtp, sendOtp } = useAuthStore();

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((s) => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digitsOnly = raw.replace(/[^0-9۰-۹٠-٩]/g, '');
    const limited = digitsOnly.slice(0, 6);
    setOtp(limited);
    if (error) setError('');
  };

  const validateOtp = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return 'وارد کردن کد تایید الزامی است';
    const normalized = convertToEnglishNumbers(trimmed);
    if (!isNumeric(trimmed)) return 'کد تایید فقط باید شامل ارقام باشد';
    if (normalized.length !== 6) return 'کد تایید باید دقیقا ۶ رقم باشد';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validationMessage = validateOtp(otp);
    if (validationMessage) {
      setError(validationMessage);
      setLoading(false);
      return;
    }

    try {
      const normalizedOtp = convertToEnglishNumbers(otp.trim());
      const normalizedPhone = convertToEnglishNumbers(identifier.trim());
      await verifyOtp({
        phone: normalizedPhone,
        otp: normalizedOtp,
      });
      
      // After successful verification, redirect to dashboard
      toast.success('ورود موفقیت‌آمیز بود');
      router.push('/user'); // or wherever the user should go after login
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'کد تایید اشتباه است. دوباره تلاش کنید.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || resendLoading) return;
    try {
      setResendLoading(true);
      const normalizedPhone = convertToEnglishNumbers(identifier.trim());
      const res = await sendOtp({ phone: normalizedPhone });
      toast.success(res.message || 'کد مجدداً ارسال شد.');
      setResendTimer(60);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'مشکلی در ارسال مجدد کد به وجود آمد.';
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
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
              name="otp"
              type="tel"
              inputMode="numeric"
              pattern="[0-9۰-۹٠-٩]*"
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              className="focus:border-primary-500 focus:ring-primary-500/20 block w-full rounded-lg border border-gray-300 bg-white/50 p-3 pr-10 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-400"
              required
              placeholder="کد تایید را وارد کنید"
              dir="ltr"
            />
          </div>
        </div>

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

          <button
            type="button"
            onClick={handleResend}
            disabled={resendTimer > 0 || resendLoading}
            className="hover:text-primary-600 dark:hover:text-primary-400 flex w-full items-center justify-center gap-2 text-sm text-gray-600 transition-colors disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-400"
          >
            {resendLoading
              ? 'درحال ارسال...'
              : resendTimer > 0
                ? `ارسال دوباره کد (${resendTimer} ثانیه)`
                : 'ارسال دوباره کد'}
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
