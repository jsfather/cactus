'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { getReport, createReport } from '@/app/lib/api/teacher/reports';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

const reportSchema = z.object({
  term_id: z.string().min(1, 'شناسه ترم الزامی است'),
  student_id: z.string().min(1, 'شناسه دانش پژوه الزامی است'),
  description: z.string().min(1, 'توضیحات الزامی است'),
  mark: z.string().min(1, 'نمره الزامی است'),
});

type ReportFormData = z.infer<typeof reportSchema>;

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
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  useEffect(() => {
    const fetchReport = async () => {
      if (isNew) return;

      try {
        const response = await getReport(resolvedParams.id);
        reset({
          term_id: response.term_id,
          student_id: response.student_id,
          description: response.description,
          mark: response.mark,
        });
      } catch (error) {
        router.push('/teacher/reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: ReportFormData) => {
    try {
      await createReport(data);
      toast.success('گزارش با موفقیت ایجاد شد');
      router.push('/teacher/reports');
    } catch (error) {
      toast.error('خطا در ایجاد گزارش');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'گزارش‌ها', href: '/teacher/reports' },
          {
            label: isNew ? 'ایجاد گزارش' : 'مشاهده گزارش',
            href: `/teacher/reports/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
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
            id="student_id"
            label="شناسه دانش پژوه"
            placeholder="شناسه دانش پژوه را وارد کنید"
            required
            error={errors.student_id?.message}
            {...register('student_id')}
          />
        </div>

        <div className="w-full">
          <Textarea
            id="description"
            label="توضیحات"
            placeholder="توضیحات گزارش را وارد کنید"
            required
            error={errors.description?.message}
            {...register('description')}
          />
        </div>

        <div className="w-full">
          <Input
            id="mark"
            label="نمره"
            placeholder="نمره را وارد کنید"
            required
            error={errors.mark?.message}
            {...register('mark')}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/teacher/reports')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? 'ایجاد گزارش' : 'مشاهده گزارش'}
          </Button>
        </div>
      </form>
    </main>
  );
}
