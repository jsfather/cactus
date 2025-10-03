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
import { useUser } from '@/app/hooks/useUser';
import { UpdateProfileRequest } from '@/app/lib/types';
import { User, Save } from 'lucide-react';
import Image from 'next/image';

const schema = z.object({
  first_name: z.string().min(1, 'نام الزامی است'),
  last_name: z.string().min(1, 'نام خانوادگی الزامی است'),
  username: z.string().min(1, 'نام کاربری الزامی است'),
  phone: z.string().min(1, 'شماره موبایل الزامی است'),
  email: z.string().email('فرمت ایمیل صحیح نیست').optional().or(z.literal('')),
  national_code: z
    .string()
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
    updateProfile: updateProfileService,
    clearError,
  } = useProfile();

  const { updateProfile: updateUserProfile } = useUser();

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
      // Clean up profile_picture field
      let profilePicture = null;
      if (data.profile_picture) {
        if (
          data.profile_picture instanceof File &&
          data.profile_picture.size > 0
        ) {
          profilePicture = data.profile_picture;
        } else if (
          data.profile_picture instanceof FileList &&
          data.profile_picture.length > 0
        ) {
          profilePicture = data.profile_picture[0];
        }
      }

      const payload: UpdateProfileRequest = {
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        phone: data.phone,
        email: data.email || null,
        national_code: data.national_code || null,
        profile_picture: profilePicture,
      };

      console.log('Updating profile with payload:', {
        first_name: payload.first_name,
        last_name: payload.last_name,
        username: payload.username,
        phone: payload.phone,
        email: payload.email,
        national_code: payload.national_code,
        profile_picture: profilePicture
          ? `File: ${profilePicture.name} (${profilePicture.size} bytes)`
          : null,
      });

      // First update through user service to ensure global state is updated
      const response = await updateUserProfile(payload);
      console.log('User profile updated, response:', response);

      // Then update profile service for local state consistency (non-blocking)
      try {
        await updateProfileService(payload);
      } catch (profileError) {
        console.warn(
          'Profile service update failed, but user data is already updated:',
          profileError
        );
      }

      toast.success('اطلاعات پروفایل با موفقیت بروزرسانی شد');
    } catch (error: any) {
      // Error handling is done in the store and displayed via toast
      console.error('Profile update error:', error);
      toast.error('خطا در بروزرسانی پروفایل');
    }
  };

  const breadcrumbItems = [
    { label: 'پنل کاربری', href: '/user' },
    { label: 'اطلاعات کاربری', href: '/user/profile', active: true },
  ];

  if (loading && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs breadcrumbs={breadcrumbItems} />

      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
          <div className="flex flex-col items-center space-y-4 border-b border-gray-200 pb-6 dark:border-gray-700">
            <div className="relative">
              {profile?.profile_picture ? (
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-gray-200 dark:border-gray-700">
                  <Image
                    src={
                      profile.profile_picture.startsWith('http')
                        ? profile.profile_picture
                        : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${profile.profile_picture}`
                    }
                    alt="تصویر پروفایل"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                    unoptimized={true} // Disable Next.js optimization for external images
                  />
                </div>
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                  <User className="h-12 w-12 text-gray-400 dark:text-gray-500" />
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
          <div className="flex justify-end border-t border-gray-200 pt-6 dark:border-gray-700">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              ذخیره تغییرات
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
