'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import DatePicker from '@/app/components/ui/DatePicker';
import MarkdownEditor from '@/app/components/ui/MarkdownEditor';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBlog } from '@/app/lib/hooks/use-blog';
import { useUser } from '@/app/hooks/useUser';
import { CreateBlogRequest, UpdateBlogRequest } from '@/app/lib/types';
import { ArrowRight, Save } from 'lucide-react';
import Select from '@/app/components/ui/Select';

const schema = z
  .object({
    title: z.string().min(1, 'عنوان مقاله الزامی است'),
    little_description: z.string().min(1, 'توضیحات کوتاه الزامی است'),
    description: z.string().min(1, 'محتوای مقاله الزامی است'),
    meta_title: z.string().min(1, 'عنوان متا الزامی است'),
    meta_description: z.string().min(1, 'توضیحات متا الزامی است'),
    slug: z
      .string()
      .min(1, 'اسلاگ الزامی است')
      .regex(
        /^[a-z0-9-]+$/,
        'اسلاگ باید شامل حروف انگلیسی کوچک، اعداد و خط تیره باشد'
      ),
    tags: z.string(),
    status: z.enum(['draft', 'published'], {
      required_error: 'وضعیت انتشار الزامی است',
    }),
    publish_at: z.string().min(1, 'تاریخ انتشار الزامی است'),
  })
  .refine(
    (data) => {
      // If status is published, publish_at is required
      if (data.status === 'published' && !data.publish_at) {
        return false;
      }
      return true;
    },
    {
      message: 'تاریخ انتشار برای مقالات منتشر شده الزامی است',
      path: ['publish_at'],
    }
  );

type FormData = z.infer<typeof schema>;

export default function BlogFormPage({
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
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      little_description: '',
      description: '',
      meta_title: '',
      meta_description: '',
      slug: '',
      tags: '',
      status: 'draft',
      publish_at: '',
    },
  });

  const {
    currentBlog,
    loading,
    error,
    fetchBlogById,
    createBlog,
    updateBlog,
    clearError,
  } = useBlog();

  const { user, loading: userLoading } = useUser();

  const titleValue = watch('title');
  const statusValue = watch('status');

  useEffect(() => {
    if (titleValue && isNew) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [titleValue, isNew, setValue]);

  // Handle status change and auto-set publish date
  useEffect(() => {
    if (statusValue === 'published') {
      setValue('publish_at', new Date().toISOString().split('T')[0]);
    } else if (statusValue === 'draft') {
      // For draft, set a future date (10 years from now)
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 10);
      setValue('publish_at', futureDate.toISOString().split('T')[0]);
    }
  }, [statusValue, setValue]);

  useEffect(() => {
    if (!isNew && resolvedParams.id) {
      fetchBlogById(resolvedParams.id);
    }
  }, [isNew, resolvedParams.id, fetchBlogById]);

  useEffect(() => {
    if (currentBlog && !isNew) {
      // Determine status based on publish_at date
      const publishDate = new Date(currentBlog.publish_at);
      const now = new Date();
      const isDraft = publishDate > now;

      reset({
        title: currentBlog.title,
        little_description: currentBlog.little_description,
        description: currentBlog.description,
        meta_title: currentBlog.meta_title,
        meta_description: currentBlog.meta_description,
        slug: currentBlog.slug,
        tags: Array.isArray(currentBlog.tags)
          ? currentBlog.tags.join(', ')
          : '',
        status: isDraft ? 'draft' : 'published',
        publish_at: currentBlog.publish_at
          ? currentBlog.publish_at.split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    }
  }, [currentBlog, isNew, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      clearError();

      if (!user?.id) {
        toast.error('شناسه کاربر یافت نشد. لطفاً مجدد وارد شوید.');
        return;
      }

      const payload = {
        title: data.title,
        little_description: data.little_description,
        description: data.description,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        slug: data.slug,
        tags: data.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        user_id: user.id, // استفاده از آیدی کاربر لاگین شده
        publish_at: data.publish_at || new Date().toISOString().split('T')[0],
      };

      if (isNew) {
        await createBlog(payload as CreateBlogRequest);
        const statusMessage =
          data.status === 'published'
            ? 'منتشر شد'
            : 'به عنوان پیش‌نویس ذخیره شد';
        toast.success(`مقاله با موفقیت ${statusMessage}`);
      } else {
        await updateBlog(resolvedParams.id, payload as UpdateBlogRequest);
        const statusMessage =
          data.status === 'published'
            ? 'منتشر شد'
            : 'به عنوان پیش‌نویس ذخیره شد';
        toast.success(`مقاله با موفقیت ${statusMessage}`);
      }

      router.push('/admin/blogs');
    } catch (error: any) {
      console.error('Error saving blog:', error);
      toast.error(error?.message || 'خطا در ذخیره مقاله');
    }
  };

  if (userLoading || (loading && !isNew)) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'مدیریت مقالات', href: '/admin/blogs' },
          {
            label: isNew ? 'افزودن مقاله جدید' : 'ویرایش مقاله',
            href: `/admin/blogs/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <div className="mt-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push('/admin/blogs')}
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              بازگشت
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {isNew ? 'افزودن مقاله جدید' : 'ویرایش مقاله'}
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {isNew
                  ? 'مقاله جدید ایجاد کنید'
                  : 'اطلاعات مقاله را ویرایش کنید'}
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
                <Input
                  label="عنوان مقاله"
                  {...register('title')}
                  error={errors.title?.message}
                  placeholder="عنوان مقاله را وارد کنید"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <Textarea
                  label="توضیحات کوتاه"
                  {...register('little_description')}
                  error={errors.little_description?.message}
                  placeholder="توضیحات کوتاه مقاله"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Input
                  label="اسلاگ (URL)"
                  {...register('slug')}
                  error={errors.slug?.message}
                  placeholder="blog-slug"
                  required
                  dir="ltr"
                />
                <p className="mt-1 text-xs text-gray-500">
                  اسلاگ برای URL مقاله استفاده می‌شود
                </p>
              </div>

              <div>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="status"
                      label="وضعیت انتشار"
                      required
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.status?.message}
                      options={[
                        { value: 'draft', label: 'پیش‌نویس' },
                        { value: 'published', label: 'منتشر شده' },
                      ]}
                    />
                  )}
                />
              </div>

              {statusValue === 'draft' && (
                <div>
                  <Controller
                    name="publish_at"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        id="publish_at"
                        label="تاریخ انتشار (اختیاری)"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.publish_at?.message}
                        placeholder="تاریخ انتشار را انتخاب کنید"
                      />
                    )}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    برای پیش‌نویس می‌توانید تاریخ انتشار آینده انتخاب کنید
                  </p>
                </div>
              )}

              {statusValue === 'published' && (
                <div>
                  <Controller
                    name="publish_at"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        id="publish_at"
                        label="تاریخ انتشار"
                        required
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.publish_at?.message}
                        placeholder="تاریخ انتشار"
                        disabled
                      />
                    )}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    تاریخ انتشار به صورت خودکار روی امروز تنظیم شده است
                  </p>
                </div>
              )}

              <div className="lg:col-span-2">
                <Input
                  label="برچسب‌ها"
                  {...register('tags')}
                  error={errors.tags?.message}
                  placeholder="Laravel, PHP, Backend"
                />
                <p className="mt-1 text-xs text-gray-500">
                  برچسب‌ها را با کاما جدا کنید
                </p>
              </div>

              <div>
                <Input
                  label="عنوان متا (SEO)"
                  {...register('meta_title')}
                  error={errors.meta_title?.message}
                  placeholder="عنوان برای موتورهای جستجو"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <Textarea
                  label="توضیحات متا (SEO)"
                  {...register('meta_description')}
                  error={errors.meta_description?.message}
                  placeholder="توضیحات برای موتورهای جستجو"
                  rows={2}
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <MarkdownEditor
                      id="description"
                      label="محتوای مقاله"
                      placeholder="محتوای کامل مقاله را در اینجا وارد کنید..."
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.description?.message}
                      required
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/admin/blogs')}
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
                  ? isNew
                    ? statusValue === 'published'
                      ? 'در حال انتشار...'
                      : 'در حال ذخیره پیش‌نویس...'
                    : statusValue === 'published'
                      ? 'در حال انتشار...'
                      : 'در حال ذخیره پیش‌نویس...'
                  : isNew
                    ? statusValue === 'published'
                      ? 'انتشار مقاله'
                      : 'ذخیره پیش‌نویس'
                    : statusValue === 'published'
                      ? 'انتشار مقاله'
                      : 'ذخیره پیش‌نویس'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
