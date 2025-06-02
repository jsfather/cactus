'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { createAttendance } from '@/app/lib/api/teacher/attendances';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import Select from '@/app/components/ui/Select';

const attendanceSchema = z.object({
  status: z.enum(['present', 'absent'], {
    required_error: 'وضعیت حضور الزامی است',
  }),
  absence_reason: z.string().nullable(),
  mark: z.string().min(1, 'نمره الزامی است'),
  student_id: z.string().min(1, 'شناسه دانش پژوه الزامی است'),
  schedule_id: z.string().min(1, 'شناسه جلسه الزامی است'),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

const statusOptions = [
  { value: 'present', label: 'حاضر' },
  { value: 'absent', label: 'غایب' },
];

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      status: 'present',
    },
  });

  const status = watch('status');

  const onSubmit = async (data: AttendanceFormData) => {
    try {
      await createAttendance(data);
      toast.success('حضور و غیاب با موفقیت ثبت شد');
      router.push('/teacher/attendances');
    } catch (error) {
      toast.error('خطا در ثبت حضور و غیاب');
    }
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'حضور و غیاب', href: '/teacher/attendances' },
          {
            label: 'ثبت حضور و غیاب',
            href: `/teacher/attendances/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Select
            id="status"
            label="وضعیت حضور"
            placeholder="وضعیت حضور را انتخاب کنید"
            options={statusOptions}
            required
            error={errors.status?.message}
            {...register('status')}
          />

          <Input
            id="mark"
            label="نمره"
            placeholder="نمره را وارد کنید"
            required
            error={errors.mark?.message}
            {...register('mark')}
          />
        </div>

        {status === 'absent' && (
          <div className="w-full">
            <Input
              id="absence_reason"
              label="دلیل غیبت"
              placeholder="دلیل غیبت را وارد کنید"
              error={errors.absence_reason?.message}
              {...register('absence_reason')}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="student_id"
            label="شناسه دانش پژوه"
            placeholder="شناسه دانش پژوه را وارد کنید"
            required
            error={errors.student_id?.message}
            {...register('student_id')}
          />

          <Input
            id="schedule_id"
            label="شناسه جلسه"
            placeholder="شناسه جلسه را وارد کنید"
            required
            error={errors.schedule_id?.message}
            {...register('schedule_id')}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/teacher/attendances')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            ثبت حضور و غیاب
          </Button>
        </div>
      </form>
    </main>
  );
}
