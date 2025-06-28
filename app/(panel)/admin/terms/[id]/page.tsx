'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { getTerm, createTerm, updateTerm } from '@/app/lib/api/admin/terms';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Select from '@/app/components/ui/Select';
import DatePicker from '@/app/components/ui/DatePicker';

const termSchema = z.object({
  title: z.string().min(1, 'عنوان الزامی است'),
  duration: z.string().min(1, 'مدت زمان الزامی است'),
  number_of_sessions: z.string().min(1, 'تعداد جلسات الزامی است'),
  level_id: z.number(),
  start_date: z.string().min(1, 'تاریخ شروع الزامی است'),
  end_date: z.string().min(1, 'تاریخ پایان الزامی است'),
  type: z.enum(['normal', 'capacity_completion', 'vip'], {
    required_error: 'نوع ترم الزامی است',
  }),
  capacity: z.string().min(1, 'ظرفیت الزامی است'),
});

type TermFormData = z.infer<typeof termSchema>;

const termTypeOptions = [
  { value: 'normal', label: 'عادی' },
  { value: 'capacity_completion', label: 'تکمیل ظرفیت' },
  { value: 'vip', label: 'ویژه' },
];

const levelOptions = [
  { value: '1', label: 'مبتدی' },
  { value: '2', label: 'متوسط' },
  { value: '3', label: 'پیشرفته' },
];

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const [loading, setLoading] = useState(!isNew);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TermFormData>({
    resolver: zodResolver(termSchema),
    defaultValues: {
      title: '',
      duration: '',
      number_of_sessions: '',
      level_id: 1,
      start_date: '',
      end_date: '',
      type: 'normal',
      capacity: '',
    }
  });

  useEffect(() => {
    const fetchTerm = async () => {
      if (isNew) return;

      try {
        const response = await getTerm(resolvedParams.id);
        const term = response.data;
        reset({
          title: term.title,
          duration: term.duration,
          number_of_sessions: term.number_of_sessions,
          level_id: term.level_id,
          start_date: term.start_date,
          end_date: term.end_date,
          type: term.type,
          capacity: term.capacity,
        });
      } catch (error) {
        router.push('/admin/terms');
      } finally {
        setLoading(false);
      }
    };

    fetchTerm();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: TermFormData) => {
    console.log('Form data before submit:', data);
    try {
      if (isNew) {
        await createTerm(data);
        toast.success('ترم با موفقیت ایجاد شد');
      } else {
        await updateTerm(resolvedParams.id, data);
        toast.success('ترم با موفقیت بروزرسانی شد');
      }
      router.push('/admin/terms');
    } catch (error) {
      toast.error(isNew ? 'خطا در ایجاد ترم' : 'خطا در بروزرسانی ترم');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'ترم‌ها', href: '/admin/terms' },
          {
            label: isNew ? 'ایجاد ترم' : 'ویرایش ترم',
            href: `/admin/terms/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="title"
            label="عنوان"
            placeholder="عنوان ترم را وارد کنید"
            required
            error={errors.title?.message}
            {...register('title')}
          />

          <Select
            id="type"
            label="نوع ترم"
            placeholder="نوع ترم را انتخاب کنید"
            options={termTypeOptions}
            required
            error={errors.type?.message}
            {...register('type')}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="duration"
            label="مدت زمان"
            placeholder="مدت زمان ترم را وارد کنید"
            required
            error={errors.duration?.message}
            {...register('duration')}
          />

          <Input
            id="number_of_sessions"
            label="تعداد جلسات"
            placeholder="تعداد جلسات را وارد کنید"
            required
            error={errors.number_of_sessions?.message}
            {...register('number_of_sessions')}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Select
            id="level_id"
            label="سطح"
            placeholder="سطح را انتخاب کنید"
            options={levelOptions}
            required
            error={errors.level_id?.message}
            {...register('level_id', {
              setValueAs: (value: string) => parseInt(value),
            })}
          />

          <Input
            id="capacity"
            label="ظرفیت"
            placeholder="ظرفیت ترم را وارد کنید"
            required
            error={errors.capacity?.message}
            {...register('capacity')}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Controller
            name="start_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="start_date"
                label="تاریخ شروع"
                placeholder="تاریخ شروع را وارد کنید"
                required
                error={errors.start_date?.message}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />

          <Controller
            name="end_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="end_date"
                label="تاریخ پایان"
                placeholder="تاریخ پایان را وارد کنید"
                required
                error={errors.end_date?.message}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/admin/terms')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? 'ایجاد ترم' : 'بروزرسانی ترم'}
          </Button>
        </div>
      </form>
    </main>
  );
}