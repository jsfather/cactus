'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

// UI Components
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import DatePicker from '@/app/components/ui/DatePicker';
import MarkdownEditor from '@/app/components/ui/MarkdownEditor';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';

// Hooks and Types
import { useTerm } from '@/app/lib/hooks/use-term';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import { CreateTermRequest, UpdateTermRequest } from '@/app/lib/types/term';

// Utils
import { convertToEnglishNumbers } from '@/app/lib/utils';

// Form Validation Schema
const termSchema = z.object({
  title: z.string().min(1, 'عنوان ضروری است'),
  start_date: z.string().min(1, 'تاریخ شروع ضروری است'),
  end_date: z.string().min(1, 'تاریخ پایان ضروری است'),
  duration: z.string().min(1, 'مدت زمان ضروری است'),
  number_of_sessions: z.string().min(1, 'تعداد جلسات ضروری است'),
  capacity: z.string().min(1, 'ظرفیت ضروری است'),
  type: z.enum(['normal', 'capacity_completion', 'project_based', 'specialized', 'ai'], {
    errorMap: () => ({ message: 'نوع ترم ضروری است' })
  }),
  price: z.string().min(1, 'قیمت ضروری است'),
});

type TermFormData = z.infer<typeof termSchema>;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const TermFormPage: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const { createTerm, updateTerm, fetchTermById, currentTerm } = useTerm();

  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const isNew = resolvedParams?.id === 'new';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useFormWithBackendErrors<TermFormData>(termSchema);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParamsData = await params;
      setResolvedParams(resolvedParamsData);

      if (resolvedParamsData.id === 'new') {
        // Clear form for new term
        reset({
          title: '',
          start_date: '',
          end_date: '',
          duration: '',
          number_of_sessions: '',
          capacity: '',
          type: 'normal',
          price: '',
        });
        setLoading(false);
        return;
      }

      try {
        await fetchTermById(resolvedParamsData.id);
      } catch (error) {
        toast.error('خطا در بارگذاری اطلاعات ترم');
        router.push('/admin/terms');
      } finally {
        setLoading(false);
      }
    };

    resolveParams();
  }, [fetchTermById, reset, router]);

  // Set form data when currentTerm changes
  useEffect(() => {
    if (currentTerm && !isNew) {
      reset({
        title: currentTerm.title,
        start_date: currentTerm.start_date,
        end_date: currentTerm.end_date,
        duration: currentTerm.duration.toString(),
        number_of_sessions: currentTerm.number_of_sessions.toString(),
        capacity: currentTerm.capacity.toString(),
        type: currentTerm.type,
        price: currentTerm.price.toString(),
      });
    }
  }, [currentTerm, isNew, reset]);

  const onSubmit = async (data: TermFormData) => {
    if (!resolvedParams) return;

    const processedData = {
      title: data.title,
      start_date: data.start_date,
      end_date: data.end_date,
      duration: Number(convertToEnglishNumbers(data.duration)),
      number_of_sessions: Number(convertToEnglishNumbers(data.number_of_sessions)),
      capacity: convertToEnglishNumbers(data.capacity), // Keep as string for API
      price: convertToEnglishNumbers(data.price), // Keep as string for API
      type: data.type,
      level_id: 1, // Default level_id
    };

    try {
      if (resolvedParams.id === 'new') {
        await createTerm(processedData as CreateTermRequest);
        toast.success('ترم با موفقیت ایجاد شد');
      } else {
        await updateTerm(resolvedParams.id, processedData as UpdateTermRequest);
        toast.success('ترم با موفقیت به‌روزرسانی شد');
      }
      router.push('/admin/terms');
    } catch (error) {
      toast.error(isNew ? 'خطا در ایجاد ترم' : 'خطا در بروزرسانی ترم');
    }
  };

  const handleError = () => {
    toast.error(isNew ? 'خطا در ایجاد ترم' : 'خطا در بروزرسانی ترم');
  };

  if (!resolvedParams || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'داشبورد', href: '/admin' },
    { label: 'ترم‌ها', href: '/admin/terms' },
    { label: isNew ? 'ایجاد ترم جدید' : 'ویرایش ترم', href: '#' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Breadcrumbs breadcrumbs={breadcrumbItems} />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNew ? 'ایجاد ترم جدید' : 'ویرایش ترم'}
          </h1>
          <Button
            variant="secondary"
            onClick={() => router.push('/admin/terms')}
            className="flex items-center gap-2"
          >
            <span>←</span>
            بازگشت به لیست
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit, handleError)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    id="title"
                    label="عنوان ترم"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.title?.message}
                    required
                  />
                )}
              />
            </div>

            {/* Type */}
            <div>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    id="type"
                    label="نوع ترم"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.type?.message}
                    placeholder="انتخاب کنید"
                    required
                    options={[
                      { value: 'normal', label: 'عادی' },
                      { value: 'capacity_completion', label: 'تکمیل ظرفیت' },
                      { value: 'project_based', label: 'پروژه محور(ویژه)' },
                      { value: 'specialized', label: 'گرایش تخصصی' },
                      { value: 'ai', label: 'هوش مصنوعی' },
                    ]}
                  />
                )}
              />
            </div>

            {/* Duration */}
            <div>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <Input
                    id="duration"
                    label="مدت زمان (روز)"
                    type="number"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.duration?.message}
                    required
                  />
                )}
              />
            </div>

            {/* Number of Sessions */}
            <div>
              <Controller
                name="number_of_sessions"
                control={control}
                render={({ field }) => (
                  <Input
                    id="number_of_sessions"
                    label="تعداد جلسات"
                    type="number"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.number_of_sessions?.message}
                    required
                  />
                )}
              />
            </div>

            {/* Capacity */}
            <div>
              <Controller
                name="capacity"
                control={control}
                render={({ field }) => (
                  <Input
                    id="capacity"
                    label="ظرفیت"
                    type="number"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.capacity?.message}
                    required
                  />
                )}
              />
            </div>

            {/* Price */}
            <div>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    id="price"
                    label="قیمت (تومان)"
                    type="number"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.price?.message}
                    required
                  />
                )}
              />
            </div>

            {/* Start Date */}
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

            {/* End Date */}
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

          <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? 'در حال پردازش...' : (isNew ? 'ایجاد ترم' : 'بروزرسانی ترم')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/admin/terms')}
            >
              انصراف
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TermFormPage;
