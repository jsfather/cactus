'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { getExamQuestions, deleteExamQuestion } from '@/app/lib/api/admin/examQuestions';
import { ExamQuestion } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';

export default function ExamQuestionsPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;
  
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ExamQuestion | null>(null);

  const columns: Column<ExamQuestion>[] = [
    {
      header: 'متن سوال',
      accessor: 'text',
      render: (value) => {
        if (typeof value === 'string' && value.length > 50) {
          return value.substring(0, 50) + '...';
        }
        return value;
      },
    },
    {
      header: 'تعداد گزینه‌ها',
      accessor: 'options',
      render: (value) => {
        if (Array.isArray(value)) {
          return value.length.toString();
        }
        return '0';
      },
    },
    {
      header: 'گزینه‌های صحیح',
      accessor: 'options',
      render: (value) => {
        if (Array.isArray(value)) {
          const correctOptions = value.filter(option => option.is_correct);
          return correctOptions.length.toString();
        }
        return '0';
      },
    },
    {
      header: 'فایل ضمیمه',
      accessor: 'file',
      render: (value) => {
        return value ? 'دارد' : 'ندارد';
      },
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

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await getExamQuestions(examId);
      setQuestions(data);
    } catch (error) {
      toast.error('خطا در دریافت سوالات آزمون');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (question: ExamQuestion) => {
    setItemToDelete(question);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteExamQuestion(examId, itemToDelete.id);
      toast.success('سوال با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchQuestions();
    } catch (error) {
      toast.error('خطا در حذف سوال');
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
    if (examId) {
      fetchQuestions();
    }
  }, [examId]);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          سوالات آزمون
        </h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push(`/admin/exams/${examId}/questions/new`)}>
            افزودن سوال جدید
          </Button>
          <Button variant="secondary" onClick={() => router.push('/admin/exams')}>
            بازگشت به آزمون‌ها
          </Button>
        </div>
      </div>

      <Table
        data={questions}
        columns={columns}
        loading={loading}
        onEdit={(question) => router.push(`/admin/exams/${examId}/questions/${question.id}/edit`)}
        onDelete={handleDeleteClick}
        editText="ویرایش"
        deleteText="حذف"
      />

      <ConfirmModal
        show={showDeleteModal}
        title="حذف سوال"
        message={`آیا از حذف سوال "${itemToDelete?.text}" اطمینان دارید؟`}
        confirmText="حذف"
        cancelText="لغو"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
