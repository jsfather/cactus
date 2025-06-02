'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { getTermTeacher, createTermTeacher, updateTermTeacher } from '@/app/lib/api/admin/term-teachers';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Select from '@/app/components/ui/Select';

const daySchema = z.object({
  day_of_week: z.string().min(1, 'روز هفته الزامی است'),
  start_time: z.string().min(1, 'زمان شروع الزامی است'),
  end_time: z.string().min(1, 'زمان پایان الزامی است'),
});

const scheduleSchema = z.object({
  sky_room_id: z.string().nullable(),
  session_date: z.string().min(1, 'تاریخ جلسه الزامی است'),
  start_time: z.string().min(1, 'زمان شروع الزامی است'),
  end_time: z.string().min(1, 'زمان پایان الزامی است'),
  is_canceled: z.number(),
  another_person: z.number(),
  another_person_name: z.string().nullable(),
});

const termTeacherSchema = z.object({
  term_id: z.string().min(1, 'شناسه ترم الزامی است'),
  teacher_id: z.string().min(1, 'شناسه مدرس الزامی است'),
  days: z.array(z.object({
    day_of_week: z.string().min(1, 'روز هفته الزامی است'),
    start_time: z.string().min(1, 'ساعت شروع الزامی است'),
    end_time: z.string().min(1, 'ساعت پایان الزامی است'),
  })),
  schedules: z.array(z.object({
    session_date: z.string().min(1, 'تاریخ جلسه الزامی است'),
    start_time: z.string().min(1, 'ساعت شروع الزامی است'),
    end_time: z.string().min(1, 'ساعت پایان الزامی است'),
    sky_room_id: z.string().nullable(),
    is_canceled: z.number(),
    another_person: z.number(),
    another_person_name: z.string().nullable(),
  })),
});

type TermTeacherFormData = z.infer<typeof termTeacherSchema>;

const daysOfWeek = [
  { value: 'saturday', label: 'شنبه' },
  { value: 'sunday', label: 'یکشنبه' },
  { value: 'monday', label: 'دوشنبه' },
  { value: 'tuesday', label: 'سه‌شنبه' },
  { value: 'wednesday', label: 'چهارشنبه' },
  { value: 'thursday', label: 'پنج‌شنبه' },
  { value: 'friday', label: 'جمعه' },
];

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const [loading, setLoading] = useState(!isNew);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TermTeacherFormData>({
    resolver: zodResolver(termTeacherSchema),
    defaultValues: {
      days: [],
      schedules: [],
    },
  });

  useEffect(() => {
    const fetchTermTeacher = async () => {
      if (isNew) return;

      try {
        const response = await getTermTeacher(resolvedParams.id);
        const termTeacher = response.data;
        reset({
          term_id: termTeacher.term_id.toString(),
          teacher_id: termTeacher.teacher_id.toString(),
          days: termTeacher.days,
          schedules: termTeacher.schedules,
        });
      } catch (error) {
        router.push('/admin/term-teachers');
      } finally {
        setLoading(false);
      }
    };

    fetchTermTeacher();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: TermTeacherFormData) => {
    try {
      const formattedData = {
        ...data,
        days: data.days.map(day => ({
          ...day,
          term_teacher_id: '',
          id: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null,
        })),
        schedules: data.schedules.map(schedule => ({
          ...schedule,
          term_teacher_id: '',
          id: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null,
        })),
      };

      if (isNew) {
        await createTermTeacher(formattedData);
        toast.success('ترم مدرس با موفقیت ایجاد شد');
      } else {
        await updateTermTeacher(resolvedParams.id, formattedData);
        toast.success('ترم مدرس با موفقیت بروزرسانی شد');
      }
      router.push('/admin/term-teachers');
    } catch (error) {
      toast.error(isNew ? 'خطا در ایجاد ترم مدرس' : 'خطا در بروزرسانی ترم مدرس');
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

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="term_id"
            label="شناسه ترم"
            placeholder="شناسه ترم را وارد کنید"
            required
            error={errors.term_id?.message}
            {...register('term_id')}
          />

          <Input
            id="teacher_id"
            label="شناسه مدرس"
            placeholder="شناسه مدرس را وارد کنید"
            required
            error={errors.teacher_id?.message}
            {...register('teacher_id')}
          />
        </div>

        {/* Days Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">روزهای کلاس</h3>
          {/* Add dynamic form fields for days */}
        </div>

        {/* Schedules Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">برنامه جلسات</h3>
          {/* Add dynamic form fields for schedules */}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/admin/term-teachers')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? 'ایجاد ترم مدرس' : 'بروزرسانی ترم مدرس'}
          </Button>
        </div>
      </form>
    </main>
  );
}
