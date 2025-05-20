'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { updateUser, User } from '@/lib/api/panel/admin/users';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';

type FormData = {
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  email: string;
  national_code: string;
  password?: string;
  profile_picture?: string;
};

export default function Form({ user }: { user: User }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      phone: user.phone,
      email: user.email,
      national_code: user.national_code,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateUser(user.id, data);
      toast.success('کاربر با موفقیت بروزرسانی شد');
      router.push('/admin/users');
    } catch (error: any) {
      toast.error(error.message || 'خطا در بروزرسانی کاربر');
      console.error('Failed to update user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Name Fields Row */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="mb-2 block text-sm font-medium">
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
            <label htmlFor="username" className="mb-2 block text-sm font-medium">
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
            <label htmlFor="national_code" className="mb-2 block text-sm font-medium">
              کد ملی <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="national_code"
                {...register('national_code', { required: 'کد ملی الزامی است' })}
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
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              رمز عبور جدید
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="password"
                type="password"
                {...register('password')}
                className="peer block w-full rounded-md border border-gray-300 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
              <p className="mt-1 text-sm text-gray-500">
                در صورت عدم تغییر رمز عبور، این فیلد را خالی بگذارید
              </p>
            </div>
          </div>
          <div>
            <label htmlFor="profile_picture" className="mb-2 block text-sm font-medium">
              تصویر پروفایل
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="profile_picture"
                type="file"
                accept="image/*"
                {...register('profile_picture')}
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
          بروزرسانی کاربر
        </Button>
      </div>
    </form>
  );
}
