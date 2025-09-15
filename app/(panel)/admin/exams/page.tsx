'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { useExamStore } from '@/app/lib/stores/exam.store';
import { Exam } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';

export default function Page() {
  const router = useRouter();
  const {
    exams,
    isListLoading: loading,
    deleteExam,
    fetchExams,
    error,
  } = useExamStore();

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Exam | null>(null);

  const columns: Column<Exam>[] = [
    {
      header: 'عنوان',
      accessor: 'title',
    },
    {
      header: 'توضیحات',
      accessor: 'description',
      render: (value) =>
        value
          ? String(value).substring(0, 100) +
            (String(value).length > 100 ? '...' : '')
          : '-',
    },
    {
      header: 'تاریخ آزمون',
      accessor: 'date',
      render: (value) =>
        value ? new Date(value).toLocaleDateString('fa-IR') : '-',
    },
    {
      header: 'مدت زمان',
      accessor: 'duration',
      render: (value) => (value ? `${value} دقیقه` : '-'),
    },
    {
      header: 'ترم',
      accessor: 'term_id',
      render: (value) => (value ? `ترم ${value}` : '-'),
    },
    {
      header: 'ایجاد کننده',
      accessor: 'created_by',
      render: (value) => (value ? `کاربر ${value}` : '-'),
    },
  ];

  const handleDeleteClick = (exam: Exam) => {
    setItemToDelete(exam);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteExam(itemToDelete.id.toString());
      toast.success('آزمون با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error('خطا در حذف آزمون');
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

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'آزمون‌ها', href: '/admin/exams', active: true },
        ]}
      />

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    کل آزمون‌ها
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {exams.length}
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
                <svg
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    آزمون‌های زمان‌دار
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {
                      exams.filter((exam) => exam.duration && exam.duration > 0)
                        .length
                    }
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
                <svg
                  className="h-6 w-6 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    آزمون‌های امروز
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {
                      exams.filter((exam) => {
                        if (!exam.date) return false;
                        const today = new Date().toDateString();
                        const examDate = new Date(exam.date).toDateString();
                        return today === examDate;
                      }).length
                    }
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
                <svg
                  className="h-6 w-6 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    آزمون‌های دارای ترم
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {exams.filter((exam) => exam.term_id).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          آزمون‌ها
        </h1>
        <Button onClick={() => router.push('/admin/exams/new')}>
          ایجاد آزمون
        </Button>
      </div>

      <div className="mt-8">
        <Table
          data={exams}
          columns={columns}
          loading={loading}
          emptyMessage="هیچ آزمونی یافت نشد"
          onEdit={(exam) => router.push(`/admin/exams/${exam.id}`)}
          onDelete={handleDeleteClick}
          actions={(exam) => (
            <button
              onClick={() => router.push(`/admin/exams/${exam.id}/questions`)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              مدیریت سوالات
            </button>
          )}
        />
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف آزمون"
        description={`آیا از حذف آزمون "${itemToDelete?.title}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </main>
  );
}
