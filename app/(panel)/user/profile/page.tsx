'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getProfile, updateProfile } from '@/app/lib/api/user/profile';

interface FormData {
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  national_code: string;
}

interface ApiError {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await updateProfile(data);
      // Show success message or redirect
    } catch (error: any) {
      // Check if the error has a response property (axios error)
      const apiError = error.response?.data || error;

      if (apiError.errors) {
        // Set errors for each field from the API response
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          setError(field as keyof FormData, {
            type: 'server',
            message: Array.isArray(messages) ? messages[0] : messages,
          });
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">ویرایش پروفایل</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              نام کاربری
            </label>
            <input
              type="text"
              id="username"
              {...register('username', { required: 'نام کاربری الزامی است' })}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                errors.username ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* First Name Field */}
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700"
            >
              نام
            </label>
            <input
              type="text"
              id="first_name"
              {...register('first_name', { required: 'نام الزامی است' })}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                errors.first_name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.first_name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.first_name.message}
              </p>
            )}
          </div>

          {/* Last Name Field */}
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700"
            >
              نام خانوادگی
            </label>
            <input
              type="text"
              id="last_name"
              {...register('last_name', {
                required: 'نام خانوادگی الزامی است',
              })}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                errors.last_name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.last_name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.last_name.message}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              شماره تماس
            </label>
            <input
              type="tel"
              id="phone"
              {...register('phone', { required: 'شماره تماس الزامی است' })}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              dir="ltr"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              ایمیل
            </label>
            <input
              type="email"
              id="email"
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'آدرس ایمیل نامعتبر است',
                },
              })}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              dir="ltr"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* National Code Field */}
          <div>
            <label
              htmlFor="national_code"
              className="block text-sm font-medium text-gray-700"
            >
              کد ملی
            </label>
            <input
              type="text"
              id="national_code"
              {...register('national_code', {
                pattern: {
                  value: /^\d{10}$/,
                  message: 'کد ملی باید ۱۰ رقم باشد',
                },
              })}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                errors.national_code ? 'border-red-300' : 'border-gray-300'
              }`}
              dir="ltr"
            />
            {errors.national_code && (
              <p className="mt-1 text-sm text-red-600">
                {errors.national_code.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-primary-600 hover:bg-primary-700 rounded-md px-4 py-2 text-sm font-medium text-white transition ${
              isSubmitting ? 'cursor-not-allowed opacity-75' : ''
            }`}
          >
            {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
        </div>
      </form>
    </div>
  );
}
