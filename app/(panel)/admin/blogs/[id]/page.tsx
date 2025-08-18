'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

import { z } from 'zod';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import { ApiError } from '@/app/lib/api/client';
import { useBlog } from '@/app/lib/hooks/use-blog';

const schema = z.object({
  title: z.string().min(1, 'عنوان الزامی است'),
  little_description: z.string().min(1, 'توضیحات کوتاه الزامی است'),
  description: z.string().min(1, 'توضیحات الزامی است'),
  meta_title: z.string().min(1, 'عنوان متا الزامی است'),
  meta_description: z.string().min(1, 'توضیحات متا الزامی است'),
  slug: z.string().min(1, 'اسلاگ الزامی است'),
});

type FormData = z.infer<typeof schema>;

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    submitWithErrorHandling,
    globalError,
    reset,
  } = useFormWithBackendErrors<FormData>(schema);

  const {
    currentBlog,
    loading,
    fetchBlogById,
    createBlog,
    updateBlog,
  } = useBlog();

  useEffect(() => {
    const fetchBlog = async () => {
      if (isNew) return;

      try {
        await fetchBlogById(resolvedParams.id);
        if (currentBlog) {
          reset({
            title: currentBlog.title,
            little_description: currentBlog.little_description,
            description: currentBlog.description,
            meta_title: currentBlog.meta_title,
            meta_description: currentBlog.meta_description,
            slug: currentBlog.slug,
          });
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('خطا در بارگذاری بلاگ');
        router.push('/admin/blogs');
      }
    };
    fetchBlog();
  }, []);

  const onSubmit = async (data: FormData) => {
    if (isNew) {
      await createBlog(data);
      toast.success('بلاگ با موفقیت ایجاد شد');
      router.push('/admin/blogs');
    } else {
      await updateBlog(resolvedParams.id, data);
      toast.success('بلاگ با موفقیت بروزرسانی شد');
      router.push('/admin/blogs');
    }
  };

  const handleError = (error: ApiError) => {
    console.log('Blog form submission error:', error);

    // Show toast error message
    if (error?.message) {
      toast.error(error.message);
    } else {
      toast.error('خطا در ثبت بلاگ');
    }
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
