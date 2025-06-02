'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { getExam, createExam, updateExam } from '@/app/lib/api/admin/exams';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

const examSchema = z.object({
  title: z.string().min(1, 'عنوان الزامی است'),
  description: z.string().min(1, 'توضیحات الزامی است'),
  date: z.string().nullable(),
  duration: z.number().nullable(),
  term_id: z.number().nullable(),
});

type ExamFormData = z.infer<typeof examSchema>;

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
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
  });

  useEffect(() => {
    const fetchExam = async () => {
      if (isNew) return;

      try {
        const response = await getExam(resolvedParams.id);
        const exam = response.data;
        reset({
          title: exam.title,
          description: exam.description,
          date: exam.date || null,
          duration: exam.duration,
          term_id: exam.term_id,
        });
      } catch (error) {
        router.push('/admin/exams');
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: ExamFormData) => {
    try {
      if (isNew) {
        await createExam(data);
        toast.success('آزمون با موفقیت ایجاد شد');
      } else {
        await updateExam(resolvedParams.id, data);
        toast.success('آزمون با موفقیت بروزرسانی شد');
      }
      router.push('/admin/exams');
    } catch (error) {
      toast.error(isNew ? 'خطا در ایجاد آزمون' : 'خطا در بروزرسانی آزمون');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'آزمون‌ها', href: '/admin/exams' },
          {
            label: isNew ? 'ایجاد آزمون' : 'ویرایش آزمون',
            href: `/admin/exams/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="title"
            label="عنوان"
            placeholder="عنوان آزمون را وارد کنید"
            required
            error={errors.title?.message}
            {...register('title')}
          />

          <Input
            id="date"
            label="تاریخ"
            type="datetime-local"
            placeholder="تاریخ آزمون را وارد کنید"
            error={errors.date?.message}
            {...register('date')}
          />
        </div>

        <div className="w-full">
          <Textarea
            id="description"
            label="توضیحات"
            placeholder="توضیحات آزمون را وارد کنید"
            required
            error={errors.description?.message}
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="duration"
            label="مدت زمان (دقیقه)"
            type="number"
            placeholder="مدت زمان آزمون را وارد کنید"
            error={errors.duration?.message}
            {...register('duration', {
              setValueAs: (value: string) => (value ? parseInt(value) : null),
            })}
          />

          <Input
            id="term_id"
            label="شناسه ترم"
            type="number"
            placeholder="شناسه ترم را وارد کنید"
            error={errors.term_id?.message}
            {...register('term_id', {
              setValueAs: (value: string) => (value ? parseInt(value) : null),
            })}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/admin/exams')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? 'ایجاد آزمون' : 'بروزرسانی آزمون'}
          </Button>
        </div>
      </form>
    </main>
  );
}
