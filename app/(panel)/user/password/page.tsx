'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { updatePassword } from '@/app/lib/api/user/profile';

interface PasswordFormData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<PasswordFormData>();

  const newPassword = watch('new_password');

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setIsSubmitting(true);
      const response = await updatePassword(data);
      toast.success(response.message);
    } catch (error: any) {
      const apiError = error.response?.data || error;
      if (apiError.errors) {
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          setError(field as keyof PasswordFormData, {
            type: 'server',
            message: Array.isArray(messages) ? messages[0] : messages,
          });
        });
      } else {
        toast.error('خطا در تغییر رمز عبور');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          تغییر رمز عبور
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            رمز عبور فعلی
            <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            {...register('current_password', {
              required: 'رمز عبور فعلی الزامی است',
            })}
            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm ${
              errors.current_password
                ? 'border-red-300 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            } bg-white text-gray-900 dark:bg-gray-800 dark:text-white`}
            dir="ltr"
          />
          {errors.current_password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.current_password.message}
            </p>
          )}
        </div>

        {/* New Password and Confirmation */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              رمز عبور جدید
              <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register('new_password', {
                required: 'رمز عبور جدید الزامی است',
                minLength: {
                  value: 8,
                  message: 'رمز عبور باید حداقل ۸ کاراکتر باشد',
                },
              })}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm ${
                errors.new_password
                  ? 'border-red-300 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white text-gray-900 dark:bg-gray-800 dark:text-white`}
              dir="ltr"
            />
            {errors.new_password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.new_password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              تکرار رمز عبور جدید
              <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register('new_password_confirmation', {
                required: 'تکرار رمز عبور الزامی است',
                validate: (value) =>
                  value === newPassword || 'رمز عبور و تکرار آن یکسان نیستند',
              })}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm ${
                errors.new_password_confirmation
                  ? 'border-red-300 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white text-gray-900 dark:bg-gray-800 dark:text-white`}
              dir="ltr"
            />
            {errors.new_password_confirmation && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.new_password_confirmation.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600 inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="ml-2">در حال ذخیره...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </>
            ) : (
              'تغییر رمز عبور'
            )}
          </button>
        </div>
      </form>
      <Toaster position="top-center" />
    </div>
  );
}
