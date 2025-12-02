'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import DatePicker from '@/app/components/ui/DatePicker';
import FileUpload from '@/app/components/ui/FileUpload';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCertificate } from '@/app/lib/hooks/use-certificate';
import {
  CertificateCreateRequest,
  CertificateUpdateRequest,
} from '@/lib/types/certificate';
import { ArrowRight, Save } from 'lucide-react';

const schema = z.object({
  image: z.union([
    z.instanceof(File),
    z.string().min(1, 'تصویر گواهینامه الزامی است'),
  ]),
  title: z.string().min(1, 'عنوان گواهینامه الزامی است'),
  description: z.string().min(1, 'توضیحات الزامی است'),
  issued_at: z.string().min(1, 'تاریخ صدور الزامی است'),
  organization: z.string().min(1, 'نام سازمان الزامی است'),
  location: z.string().min(1, 'مکان الزامی است'),
  categories: z.string().min(1, 'حداقل یک دسته‌بندی الزامی است'),
});

type FormData = z.infer<typeof schema>;

export default function CertificateFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      image: '',
      title: '',
      description: '',
      issued_at: '',
      organization: '',
      location: '',
      categories: '',
    },
  });

  const {
    currentCertificate,
    loading,
    error,
    fetchCertificateById,
    createCertificate,
    updateCertificate,
    clearError,
  } = useCertificate();

  useEffect(() => {
    if (!isNew && resolvedParams.id) {
      fetchCertificateById(resolvedParams.id);
    }
  }, [isNew, resolvedParams.id, fetchCertificateById]);

  useEffect(() => {
    if (currentCertificate && !isNew) {
      reset({
        image: currentCertificate.image,
        title: currentCertificate.title
          .replace(/^"|"$/g, '')
          .replace(/\\"/g, '"'),
        description: currentCertificate.description
          .replace(/^"|"$/g, '')
          .replace(/\\"/g, '"'),
        issued_at: currentCertificate.issued_at,
        organization: currentCertificate.organization
          .replace(/^"|"$/g, '')
          .replace(/\\"/g, '"'),
        location: currentCertificate.location
          .replace(/^"|"$/g, '')
          .replace(/\\"/g, '"'),
        categories: currentCertificate.categories.join(', '),
      });
    }
  }, [currentCertificate, isNew, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      clearError();

      const categoriesArray = data.categories
        .split(',')
        .map((cat) => cat.trim())
        .filter(Boolean);

      const payload: CertificateCreateRequest | CertificateUpdateRequest = {
        image: data.image,
        title: data.title,
        description: data.description,
        issued_at: data.issued_at,
        organization: data.organization,
        location: data.location,
        categories: categoriesArray,
      };

      if (isNew) {
        await createCertificate(payload as CertificateCreateRequest);
        toast.success('گواهینامه با موفقیت ایجاد شد');
      } else {
        await updateCertificate(
          resolvedParams.id,
          payload as CertificateUpdateRequest
        );
        toast.success('گواهینامه با موفقیت به‌روزرسانی شد');
      }

      router.push('/admin/certificates');
    } catch (error: any) {
      console.error('Error saving certificate:', error);
      toast.error(error?.message || 'خطا در ذخیره گواهینامه');
    }
  };

  if (loading && !isNew) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'افتخارات و گواهینامه‌ها', href: '/admin/certificates' },
          {
            label: isNew ? 'افزودن گواهینامه جدید' : 'ویرایش گواهینامه',
            href: `/admin/certificates/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <div className="mt-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push('/admin/certificates')}
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              بازگشت
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {isNew ? 'افزودن گواهینامه جدید' : 'ویرایش گواهینامه'}
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {isNew
                  ? 'گواهینامه جدید ایجاد کنید'
                  : 'اطلاعات گواهینامه را ویرایش کنید'}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <div className="text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          </div>
        )}

        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <FileUpload
                      id="image"
                      label="تصویر گواهینامه"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.image?.message}
                      accept="image/*"
                      required
                    />
                  )}
                />
              </div>

              <div className="lg:col-span-2">
                <Input
                  label="عنوان گواهینامه"
                  {...register('title')}
                  error={errors.title?.message}
                  placeholder="عنوان گواهینامه را وارد کنید"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <Textarea
                  label="توضیحات"
                  {...register('description')}
                  error={errors.description?.message}
                  placeholder="توضیحات گواهینامه را وارد کنید"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Input
                  label="نام سازمان"
                  {...register('organization')}
                  error={errors.organization?.message}
                  placeholder="نام سازمان صادرکننده"
                  required
                />
              </div>

              <div>
                <Input
                  label="مکان"
                  {...register('location')}
                  error={errors.location?.message}
                  placeholder="مکان صدور گواهینامه"
                  required
                />
              </div>

              <div>
                <Controller
                  name="issued_at"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="issued_at"
                      label="تاریخ صدور"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.issued_at?.message}
                      required
                    />
                  )}
                />
              </div>

              <div>
                <Input
                  label="دسته‌بندی‌ها"
                  {...register('categories')}
                  error={errors.categories?.message}
                  placeholder="دسته‌بندی‌ها را با کاما جدا کنید"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  دسته‌بندی‌ها را با کاما (،) از هم جدا کنید
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/admin/certificates')}
              >
                انصراف
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="ml-2 h-4 w-4" />
                {isSubmitting
                  ? 'در حال ذخیره...'
                  : isNew
                    ? 'ایجاد گواهینامه'
                    : 'به‌روزرسانی گواهینامه'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
