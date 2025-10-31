'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Select from '@/app/components/ui/Select';
import FileUpload from '@/app/components/ui/FileUpload';
import { usePanelGuide } from '@/app/lib/hooks/use-panel-guide';

const panelGuideSchema = z.object({
  title: z.string().min(1, 'عنوان الزامی است'),
  description: z.string().min(1, 'توضیحات الزامی است'),
  type: z.enum(['student', 'admin', 'teacher'], {
    required_error: 'نوع راهنما الزامی است',
  }),
});

type PanelGuideFormData = z.infer<typeof panelGuideSchema>;

const userTypeOptions = [
  { value: 'student', label: 'دانش پژوه' },
  { value: 'admin', label: 'مدیر' },
  { value: 'teacher', label: 'مدرس' },
];

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    currentPanelGuide,
    isLoading: loading,
    fetchPanelGuideById,
    createPanelGuide,
    updatePanelGuide,
    clearCurrentPanelGuide,
  } = usePanelGuide();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PanelGuideFormData>({
    resolver: zodResolver(panelGuideSchema),
  });

  useEffect(() => {
    if (isNew) {
      clearCurrentPanelGuide();
      // Set default values for new guides
      reset({
        title: '',
        description: '',
        type: 'student',
      });
    } else {
      fetchPanelGuideById(resolvedParams.id);
    }
  }, [
    isNew,
    resolvedParams.id,
    fetchPanelGuideById,
    clearCurrentPanelGuide,
    reset,
  ]);

  useEffect(() => {
    if (currentPanelGuide && !isNew) {
      reset({
        title: currentPanelGuide.title,
        description: currentPanelGuide.description,
        type: currentPanelGuide.type,
      });
    }
  }, [currentPanelGuide, isNew, reset]);

  const onSubmit = async (data: PanelGuideFormData) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('type', data.type);

      // Add file if selected
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      if (isNew) {
        await createPanelGuide(formData);
        toast.success('اعلان با موفقیت ایجاد شد');
      } else {
        await updatePanelGuide(resolvedParams.id, formData);
        toast.success('اعلان با موفقیت بروزرسانی شد');
      }
      router.push('/admin/panel-guides');
    } catch (error) {
      // Error handling is done in the store
    }
  };

  if (loading && !isNew) {
    return <LoadingSpinner />;
  }

  return (
    <main className="space-y-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'تابلوی اعلانات', href: '/admin/panel-guides' },
          {
            label: isNew ? 'ایجاد اعلان جدید' : 'ویرایش اعلان',
            href: `/admin/panel-guides/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="title"
            label="عنوان"
            placeholder="عنوان اعلان را وارد کنید"
            required
            error={errors.title?.message}
            {...register('title')}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                id="type"
                label="نوع کاربر"
                placeholder="نوع کاربر را انتخاب کنید"
                options={userTypeOptions}
                required
                error={errors.type?.message}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />
        </div>

        <div className="w-full">
          <Textarea
            id="description"
            label="توضیحات"
            placeholder="توضیحات اعلان را وارد کنید"
            required
            error={errors.description?.message}
            {...register('description')}
          />
        </div>

        <div className="w-full">
          <FileUpload
            id="file"
            label="فایل ضمیمه"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            placeholder="فایل ضمیمه را انتخاب کنید (اختیاری)"
            required={isNew}
            onChange={(file) => setSelectedFile(file)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/admin/panel-guides')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? 'ایجاد اعلان' : 'بروزرسانی اعلان'}
          </Button>
        </div>
      </form>
    </main>
  );
}
