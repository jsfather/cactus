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
import MultiComboBox from '@/app/components/ui/MultiComboBox';
import Checkbox from '@/app/components/ui/Checkbox';

// Hooks and Types
import { useTerm } from '@/app/lib/hooks/use-term';
import { useLevel } from '@/app/lib/hooks/use-level';
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
  level_id: z.string().min(1, 'سطح ضروری است'),
  type: z.enum(
    ['normal', 'capacity_completion', 'project_based', 'specialized', 'ai'],
    {
      errorMap: () => ({ message: 'نوع ترم ضروری است' }),
    }
  ),
  price: z.string().min(1, 'قیمت ضروری است'),
  sort: z.string().min(1, 'ترتیب ضروری است'),
  term_requirements: z.array(z.number()).optional(),
  is_in_person: z.boolean(),
  is_online: z.boolean(),
  is_downloadable: z.boolean(),
});

type TermFormData = z.infer<typeof termSchema>;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const TermFormPage: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const {
    createTerm,
    updateTerm,
    fetchTermById,
    currentTerm,
    termList,
    fetchTermList,
  } = useTerm();
  const { levelList, loading: levelsLoading, fetchLevelList } = useLevel();

  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const isNew = resolvedParams?.id === 'new';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useFormWithBackendErrors<TermFormData>(termSchema);

  useEffect(() => {
    fetchLevelList();
    fetchTermList();
  }, [fetchLevelList, fetchTermList]);

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
          level_id: '',
          type: 'normal',
          price: '0',
          sort: '',
          term_requirements: [],
          is_in_person: false,
          is_online: false,
          is_downloadable: false,
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

  // Set form data when currentTerm changes and levels are loaded
  useEffect(() => {
    if (currentTerm && !isNew && levelList.length > 0) {
      // Extract level_id from the nested level object or use level_id directly
      const levelId = currentTerm.level?.id || currentTerm.level_id;

      reset({
        title: currentTerm.title,
        start_date: currentTerm.start_date,
        end_date: currentTerm.end_date,
        duration: currentTerm.duration.toString(),
        number_of_sessions: currentTerm.number_of_sessions.toString(),
        capacity: currentTerm.capacity.toString(),
        level_id: levelId?.toString() || '',
        type: currentTerm.type,
        price: currentTerm.price.toString(),
        sort: currentTerm.sort?.toString() || '',
        term_requirements: currentTerm.term_requirements || [],
        is_in_person: currentTerm.is_in_person || false,
        is_online: currentTerm.is_online || false,
        is_downloadable: currentTerm.is_downloadable || false,
      });
    }
  }, [currentTerm, isNew, reset, levelList]);

  const onSubmit = async (data: TermFormData) => {
    if (!resolvedParams) return;

    const processedData = {
      title: data.title,
      start_date: data.start_date,
      end_date: data.end_date,
      duration: Number(convertToEnglishNumbers(data.duration)),
      number_of_sessions: Number(
        convertToEnglishNumbers(data.number_of_sessions)
      ),
      capacity: convertToEnglishNumbers(data.capacity), // Keep as string for API
      price: convertToEnglishNumbers(data.price), // Keep as string for API
      sort: convertToEnglishNumbers(data.sort), // Keep as string for API
      type: data.type,
      level_id: Number(data.level_id),
      term_requirements: data.term_requirements,
      is_in_person: data.is_in_person,
      is_online: data.is_online,
      is_downloadable: data.is_downloadable,
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

  if (!resolvedParams || loading || levelsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
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
          <div className="flex gap-3">
            {!isNew && currentTerm && (
              <Button
                variant="white"
                onClick={() =>
                  router.push(`/admin/terms/${resolvedParams?.id}/view`)
                }
                className="flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                مشاهده جزئیات
              </Button>
            )}
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
      </div>

      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <form
          onSubmit={handleSubmit(onSubmit, handleError)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

            {/* Level */}
            <div>
              <Controller
                name="level_id"
                control={control}
                render={({ field }) => (
                  <Select
                    id="level_id"
                    label="سطح"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.level_id?.message}
                    placeholder="انتخاب کنید"
                    required
                    options={levelList.map((level) => ({
                      value: level.id.toString(),
                      label: `${level.label} - ${level.name}`,
                    }))}
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

            {/* Sort */}
            <div>
              <Controller
                name="sort"
                control={control}
                render={({ field }) => (
                  <Input
                    id="sort"
                    label="ترتیب ترم"
                    type="number"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.sort?.message}
                    required
                    placeholder="مثال: 1، 2، 3"
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

            {/* Term Requirements */}
            <div className="md:col-span-2">
              <Controller
                name="term_requirements"
                control={control}
                render={({ field }) => {
                  // Prepare options for MultiComboBox
                  const termOptions = termList
                    .filter(
                      (term) =>
                        resolvedParams?.id === 'new' ||
                        term.id.toString() !== resolvedParams?.id
                    )
                    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
                    .map((term) => ({
                      value: Number(term.id),
                      label: term.title,
                      description: `ترتیب: ${term.sort || 'نامشخص'} - ${term.level?.label || 'سطح نامشخص'}`,
                    }));

                  return (
                    <MultiComboBox
                      id="term_requirements"
                      label="پیش‌نیازهای ترم"
                      placeholder="انتخاب پیش‌نیازها..."
                      searchPlaceholder="جستجوی ترم..."
                      options={termOptions}
                      value={field.value || []}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.term_requirements?.message}
                      maxDisplayItems={3}
                    />
                  );
                }}
              />
            </div>

            {/* Delivery Options */}
            <div className="md:col-span-2">
              <label className="mb-3 block text-sm font-medium text-gray-900 dark:text-white">
                نحوه ارائه
              </label>
              <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <Controller
                  name="is_in_person"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="is_in_person"
                      label="حضوری"
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      description="این ترم به صورت حضوری برگزار می‌شود"
                    />
                  )}
                />
                <Controller
                  name="is_online"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="is_online"
                      label="آنلاین"
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      description="این ترم به صورت آنلاین برگزار می‌شود"
                    />
                  )}
                />
                <Controller
                  name="is_downloadable"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="is_downloadable"
                      label="قابل دانلود"
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      description="محتوای این ترم قابل دانلود است"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting
                ? 'در حال پردازش...'
                : isNew
                  ? 'ایجاد ترم'
                  : 'بروزرسانی ترم'}
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
