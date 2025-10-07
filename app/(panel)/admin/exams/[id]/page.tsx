'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

// UI Components
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import DatePicker from '@/app/components/ui/DatePicker';
import MarkdownEditor from '@/app/components/ui/MarkdownEditor';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

// Hooks and Types
import { useExam } from '@/app/lib/hooks/use-exam';
import { useTerm } from '@/app/lib/hooks/use-term';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import { CreateExamRequest, UpdateExamRequest } from '@/app/lib/types/exam';

// Form Validation Schema
const examSchema = z.object({
  title: z.string().min(1, 'عنوان آزمون ضروری است'),
  description: z.string().min(1, 'توضیحات آزمون ضروری است'),
  date: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  term_id: z.string().optional().nullable(),
});

type ExamFormData = z.infer<typeof examSchema>;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const ExamFormPage: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const { createExam, updateExam, fetchExamById, currentExam } = useExam();
  const { termList, loading: termsLoading, fetchTermList } = useTerm();

  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const isNew = resolvedParams?.id === 'new';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useFormWithBackendErrors<ExamFormData>(examSchema);

  useEffect(() => {
    fetchTermList();
  }, [fetchTermList]);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParamsData = await params;
      setResolvedParams(resolvedParamsData);

      if (resolvedParamsData.id === 'new') {
        // Clear form for new exam
        reset({
          title: '',
          description: '',
          date: null,
          duration: null,
          term_id: null,
        });
        setLoading(false);
        return;
      }

      try {
        await fetchExamById(resolvedParamsData.id);
      } catch (error) {
        toast.error('خطا در بارگذاری اطلاعات آزمون');
        router.push('/admin/exams');
      } finally {
        setLoading(false);
      }
    };

    resolveParams();
  }, [params, fetchExamById, reset, router]);

  useEffect(() => {
    if (currentExam && !isNew) {
      reset({
        title: currentExam.title || '',
        description: currentExam.description || '',
        date: currentExam.date || null,
        duration: currentExam.duration?.toString() || null,
        term_id: currentExam.term_id?.toString() || null,
      });
    }
  }, [currentExam, isNew, reset]);

  const onSubmit = async (data: ExamFormData) => {
    try {
      const payload: CreateExamRequest | UpdateExamRequest = {
        title: data.title,
        description: data.description,
        date: data.date || null,
        duration: data.duration ? parseInt(data.duration) : null,
        term_id: data.term_id ? parseInt(data.term_id) : null,
      };

      if (isNew) {
        await createExam(payload as CreateExamRequest);
        toast.success('آزمون با موفقیت ایجاد شد');
      } else if (resolvedParams) {
        await updateExam(resolvedParams.id, payload as UpdateExamRequest);
        toast.success('آزمون با موفقیت بروزرسانی شد');
      }
      
      router.push('/admin/exams');
    } catch (error) {
      // Error handling is done in the hook/store
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
            href: `/admin/exams/${resolvedParams?.id}`,
            active: true,
          },
        ]}
      />

      <div className="mt-8">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                {isNew ? 'ایجاد آزمون جدید' : 'ویرایش آزمون'}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {isNew 
                  ? 'اطلاعات آزمون جدید را وارد کنید' 
                  : 'اطلاعات آزمون را ویرایش کنید'
                }
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 dark:bg-gray-800 sm:p-6">
                  
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="title"
                          label="عنوان آزمون"
                          placeholder="عنوان آزمون را وارد کنید"
                          required
                          error={errors.title?.message}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          id="date"
                          label="تاریخ آزمون"
                          placeholder="تاریخ آزمون را انتخاب کنید"
                          error={errors.date?.message}
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                  </div>

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

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Controller
                      name="duration"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="duration"
                          label="مدت زمان (دقیقه)"
                          type="number"
                          placeholder="مدت زمان آزمون را وارد کنید"
                          error={errors.duration?.message}
                          {...field}
                          value={field.value || ''}
                        />
                      )}
                    />

                    <Controller
                      name="term_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          id="term_id"
                          label="ترم"
                          placeholder={
                            termsLoading 
                              ? "در حال بارگذاری..." 
                              : termList.length === 0 
                                ? "هیچ ترمی یافت نشد" 
                                : "ترم را انتخاب کنید (اختیاری)"
                          }
                          error={errors.term_id?.message}
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          disabled={termsLoading || termList.length === 0}
                          options={[
                            { value: '', label: 'بدون ترم' },
                            ...termList.map((term) => ({
                              value: term.id.toString(),
                              label: term.title,
                            }))
                          ]}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 text-left dark:bg-gray-700 sm:px-6">
                  <div className="flex justify-between">
                    <div>
                      {!isNew && (
                        <Button
                          type="button"
                          variant="info"
                          onClick={() =>
                            router.push(`/admin/exams/${resolvedParams?.id}/questions`)
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
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ExamFormPage;
