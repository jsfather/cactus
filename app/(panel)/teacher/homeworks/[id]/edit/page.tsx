'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/app/components/ui/Button';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import FileUpload from '@/app/components/ui/FileUpload';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import { useTeacherHomework } from '@/app/lib/hooks/use-teacher-homework';
import { useTeacherTerm } from '@/app/lib/hooks/use-teacher-term';
import { UpdateTeacherHomeworkRequest } from '@/app/lib/types/teacher-homework';
import { Save, X, FileText, Download } from 'lucide-react';

// Form Validation Schema
const homeworkSchema = z.object({
  description: z.string().min(1, 'شرح تکلیف ضروری است'),
  term_id: z.string().min(1, 'انتخاب ترم ضروری است'),
  term_teacher_schedule_id: z.string().min(1, 'انتخاب جلسه ضروری است'),
  offline_session_id: z.string().optional(),
  file: z.any().optional(),
});

type HomeworkFormData = z.infer<typeof homeworkSchema>;

export default function EditHomeworkPage() {
  const params = useParams();
  const router = useRouter();
  const homeworkId = params.id as string;
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [availableSchedules, setAvailableSchedules] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const { 
    currentHomework, 
    loading, 
    updating, 
    fetchHomeworkById, 
    updateHomework,
    clearCurrentHomework 
  } = useTeacherHomework();
  const { terms, fetchTerms, loading: termsLoading } = useTeacherTerm();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useFormWithBackendErrors<HomeworkFormData>(homeworkSchema);

  useEffect(() => {
    fetchTerms();
    if (homeworkId) {
      fetchHomeworkById(homeworkId);
    }
    
    return () => {
      clearCurrentHomework();
    };
  }, [homeworkId, fetchTerms, fetchHomeworkById, clearCurrentHomework]);

  // Extract schedules from terms
  useEffect(() => {
    if (terms.length > 0) {
      const schedules: any[] = [];
      terms.forEach(term => {
        if (term.teachers) {
          term.teachers.forEach(teacher => {
            if (teacher.schedules) {
              teacher.schedules.forEach(schedule => {
                schedules.push({
                  ...schedule,
                  termTitle: term.title,
                  termId: term.id,
                });
              });
            }
          });
        }
      });
      setAvailableSchedules(schedules);
    }
  }, [terms]);

  // Populate form when homework data is loaded
  useEffect(() => {
    if (currentHomework && !loading) {
      reset({
        description: currentHomework.description,
        term_id: currentHomework.term?.id.toString() || '',
        term_teacher_schedule_id: currentHomework.schedule?.id.toString() || '',
        offline_session_id: '', // This might not be in the response, leave empty
      });
      setInitialLoading(false);
    }
  }, [currentHomework, loading, reset]);

  const onSubmit = async (data: HomeworkFormData) => {
    try {
      const payload: UpdateTeacherHomeworkRequest = {
        description: data.description,
        term_id: parseInt(data.term_id),
        term_teacher_schedule_id: parseInt(data.term_teacher_schedule_id),
      };

      // Add offline_session_id if provided
      if (data.offline_session_id) {
        payload.offline_session_id = parseInt(data.offline_session_id);
      }

      // Only include file if a new one was selected
      if (selectedFile) {
        payload.file = selectedFile;
      }

      const result = await updateHomework(homeworkId, payload);
      if (result) {
        router.push(`/teacher/homeworks/${homeworkId}`);
      }
    } catch (error) {
      console.error('Error updating homework:', error);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  if (loading || termsLoading || initialLoading) {
    return <LoadingSpinner />;
  }

  if (!currentHomework) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              تکلیف یافت نشد
            </h1>
            <Button
              onClick={() => router.push('/teacher/homeworks')}
              className="mt-4"
            >
              بازگشت به لیست تکالیف
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumbs
          breadcrumbs={[
            { label: 'داشبورد مدرس', href: '/teacher' },
            { label: 'تکالیف', href: '/teacher/homeworks' },
            { label: 'جزئیات تکلیف', href: `/teacher/homeworks/${homeworkId}` },
            { label: 'ویرایش', href: `/teacher/homeworks/${homeworkId}/edit` },
          ]}
        />

        {/* Header */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              ویرایش تکلیف
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              اطلاعات تکلیف را ویرایش کنید
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="mt-8 max-w-4xl">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Description */}
                <div className="lg:col-span-2">
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          شرح تکلیف *
                        </label>
                        <textarea
                          {...field}
                          id="description"
                          rows={4}
                          placeholder="شرح کاملی از تکلیف مورد نظر بنویسید..."
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.description.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Schedule Selection */}
                <div className="lg:col-span-2">
                  <Controller
                    name="term_teacher_schedule_id"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          انتخاب جلسه *
                        </label>
                        <select
                          {...field}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        >
                          <option value="">انتخاب کنید...</option>
                          {availableSchedules.map((schedule) => (
                            <option key={schedule.id} value={schedule.id.toString()}>
                              {schedule.termTitle} - {schedule.session_date} ({schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)})
                            </option>
                          ))}
                        </select>
                        {errors.term_teacher_schedule_id && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.term_teacher_schedule_id.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Term ID (Hidden field - will be populated based on schedule selection) */}
                <Controller
                  name="term_id"
                  control={control}
                  render={({ field }) => (
                    <input type="hidden" {...field} />
                  )}
                />

                {/* Offline Session ID (Optional field) */}
                <div className="lg:col-span-2">
                  <Controller
                    name="offline_session_id"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          شناسه جلسه آفلاین (اختیاری)
                        </label>
                        <input
                          {...field}
                          type="number"
                          placeholder="شناسه جلسه آفلاین را وارد کنید"
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                        {errors.offline_session_id && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.offline_session_id.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Current File */}
                {currentHomework.file_url && (
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      فایل فعلی
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        فایل ضمیمه موجود
                      </span>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => window.open(currentHomework.file_url!, '_blank')}
                        className="flex items-center gap-1 text-xs px-2 py-1"
                      >
                        <Download className="h-3 w-3" />
                        دانلود
                      </Button>
                    </div>
                  </div>
                )}

                {/* File Upload */}
                <div className="lg:col-span-2">
                  <FileUpload
                    id="homework_file"
                    label={currentHomework.file_url ? "تغییر فایل (اختیاری)" : "فایل ضمیمه (اختیاری)"}
                    accept="image/*,application/pdf,.doc,.docx,.txt"
                    placeholder="فایل جدید را اینجا بکشید یا کلیک کنید"
                    value={selectedFile}
                    onChange={handleFileSelect}
                  />
                  {currentHomework.file_url && !selectedFile && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      اگر فایل جدیدی انتخاب نکنید، فایل فعلی حفظ خواهد شد.
                    </p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push(`/teacher/homeworks/${homeworkId}`)}
                  disabled={isSubmitting || updating}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || updating}
                  className="flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      در حال بروزرسانی...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      ذخیره تغییرات
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}