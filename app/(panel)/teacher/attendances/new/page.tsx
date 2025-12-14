'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import Select from '@/app/components/ui/Select';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Card } from '@/app/components/ui/Card';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAttendance } from '@/app/lib/hooks/use-attendance';
import { useTeacherTerm } from '@/app/lib/hooks/use-teacher-term';
import { CreateAttendanceRequest } from '@/app/lib/types/attendance';
import { ArrowRight, Save, UserCheck } from 'lucide-react';

const attendanceSchema = z.object({
  student_id: z.string().min(1, 'انتخاب دانش‌پژوه الزامی است'),
  term_id: z.string().min(1, 'انتخاب ترم الزامی است'),
  term_teacher_schedule_id: z.string().min(1, 'انتخاب جلسه الزامی است'),
  status: z.enum(['present', 'absent'], {
    required_error: 'انتخاب وضعیت حضور الزامی است',
  }),
  absence_reason: z.string().optional(),
  mark: z.string().min(1, 'وارد کردن نمره الزامی است'),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

const statusOptions = [
  { value: 'present', label: 'حاضر' },
  { value: 'absent', label: 'غایب' },
];

function NewAttendanceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const termId = searchParams.get('termId');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      student_id: '',
      term_id: termId || '',
      term_teacher_schedule_id: '',
      status: 'present',
      absence_reason: '',
      mark: '20',
    },
  });

  const { loading, error, createAttendance, clearError } = useAttendance();

  const { currentTerm, fetchTermById, loading: termLoading } = useTeacherTerm();

  const statusValue = watch('status');

  useEffect(() => {
    if (termId) {
      fetchTermById(termId);
    }
  }, [termId, fetchTermById]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (data: AttendanceFormData) => {
    try {
      await createAttendance(data as CreateAttendanceRequest);
      toast.success('حضور و غیاب با موفقیت ثبت شد');
      router.push('/teacher/attendances');
    } catch (error) {
      // Error is handled by the store and useEffect above
    }
  };

  // Generate student options from current term
  const studentOptions =
    currentTerm?.students
      ?.filter((student) => student.user)
      .map((student) => ({
        value: student.user!.id.toString(),
        label: `${student.user!.first_name} ${student.user!.last_name}`,
      })) || [];

  // Generate schedule options (sessions) from current term
  const scheduleOptions =
    currentTerm?.teachers?.[0]?.schedules?.map((schedule) => ({
      value: schedule.id.toString(),
      label: `${new Date(schedule.session_date).toLocaleDateString('fa-IR')} - ${schedule.start_time} تا ${schedule.end_time}`,
    })) || [];

  if (termLoading || !termId) {
    return <LoadingSpinner />;
  }

  if (!currentTerm) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            ترم یافت نشد
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            ترم مورد نظر یافت نشد یا دسترسی به آن وجود ندارد
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push('/teacher/attendances')}
          >
            بازگشت به لیست
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'حضور و غیاب', href: '/teacher/attendances' },
          { label: 'ثبت حضور و غیاب جدید', href: '/teacher/attendances/new' },
        ]}
      />

      <div className="mt-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              ثبت حضور و غیاب جدید
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              ثبت حضور و غیاب برای ترم: {currentTerm.title}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => router.push('/teacher/attendances')}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت
          </Button>
        </div>

        {/* Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Student Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  دانش‌پژوه *
                </label>
                <Controller
                  name="student_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="student_id"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: '', label: 'انتخاب دانش‌پژوه' },
                        ...studentOptions,
                      ]}
                      error={errors.student_id?.message}
                      required
                    />
                  )}
                />
              </div>

              {/* Schedule Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  جلسه *
                </label>
                <Controller
                  name="term_teacher_schedule_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="term_teacher_schedule_id"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: '', label: 'انتخاب جلسه' },
                        ...scheduleOptions,
                      ]}
                      error={errors.term_teacher_schedule_id?.message}
                      required
                    />
                  )}
                />
              </div>

              {/* Status Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  وضعیت حضور *
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="status"
                      value={field.value}
                      onChange={field.onChange}
                      options={statusOptions}
                      error={errors.status?.message}
                      required
                    />
                  )}
                />
              </div>

              {/* Mark */}
              <div>
                <Input
                  id="mark"
                  label="نمره (از 20)"
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  {...register('mark')}
                  error={errors.mark?.message}
                  required
                />
              </div>
            </div>

            {/* Absence Reason - Only show if status is absent */}
            {statusValue === 'absent' && (
              <div>
                <Textarea
                  id="absence_reason"
                  label="دلیل غیبت"
                  rows={3}
                  {...register('absence_reason')}
                  error={errors.absence_reason?.message}
                  placeholder="دلیل غیبت دانش‌پژوه را وارد کنید..."
                />
              </div>
            )}

            {/* Hidden Term ID */}
            <input type="hidden" {...register('term_id')} />

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/teacher/attendances')}
              >
                انصراف
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="flex items-center gap-2"
              >
                {isSubmitting || loading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    ثبت حضور و غیاب
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}

export default function NewAttendancePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NewAttendanceForm />
    </Suspense>
  );
}
