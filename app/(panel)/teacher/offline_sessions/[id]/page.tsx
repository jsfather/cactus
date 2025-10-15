'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

// UI Components
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import MarkdownEditor from '@/app/components/ui/MarkdownEditor';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';

// Hooks and Types
import { useOfflineSession } from '@/app/lib/hooks/use-offline-session';
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

  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const isNew = resolvedParams?.id === 'new';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useFormWithBackendErrors<OfflineSessionFormData>(offlineSessionSchema);

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

  // Set form data when currentOfflineSession changes
  useEffect(() => {
    if (currentOfflineSession && !isNew) {
      reset({
        title: currentOfflineSession.title,
        description: currentOfflineSession.description,
        video_url: currentOfflineSession.video_url,
        term_id: currentOfflineSession.term_id.toString(),
        term_teacher_id: currentOfflineSession.term_teacher_id.toString(),
      });
    }
  }, [currentOfflineSession, isNew, reset]);

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

  if (!resolvedParams || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
                  <Input
                    id="term_id"
                    label="شناسه ترم"
                    type="number"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.term_id?.message}
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
                  <Input
                    id="term_teacher_id"
                    label="شناسه مدرس ترم"
                    type="number"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.term_teacher_id?.message}
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
