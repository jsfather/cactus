'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { AdminProductComment } from '@/app/lib/types/product';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useProductComment } from '@/app/lib/hooks/use-product-comment';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import {
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Package,
} from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default function ProductCommentsPage() {
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AdminProductComment | null>(
    null
  );
  const {
    commentList,
    loading,
    fetchCommentList,
    approveComment,
    rejectComment,
    deleteComment,
  } = useProductComment();

  useEffect(() => {
    fetchCommentList();
  }, [fetchCommentList]);

  // Calculate summary stats
  const totalComments = commentList.length;
  const approvedComments = commentList.filter((c) => c.approved).length;
  const pendingComments = commentList.filter((c) => !c.approved).length;
  const uniqueProducts = new Set(commentList.map((c) => c.product_id)).size;

  const columns: Column<AdminProductComment>[] = [
    {
      header: 'محصول',
      accessor: 'product',
      render: (value): string => {
        return (value as any)?.title || '-';
      },
    },
    {
      header: 'کاربر',
      accessor: 'user',
      render: (value): string => {
        const user = value as any;
        return user ? `${user.first_name} ${user.last_name}` : '-';
      },
    },
    {
      header: 'محتوا',
      accessor: 'content',
      render: (value): string => {
        const content = String(value);
        return content.length > 50 ? content.substring(0, 50) + '...' : content;
      },
    },
    {
      header: 'وضعیت',
      accessor: 'approved',
      render: (value): any => {
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              value
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
            }`}
          >
            {value ? 'تایید شده' : 'در انتظار تایید'}
          </span>
        );
      },
    },
    {
      header: 'تاریخ',
      accessor: 'created_at',
      render: (value): string => {
        if (!value || typeof value !== 'string') return '-';
        return new Date(value).toLocaleDateString('fa-IR');
      },
    },
  ];

  const handleApprove = async (comment: AdminProductComment) => {
    try {
      setActionLoading(true);
      await approveComment(comment.id.toString());
      toast.success('نظر با موفقیت تایید شد');
    } catch (error) {
      toast.error('خطا در تایید نظر');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (comment: AdminProductComment) => {
    try {
      setActionLoading(true);
      await rejectComment(comment.id.toString());
      toast.success('نظر با موفقیت رد شد');
    } catch (error) {
      toast.error('خطا در رد نظر');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (comment: AdminProductComment) => {
    setItemToDelete(comment);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setActionLoading(true);
      await deleteComment(itemToDelete.id.toString());
      toast.success('نظر با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error('خطا در حذف نظر');
    } finally {
      setActionLoading(false);
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
          {
            label: 'مدیریت نظرات محصولات',
            href: '/admin/product-comments',
            active: true,
          },
        ]}
      />

      <div className="mt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              مدیریت نظرات محصولات
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              تایید، رد و مدیریت نظرات کاربران برای محصولات
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      کل نظرات
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {totalComments.toLocaleString('fa-IR')}
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
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      تایید شده
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {approvedComments.toLocaleString('fa-IR')}
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
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      در انتظار تایید
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {pendingComments.toLocaleString('fa-IR')}
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
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      محصولات با نظر
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {uniqueProducts.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Table */}
        <div className="mt-6">
          <Table
            data={commentList}
            columns={columns}
            loading={loading}
            emptyMessage="هیچ نظری یافت نشد"
            onDelete={handleDeleteClick}
            actions={(comment: AdminProductComment) => (
              <div className="flex gap-2">
                {!comment.approved && (
                  <button
                    onClick={() => handleApprove(comment)}
                    disabled={actionLoading}
                    className="rounded-md bg-green-100 p-1.5 text-green-700 transition-colors hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                    title="تایید نظر"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                )}
                {comment.approved && (
                  <button
                    onClick={() => handleReject(comment)}
                    disabled={actionLoading}
                    className="rounded-md bg-yellow-100 p-1.5 text-yellow-700 transition-colors hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50"
                    title="رد نظر"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف نظر"
        description={`آیا از حذف این نظر مطمئن هستید؟`}
        confirmText="حذف"
        cancelText="انصراف"
        loading={actionLoading}
      />
    </main>
  );
}
