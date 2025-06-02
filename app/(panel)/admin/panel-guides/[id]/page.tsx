'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { getPanelGuide, createPanelGuide, updatePanelGuide } from '@/app/lib/api/admin/panel-guides';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Select from '@/app/components/ui/Select';

const panelGuideSchema = z.object({
  title: z.string().min(1, 'عنوان الزامی است'),
  description: z.string().min(1, 'توضیحات الزامی است'),
  type: z.enum(['student', 'admin', 'teacher'], {
    required_error: 'نوع راهنما الزامی است',
  }),
  file: z.string().min(1, 'فایل الزامی است'),
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
  const [loading, setLoading] = useState(!isNew);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PanelGuideFormData>({
    resolver: zodResolver(panelGuideSchema),
  });

  useEffect(() => {
    const fetchPanelGuide = async () => {
      if (isNew) return;

      try {
        const response = await getPanelGuide(resolvedParams.id);
        const guide = response.data;
        reset({
          title: guide.title,
          description: guide.description,
          type: guide.type,
          file: guide.file,
        });
      } catch (error) {
        router.push('/admin/panel-guides');
      } finally {
        setLoading(false);
      }
    };

    fetchPanelGuide();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: PanelGuideFormData) => {
    try {
      if (isNew) {
        await createPanelGuide(data);
        toast.success('راهنمای پنل با موفقیت ایجاد شد');
      } else {
        await updatePanelGuide(resolvedParams.id, data);
        toast.success('راهنمای پنل با موفقیت بروزرسانی شد');
      }
      router.push('/admin/panel-guides');
    } catch (error) {
      toast.error(isNew ? 'خطا در ایجاد راهنمای پنل' : 'خطا در بروزرسانی راهنمای پنل');
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

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
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
          <Input
            id="file"
            label="فایل"
            type="file"
            accept=".pdf,.doc,.docx"
            placeholder="فایل راهنما را انتخاب کنید"
            required
            error={errors.file?.message}
            {...register('file')}
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
