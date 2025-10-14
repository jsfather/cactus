'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Table, { Column } from '@/app/components/ui/Table';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { TeacherHomework, formatHomeworkDescription, getTeacherHomeworkTermTypeLabel } from '@/app/lib/types/teacher-homework';
import { useTeacherHomework } from '@/app/lib/hooks/use-teacher-homework';
import { 
  Plus, 
  BookOpen, 
  Calendar, 
  Clock, 
  Users, 
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function TeacherHomeworksPage() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TeacherHomework | null>(null);

  const { 
    homeworks, 
    loading, 
    deleting,
    fetchHomeworks, 
    deleteHomework 
  } = useTeacherHomework();

  useEffect(() => {
    fetchHomeworks();
  }, [fetchHomeworks]);

  // Calculate summary statistics
  const totalHomeworks = homeworks.length;
  const homeworksWithFiles = homeworks.filter(hw => hw.file_url).length;
  const totalAnswers = homeworks.reduce((sum, hw) => sum + (hw.answers?.length || 0), 0);
  const recentHomeworks = homeworks.filter(hw => {
    if (!hw.schedule?.session_date) return false;
    const sessionDate = new Date(hw.schedule.session_date);
    const today = new Date();
    const diffTime = today.getTime() - sessionDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= 7; // Recent if within last 7 days
  }).length;

  const handleDelete = async (homework: TeacherHomework) => {
    setItemToDelete(homework);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setDeleteLoading(true);
    try {
      const success = await deleteHomework(itemToDelete.id.toString());
      if (success) {
        setShowDeleteModal(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting homework:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: Column<TeacherHomework>[] = [
    {
      header: 'شرح تکلیف',
      accessor: 'description',
      render: (value): React.JSX.Element => {
        const description = value as string;
        return (
          <div className="max-w-xs">
            <p className="text-sm text-gray-900 dark:text-white">
              {formatHomeworkDescription(description, 80)}
            </p>
          </div>
        );
      },
    },
    {
      header: 'ترم',
      accessor: 'term',
      render: (value, item): React.JSX.Element => {
        const term = item.term;
        if (!term) {
          return (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              نامشخص
            </span>
          );
        }

        return (
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {term.title}
            </p>
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              term.type === 'normal' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
              term.type === 'capacity_completion' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
              term.type === 'project_based' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
              term.type === 'specialized' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
              term.type === 'ai' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' :
              'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
            }`}>
              {getTeacherHomeworkTermTypeLabel(term.type)}
            </span>
          </div>
        );
      },
    },
    {
      header: 'جلسه',
      accessor: 'schedule',
      render: (value, item): React.JSX.Element => {
        const schedule = item.schedule;
        if (!schedule) {
          return (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              نامشخص
            </span>
          );
        }

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <Calendar className="h-3 w-3" />
              {schedule.session_date}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              {schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)}
            </div>
          </div>
        );
      },
    },
    {
      header: 'فایل ضمیمه',
      accessor: 'file_url',
      render: (value): React.JSX.Element => {
        if (!value) {
          return (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ندارد
            </span>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <Button
              variant="secondary"
              onClick={() => window.open(value as string, '_blank')}
              className="flex items-center gap-1 text-xs px-2 py-1"
            >
              <Download className="h-3 w-3" />
              دانلود
            </Button>
          </div>
        );
      },
    },
    {
      header: 'پاسخ‌ها',
      accessor: 'answers',
      render: (value, item): React.JSX.Element => {
        const answersCount = item.answers?.length || 0;
        
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">
              {answersCount.toLocaleString('fa-IR')} پاسخ
            </span>
            {answersCount > 0 && (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
          </div>
        );
      },
    },
    {
      header: 'وضعیت',
      accessor: 'id',
      render: (value, item): React.JSX.Element => {
        const hasFile = !!item.file_url;
        const hasAnswers = (item.answers?.length || 0) > 0;
        
        if (hasAnswers) {
          return (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
              دارای پاسخ
            </span>
          );
        }
        
        if (hasFile) {
          return (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              دارای فایل
            </span>
          );
        }
        
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            در انتظار
          </span>
        );
      },
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumbs
          breadcrumbs={[
            { label: 'داشبورد مدرس', href: '/teacher' },
            { label: 'تکالیف', href: '/teacher/homeworks' },
          ]}
        />

        {/* Header */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              مدیریت تکالیف
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              ایجاد، ویرایش و مدیریت تکالیف کلاسی
            </p>
          </div>
          <Button
            onClick={() => router.push('/teacher/homeworks/new')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            تکلیف جدید
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    کل تکالیف
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {totalHomeworks.toLocaleString('fa-IR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    دارای فایل
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {homeworksWithFiles.toLocaleString('fa-IR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    کل پاسخ‌ها
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {totalAnswers.toLocaleString('fa-IR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    اخیر (۷ روز)
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {recentHomeworks.toLocaleString('fa-IR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-8">
          <Table
            data={homeworks}
            columns={columns}
            loading={loading}
            emptyMessage="هیچ تکلیفی ایجاد نشده است"
            onView={(homework) => router.push(`/teacher/homeworks/${homework.id}`)}
            onEdit={(homework) => router.push(`/teacher/homeworks/${homework.id}/edit`)}
            onDelete={handleDelete}
          />
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="حذف تکلیف"
          description={`آیا از حذف تکلیف "${itemToDelete?.description}" اطمینان دارید؟`}
          confirmText="حذف"
          cancelText="انصراف"
          loading={deleteLoading}
          variant="danger"
        />
      </div>
    </main>
  );
}