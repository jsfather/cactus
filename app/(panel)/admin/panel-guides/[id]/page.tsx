'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  getPanelGuide,
  createPanelGuide,
  updatePanelGuide,
} from '@/app/lib/api/admin/panel_guides';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Select from '@/app/components/ui/Select';
import FileUpload from '@/app/components/ui/FileUpload';

import { z } from 'zod';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import { ApiError } from '@/app/lib/api/client';

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
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    submitWithErrorHandling,
    globalError,
    setGlobalError,
    reset,
  } = useFormWithBackendErrors<PanelGuideFormData>(panelGuideSchema);

  useEffect(() => {
    const fetchPanelGuide = async () => {
      if (isNew) {
        // Set default values for new guides
        reset({
          title: '',
          description: '',
          type: 'student',
        });
        setLoading(false);
        return;
      }

      try {
        const response = await getPanelGuide(resolvedParams.id);
        const guide = response.data;
        reset({
          title: guide.title,
          description: guide.description,
          type: guide.type,
        });
      } catch (error) {
        toast.error('خطا در بارگذاری راهنمای پنل');
        router.push('/admin/panel-guides');
      } finally {
        setLoading(false);
      }
    };

    fetchPanelGuide();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: PanelGuideFormData) => {
    console.log('Form data before FormData creation:', data);
    console.log('Selected file:', selectedFile);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('type', data.type);

    // Add file if selected
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    // Log FormData contents
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    if (isNew) {
      await createPanelGuide(formData);
      toast.success('راهنمای پنل با موفقیت ایجاد شد');
    } else {
      await updatePanelGuide(resolvedParams.id, formData);
      toast.success('راهنمای پنل با موفقیت بروزرسانی شد');
    }
    router.push('/admin/panel-guides');
  };

  const handleError = (error: ApiError) => {
    console.log('Panel guide form submission error:', error);

    // Show toast error message
    if (error?.message) {
      toast.error(error.message);
    } else {
      toast.error(
        isNew ? 'خطا در ایجاد راهنمای پنل' : 'خطا در بروزرسانی راهنمای پنل'
      );
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'راهنماهای پنل', href: '/admin/panel-guides' },
          {
            label: isNew ? 'ایجاد راهنمای پنل' : 'ویرایش راهنمای پنل',
            href: `/admin/panel-guides/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <form
        onSubmit={handleSubmit(submitWithErrorHandling(onSubmit, handleError))}
        className="mt-8 space-y-6"
      >
        {globalError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-100 p-4 text-sm text-red-700">
            {globalError}
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="title"
            label="عنوان"
            placeholder="عنوان راهنما را وارد کنید"
            required
            error={errors.title?.message}
            {...register('title')}
          />

          <Select
            id="type"
            label="نوع کاربر"
            placeholder="نوع کاربر را انتخاب کنید"
            options={userTypeOptions}
            required
            error={errors.type?.message}
            {...register('type')}
          />
        </div>

        <div className="w-full">
          <Textarea
            id="description"
            label="توضیحات"
            placeholder="توضیحات راهنما را وارد کنید"
            required
            error={errors.description?.message}
            {...register('description')}
          />
        </div>

        <div className="w-full">
          <FileUpload
            id="file"
            label="فایل"
            accept=".pdf,.doc,.docx"
            placeholder="فایل راهنما را انتخاب کنید"
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
            {isNew ? 'ایجاد راهنمای پنل' : 'بروزرسانی راهنمای پنل'}
          </Button>
        </div>
      </form>
    </main>
  );
}
