'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getTerm, createTerm, updateTerm } from '@/app/lib/api/admin/terms';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Select from '@/app/components/ui/Select';
import DatePicker from '@/app/components/ui/DatePicker';
import { Controller } from 'react-hook-form';

import { z } from 'zod';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import { ApiError } from '@/app/lib/api/client';
import { convertToEnglishNumbers } from '@/app/lib/utils/persian';

const termSchema = z.object({
  title: z.string().min(1, 'عنوان الزامی است'),
  duration: z.string().min(1, 'مدت زمان الزامی است'),
  number_of_sessions: z.string().min(1, 'تعداد جلسات الزامی است'),
  level_id: z.number({ required_error: 'سطح الزامی است' }),
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
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    submitWithErrorHandling,
    globalError,
    setGlobalError,
    reset,
  } = useFormWithBackendErrors<TermFormData>(termSchema);

  useEffect(() => {
    const fetchTerm = async () => {
      if (isNew) {
        // Set default values for new terms
        reset({
          title: '',
          duration: '',
          number_of_sessions: '',
          level_id: 1,
          start_date: '',
          end_date: '',
          type: 'normal',
          capacity: '',
        });
        setLoading(false);
        return;
      }

      try {
        const response = await getTerm(resolvedParams.id);
        const term = response.data;
        reset({
          title: term.title,
          duration: String(term.duration), // Convert to string
          number_of_sessions: String(term.number_of_sessions), // Convert to string
          level_id: term.level_id || term.level?.id, // Handle both cases
          start_date: term.start_date,
          end_date: term.end_date,
          type: term.type,
          capacity: String(term.capacity), // Convert to string
        });
      } catch (error) {
        toast.error('خطا در بارگذاری ترم');
        router.push('/admin/terms');
      } finally {
        setLoading(false);
      }
    };

    fetchTerm();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: TermFormData) => {
    // Convert Persian/Arabic numbers to English before sending to server
    const processedData = {
      ...data,
      duration: convertToEnglishNumbers(data.duration),
      number_of_sessions: convertToEnglishNumbers(data.number_of_sessions),
      capacity: convertToEnglishNumbers(data.capacity),
    };

    if (isNew) {
      await createTerm(processedData);
      toast.success('ترم با موفقیت ایجاد شد');
      router.push('/admin/terms');
    } else {
      await updateTerm(resolvedParams.id, processedData);
      toast.success('ترم با موفقیت بروزرسانی شد');
      router.push('/admin/terms');
    }
  };

  const handleError = (error: ApiError) => {
    console.log('Term form submission error:', error);
    
    // Show toast error message
    if (error?.message) {
      toast.error(error.message);
    } else {
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

      <form 
        onSubmit={handleSubmit(submitWithErrorHandling(onSubmit, handleError))} 
        className="mt-8 space-y-6"
      >
        {globalError && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
            {globalError}
          </div>
        )}
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
            convertNumbers={true}
            error={errors.duration?.message}
            {...register('duration', {
              setValueAs: (value) => convertToEnglishNumbers(value)
            })}
          />

          <Input
            id="number_of_sessions"
            label="تعداد جلسات"
            placeholder="تعداد جلسات را وارد کنید"
            required
            convertNumbers={true}
            error={errors.number_of_sessions?.message}
            {...register('number_of_sessions', {
              setValueAs: (value) => convertToEnglishNumbers(value)
            })}
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
              setValueAs: (value: string) => parseInt(value, 10),
            })}
          />

          <Input
            id="capacity"
            label="ظرفیت"
            placeholder="ظرفیت ترم را وارد کنید"
            required
            convertNumbers={true}
            error={errors.capacity?.message}
            {...register('capacity', {
              setValueAs: (value) => convertToEnglishNumbers(value)
            })}
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
