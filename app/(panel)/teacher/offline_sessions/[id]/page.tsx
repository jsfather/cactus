'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import {
  getOfflineSession,
  createOfflineSession,
  updateOfflineSession,
} from '@/app/lib/api/teacher/offline_sessions';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

const offlineSessionSchema = z.object({
  title: z.string().min(1, 'عنوان الزامی است'),
  description: z.string().min(1, 'توضیحات الزامی است'),
  video_url: z.string().min(1, 'آدرس ویدیو الزامی است'),
  term_id: z.string().min(1, 'شناسه ترم الزامی است'),
  term_teacher_id: z.string().min(1, 'شناسه مدرس ترم الزامی است'),
});

type OfflineSessionFormData = z.infer<typeof offlineSessionSchema>;

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
  } = useForm<OfflineSessionFormData>({
    resolver: zodResolver(offlineSessionSchema),
  });

  useEffect(() => {
    const fetchOfflineSession = async () => {
      if (isNew) return;

      try {
        const response = await getOfflineSession(resolvedParams.id);
        reset({
          title: response.title,
          description: response.description,
          video_url: response.video_url,
          term_id: response.term_id,
          term_teacher_id: response.term_teacher_id,
        });
      } catch (error) {
        router.push('/teacher/offline_sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchOfflineSession();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: OfflineSessionFormData) => {
    try {
      if (isNew) {
        await createOfflineSession(data);
        toast.success('کلاس آفلاین با موفقیت ایجاد شد');
      } else {
        await updateOfflineSession(resolvedParams.id, data);
        toast.success('کلاس آفلاین با موفقیت بروزرسانی شد');
      }
      router.push('/teacher/offline_sessions');
    } catch (error) {
      toast.error(
        isNew ? 'خطا در ایجاد کلاس آفلاین' : 'خطا در بروزرسانی کلاس آفلاین'
      );
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'کلاس های آفلاین', href: '/teacher/offline_sessions' },
          {
            label: isNew ? 'ایجاد کلاس آفلاین' : 'ویرایش کلاس آفلاین',
            href: `/teacher/offline_sessions/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="title"
            label="عنوان"
            placeholder="عنوان کلاس را وارد کنید"
            required
            error={errors.title?.message}
            {...register('title')}
          />

          <Input
            id="video_url"
            label="آدرس ویدیو"
            placeholder="آدرس ویدیو را وارد کنید"
            required
            error={errors.video_url?.message}
            {...register('video_url')}
          />
        </div>

        <div className="w-full">
          <Textarea
            id="description"
            label="توضیحات"
            placeholder="توضیحات کلاس را وارد کنید"
            required
            error={errors.description?.message}
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="term_id"
            label="شناسه ترم"
            placeholder="شناسه ترم را وارد کنید"
            required
            error={errors.term_id?.message}
            {...register('term_id')}
          />

          <Input
            id="term_teacher_id"
            label="شناسه مدرس ترم"
            placeholder="شناسه مدرس ترم را وارد کنید"
            required
            error={errors.term_teacher_id?.message}
            {...register('term_teacher_id')}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/teacher/offline_sessions')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? 'ایجاد کلاس آفلاین' : 'بروزرسانی کلاس آفلاین'}
          </Button>
        </div>
      </form>
    </main>
  );
}
