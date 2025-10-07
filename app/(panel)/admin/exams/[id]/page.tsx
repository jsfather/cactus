'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { useExamStore } from '@/app/lib/stores/exam.store';
import { useTerm } from '@/app/lib/hooks/use-term';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import MarkdownEditor from '@/app/components/ui/MarkdownEditor';
import Select from '@/app/components/ui/Select';
import DatePicker from '@/app/components/ui/DatePicker';
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

  const {
    currentExam,
    isLoading: loading,
    fetchExamById,
    createExam,
    updateExam,
    clearCurrentExam,
  } = useExamStore();

  const {
    termList,
    fetchTermList,
    loading: termLoading,
    error: termError,
  } = useTerm();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isNew) {
          clearCurrentExam();
        } else {
          await fetchExamById(resolvedParams.id);
        }
        
        // Fetch terms for the select dropdown
        console.log('About to fetch terms...');
        await fetchTermList();
        console.log('Terms fetched, count:', termList.length);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [isNew, resolvedParams.id, fetchExamById, clearCurrentExam, fetchTermList]);

  // Debug termList changes
  useEffect(() => {
    console.log('termList updated:', termList);
  }, [termList]);

  useEffect(() => {
    if (currentExam && !isNew) {
      reset({
        title: currentExam.title,
        description: currentExam.description,
        date: currentExam.date || null,
        duration: currentExam.duration,
        term_id: currentExam.term_id,
      });
    }
  }, [currentExam, isNew, reset]);

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
      // Error handling is done in the store
    }
  };

  if (loading && !isNew) {
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

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="date"
                label="تاریخ آزمون"
                placeholder="تاریخ آزمون را وارد کنید"
                error={errors.date?.message}
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />
        </div>

        <div className="w-full">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <MarkdownEditor
                id="description"
                label="توضیحات آزمون"
                value={field.value}
                onChange={field.onChange}
                error={errors.description?.message}
                required
              />
            )}
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

          <Controller
            name="term_id"
            control={control}
            render={({ field }) => (
              <Select
                id="term_id"
                label="ترم"
                placeholder={termLoading ? "در حال بارگذاری..." : termList.length === 0 ? "هیچ ترمی یافت نشد" : "ترم را انتخاب کنید"}
                error={errors.term_id?.message || termError || undefined}
                value={field.value?.toString() || ''}
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                onBlur={field.onBlur}
                disabled={termLoading || termList.length === 0}
                options={termList.map((term) => ({
                  value: term.id.toString(),
                  label: term.title,
                }))}
              />
            )}
          />
        </div>

        <div className="flex justify-between">
          <div>
            {!isNew && (
              <Button
                type="button"
                variant="info"
                onClick={() =>
                  router.push(`/admin/exams/${resolvedParams.id}/questions`)
                }
              >
                مدیریت سوالات
              </Button>
            )}
          </div>
          <div className="flex gap-3">
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
        </div>
      </form>
    </main>
  );
}
