'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOnboardingStore } from '@/app/lib/stores/onboarding.store';
import { useAvailableTermStore } from '@/app/lib/stores/available-term.store';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  Clock,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AvailableTerm } from '@/app/lib/types/available-term';

type TermType =
  | 'normal'
  | 'capacity_completion'
  | 'project_based'
  | 'specialized'
  | 'ai';

const termTypeLabels: Record<TermType, string> = {
  normal: 'عادی',
  capacity_completion: 'تکمیل ظرفیت',
  project_based: 'پروژه محور',
  specialized: 'گرایش تخصصی',
  ai: 'هوش مصنوعی',
};

export default function PreviousCoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';

  const [step, setStep] = useState<'question' | 'terms'>('question');
  const [hasPreviousCourse, setHasPreviousCourse] = useState<boolean | null>(
    null
  );

  const { setPreviousCoursesAsked } = useOnboardingStore();
  const { availableTerms, loading, error, fetchAvailableTerms } =
    useAvailableTermStore();

  // Fetch available terms when user wants to see them
  useEffect(() => {
    if (step === 'terms') {
      fetchAvailableTerms();
    }
  }, [step, fetchAvailableTerms]);

  const handleYes = () => {
    setHasPreviousCourse(true);
    setStep('terms');
  };

  const handleNo = () => {
    setHasPreviousCourse(false);
    setPreviousCoursesAsked(true);
    toast.success('ثبت‌نام شما با موفقیت تکمیل شد');
    router.push('/user');
  };

  const handleSkip = () => {
    setPreviousCoursesAsked(true);
    router.push('/user');
  };

  const handleContinueToTerms = () => {
    setPreviousCoursesAsked(true);
    router.push('/student/terms');
  };

  const handleFinish = () => {
    setPreviousCoursesAsked(true);
    toast.success('ثبت‌نام شما با موفقیت تکمیل شد');
    router.push('/user');
  };

  // Question step
  if (step === 'question') {
    return (
      <div className="w-full">
        <div className="mb-8 text-center">
          <div className="bg-primary-100 dark:bg-primary-900/30 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
            <BookOpen className="text-primary-600 dark:text-primary-400 h-8 w-8" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            سوابق آموزشی
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            آیا قبلاً در دوره‌های آموزشگاه کاکتوس شرکت کرده‌اید؟
          </p>
        </div>

        <div className="space-y-4">
          {/* Yes Button */}
          <button
            onClick={handleYes}
            className="hover:border-primary-500 hover:bg-primary-50 dark:hover:border-primary-500 dark:hover:bg-primary-900/20 group flex w-full items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-4 transition-all dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  بله، شرکت کرده‌ام
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  دوره‌های موجود را مشاهده کنید
                </p>
              </div>
            </div>
            <ArrowLeft className="group-hover:text-primary-600 dark:group-hover:text-primary-400 h-5 w-5 text-gray-400 transition-colors" />
          </button>

          {/* No Button */}
          <button
            onClick={handleNo}
            className="hover:border-primary-500 hover:bg-primary-50 dark:hover:border-primary-500 dark:hover:bg-primary-900/20 group flex w-full items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-4 transition-all dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <XCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  خیر، این اولین بار است
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  به پنل کاربری هدایت می‌شوید
                </p>
              </div>
            </div>
            <ArrowLeft className="group-hover:text-primary-600 dark:group-hover:text-primary-400 h-5 w-5 text-gray-400 transition-colors" />
          </button>
        </div>

        {/* Skip Link */}
        <div className="mt-6 text-center">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 underline hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            رد کردن و ادامه
          </button>
        </div>
      </div>
    );
  }

  // Terms list step
  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          دوره‌های در دسترس
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          دوره‌های زیر برای ثبت‌نام در دسترس هستند
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="text-primary-600 dark:text-primary-400 h-8 w-8 animate-spin" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            در حال دریافت دوره‌ها...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-800 dark:text-red-200">{error}</p>
          <button
            onClick={() => fetchAvailableTerms()}
            className="mt-2 text-sm text-red-600 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {/* Terms List */}
      {!loading && !error && (
        <>
          {availableTerms.length === 0 ? (
            <div className="py-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                در حال حاضر دوره‌ای در دسترس نیست
              </p>
            </div>
          ) : (
            <div className="custom-scrollbar max-h-[400px] space-y-3 overflow-y-auto">
              {availableTerms.slice(0, 5).map((term) => (
                <TermCard key={term.id} term={term} />
              ))}

              {availableTerms.length > 5 && (
                <div className="py-2 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    و {availableTerms.length - 5} دوره دیگر...
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          type="button"
          onClick={() => setStep('question')}
          className="focus:ring-primary-500 flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت
        </button>

        {availableTerms.length > 0 ? (
          <button
            type="button"
            onClick={handleContinueToTerms}
            className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600 flex-1 rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            مشاهده و ثبت‌نام
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600 flex-1 rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            ورود به پنل کاربری
          </button>
        )}
      </div>
    </div>
  );
}

// Term Card Component
function TermCard({ term }: { term: AvailableTerm }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white">
            {term.title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3" />
              {term.start_date}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              {term.number_of_sessions} جلسه
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Users className="h-3 w-3" />
              ظرفیت: {term.capacity}
            </span>
          </div>
        </div>
        <div className="text-left">
          <span className="text-primary-600 dark:text-primary-400 text-sm font-bold">
            {formatPrice(term.price)}
          </span>
          <span className="mr-1 text-xs text-gray-500 dark:text-gray-400">
            تومان
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
          {termTypeLabels[term.type] || term.type}
        </span>
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          سطح {term.level?.label || '-'}
        </span>
        {term.is_bought && (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
            خریداری شده
          </span>
        )}
        {term.prerequisite_missing && (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
            پیش‌نیاز دارد
          </span>
        )}
      </div>
    </div>
  );
}
