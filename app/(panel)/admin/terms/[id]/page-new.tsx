'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import DatePicker from '@/app/components/ui/DatePicker';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTerm } from '@/app/lib/hooks/use-term';
import { useLevel } from '@/app/lib/hooks/use-level';
import { CreateTermRequest, UpdateTermRequest } from '@/app/lib/types';
import { ArrowRight, Save } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'عنوان ترم الزامی است'),
  duration: z.coerce.number().min(1, 'مدت زمان الزامی است'),
  number_of_sessions: z.coerce.number().min(1, 'تعداد جلسات الزامی است'),
  level_id: z.coerce.number().min(1, 'سطح الزامی است'),
  start_date: z.string().min(1, 'تاریخ شروع الزامی است'),
  end_date: z.string().min(1, 'تاریخ پایان الزامی است'),
  type: z.enum(
    ['normal', 'capacity_completion', 'project_based', 'specialized', 'ai'],
    {
      required_error: 'نوع ترم الزامی است',
    }
  ),
  capacity: z.coerce.number().min(1, 'ظرفیت الزامی است'),
  price: z.coerce.number().min(0, 'قیمت نمی‌تواند منفی باشد'),
});

type FormData = z.infer<typeof schema>;

const termTypeOptions = [
  { value: 'normal', label: 'عادی' },
  { value: 'capacity_completion', label: 'تکمیل ظرفیت' },
  { value: 'project_based', label: 'پروژه محور(ویژه)' },
  { value: 'specialized', label: 'گرایش تخصصی' },
  { value: 'ai', label: 'هوش مصنوعی' },
];

export default function TermFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';

  const {
    currentTerm,
    loading,
    error,
    fetchTermById,
    createTerm,
    updateTerm,
    clearError,
  } = useTerm();

  const { levelList, loading: levelsLoading, fetchLevelList } = useLevel();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      duration: 60,
      number_of_sessions: 12,
      level_id: 1,
      start_date: '',
      end_date: '',
      type: 'normal',
      capacity: 20,
      price: 0,
    },
  });

  const titleValue = watch('title');

  useEffect(() => {
    if (!isNew) {
      fetchTermById(resolvedParams.id);
    }
  }, [resolvedParams.id, isNew, fetchTermById]);

  useEffect(() => {
    fetchLevelList();
  }, [fetchLevelList]);

  useEffect(() => {
    if (currentTerm && !isNew) {
      reset({
        title: currentTerm.title,
        duration: currentTerm.duration,
        number_of_sessions: currentTerm.number_of_sessions,
        level_id: currentTerm.level_id,
        start_date: currentTerm.start_date,
        end_date: currentTerm.end_date,
        type: currentTerm.type,
        capacity: currentTerm.capacity,
        price: currentTerm.price,
      });
    }
  }, [currentTerm, isNew, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      clearError();

      // Convert numbers to strings as API expects
      const apiData = {
        ...data,
        capacity: data.capacity.toString(),
        price: data.price.toString(),
      };

      if (isNew) {
        await createTerm(apiData as CreateTermRequest);
        toast.success('ترم با موفقیت ایجاد شد');
      } else {
        await updateTerm(resolvedParams.id, apiData as UpdateTermRequest);
        toast.success('ترم با موفقیت به‌روزرسانی شد');
      }

      router.push('/admin/terms');
    } catch (error) {
      toast.error(isNew ? 'خطا در ایجاد ترم' : 'خطا در به‌روزرسانی ترم');
    }
  };

  if (loading && !isNew) {
    return <LoadingSpinner />;
  }

  const breadcrumbItems = [
    { label: 'داشبورد', href: '/admin' },
    { label: 'ترم‌ها', href: '/admin/terms' },
    { label: isNew ? 'ایجاد ترم' : 'ویرایش ترم', href: '#' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs breadcrumbs={breadcrumbItems} />

        <div className="mt-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isNew ? 'ایجاد ترم جدید' : 'ویرایش ترم'}
            </h1>
            {titleValue && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {titleValue}
              </p>
            )}
          </div>
          <Button
            variant="secondary"
            onClick={() => router.push('/admin/terms')}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت
          </Button>
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Input
                  label="عنوان ترم"
                  {...register('title')}
                  error={errors.title?.message}
                  placeholder="مثال: ترم تابستان ۱۴۰۴"
                  required
                />
              </div>

              <div>
                <Input
                  label="مدت زمان هر جلسه (دقیقه)"
                  type="number"
                  {...register('duration')}
                  error={errors.duration?.message}
                  placeholder="۶۰"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Input
                  label="تعداد جلسات"
                  type="number"
                  {...register('number_of_sessions')}
                  error={errors.number_of_sessions?.message}
                  placeholder="۱۲"
                  required
                />
              </div>

              <div>
                <Controller
                  name="level_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="سطح"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      error={errors.level_id?.message}
                      placeholder="سطح را انتخاب کنید"
                      options={levelList.map((level) => ({
                        value: level.id,
                        label: `${level.label} - ${level.name}`,
                      }))}
                      required
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="نوع ترم"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      error={errors.type?.message}
                      placeholder="نوع ترم را انتخاب کنید"
                      options={termTypeOptions}
                      required
                    />
                  )}
                />
              </div>

              <div>
                <Input
                  label="ظرفیت (تعداد دانش‌آموز)"
                  type="number"
                  {...register('capacity')}
                  error={errors.capacity?.message}
                  placeholder="۲۰"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Input
                  label="قیمت (تومان)"
                  type="number"
                  {...register('price')}
                  error={errors.price?.message}
                  placeholder="۱۲۰۰۰۰"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Controller
                  name="start_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="start_date"
                      label="تاریخ شروع"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.start_date?.message}
                      required
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="end_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="end_date"
                      label="تاریخ پایان"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.end_date?.message}
                      required
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/admin/terms')}
                disabled={isSubmitting}
              >
                انصراف
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSubmitting
                  ? 'در حال ذخیره...'
                  : isNew
                    ? 'ایجاد ترم'
                    : 'به‌روزرسانی ترم'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
