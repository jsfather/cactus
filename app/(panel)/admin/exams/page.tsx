'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Table, { Column } from '@/app/components/ui/Table';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Exam } from '@/app/lib/types/exam';
import { useExam } from '@/app/lib/hooks/use-exam';
import { Plus, FileText, Clock, Calendar, Users } from 'lucide-react';

export default function ExamsPage() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Exam | null>(null);
  
  const {
    exams,
    isListLoading: loading,
    fetchExams,
    deleteExam: deleteExamAction,
    clearError,
  } = useExam();

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  // Calculate summary statistics
  const totalExams = exams.length;
  const timedExams = exams.filter(exam => exam.duration && exam.duration > 0).length;
  const todayExams = exams.filter(exam => {
    if (!exam.date) return false;
    const today = new Date().toDateString();
    const examDate = new Date(exam.date).toDateString();
    return today === examDate;
  }).length;
  const termBasedExams = exams.filter(exam => exam.term_id).length;

  const columns: Column<Exam>[] = [
    {
      header: 'عنوان',
      accessor: 'title',
      render: (value): string => {
        return value as string;
      },
    },
    {
      header: 'توضیحات',
      accessor: 'description',
      render: (value): string => {
        const desc = value as string;
        return desc ? (desc.length > 100 ? desc.substring(0, 100) + '...' : desc) : '-';
      },
    },
    {
      header: 'تاریخ آزمون',
      accessor: 'date',
      render: (value): string => {
        return value ? new Date(value as string).toLocaleDateString('fa-IR') : '-';
      },
    },
    {
      header: 'مدت زمان',
      accessor: 'duration',
      render: (value): string => {
        return value ? `${value} دقیقه` : 'نامحدود';
      },
    },
    {
      header: 'ترم',
      accessor: 'term_id',
      render: (value): React.JSX.Element => {
        const termId = value as number | null;
        if (!termId) {
          return (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-900 dark:text-gray-300">
              آزاد
            </span>
          );
        }
        
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            ترم {termId}
          </span>
        );
      },
    },
    {
      header: 'تعداد سوالات',
      accessor: 'questions',
      render: (value): string => {
        const questions = value as Exam['questions'];
        return questions ? questions.length.toString() : '0';
      },
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
      await deleteExamAction(itemToDelete.id.toString());
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

  if (loading) {
    return <LoadingSpinner />;
  }

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
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    کل آزمون‌ها
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {totalExams}
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
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    آزمون‌های زمان‌دار
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {timedExams}
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
                <Calendar className="h-6 w-6 text-green-400" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    آزمون‌های امروز
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {todayExams}
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
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    آزمون‌های دارای ترم
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {termBasedExams}
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
        <Button 
          onClick={() => router.push('/admin/exams/new')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
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
