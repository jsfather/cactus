'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { Blog } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useBlog } from '@/app/lib/hooks/use-blog';

export default function Page() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Blog | null>(null);
  const {
    blogList,
    loading,
    fetchBlogList,
    deleteBlog,
  } = useBlog();

  useEffect(() => {
    fetchBlogList();
  }, [fetchBlogList]);

  const columns: Column<Blog>[] = [
    {
      header: 'عنوان',
      accessor: 'title',
    },
    {
      header: 'توضیحات',
      accessor: 'description',
    },
    {
      header: 'توضیحات کوتاه',
      accessor: 'little_description',
    },
    {
      header: 'تاریخ ایجاد',
      accessor: 'created_at',
      render: (value) => {
        if (!value || typeof value !== 'string') return '';
        return new Date(value).toLocaleDateString('fa-IR');
      },
    },
  ];

  const handleDeleteClick = (blog: Blog) => {
    setItemToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteBlog(itemToDelete.id.toString());
      toast.success('بلاگ با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchBlogList();
    } catch (error) {
      toast.error('خطا در حذف بلاگ');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTimeout(() => {
      setItemToDelete(null);
    }, 500);
  };

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
        data={blogList}
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
        description={`آیا از حذف بلاگ "${itemToDelete?.title}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
