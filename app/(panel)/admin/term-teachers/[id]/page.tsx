'use client';

import { useEffect, useState, use, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Controller, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';

// UI Components
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Select from '@/app/components/ui/Select';
import TimePicker from '@/app/components/ui/TimePicker';

// Hooks and Types
import { useTermTeacher } from '@/app/lib/hooks/use-term-teacher';
import { useTeacher } from '@/app/lib/hooks/use-teacher';
import { useTerm } from '@/app/lib/hooks/use-term';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import {
  CreateTermTeacherRequest,
  UpdateTermTeacherRequest,
} from '@/app/lib/types/term_teacher';
import { ApiError } from '@/app/lib/api/client';

// Form Validation Schema
const termTeacherSchema = z.object({
  term_id: z.number({ required_error: 'ترم الزامی است' }),
  teacher_id: z.number({ required_error: 'مدرس الزامی است' }),
  days: z
    .array(
      z.object({
        day_of_week: z.string().min(1, 'روز هفته الزامی است'),
        start_time: z.string().min(1, 'ساعت شروع الزامی است'),
        end_time: z.string().min(1, 'ساعت پایان الزامی است'),
      })
    )
    .min(1, 'حداقل یک روز الزامی است'),
});

type TermTeacherFormData = z.infer<typeof termTeacherSchema>;

const daysOfWeek = [
  { value: 'شنبه', label: 'شنبه' },
  { value: 'یکشنبه', label: 'یکشنبه' },
  { value: 'دوشنبه', label: 'دوشنبه' },
  { value: 'سه‌شنبه', label: 'سه‌شنبه' },
  { value: 'چهارشنبه', label: 'چهارشنبه' },
  { value: 'پنجشنبه', label: 'پنجشنبه' },
  { value: 'جمعه', label: 'جمعه' },
];

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';

  // Hooks
  const {
    currentTermTeacher,
    loading: termTeacherLoading,
    fetchTermTeacherById,
    createTermTeacher,
    updateTermTeacher,
    clearCurrentTermTeacher,
  } = useTermTeacher();

  const {
    teacherList,
    loading: teacherLoading,
    fetchTeacherList,
  } = useTeacher();

  const { termList, loading: termLoading, fetchTermList } = useTerm();

  // Form setup
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    submitWithErrorHandling,
    globalError,
    reset,
  } = useFormWithBackendErrors<TermTeacherFormData>(termTeacherSchema);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'days',
  });

  // Track if form has been initialized to prevent infinite loops
  const initializedRef = useRef(false);

  // Loading states
  const loading = termTeacherLoading || teacherLoading || termLoading;

  // Memoized options for selects to prevent infinite re-renders
  const termOptions = useMemo(
    () =>
      termList.map((term) => ({
        value: term.id.toString(),
        label: term.title,
      })),
    [termList]
  );

  const teacherOptions = useMemo(
    () =>
      teacherList
        .filter((teacher: any) => teacher.user !== null)
        .map((teacher: any) => ({
          value: teacher.user_id.toString(),
          label: `${teacher.user.first_name} ${teacher.user.last_name}`,
        })),
    [teacherList]
  );

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load terms and teachers for dropdowns
        await Promise.all([fetchTermList(), fetchTeacherList()]);

        // If editing, also fetch the term-teacher data
        if (!isNew) {
          await fetchTermTeacherById(resolvedParams.id);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('خطا در بارگذاری اطلاعات');
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, resolvedParams.id]);

  // Initialize form with default values for new term-teacher
  useEffect(() => {
    if (
      !loading &&
      termOptions.length > 0 &&
      teacherOptions.length > 0 &&
      !initializedRef.current &&
      isNew
    ) {
      // Set default values for new term-teachers
      reset({
        term_id: parseInt(termOptions[0].value),
        teacher_id: parseInt(teacherOptions[0].value),
        days: [
          {
            day_of_week: 'شنبه',
            start_time: '09:00',
            end_time: '10:00',
          },
        ],
      });
      initializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, termOptions.length, teacherOptions.length, isNew]);

  // Initialize form with fetched data when editing
  useEffect(() => {
    if (
      !isNew &&
      currentTermTeacher &&
      termOptions.length > 0 &&
      teacherOptions.length > 0 &&
      !initializedRef.current
    ) {
      // Format times by removing seconds if present (HH:MM:SS -> HH:MM)
      const formatTime = (time: string) => {
        if (!time) return '';
        const parts = time.split(':');
        return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : time;
      };

      // Map the fetched days to the form format
      const formDays = currentTermTeacher.days.map((day) => ({
        day_of_week: day.day_of_week,
        start_time: formatTime(day.start_time),
        end_time: formatTime(day.end_time),
      }));

      reset({
        term_id: currentTermTeacher.term_id,
        teacher_id: currentTermTeacher.teacher_id,
        days:
          formDays.length > 0
            ? formDays
            : [
                {
                  day_of_week: 'شنبه',
                  start_time: '09:00',
                  end_time: '10:00',
                },
              ],
      });
      initializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, currentTermTeacher, termOptions.length, teacherOptions.length]);

  // Clear current term teacher when leaving the page
  useEffect(() => {
    return () => {
      clearCurrentTermTeacher();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: TermTeacherFormData) => {
    try {
      console.log('Submitting form data:', JSON.stringify(data, null, 2));
      if (isNew) {
        await createTermTeacher(data);
        toast.success('ترم مدرس با موفقیت ایجاد شد');
      } else {
        await updateTermTeacher(resolvedParams.id, data);
        toast.success('ترم مدرس با موفقیت بروزرسانی شد');
      }
      router.push('/admin/term-teachers');
    } catch (error: any) {
      // Error is already handled by the hook and store
      console.error('Form submission error:', error);
      console.error('Error details:', {
        message: error?.message,
        status: error?.status,
        errors: error?.errors,
        raw: JSON.stringify(error, null, 2),
      });
    }
  };

  const handleError = (error: ApiError) => {
    console.error('Term teacher form submission error:', error);
    toast.error(
      error?.message ||
        (isNew ? 'خطا در ایجاد ترم مدرس' : 'خطا در بروزرسانی ترم مدرس')
    );
  };

  const addDay = () => {
    append({
      day_of_week: 'شنبه',
      start_time: '09:00',
      end_time: '10:00',
    });
  };

  const removeDay = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'ترم مدرسین', href: '/admin/term-teachers' },
          {
            label: isNew ? 'ایجاد ترم مدرس' : 'ویرایش ترم مدرس',
            href: `/admin/term-teachers/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <div className="mt-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <form
          onSubmit={handleSubmit(
            submitWithErrorHandling(onSubmit, handleError)
          )}
          className="space-y-6"
        >
          {globalError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-100 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {globalError}
            </div>
          )}

          {/* Main Fields */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Controller
              name="term_id"
              control={control}
              render={({ field }) => (
                <Select
                  id="term_id"
                  label="ترم"
                  placeholder="ترم را انتخاب کنید"
                  options={termOptions}
                  required
                  error={errors.term_id?.message}
                  value={field.value?.toString() || ''}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  onBlur={field.onBlur}
                />
              )}
            />

            <Controller
              name="teacher_id"
              control={control}
              render={({ field }) => (
                <Select
                  id="teacher_id"
                  label="مدرس"
                  placeholder="مدرس را انتخاب کنید"
                  options={teacherOptions}
                  required
                  error={errors.teacher_id?.message}
                  value={field.value?.toString() || ''}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  onBlur={field.onBlur}
                />
              )}
            />
          </div>

          {/* Days Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                برنامه کلاس‌ها
              </h3>
              <Button
                type="button"
                variant="secondary"
                onClick={addDay}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                افزودن روز
              </Button>
            </div>

            {errors.days?.message && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.days.message}
              </p>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 md:grid-cols-4 dark:border-gray-700"
                >
                  <Controller
                    name={`days.${index}.day_of_week`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        id={`day_${index}`}
                        label="روز هفته"
                        placeholder="روز را انتخاب کنید"
                        options={daysOfWeek}
                        required
                        error={errors.days?.[index]?.day_of_week?.message}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name={`days.${index}.start_time`}
                    control={control}
                    render={({ field }) => (
                      <TimePicker
                        id={`start_time_${index}`}
                        label="ساعت شروع"
                        placeholder="ساعت شروع"
                        required
                        error={errors.days?.[index]?.start_time?.message}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    )}
                  />

                  <Controller
                    name={`days.${index}.end_time`}
                    control={control}
                    render={({ field }) => (
                      <TimePicker
                        id={`end_time_${index}`}
                        label="ساعت پایان"
                        placeholder="ساعت پایان"
                        required
                        error={errors.days?.[index]?.end_time?.message}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    )}
                  />

                  <div className="flex items-end">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => removeDay(index)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-start gap-3 pt-6">
            <Button type="submit" loading={isSubmitting}>
              {isNew ? 'ایجاد ترم مدرس' : 'بروزرسانی ترم مدرس'}
            </Button>
            <Button
              type="button"
              variant="white"
              onClick={() => router.push('/admin/term-teachers')}
            >
              انصراف
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
