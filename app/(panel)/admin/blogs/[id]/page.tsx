'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { blogService } from '@/app/lib/api/admin/blogs';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

import { z } from 'zod';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import { FormErrorAlert } from '@/app/components/FormErrorAlert';

const schema = z.object({
  title: z.string().optional(),
  little_description: z.string().min(1),
  description: z.string().min(1),
  meta_title: z.string().min(1),
  meta_description: z.string().min(1),
  slug: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const [loading, setLoading] = useState(!isNew);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    submitWithErrorHandling,
    globalError,
    setGlobalError,
  } = useFormWithBackendErrors<FormData>(schema);

  useEffect(() => {
    const fetchBlog = async () => {
      if (isNew) return;

      try {
        await blogService.getBlog(resolvedParams.id);
      } catch (error) {
        toast.success('بلاگ با موفقیت ایجاد شد');
        router.push('/admin/blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [isNew, resolvedParams.id, router]);

  const onSubmit = async (data: FormData) => {
    if (isNew) {
      const result = await blogService.createBlog(data);
      console.log('User created successfully:', result);
    } else {
      const result = await blogService.updateBlog(resolvedParams.id, data);
      console.log('User created successfully:', result);
    }
  };
  

   const handleError = (error: any) => {
    console.error('Blog form submission error:', error);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'بلاگ', href: '/admin/blogs' },
          {
            label: isNew ? 'ایجاد بلاگ' : 'ویرایش بلاگ',
            href: `/admin/blogs/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <FormErrorAlert
        error={globalError} 
        onClose={() => setGlobalError(null)} 
      />

      <form
        onSubmit={handleSubmit(submitWithErrorHandling(onSubmit, handleError))}
        className="mt-8 space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="title"
            label="عنوان"
            placeholder="عنوان بلاگ را وارد کنید"
            required
            error={errors.title?.message}
            {...register('title')}
          />

          <Input
            id="little_description"
            label="توضیحات کوتاه"
            placeholder="توضیحات کوتاه بلاگ را وارد کنید"
            required
            error={errors.little_description?.message}
            {...register('little_description')}
          />
        </div>

        <div className="w-full">
          <Textarea
            id="description"
            label="توضیحات"
            placeholder="توضیحات کامل بلاگ را وارد کنید"
            required
            error={errors.description?.message}
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="meta_title"
            label="عنوان متا"
            placeholder="عنوان متا بلاگ را وارد کنید"
            required
            error={errors.meta_title?.message}
            {...register('meta_title')}
          />

          <Input
            id="slug"
            label="اسلاگ"
            placeholder="اسلاگ بلاگ را وارد کنید"
            required
            error={errors.slug?.message}
            {...register('slug')}
          />
        </div>

        <div className="w-full">
          <Input
            id="meta_description"
            label="توضیحات متا"
            placeholder="توضیحات متا بلاگ را وارد کنید"
            required
            error={errors.meta_description?.message}
            {...register('meta_description')}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/admin/blogs')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? 'ایجاد بلاگ' : 'بروزرسانی بلاگ'}
          </Button>
        </div>
      </form>
    </main>
  );
}
