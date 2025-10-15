'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
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
import { UpdateAttendanceRequest } from '@/app/lib/types/attendance';
import {
  ArrowRight,
  Save,
  Edit,
  UserCheck,
  UserX,
  Calendar,
  Clock,
  Award,
} from 'lucide-react';

const attendanceSchema = z.object({
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

export default function AttendanceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isEditing = false; // You can add edit mode toggle

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
      status: 'present',
      absence_reason: '',
      mark: '20',
    },
  });

  const {
    currentAttendance,
    loading,
    error,
    fetchAttendanceById,
    updateAttendance,
    clearError,
  } = useAttendance();

  const statusValue = watch('status');

  useEffect(() => {
    if (resolvedParams.id) {
      fetchAttendanceById(resolvedParams.id);
    }
  }, [resolvedParams.id, fetchAttendanceById]);

  useEffect(() => {
    if (currentAttendance) {
      reset({
        status: currentAttendance.status,
        absence_reason: currentAttendance.absence_reason || '',
        mark: currentAttendance.mark,
      });
    }
  }, [currentAttendance, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (data: AttendanceFormData) => {
    if (!currentAttendance) return;

    try {
      await updateAttendance(
        currentAttendance.id.toString(),
        data as UpdateAttendanceRequest
      );
      toast.success('حضور و غیاب با موفقیت بروزرسانی شد');
      router.push('/teacher/attendances');
    } catch (error) {
      // Error is handled by the store and useEffect above
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentAttendance) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            حضور و غیاب یافت نشد
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            حضور و غیاب مورد نظر یافت نشد یا دسترسی به آن وجود ندارد
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
          {
            label: `${currentAttendance.student?.first_name || 'نامشخص'} ${currentAttendance.student?.last_name || ''}`,
            href: `/teacher/attendances/${currentAttendance.id}`,
          },
        ]}
      />

      <div className="mt-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              جزئیات حضور و غیاب
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              مشاهده و ویرایش اطلاعات حضور و غیاب
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Attendance Info Cards */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Student Info */}
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                  اطلاعات دانش‌آموز
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      نام:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {currentAttendance.student
                        ? `${currentAttendance.student.first_name} ${currentAttendance.student.last_name}`
                        : 'نامشخص'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      شماره تماس:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {currentAttendance.student?.phone || 'نامشخص'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Session Info */}
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                  اطلاعات جلسه
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        تاریخ:
                      </span>
                      <span className="mr-2 text-sm font-medium text-gray-900 dark:text-white">
                        {currentAttendance.schedule
                          ? new Date(
                              currentAttendance.schedule.session_date
                            ).toLocaleDateString('fa-IR')
                          : 'نامشخص'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        زمان:
                      </span>
                      <span className="mr-2 text-sm font-medium text-gray-900 dark:text-white">
                        {currentAttendance.schedule
                          ? `${currentAttendance.schedule.start_time} - ${currentAttendance.schedule.end_time}`
                          : 'نامشخص'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Current Status */}
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                  وضعیت فعلی
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      حضور:
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        currentAttendance.status === 'present'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}
                    >
                      {currentAttendance.status === 'present' ? (
                        <>
                          <UserCheck className="ml-1.5 h-3 w-3" />
                          حاضر
                        </>
                      ) : (
                        <>
                          <UserX className="ml-1.5 h-3 w-3" />
                          غایب
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      نمره:
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                      <Award className="h-3 w-3 text-yellow-500" />
                      {currentAttendance.mark}/20
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      تاریخ ثبت:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(
                        currentAttendance.created_at
                      ).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  ویرایش حضور و غیاب
                </h3>
                <Edit className="h-5 w-5 text-gray-400" />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                      placeholder="دلیل غیبت دانش‌آموز را وارد کنید..."
                    />
                  </div>
                )}

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
                        بروزرسانی
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>

        {/* Homeworks Section */}
        {currentAttendance.schedule?.homeworks &&
          currentAttendance.schedule.homeworks.length > 0 && (
            <Card className="mt-6 p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                تکالیف جلسه
              </h3>
              <div className="space-y-4">
                {currentAttendance.schedule.homeworks.map((homework) => (
                  <div
                    key={homework.id}
                    className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {homework.description}
                        </p>
                        {homework.file_url && (
                          <a
                            href={homework.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                          >
                            مشاهده فایل ضمیمه
                          </a>
                        )}
                      </div>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {homework.answers.length} پاسخ
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
      </div>
    </main>
  );
}
