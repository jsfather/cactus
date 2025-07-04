'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { getExams, deleteExam } from '@/app/lib/api/admin/exams';
import { Exam } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
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
    },
    {
      header: 'مدت زمان',
      accessor: 'duration',
    },
    {
      header: 'ترم',
      accessor: 'term_id',
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

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await getExams();
      if (response) {
        setExams(response.data);
      }
    } catch (error) {
      toast.error('خطا در دریافت لیست آزمون ها');
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (exam: Exam) => {
    setItemToDelete(exam);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteExam(itemToDelete.id);
      toast.success('آزمون با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchExams();
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
  }, []);

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
