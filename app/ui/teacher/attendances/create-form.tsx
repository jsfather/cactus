'use client';

import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';
import { createAttendance } from '@/app/lib/api/teacher/attendances';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

// You may want to fetch students and schedules for the selects
// For now, use placeholder arrays
const students = [
  { id: 1, name: 'دانش‌آموز ۱' },
  { id: 2, name: 'دانش‌آموز ۲' },
];
const schedules = [
  { id: 1, label: 'جلسه ۱' },
  { id: 2, label: 'جلسه ۲' },
];

type FormData = {
  status: 'present' | 'absent' | 'late';
  absence_reason?: string;
  mark: string;
  student_id: number;
  schedule_id: number;
};

export default function Form() {
  const router = useRouter();
  const [status, setStatus] = useState<'present' | 'absent' | 'late'>(
    'present'
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    defaultValues: { status: 'present' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createAttendance({
        status: data.status,
        absence_reason: data.status === 'absent' ? data.absence_reason : null,
        mark: data.mark,
        student: { id: data.student_id } as any,
        schedule: { id: data.schedule_id } as any,
      });
      toast.success('حضور و غیاب با موفقیت ثبت شد');
      router.push('/teacher/attendances');
    } catch (error: any) {
      toast.error(error.message || 'خطا در ثبت حضور و غیاب');
      console.error('Failed to create attendance:', error);
    }
  };

  const selectedStatus = watch('status');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Student and Schedule Row */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="student_id"
              className="mb-2 block text-sm font-medium"
            >
              دانش‌آموز <span className="text-red-500">*</span>
            </label>
            <select
              id="student_id"
              {...register('student_id', {
                required: 'انتخاب دانش‌آموز الزامی است',
                valueAsNumber: true,
              })}
              className={`peer block w-full rounded-md border py-2 pr-4 text-sm focus:outline-0 ${
                errors.student_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">انتخاب کنید</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.student_id && (
              <p className="mt-1 text-sm text-red-500">
                {errors.student_id.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="schedule_id"
              className="mb-2 block text-sm font-medium"
            >
              جلسه <span className="text-red-500">*</span>
            </label>
            <select
              id="schedule_id"
              {...register('schedule_id', {
                required: 'انتخاب جلسه الزامی است',
                valueAsNumber: true,
              })}
              className={`peer block w-full rounded-md border py-2 pr-4 text-sm focus:outline-0 ${
                errors.schedule_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">انتخاب کنید</option>
              {schedules.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            {errors.schedule_id && (
              <p className="mt-1 text-sm text-red-500">
                {errors.schedule_id.message}
              </p>
            )}
          </div>
        </div>

        {/* Status and Mark Row */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="status" className="mb-2 block text-sm font-medium">
              وضعیت <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              {...register('status', { required: 'انتخاب وضعیت الزامی است' })}
              className={`peer block w-full rounded-md border py-2 pr-4 text-sm focus:outline-0 ${
                errors.status ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="present">حضور</option>
              <option value="absent">غیاب</option>
              <option value="late">دیرکرد</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">
                {errors.status.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="mark" className="mb-2 block text-sm font-medium">
              نمره
            </label>
            <input
              id="mark"
              {...register('mark', { required: 'نمره الزامی است' })}
              className={`peer block w-full rounded-md border py-2 pr-4 text-sm focus:outline-0 ${
                errors.mark ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.mark && (
              <p className="mt-1 text-sm text-red-500">{errors.mark.message}</p>
            )}
          </div>
        </div>

        {/* Absence Reason Row (only if absent) */}
        {selectedStatus === 'absent' && (
          <div className="mb-4">
            <label
              htmlFor="absence_reason"
              className="mb-2 block text-sm font-medium"
            >
              دلیل غیبت
            </label>
            <input
              id="absence_reason"
              {...register('absence_reason', {
                required: 'دلیل غیبت الزامی است',
              })}
              className={`peer block w-full rounded-md border py-2 pr-4 text-sm focus:outline-0 ${
                errors.absence_reason ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.absence_reason && (
              <p className="mt-1 text-sm text-red-500">
                {errors.absence_reason.message}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/teacher/attendances"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          لغو
        </Link>
        <Button type="submit" loading={isSubmitting}>
          ثبت حضور و غیاب
        </Button>
      </div>
    </form>
  );
}
