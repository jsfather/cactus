'use client';

import { useState, useEffect } from 'react';
import Table from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { getBlogs, deleteBlog } from '@/app/lib/api/admin/blogs';
import { Blog } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  const columns = [
    {
      header: 'عنوان',
      accessor: 'title' as keyof Blog,
    },
    {
      header: 'توضیحات',
      accessor: 'description' as keyof Blog,
    },
    {
      header: 'توضیحات کوتاه',
      accessor: 'little_description' as keyof Blog,
    },
    {
      header: 'تاریخ ایجاد',
      accessor: 'created_at' as keyof Blog,
      render: (value: string | null, item: Blog) =>
        value ? new Date(value).toLocaleDateString('fa-IR') : '',
    },
  ];

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getBlogs();
      if (response) {
        setBlogs(response);
      }
    } catch (error) {
      toast.error('خطا در دریافت لیست بلاگ‌ها');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };



  const handleDeleteClick = (blog: Blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteBlog(blogToDelete.id);
      toast.success('بلاگ با موفقیت حذف شد');
      setShowDeleteModal(false);
      setBlogToDelete(null);
      fetchBlogs();
    } catch (error) {
      toast.error('خطا در حذف بلاگ');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTimeout(() => {
      setBlogToDelete(null);
    }, 500);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          بلاگ
        </h1>
        <Button onClick={() => router.push('/admin/blogs/new')}>
          ایجاد بلاگ
        </Button>
      </div>
      <Table
        data={blogs}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ بلاگی یافت نشد"
        onEdit={(blog) => router.push(`/admin/blogs/${blog.id}`)}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف بلاگ"
        description={`آیا از حذف بلاگ "${blogToDelete?.title}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
