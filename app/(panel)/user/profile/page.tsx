'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from '@/app/hooks/useUser';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { User } from '@/app/lib/types';

type FormData = Omit<User, 'id' | 'files' | 'profile_picture'> & {
  username: string;
};

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, updateProfile } = useUser();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        email: user.email || '',
        national_code: user.national_code || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await updateProfile(data);
      toast.success('اطلاعات پروفایل با موفقیت بروزرسانی شد');
    } catch (error: any) {
      const apiError = error.response?.data || error;
      if (apiError.errors) {
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          setError(field as keyof FormData, {
            type: 'server',
            message: Array.isArray(messages) ? messages[0] : messages,
          });
        });
      } else {
        toast.error('خطا در بروزرسانی اطلاعات');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ویرایش پروفایل</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Row 1: Username and First Name */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              نام کاربری
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('username', { required: 'نام کاربری الزامی است' })}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm ${
                errors.username
                  ? 'border-red-300 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white text-gray-900 dark:bg-gray-800 dark:text-white`}
              dir="ltr"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              نام
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('first_name', { required: 'نام الزامی است' })}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm ${
                errors.first_name
                  ? 'border-red-300 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white text-gray-900 dark:bg-gray-800 dark:text-white`}
            />
            {errors.first_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.first_name.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Last Name and Phone */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              نام خانوادگی
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('last_name', { required: 'نام خانوادگی الزامی است' })}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm ${
                errors.last_name
                  ? 'border-red-300 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white text-gray-900 dark:bg-gray-800 dark:text-white`}
            />
            {errors.last_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.last_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              شماره تماس
              <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register('phone', { required: 'شماره تماس الزامی است' })}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm ${
                errors.phone
                  ? 'border-red-300 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white text-gray-900 dark:bg-gray-800 dark:text-white`}
              dir="ltr"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 3: Email and National Code */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ایمیل
            </label>
            <input
              type="email"
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'آدرس ایمیل نامعتبر است',
                },
              })}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm ${
                errors.email
                  ? 'border-red-300 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white text-gray-900 dark:bg-gray-800 dark:text-white`}
              dir="ltr"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              کد ملی
            </label>
            <input
              type="text"
              {...register('national_code', {
                pattern: {
                  value: /^\d{10}$/,
                  message: 'کد ملی باید ۱۰ رقم باشد',
                },
              })}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm ${
                errors.national_code
                  ? 'border-red-300 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white text-gray-900 dark:bg-gray-800 dark:text-white`}
              dir="ltr"
            />
            {errors.national_code && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.national_code.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-700 dark:hover:bg-primary-600"
          >
            {isSubmitting ? (
              <>
                <span className="ml-2">در حال ذخیره...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </>
            ) : (
              'ذخیره تغییرات'
            )}
          </button>
        </div>
      </form>
      <Toaster position="top-center" />
    </div>
  );
}
