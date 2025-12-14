'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import FileUpload from '@/app/components/ui/FileUpload';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import { useTeacherHomework } from '@/app/lib/hooks/use-teacher-homework';
import { useTeacherTerm } from '@/app/lib/hooks/use-teacher-term';
import { CreateTeacherHomeworkRequest } from '@/app/lib/types/teacher-homework';
import { Plus, Save, X, BookOpen, Calendar, FileText } from 'lucide-react';

// Form Validation Schema
const homeworkSchema = z.object({
  description: z.string().min(1, 'شرح تکلیف ضروری است'),
  term_id: z.string().min(1, 'انتخاب ترم ضروری است'),
  term_teacher_schedule_id: z.string().min(1, 'انتخاب جلسه ضروری است'),
  offline_session_id: z.string().optional(),
  file: z.any().optional(),
});

type HomeworkFormData = z.infer<typeof homeworkSchema>;

export default function NewHomeworkPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [availableSchedules, setAvailableSchedules] = useState<any[]>([]);

  const { createHomework, creating } = useTeacherHomework();
  const { terms, fetchTerms, loading: termsLoading } = useTeacherTerm();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useFormWithBackendErrors<HomeworkFormData>(homeworkSchema);

  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  // Extract schedules from terms
  useEffect(() => {
    if (terms.length > 0) {
      const schedules: any[] = [];
      terms.forEach((term) => {
        if (term.teachers) {
          term.teachers.forEach((teacher) => {
            if (teacher.schedules) {
              teacher.schedules.forEach((schedule) => {
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

  const onSubmit = async (data: HomeworkFormData) => {
    try {
      const payload: CreateTeacherHomeworkRequest = {
        description: data.description,
        term_id: parseInt(data.term_id),
        term_teacher_schedule_id: parseInt(data.term_teacher_schedule_id),
      };

      // Add offline_session_id if provided
      if (data.offline_session_id && data.offline_session_id.trim()) {
        payload.offline_session_id = parseInt(data.offline_session_id);
      }

      // Only include file if one was selected
      if (selectedFile) {
        payload.file = selectedFile;
      }

      const result = await createHomework(payload);
      if (result) {
        router.push('/teacher/homeworks');
      }
    } catch (error) {
      console.error('Error creating homework:', error);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  if (termsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumbs
          breadcrumbs={[
            { label: 'داشبورد مدرس', href: '/teacher' },
            { label: 'تکالیف', href: '/teacher/homeworks' },
            { label: 'تکلیف جدید', href: '/teacher/homeworks/new' },
          ]}
        />

        {/* Header */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              ایجاد تکلیف جدید
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              تکلیف جدید برای دانش‌پژوهان ایجاد کنید
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
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          شرح تکلیف *
                        </label>
                        <textarea
                          {...field}
                          id="description"
                          rows={4}
                          placeholder="شرح کاملی از تکلیف مورد نظر بنویسید..."
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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

                {/* Term Selection */}
                <div className="lg:col-span-1">
                  <Controller
                    name="term_id"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          انتخاب ترم *
                        </label>
                        <select
                          {...field}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        >
                          <option value="">انتخاب کنید...</option>
                          {terms.map((term) => (
                            <option key={term.id} value={term.id.toString()}>
                              {term.title}
                            </option>
                          ))}
                        </select>
                        {errors.term_id && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.term_id.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Schedule Selection */}
                <div className="lg:col-span-1">
                  <Controller
                    name="term_teacher_schedule_id"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          انتخاب جلسه *
                        </label>
                        <select
                          {...field}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        >
                          <option value="">انتخاب کنید...</option>
                          {availableSchedules.map((schedule) => (
                            <option
                              key={schedule.id}
                              value={schedule.id.toString()}
                            >
                              {schedule.termTitle} - {schedule.session_date} (
                              {schedule.start_time.substring(0, 5)} -{' '}
                              {schedule.end_time.substring(0, 5)})
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

                {/* Offline Session ID (Optional) */}
                <div className="lg:col-span-1">
                  <Controller
                    name="offline_session_id"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          شناسه جلسه آفلاین (اختیاری)
                        </label>
                        <input
                          {...field}
                          type="number"
                          placeholder="شناسه جلسه آفلاین..."
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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

                {/* File Upload */}
                <div className="lg:col-span-2">
                  <FileUpload
                    id="homework_file"
                    label="فایل ضمیمه (اختیاری)"
                    accept="image/*,application/pdf,.doc,.docx,.txt"
                    placeholder="فایل تکلیف را اینجا بکشید یا کلیک کنید"
                    value={selectedFile}
                    onChange={handleFileSelect}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/teacher/homeworks')}
                  disabled={isSubmitting || creating}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || creating}
                  className="flex items-center gap-2"
                >
                  {creating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      در حال ایجاد...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      ایجاد تکلیف
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Available Schedules Info */}
          {availableSchedules.length === 0 && (
            <div className="mt-6 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    هیچ جلسه‌ای موجود نیست
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                    برای ایجاد تکلیف، ابتدا باید ترم‌ها و جلسات برنامه‌ریزی
                    شوند.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Summary */}
          {availableSchedules.length > 0 && (
            <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    جلسات موجود
                  </h3>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                    {availableSchedules.length} جلسه برای انتخاب موجود است.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
