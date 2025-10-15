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
import MarkdownEditor from '@/app/components/ui/MarkdownEditor';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

// Hooks and Types
import { useReport } from '@/app/lib/hooks/use-report';
import { useTeacherTerm } from '@/app/lib/hooks/use-teacher-term';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import { CreateReportRequest } from '@/lib/types/report';

// Utils
import { convertToEnglishNumbers } from '@/app/lib/utils';

// Form Validation Schema
const reportSchema = z.object({
  term_id: z.string().min(1, 'ترم ضروری است'),
  term_teacher_schedule_id: z.string().min(1, 'جلسه ضروری است'),
  content: z.string().min(1, 'محتوای گزارش ضروری است'),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const ReportFormPage: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const {
    createReport,
    fetchReportById,
    currentReport,
    loading: reportLoading,
  } = useReport();

  const { terms, loading: termsLoading, fetchTerms } = useTeacherTerm();

  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [selectedTermId, setSelectedTermId] = useState<string>('');
  const [availableSchedules, setAvailableSchedules] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const isNew = resolvedParams?.id === 'new';

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useFormWithBackendErrors<ReportFormData>(reportSchema);

  // Watch term_id changes to update available schedules
  const watchedTermId = watch('term_id');

  // Function to update schedules list based on term ID
  const updateSchedulesList = (termId: string) => {
    if (termId && terms.length > 0) {
      const selectedTerm = terms.find((term) => term.id.toString() === termId);
      if (selectedTerm && selectedTerm.teachers) {
        // Collect all schedules from all teachers of this term
        const allSchedules: Array<{ value: string; label: string }> = [];
        selectedTerm.teachers.forEach((teacher) => {
          if (teacher.schedules) {
            teacher.schedules.forEach((schedule) => {
              allSchedules.push({
                value: schedule.id.toString(),
                label: `جلسه ${schedule.session_date} - ${schedule.start_time} تا ${schedule.end_time}`,
              });
            });
          }
        });
        setAvailableSchedules(allSchedules);
        return allSchedules;
      }
    }
    setAvailableSchedules([]);
    return [];
  };

  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  // Update available schedules when term is selected
  useEffect(() => {
    if (watchedTermId && terms.length > 0) {
      // Only reset schedule selection if this is a new term selection by user (not initial data load)
      const shouldResetSchedule =
        watchedTermId !== selectedTermId && selectedTermId !== '';

      updateSchedulesList(watchedTermId);
      setSelectedTermId(watchedTermId);

      if (shouldResetSchedule && isNew) {
        setValue('term_teacher_schedule_id', '');
      }
    } else if (!watchedTermId) {
      setAvailableSchedules([]);
      if (isNew) {
        setValue('term_teacher_schedule_id', '');
      }
    }
  }, [watchedTermId, terms, selectedTermId, setValue, isNew]);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParamsData = await params;
      setResolvedParams(resolvedParamsData);

      if (resolvedParamsData.id === 'new') {
        // Clear form for new report
        reset({
          term_id: '',
          term_teacher_schedule_id: '',
          content: '',
        });
        setLoading(false);
        return;
      }

      try {
        await fetchReportById(resolvedParamsData.id);
      } catch (error) {
        toast.error('خطا در بارگذاری اطلاعات گزارش');
        router.push('/teacher/reports');
      } finally {
        setLoading(false);
      }
    };

    resolveParams();
  }, [fetchReportById, reset, router, params]);

  // Set form data when currentReport changes and terms are loaded
  useEffect(() => {
    if (currentReport && !isNew && terms.length > 0) {
      const termId = currentReport.term?.id?.toString() || '';
      const scheduleId = currentReport.schedule?.id?.toString() || '';

      // First update the schedules list for the selected term
      if (termId) {
        updateSchedulesList(termId);
        setSelectedTermId(termId);
      }

      // Then reset the form with all data including the schedule selection
      reset({
        term_id: termId,
        term_teacher_schedule_id: scheduleId,
        content: currentReport.content,
      });
    }
  }, [currentReport, isNew, reset, terms]);

  const onSubmit = async (data: ReportFormData) => {
    if (!resolvedParams) return;

    const processedData: CreateReportRequest = {
      term_id: Number(convertToEnglishNumbers(data.term_id)),
      term_teacher_schedule_id: Number(
        convertToEnglishNumbers(data.term_teacher_schedule_id)
      ),
      content: data.content,
    };

    try {
      if (resolvedParams.id === 'new') {
        await createReport(processedData);
        toast.success('گزارش با موفقیت ایجاد شد');
      } else {
        // Note: Update functionality not implemented in API yet
        toast('بروزرسانی گزارش در حال حاضر امکان‌پذیر نیست');
        return;
      }
      router.push('/teacher/reports');
    } catch (error) {
      toast.error(isNew ? 'خطا در ایجاد گزارش' : 'خطا در بروزرسانی گزارش');
    }
  };

  const handleError = () => {
    toast.error(isNew ? 'خطا در ایجاد گزارش' : 'خطا در بروزرسانی گزارش');
  };

  if (!resolvedParams || loading || reportLoading || termsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Prepare terms options for select
  const termOptions = terms.map((term) => ({
    value: term.id.toString(),
    label: term.title,
  }));

  const breadcrumbItems = [
    { label: 'پنل استاد', href: '/teacher' },
    { label: 'گزارش‌ها', href: '/teacher/reports' },
    {
      label: isNew ? 'ایجاد گزارش جدید' : 'ویرایش گزارش',
      href: '#',
      active: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Breadcrumbs breadcrumbs={breadcrumbItems} />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNew ? 'ایجاد گزارش جدید' : 'ویرایش گزارش'}
          </h1>
          <div className="flex gap-3">
            {!isNew && currentReport && (
              <Button
                variant="white"
                onClick={() =>
                  router.push(`/teacher/reports/${resolvedParams?.id}/view`)
                }
                className="flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                مشاهده جزئیات
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => router.push('/teacher/reports')}
              className="flex items-center gap-2"
            >
              <span>←</span>
              بازگشت به لیست
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <form
          onSubmit={handleSubmit(onSubmit, handleError)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Term Selection */}
            <div>
              <Controller
                name="term_id"
                control={control}
                render={({ field }) => (
                  <Select
                    id="term_id"
                    label="ترم"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.term_id?.message}
                    placeholder="انتخاب ترم"
                    required
                    options={termOptions}
                  />
                )}
              />
            </div>

            {/* Schedule Selection */}
            <div>
              <Controller
                name="term_teacher_schedule_id"
                control={control}
                render={({ field }) => (
                  <Select
                    id="term_teacher_schedule_id"
                    label="جلسه"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.term_teacher_schedule_id?.message}
                    placeholder="انتخاب جلسه"
                    required
                    options={availableSchedules}
                    disabled={!watchedTermId}
                  />
                )}
              />
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <MarkdownEditor
                    id="content"
                    label="محتوای گزارش"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.content?.message}
                    required
                  />
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/teacher/reports')}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isNew ? 'ایجاد گزارش' : 'بروزرسانی گزارش'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportFormPage;
