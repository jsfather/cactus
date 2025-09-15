'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import FileUpload from '@/app/components/ui/FileUpload';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfile } from '@/app/lib/hooks/use-profile';
import { UpdateProfileRequest } from '@/app/lib/types';
import { User, Save } from 'lucide-react';
import Image from 'next/image';

const schema = z.object({
  first_name: z.string().min(1, 'نام الزامی است'),
  last_name: z.string().min(1, 'نام خانوادگی الزامی است'),
  username: z.string().min(1, 'نام کاربری الزامی است'),
  phone: z.string().min(1, 'شماره موبایل الزامی است'),
  email: z.string().email('فرمت ایمیل صحیح نیست').optional().or(z.literal('')),
  national_code: z.string()
    .regex(/^\d{10}$/, 'کد ملی باید ۱۰ رقم باشد')
    .optional()
    .or(z.literal('')),
  profile_picture: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      phone: '',
      email: '',
      national_code: '',
    },
  });

  const {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    clearError,
  } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        username: profile.username || '',
        phone: profile.phone || '',
        email: profile.email || '',
        national_code: profile.national_code || '',
      });
    }
  }, [profile, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload: UpdateProfileRequest = {
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        phone: data.phone,
        email: data.email || null,
        national_code: data.national_code || null,
        profile_picture: data.profile_picture || null,
      };

      await updateProfile(payload);
      toast.success('اطلاعات پروفایل با موفقیت بروزرسانی شد');
    } catch (error: any) {
      // Error handling is done in the store and displayed via toast
      console.error('Profile update error:', error);
    }
  };

  const breadcrumbItems = [
    { label: 'پنل کاربری', href: '/user' },
    { label: 'اطلاعات کاربری', href: '/user/profile', active: true },
  ];

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs breadcrumbs={breadcrumbItems} />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              اطلاعات کاربری
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              اطلاعات شخصی خود را ویرایش کنید
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              {profile?.profile_picture ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${profile.profile_picture}`}
                    alt="تصویر پروفایل"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </div>

            <Controller
              name="profile_picture"
              control={control}
              render={({ field }) => (
                <FileUpload
                  id="profile_picture"
                  label="تصویر پروفایل"
                  accept="image/*"
                  onChange={field.onChange}
                  error={errors.profile_picture?.message as string}
                  placeholder="انتخاب تصویر جدید"
                  className="w-full max-w-xs"
                />
              )}
            />
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              id="first_name"
              label="نام"
              {...register('first_name')}
              error={errors.first_name?.message}
              required
            />

            <Input
              id="last_name"
              label="نام خانوادگی"
              {...register('last_name')}
              error={errors.last_name?.message}
              required
            />

            <Input
              id="username"
              label="نام کاربری"
              {...register('username')}
              error={errors.username?.message}
              required
            />

            <Input
              id="phone"
              label="شماره موبایل"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
              required
              placeholder="09123456789"
            />

            <Input
              id="email"
              label="ایمیل"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="example@domain.com"
            />

            <Input
              id="national_code"
              label="کد ملی"
              {...register('national_code')}
              error={errors.national_code?.message}
              placeholder="1234567890"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              ذخیره تغییرات
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}