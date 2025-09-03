'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import MarkdownEditor from '@/app/components/ui/MarkdownEditor';
import { Button } from '@/app/components/ui/Button';

import { z } from 'zod';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import { ApiError } from '@/app/lib/api/client';
import { useBlog } from '@/app/lib/hooks/use-blog';
import { Controller } from 'react-hook-form';

const schema = z.object({
  title: z.string().min(1, 'عنوان الزامی است'),
  little_description: z.string().min(1, 'توضیحات کوتاه الزامی است'),
  description: z.string().min(1, 'توضیحات الزامی است'),
  meta_title: z.string().min(1, 'عنوان متا الزامی است'),
  meta_description: z.string().min(1, 'توضیحات متا الزامی است'),
  slug: z.string().min(1, 'اسلاگ الزامی است'),
  tags: z.array(z.string()),
});

type FormData = z.infer<typeof schema>;

export default function PlaygroundPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    submitWithErrorHandling,
    globalError,
    reset,
  } = useFormWithBackendErrors<FormData>(schema);

  const { createBlog } = useBlog();

  const handleError = (error: ApiError) => {
    console.log('Playground blog form submission error:', error);

    // Show toast error message
    if (error?.message) {
      toast.error(error.message);
    } else {
      toast.error('خطا در ثبت بلاگ');
    }
  };

  const onSubmit = submitWithErrorHandling(async (data: FormData) => {
    // Create blog with default tags for playground
    const blogData = {
      ...data,
      tags: ['playground', 'test'],
    };
    
    await createBlog(blogData);
    toast.success('بلاگ با موفقیت در Playground ایجاد شد');
    
    // Reset form after successful creation
    reset({
      title: '',
      little_description: '',
      description: '',
      meta_title: '',
      meta_description: '',
      slug: '',
      tags: [],
    });
  }, handleError);

  const handleClearForm = () => {
    reset();
    toast.success('فرم پاک شد');
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Playground - ایجاد بلاگ',
            href: '/admin/playground',
            active: true,
          },
        ]}
      />

      <div className="mt-8">
        <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <h2 className="mb-2 text-lg font-semibold text-blue-800 dark:text-blue-200">
            🚀 Playground - تست و توسعه
          </h2>
          <p className="text-blue-700 dark:text-blue-300">
            این صفحه برای تست و توسعه عملکردهای جدید طراحی شده است. 
            شما می‌توانید از فرم زیر برای تست ایجاد بلاگ استفاده کنید.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(submitWithErrorHandling(onSubmit, handleError))}
          className="space-y-6"
        >
          {globalError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-100 p-4 text-sm text-red-700">
              {globalError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              id="title"
              label="عنوان بلاگ"
              placeholder="عنوان بلاگ را وارد کنید"
              required
              error={errors.title?.message}
              {...register('title')}
            />

            <Input
              id="slug"
              label="اسلاگ (URL)"
              placeholder="blog-slug-example"
              required
              error={errors.slug?.message}
              {...register('slug')}
            />
          </div>

          <div className="w-full">
            <Input
              id="little_description"
              label="توضیحات کوتاه"
              placeholder="خلاصه‌ای از محتوای بلاگ..."
              required
              error={errors.little_description?.message}
              {...register('little_description')}
            />
          </div>

          <div className="w-full">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <MarkdownEditor
                  id="description"
                  label="محتوای کامل بلاگ"
                  placeholder="محتوای کامل بلاگ را در اینجا وارد کنید..."
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.description?.message}
                  required
                />
              )}
            />
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              تنظیمات SEO
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <Input
                id="meta_title"
                label="عنوان متا (SEO)"
                placeholder="عنوان برای موتورهای جستجو"
                required
                error={errors.meta_title?.message}
                {...register('meta_title')}
              />

              <Textarea
                id="meta_description"
                label="توضیحات متا (SEO)"
                placeholder="توضیحاتی برای موتورهای جستجو (حداکثر ۱۶۰ کاراکتر)"
                rows={3}
                required
                error={errors.meta_description?.message}
                {...register('meta_description')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="white"
              onClick={handleClearForm}
            >
              پاک کردن فرم
            </Button>
            <Button
              type="button"
              variant="white"
              onClick={() => router.push('/admin/blogs')}
            >
              مشاهده لیست بلاگ‌ها
            </Button>
            <Button type="submit" loading={isSubmitting}>
              ایجاد بلاگ در Playground
            </Button>
          </div>
        </form>

        <div className="mt-8 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <h3 className="mb-2 font-semibold text-yellow-800 dark:text-yellow-200">
            💡 نکات مفید
          </h3>
          <ul className="space-y-1 text-yellow-700 dark:text-yellow-300">
            <li>• اسلاگ باید منحصر به فرد باشد</li>
            <li>• توضیحات متا حداکثر ۱۶۰ کاراکتر توصیه می‌شود</li>
            <li>• از کلمات کلیدی مرتبط در عنوان و توضیحات استفاده کنید</li>
            <li>• بلاگ‌های ایجاد شده در این صفحه با تگ "playground" مشخص می‌شوند</li>
            <li>• 📝 محتوای اصلی به صورت Markdown ذخیره می‌شود</li>
            <li>• 🎨 از دکمه‌های فرمت‌بندی برای ایجاد محتوای زیبا استفاده کنید</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
