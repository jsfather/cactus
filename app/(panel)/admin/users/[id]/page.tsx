'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getUser, createUser, updateUser } from '@/app/lib/api/admin/users';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import FileUpload from '@/app/components/ui/FileUpload';

interface UserFormData {
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  password: string;
  email?: string;
  national_code?: string;
  profile_picture?: File | null;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [apiError, setApiError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<UserFormData>();

  useEffect(() => {
    const fetchUser = async () => {
      if (isNew) return;

      try {
        const response = await getUser(resolvedParams.id);
        const user = response.data;
        reset({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          username: user.username || '',
          email: user.email || '',
          phone: user.phone || '',
          national_code: user.national_code || '',
          password: '',
        });
      } catch (error) {
        toast.error('خطا در دریافت اطلاعات کاربر');
        router.push('/admin/users');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: UserFormData) => {
    setApiError('');

    try {
      const formData = new FormData();

      // افزودن فیلدهای متنی
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('username', data.username);
      formData.append('phone', data.phone);
      formData.append('password', data.password);

      if (data.email) formData.append('email', data.email);
      if (data.national_code)
        formData.append('national_code', data.national_code);

      // افزودن فایل عکس پروفایل
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }

      if (isNew) {
        await createUser(formData);
        toast.success('کاربر با موفقیت ایجاد شد');
      } else {
        await updateUser(resolvedParams.id, formData);
        toast.success('کاربر با موفقیت بروزرسانی شد');
      }
      router.push('/admin/users');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        (isNew ? 'خطا در ایجاد کاربر' : 'خطا در بروزرسانی کاربر');
      setApiError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleProfilePictureChange = (file: File | null) => {
    setProfilePicture(file);
    setValue('profile_picture', file);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'کاربران', href: '/admin/users' },
          {
            label: isNew ? 'ایجاد کاربر' : 'ویرایش کاربر',
            href: `/admin/users/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {apiError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{apiError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="first_name"
            label="نام"
            placeholder="نام کاربر را وارد کنید"
            required
            error={errors.first_name?.message}
            {...register('first_name', { required: 'نام الزامی است' })}
          />

          <Input
            id="last_name"
            label="نام خانوادگی"
            placeholder="نام خانوادگی کاربر را وارد کنید"
            required
            error={errors.last_name?.message}
            {...register('last_name', { required: 'نام خانوادگی الزامی است' })}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="username"
            label="نام کاربری"
            placeholder="نام کاربری را وارد کنید"
            required
            error={errors.username?.message}
            {...register('username', { required: 'نام کاربری الزامی است' })}
          />

          <Input
            id="phone"
            label="شماره تماس"
            placeholder="شماره تماس کاربر را وارد کنید"
            required
            error={errors.phone?.message}
            {...register('phone', { required: 'شماره تماس الزامی است' })}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="email"
            label="ایمیل"
            type="email"
            placeholder="ایمیل کاربر را وارد کنید"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="national_code"
            label="کد ملی"
            placeholder="کد ملی کاربر را وارد کنید"
            error={errors.national_code?.message}
            {...register('national_code')}
          />
        </div>

        <div className="w-full">
          <Input
            id="password"
            label="رمز عبور"
            type="password"
            placeholder={
              isNew ? 'رمز عبور را وارد کنید' : 'برای تغییر رمز عبور وارد کنید'
            }
            required={isNew}
            error={errors.password?.message}
            {...register('password', {
              required: isNew ? 'رمز عبور الزامی است' : false,
            })}
          />
        </div>

        <div className="w-full">
          <FileUpload
            id="profile_picture"
            label="عکس پروفایل"
            accept="image/*"
            placeholder="عکس پروفایل را انتخاب کنید"
            onChange={handleProfilePictureChange}
            error={errors.profile_picture?.message}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/admin/users')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? 'ایجاد کاربر' : 'بروزرسانی کاربر'}
          </Button>
        </div>
      </form>
    </main>
  );
}
