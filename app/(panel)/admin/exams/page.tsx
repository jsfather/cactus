'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { useExamStore } from '@/app/lib/stores/exam.store';
import { Exam } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const { 
    exams, 
    isListLoading: loading, 
    deleteExam, 
    fetchExams, 
    error 
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
    },
    {
      header: 'تاریخ آزمون',
      accessor: 'date',
      render: (value) => value || '-',
    },
    {
      header: 'مدت زمان',
      accessor: 'duration',
      render: (value) => value ? `${value} دقیقه` : '-',
    },
    {
      header: 'ترم',
      accessor: 'term_id',
      render: (value) => value ? `ترم ${value}` : '-',
    },
    {
      header: 'ایجاد کننده',
      accessor: 'created_by',
      render: (value) => value ? `کاربر ${value}` : '-',
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
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          آزمون ها
        </h1>
        <Button onClick={() => router.push('/admin/exams/new')}>
          ایجاد آزمون
        </Button>
      </div>
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
    </div>
  );
}
