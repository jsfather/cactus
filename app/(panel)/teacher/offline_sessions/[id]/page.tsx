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

// Hooks and Types
import { useOfflineSession } from '@/app/lib/hooks/use-offline-session';
import { useTeacherTerm } from '@/app/lib/hooks/use-teacher-term';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import {
  CreateOfflineSessionRequest,
  UpdateOfflineSessionRequest,
} from '@/app/lib/types/offline-session';

// Utils
import { convertToEnglishNumbers } from '@/app/lib/utils';

// Form Validation Schema
const offlineSessionSchema = z.object({
  title: z.string().min(1, 'عنوان ضروری است'),
  description: z.string().min(1, 'توضیحات ضروری است'),
  video_url: z
    .string()
    .url('آدرس ویدیو معتبر نیست')
    .min(1, 'آدرس ویدیو ضروری است'),
  term_id: z.string().min(1, 'شناسه ترم ضروری است'),
  term_teacher_id: z.string().min(1, 'شناسه مدرس ترم ضروری است'),
});

type OfflineSessionFormData = z.infer<typeof offlineSessionSchema>;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const OfflineSessionFormPage: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const {
    createOfflineSession,
    updateOfflineSession,
    fetchOfflineSessionById,
    currentOfflineSession,
  } = useOfflineSession();

  const { terms, loading: termsLoading, fetchTerms } = useTeacherTerm();

  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [selectedTermId, setSelectedTermId] = useState<string>('');
  const [availableTeachers, setAvailableTeachers] = useState<
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
  } = useFormWithBackendErrors<OfflineSessionFormData>(offlineSessionSchema);

  // Watch term_id changes to update available teachers
  const watchedTermId = watch('term_id');

  // Function to update teachers list based on term ID
  const updateTeachersList = (termId: string) => {
    if (termId && terms.length > 0) {
      const selectedTerm = terms.find((term) => term.id.toString() === termId);
      if (selectedTerm && selectedTerm.teachers) {
        const teacherOptions = selectedTerm.teachers.map((teacher) => ({
          value: teacher.id.toString(),
          label: `مدرس ${teacher.id}`,
        }));
        setAvailableTeachers(teacherOptions);
        return teacherOptions;
      }
    }
    setAvailableTeachers([]);
    return [];
  };

  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  // Update available teachers when term is selected (only for user interactions, not initial data load)
  useEffect(() => {
    if (watchedTermId && terms.length > 0) {
      // Only reset teacher selection if this is a new term selection by user (not initial data load)
      const shouldResetTeacher =
        watchedTermId !== selectedTermId && selectedTermId !== '';

      updateTeachersList(watchedTermId);
      setSelectedTermId(watchedTermId);

      if (shouldResetTeacher && isNew) {
        setValue('term_teacher_id', '');
      }
    } else if (!watchedTermId) {
      setAvailableTeachers([]);
      if (isNew) {
        setValue('term_teacher_id', '');
      }
    }
  }, [watchedTermId, terms, selectedTermId, setValue, isNew]);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParamsData = await params;
      setResolvedParams(resolvedParamsData);

      if (resolvedParamsData.id === 'new') {
        // Clear form for new offline session
        reset({
          title: '',
          description: '',
          video_url: '',
          term_id: '',
          term_teacher_id: '',
        });
        setLoading(false);
        return;
      }

      try {
        await fetchOfflineSessionById(resolvedParamsData.id);
      } catch (error) {
        toast.error('خطا در بارگذاری اطلاعات جلسه آفلاین');
        router.push('/teacher/offline_sessions');
      } finally {
        setLoading(false);
      }
    };

    resolveParams();
  }, [fetchOfflineSessionById, reset, router]);

  // Set form data when currentOfflineSession changes and terms are loaded
  useEffect(() => {
    if (currentOfflineSession && !isNew && terms.length > 0) {
      const termId = currentOfflineSession.term_id.toString();
      const teacherId = currentOfflineSession.term_teacher_id.toString();

      // First update the teachers list for the selected term
      updateTeachersList(termId);
      setSelectedTermId(termId);

      // Then reset the form with all data including the teacher selection
      reset({
        title: currentOfflineSession.title,
        description: currentOfflineSession.description,
        video_url: currentOfflineSession.video_url,
        term_id: termId,
        term_teacher_id: teacherId,
      });
    }
  }, [currentOfflineSession, isNew, reset, terms]);

  const onSubmit = async (data: OfflineSessionFormData) => {
    if (!resolvedParams) return;

    const processedData = {
      title: data.title,
      description: data.description,
      video_url: data.video_url,
      term_id: convertToEnglishNumbers(data.term_id),
      term_teacher_id: convertToEnglishNumbers(data.term_teacher_id),
    };

    try {
      if (resolvedParams.id === 'new') {
        await createOfflineSession(
          processedData as CreateOfflineSessionRequest
        );
        toast.success('جلسه آفلاین با موفقیت ایجاد شد');
      } else {
        await updateOfflineSession(
          resolvedParams.id,
          processedData as UpdateOfflineSessionRequest
        );
        toast.success('جلسه آفلاین با موفقیت به‌روزرسانی شد');
      }
      router.push('/teacher/offline_sessions');
    } catch (error) {
      toast.error(
        isNew ? 'خطا در ایجاد جلسه آفلاین' : 'خطا در بروزرسانی جلسه آفلاین'
      );
    }
  };

  const handleError = () => {
    toast.error(
      isNew ? 'خطا در ایجاد جلسه آفلاین' : 'خطا در بروزرسانی جلسه آفلاین'
    );
  };

  if (!resolvedParams || loading || termsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Prepare term options for select
  const termOptions = terms.map((term) => ({
    value: term.id.toString(),
    label: term.title,
  }));

  const breadcrumbItems = [
    { label: 'پنل مدیریت', href: '/teacher' },
    { label: 'جلسات آفلاین', href: '/teacher/offline_sessions' },
    { label: isNew ? 'ایجاد جلسه جدید' : 'ویرایش جلسه', href: '#' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Breadcrumbs breadcrumbs={breadcrumbItems} />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNew ? 'ایجاد جلسه آفلاین جدید' : 'ویرایش جلسه آفلاین'}
          </h1>
          <div className="flex gap-3">
            {!isNew && currentOfflineSession && (
              <Button
                variant="white"
                onClick={() =>
                  router.push(
                    `/teacher/offline_sessions/${resolvedParams?.id}/view`
                  )
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
              onClick={() => router.push('/teacher/offline_sessions')}
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
            {/* Title */}
            <div className="md:col-span-2">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    id="title"
                    label="عنوان جلسه"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.title?.message}
                    required
                  />
                )}
              />
            </div>

            {/* Term ID */}
            <div>
              <Controller
                name="term_id"
                control={control}
                render={({ field }) => (
                  <Select
                    id="term_id"
                    label="انتخاب ترم"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.term_id?.message}
                    placeholder="ترم را انتخاب کنید"
                    options={termOptions}
                    required
                  />
                )}
              />
            </div>

            {/* Term Teacher ID */}
            <div>
              <Controller
                name="term_teacher_id"
                control={control}
                render={({ field }) => (
                  <Select
                    id="term_teacher_id"
                    label="انتخاب مدرس ترم"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.term_teacher_id?.message}
                    placeholder={
                      selectedTermId
                        ? 'مدرس را انتخاب کنید'
                        : 'ابتدا ترم را انتخاب کنید'
                    }
                    options={availableTeachers}
                    disabled={!selectedTermId || availableTeachers.length === 0}
                    required
                  />
                )}
              />
            </div>

            {/* Video URL */}
            <div className="md:col-span-2">
              <Controller
                name="video_url"
                control={control}
                render={({ field }) => (
                  <Input
                    id="video_url"
                    label="آدرس ویدیو"
                    type="url"
                    placeholder="https://www.example.com/video"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.video_url?.message}
                    required
                  />
                )}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <MarkdownEditor
                    id="description"
                    label="توضیحات جلسه"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.description?.message}
                    required
                  />
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-6 dark:border-gray-600">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/teacher/offline_sessions')}
              disabled={isSubmitting}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting
                ? 'در حال ذخیره...'
                : isNew
                  ? 'ایجاد جلسه'
                  : 'به‌روزرسانی'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfflineSessionFormPage;
