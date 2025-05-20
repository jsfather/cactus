'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createBlog, Blog } from '@/lib/api/panel/admin/blogs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Form() {
  const router = useRouter();

  const handleSubmit = async (formData: Partial<Blog>) => {
    try {
      await createBlog(formData);
      toast.success('بلاگ با موفقیت ایجاد شد');
      router.push('/admin/blogs');
    } catch (error: any) {
      toast.error(error.message || 'خطا در ایجاد بلاگ');
      console.error('Failed to create blog:', error);
    }
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await handleSubmit({
          title: formData.get('title') as string,
          little_description: formData.get('little_description') as string,
          description: formData.get('description') as string,
          meta_title: formData.get('meta_title') as string,
          meta_description: formData.get('meta_description') as string,
        });
      }}
    >
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            عنوان
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="title"
                name="title"
                type="text"
                className="peer focus:border-primary-400 block w-full rounded-md border border-gray-200 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="little_description"
            className="mb-2 block text-sm font-medium"
          >
            توضیحات کوتاه
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="little_description"
                name="little_description"
                type="text"
                className="peer focus:border-primary-400 block w-full rounded-md border border-gray-200 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            توضیحات
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="description"
                name="description"
                type="text"
                className="peer focus:border-primary-400 block w-full rounded-md border border-gray-200 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="meta_title"
            className="mb-2 block text-sm font-medium"
          >
            عنوان متا
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="meta_title"
                name="meta_title"
                type="text"
                className="peer focus:border-primary-400 block w-full rounded-md border border-gray-200 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="meta_description"
            className="mb-2 block text-sm font-medium"
          >
            توضیحات متا
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="meta_description"
                name="meta_description"
                type="text"
                className="peer focus:border-primary-400 block w-full rounded-md border border-gray-200 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
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
        <Button type="submit">ساخت بلاگ</Button>
      </div>
    </form>
  );
}
