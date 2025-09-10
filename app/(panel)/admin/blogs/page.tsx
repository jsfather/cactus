'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { Blog } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useBlog } from '@/app/lib/hooks/use-blog';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { FileText, Plus, Calendar, Users, TrendingUp, Eye } from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default function BlogsPage() {
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

  // Calculate summary stats
  const totalBlogs = blogList.length;
  const publishedBlogs = blogList.filter(blog => {
    const publishDate = new Date(blog.publish_at);
    return publishDate <= new Date();
  }).length;
  const draftBlogs = totalBlogs - publishedBlogs;
  const thisMonthBlogs = blogList.filter(blog => {
    const blogDate = new Date(blog.created_at);
    const thisMonth = new Date();
    return blogDate.getMonth() === thisMonth.getMonth() && 
           blogDate.getFullYear() === thisMonth.getFullYear();
  }).length;

  const columns: Column<Blog>[] = [
    {
      header: 'عنوان',
      accessor: 'title',
    },
    {
      header: 'توضیحات کوتاه',
      accessor: 'little_description',
      render: (value): string => {
        return String(value).length > 50 
          ? String(value).substring(0, 50) + '...'
          : String(value);
      },
    },
    {
      header: 'برچسب‌ها',
      accessor: 'tags',
      render: (value): any => {
        const tags = value as string[];
        if (!Array.isArray(tags) || tags.length === 0) return '-';
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-gray-500">+{tags.length - 3}</span>
            )}
          </div>
        );
      },
    },
    {
      header: 'تاریخ انتشار',
      accessor: 'publish_at',
      render: (value): string => {
        if (!value || typeof value !== 'string') return '-';
        return new Date(value).toLocaleDateString('fa-IR');
      },
    },
    {
      header: 'وضعیت',
      accessor: 'publish_at',
      render: (value): any => {
        if (!value) return '-';
        const publishDate = new Date(value as string);
        const now = new Date();
        const isPublished = publishDate <= now;
        
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isPublished 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
          }`}>
            {isPublished ? 'منتشر شده' : 'پیش‌نویس'}
          </span>
        );
      },
    },
    {
      header: 'تاریخ ایجاد',
      accessor: 'created_at',
      render: (value): string => {
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
      toast.success('مقاله با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchBlogList();
    } catch (error) {
      toast.error('خطا در حذف مقاله');
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'مدیریت مقالات', href: '/admin/blogs', active: true },
        ]}
      />

      <div className="mt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              مدیریت مقالات
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              ایجاد، ویرایش و مدیریت مقالات وبلاگ
            </p>
          </div>
          <Button onClick={() => router.push('/admin/blogs/new')}>
            <Plus className="h-4 w-4 ml-2" />
            افزودن مقاله جدید
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      کل مقالات
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {totalBlogs.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      منتشر شده
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {publishedBlogs.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      پیش‌نویس
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {draftBlogs.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      این ماه
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {thisMonthBlogs.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blogs Table */}
        <div className="mt-6">
          <Table
            data={blogList}
            columns={columns}
            loading={loading}
            emptyMessage="هیچ مقاله‌ای یافت نشد"
            onEdit={(blog) => router.push(`/admin/blogs/${blog.id}`)}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف مقاله"
        description={`آیا از حذف مقاله "${itemToDelete?.title}" مطمئن هستید؟`}
        confirmText="حذف"
        cancelText="انصراف"
        loading={deleteLoading}
      />
    </main>
  );
}
