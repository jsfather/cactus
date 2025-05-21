'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createUser, User } from '@/lib/api/panel/admin/users';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useRef } from 'react';

type FormData = {
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  email: string;
  national_code: string;
  password: string;
  profile_picture: string | null;
};

export default function Form() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const fileInput = fileInputRef.current;
      let profile_picture: string = '';
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        profile_picture = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      await createUser({ ...data, profile_picture });
      toast.success('کاربر با موفقیت ایجاد شد');
      router.push('/admin/users');
    } catch (error: any) {
      toast.error(error.message || 'خطا در ایجاد کاربر');
      console.error('Failed to create user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Name Fields Row */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="first_name"
              className="mb-2 block text-sm font-medium"
            >
              نام <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="first_name"
                {...register('first_name', { required: 'نام الزامی است' })}
                className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.first_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.first_name.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="mb-2 block text-sm font-medium"
            >
              نام خانوادگی <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="last_name"
                {...register('last_name', {
                  required: 'نام خانوادگی الزامی است',
                })}
                className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.last_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Username and Phone Row */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium"
            >
              نام کاربری <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="username"
                {...register('username', { required: 'نام کاربری الزامی است' })}
                className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              شماره تماس <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="phone"
                {...register('phone', { required: 'شماره تماس الزامی است' })}
                className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Email and National Code Row */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              ایمیل <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="email"
                type="email"
                {...register('email', { required: 'ایمیل الزامی است' })}
                className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="national_code"
              className="mb-2 block text-sm font-medium"
            >
              کد ملی <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="national_code"
                {...register('national_code', {
                  required: 'کد ملی الزامی است',
                })}
                className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.national_code ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.national_code && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.national_code.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Password and Profile Picture Row */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              رمز عبور <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="password"
                type="password"
                {...register('password', { required: 'رمز عبور الزامی است' })}
                className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="profile_picture"
              className="mb-2 block text-sm font-medium"
            >
              تصویر پروفایل
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="profile_picture"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="peer block w-full rounded-md border border-gray-300 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/admin/users"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          لغو
        </Link>
        <Button type="submit" loading={isSubmitting}>
          ساخت کاربر
        </Button>
      </div>
    </form>
  );
}
