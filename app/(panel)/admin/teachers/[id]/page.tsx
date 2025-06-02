'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { getTeacher, createTeacher, updateTeacher } from '@/app/lib/api/admin/teachers';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Select from '@/app/components/ui/Select';
import Textarea from '@/app/components/ui/Textarea';

const teacherSchema = z.object({
  user_id: z.string().min(1, 'کاربر الزامی است'),
  specialties: z.string().min(1, 'تخصص‌ها الزامی است'),
  education: z.string().min(1, 'تحصیلات الزامی است'),
  bio: z.string().min(1, 'بیوگرافی الزامی است'),
  resume: z.string().nullable(),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

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
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
  });

  useEffect(() => {
    const fetchTeacher = async () => {
      if (isNew) return;

      try {
        const response = await getTeacher(resolvedParams.id);
        const teacher = response.data;
        reset({
          user_id: teacher.user_id.toString(),
          specialties: teacher.specialties,
          education: teacher.education,
          bio: teacher.bio,
          resume: teacher.resume,
        });
      } catch (error) {
        router.push('/admin/teachers');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: TeacherFormData) => {
    try {
      if (isNew) {
        await createTeacher(data);
        toast.success('مدرس با موفقیت ایجاد شد');
      } else {
        await updateTeacher(resolvedParams.id, data);
        toast.success('مدرس با موفقیت بروزرسانی شد');
      }
      router.push('/admin/teachers');
    } catch (error) {
      toast.error(isNew ? 'خطا در ایجاد مدرس' : 'خطا در بروزرسانی مدرس');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'مدرسین', href: '/admin/teachers' },
          {
            label: isNew ? 'ایجاد مدرس' : 'ویرایش مدرس',
            href: `/admin/teachers/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="user_id"
            label="شناسه کاربر"
            placeholder="شناسه کاربر را وارد کنید"
            required
            error={errors.user_id?.message}
            {...register('user_id')}
          />

          <Input
            id="education"
            label="تحصیلات"
            placeholder="تحصیلات را وارد کنید"
            required
            error={errors.education?.message}
            {...register('education')}
          />
        </div>

        <div className="w-full">
          <Input
            id="specialties"
            label="تخصص‌ها"
            placeholder="تخصص‌ها را وارد کنید"
            required
            error={errors.specialties?.message}
            {...register('specialties')}
          />
        </div>

        <div className="w-full">
          <Textarea
            id="bio"
            label="بیوگرافی"
            placeholder="بیوگرافی را وارد کنید"
            required
            error={errors.bio?.message}
            {...register('bio')}
          />
        </div>

        <div className="w-full">
          <Input
            id="resume"
            label="رزومه"
            type="file"
            accept=".pdf,.doc,.docx"
            placeholder="رزومه را انتخاب کنید"
            error={errors.resume?.message}
            {...register('resume')}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/admin/teachers')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? 'ایجاد مدرس' : 'بروزرسانی مدرس'}
          </Button>
        </div>
      </form>
    </main>
  );
}
