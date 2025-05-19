'use client';

import { useEffect, useState } from 'react';
import {
  getBlogs,
  Blog,
  createBlog,
  deleteBlog,
  updateBlog,
} from '@/lib/api/panel/admin/blogs';
import DataTable from '@/components/ui/DataTable';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import moment from 'jalali-moment';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const columns = [
    { key: 'title', label: 'عنوان' },
    { key: 'little_description', label: 'عنوان کوتاه' },
    { 
      key: 'created_at', 
      label: 'تاریخ ایجاد',
      format: (value: string) => moment(value).locale('fa').format('YYYY/MM/DD HH:mm')
    }
  ];

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const data = await getBlogs();
      setBlogs(data);
    } catch (error) {
      toast.error('خطا در دریافت لیست بلاگ‌ها');
      console.error('Failed to fetch blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreate = () => {
    setSelectedBlog(null);
    setIsModalOpen(true);
  };

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    try {
      await deleteBlog(String(id));
      toast.success('بلاگ با موفقیت حذف شد');
      fetchBlogs();
    } catch (error) {
      toast.error('خطا در حذف بلاگ');
      console.error('Failed to delete blog:', error);
    }
  };

  const handleSubmit = async (formData: Partial<Blog>) => {
    try {
      if (selectedBlog) {
        await updateBlog(selectedBlog.id, formData);
        toast.success('بلاگ با موفقیت بروزرسانی شد');
      } else {
        await createBlog(formData);
        toast.success('بلاگ با موفقیت ایجاد شد');
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (error) {
      toast.error('خطا در ذخیره بلاگ');
      console.error('Failed to save blog:', error);
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-center" />
      <h1 className="mb-4 text-2xl font-bold">بلاگ</h1>
      <DataTable<Blog>
        columns={columns}
        data={blogs}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        isLoading={isLoading}
      />

      {/* Blog Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              {selectedBlog ? 'ویرایش بلاگ' : 'ایجاد بلاگ جدید'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSubmit({
                title: formData.get('title') as string,
                little_description: formData.get('little_description') as string,
                description: formData.get('description') as string,
                meta_title: formData.get('meta_title') as string,
                meta_description: formData.get('meta_description') as string,
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">عنوان</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={selectedBlog?.title}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">عنوان کوتاه</label>
                  <input
                    type="text"
                    name="little_description"
                    defaultValue={selectedBlog?.little_description}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">توضیحات</label>
                  <textarea
                    name="description"
                    defaultValue={selectedBlog?.description}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">عنوان متا</label>
                  <input
                    type="text"
                    name="meta_title"
                    defaultValue={selectedBlog?.meta_title}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">توضیحات متا</label>
                  <textarea
                    name="meta_description"
                    defaultValue={selectedBlog?.meta_description}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {selectedBlog ? 'بروزرسانی' : 'ایجاد'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
