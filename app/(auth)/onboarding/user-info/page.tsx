'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import Textarea from '@/app/components/ui/Textarea';

export default function UserInfoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Implement API call
    // For now, just navigate to next step
    router.push('/onboarding/document-upload');
  };

  return (
    <div className="w-full">
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          تکمیل اطلاعات کاربری
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          لطفا اطلاعات زیر را با دقت تکمیل کنید
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8">
        {/* Personal Information */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/50">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            اطلاعات شخصی
          </h2>
          <div className="space-y-6">
            <Input
              id="first_name"
              name="first_name"
              label="نام"
              placeholder="نام خود را وارد کنید"
              required
            />

            <Input
              id="last_name"
              name="last_name"
              label="نام خانوادگی"
              placeholder="نام خانوادگی خود را وارد کنید"
              required
            />

            <Input
              id="username"
              name="username"
              label="نام کاربری"
              placeholder="نام کاربری خود را وارد کنید"
              required
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="ایمیل"
              placeholder="ایمیل خود را وارد کنید"
              required
            />

            <Input
              id="national_code"
              name="national_code"
              label="کد ملی"
              placeholder="کد ملی خود را وارد کنید"
              required
            />

            <Input
              id="father_name"
              name="father_name"
              label="نام پدر"
              placeholder="نام پدر را وارد کنید"
              required
            />

            <Input
              id="mother_name"
              name="mother_name"
              label="نام مادر"
              placeholder="نام مادر را وارد کنید"
              required
            />

            <Input
              id="father_job"
              name="father_job"
              label="شغل پدر"
              placeholder="شغل پدر را وارد کنید"
              required
            />

            <Input
              id="mother_job"
              name="mother_job"
              label="شغل مادر"
              placeholder="شغل مادر را وارد کنید"
              required
            />

            <Input
              id="birth_date"
              name="birth_date"
              type="date"
              label="تاریخ تولد"
              required
            />
          </div>
        </div>

        {/* Health Information */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/50">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            اطلاعات سلامت
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                آیا حساسیت دارویی یا غذایی دارید؟
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="has_allergy"
                    value="true"
                    className="text-primary-600 focus:ring-primary-500/20 h-4 w-4"
                  />
                  <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">
                    بله
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="has_allergy"
                    value="false"
                    defaultChecked
                    className="text-primary-600 focus:ring-primary-500/20 h-4 w-4"
                  />
                  <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">
                    خیر
                  </span>
                </label>
              </div>
            </div>

            <Textarea
              id="allergy_details"
              name="allergy_details"
              label="جزئیات حساسیت"
              placeholder="در صورت داشتن حساسیت، جزئیات آن را شرح دهید"
            />
          </div>
        </div>

        {/* Learning Characteristics */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800/50">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            ویژگی‌های یادگیری
          </h2>
          <div className="space-y-6">
            <Select
              id="interest_level"
              name="interest_level"
              label="سطح علاقه‌مندی"
              placeholder="انتخاب کنید"
              required
              options={[
                { value: 'high', label: 'بالا' },
                { value: 'medium', label: 'متوسط' },
                { value: 'low', label: 'پایین' },
              ]}
            />

            <Select
              id="focus_level"
              name="focus_level"
              label="سطح تمرکز"
              placeholder="انتخاب کنید"
              required
              options={[
                { value: 'high', label: 'بالا' },
                { value: 'medium', label: 'متوسط' },
                { value: 'low', label: 'پایین' },
              ]}
            />
          </div>
        </div>

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
              درحال پردازش...
            </>
          ) : (
            'مرحله بعد'
          )}
        </button>
      </form>
    </div>
  );
}
