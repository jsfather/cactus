'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateBlog } from '@/app/lib/api/admin/blogs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { BlogForm } from '@/app/lib/definitions';
import { useForm } from 'react-hook-form';

type FormData = {
  title: string;
  little_description: string;
  description: string;
  meta_title: string;
  meta_description: string;
};

export default function EditBlogForm({ blog }: { blog: BlogForm }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: blog.title,
      little_description: blog.little_description,
      description: blog.description,
      meta_title: blog.meta_title,
      meta_description: blog.meta_description,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateBlog(blog.id, data);
      toast.success('بلاگ با موفقیت بروزرسانی شد');
      router.push('/admin/blogs');
    } catch (error: any) {
      toast.error(error.message || 'خطا در ذخیره بلاگ');
      console.error('Failed to save blog:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Title and Little Description Row */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium">
              عنوان <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="title"
                {...register('title', { required: 'عنوان الزامی است' })}
                className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="little_description"
              className="mb-2 block text-sm font-medium"
            >
              توضیحات کوتاه <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="little_description"
                {...register('little_description', {
                  required: 'توضیحات کوتاه الزامی است',
                })}
                className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.little_description
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors.little_description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.little_description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Description Row */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            توضیحات <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <textarea
              id="description"
              rows={6}
              {...register('description', { required: 'توضیحات الزامی است' })}
              className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {/* Meta Title and Description Row */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="meta_title"
              className="mb-2 block text-sm font-medium"
            >
              عنوان متا <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="meta_title"
                {...register('meta_title', {
                  required: 'عنوان متا الزامی است',
                })}
                className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.meta_title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.meta_title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.meta_title.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="meta_description"
              className="mb-2 block text-sm font-medium"
            >
              توضیحات متا <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="meta_description"
                {...register('meta_description', {
                  required: 'توضیحات متا الزامی است',
                })}
                className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.meta_description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.meta_description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.meta_description.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/admin/blogs"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          لغو
        </Link>
        <Button type="submit" loading={isSubmitting}>
          ویرایش بلاگ
        </Button>
      </div>
    </form>
  );
}
