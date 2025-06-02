'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { getUser, createUser, updateUser } from '@/app/lib/api/admin/users';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Select from '@/app/components/ui/Select';

const userSchema = z.object({
  name: z.string().min(1, 'نام الزامی است'),
  email: z.string().email('ایمیل معتبر نیست'),
  phone: z.string().min(1, 'شماره تماس الزامی است'),
  role: z.enum(['admin', 'student', 'teacher'], {
    required_error: 'نقش الزامی است',
  }),
  password: z.string().min(6, 'رمز عبور باید حداقل 6 کاراکتر باشد'),
});

type UserFormData = z.infer<typeof userSchema>;

const roleOptions = [
  { value: 'admin', label: 'مدیر' },
  { value: 'student', label: 'دانش پژوه' },
  { value: 'teacher', label: 'مدرس' },
];

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const [loading, setLoading] = useState(!isNew);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (isNew) return;

      try {
        const response = await getUser(resolvedParams.id);
        const user = response.data;
        reset({
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          password: '',
        });
      } catch (error) {
        router.push('/admin/users');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isNew) {
        await createUser(data);
        toast.success('کاربر با موفقیت ایجاد شد');
      } else {
        await updateUser(resolvedParams.id, data);
        toast.success('کاربر با موفقیت بروزرسانی شد');
      }
      router.push('/admin/users');
    } catch (error) {
      toast.error(isNew ? 'خطا در ایجاد کاربر' : 'خطا در بروزرسانی کاربر');
    }
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="name"
            label="نام"
            placeholder="نام کاربر را وارد کنید"
            required
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            id="email"
            label="ایمیل"
            type="email"
            placeholder="ایمیل کاربر را وارد کنید"
            required
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="phone"
            label="شماره تماس"
            placeholder="شماره تماس کاربر را وارد کنید"
            required
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Select
            id="role"
            label="نقش"
            placeholder="نقش کاربر را انتخاب کنید"
            options={roleOptions}
            required
            error={errors.role?.message}
            {...register('role')}
          />
        </div>

        <div className="w-full">
          <Input
            id="password"
            label="رمز عبور"
            type="password"
            placeholder={isNew ? 'رمز عبور را وارد کنید' : 'برای تغییر رمز عبور وارد کنید'}
            required={isNew}
            error={errors.password?.message}
            {...register('password')}
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
