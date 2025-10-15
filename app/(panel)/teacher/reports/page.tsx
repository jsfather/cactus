'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Table, { Column } from '@/app/components/ui/Table';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Report } from '@/lib/types/report';
import { useReport } from '@/app/lib/hooks/use-report';
import { Plus, FileText, Calendar, User, Clock } from 'lucide-react';

export default function ReportsPage() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Report | null>(null);

  const { reportList, loading, fetchReportList, deleteReport, clearError } =
    useReport();

  useEffect(() => {
    fetchReportList();
  }, [fetchReportList]);

  // Calculate summary statistics
  const totalReports = reportList.length;
  const recentReports = reportList.filter((report) => {
    const reportDate = new Date(report.created_at);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return reportDate >= oneWeekAgo;
  }).length;
  const totalSchedules = new Set(
    reportList.map((report) => report.schedule?.id)
  ).size;
  const uniqueTeachers = new Set(reportList.map((report) => report.teacher?.id))
    .size;

  const handleDeleteClick = (report: Report) => {
    setItemToDelete(report);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setItemToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteReport(itemToDelete.id.toString());
      toast.success('گزارش با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('خطا در حذف گزارش');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: Column<Report>[] = [
    {
      header: 'شناسه',
      accessor: 'id',
      render: (value): string => {
        return `#${value}`;
      },
    },
    {
      header: 'محتوای گزارش',
      accessor: 'content',
      render: (value): string => {
        const content = value as string;
        return content.length > 50 ? `${content.substring(0, 50)}...` : content;
      },
    },
    {
      header: 'استاد',
      accessor: 'teacher',
      render: (value, item): React.JSX.Element => {
        const teacher = item.teacher;
        if (!teacher) {
          return (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              نامشخص
            </span>
          );
        }

        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-white">
              {teacher.first_name} {teacher.last_name}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {teacher.username}
            </span>
          </div>
        );
      },
    },
    {
      header: 'تاریخ جلسه',
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
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-white">
              {schedule.session_date}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {schedule.start_time} - {schedule.end_time}
            </span>
          </div>
        );
      },
    },
    {
      header: 'تعداد تکالیف',
      accessor: 'schedule',
      render: (value, item): React.JSX.Element => {
        const homeworkCount = item.schedule?.homeworks?.length || 0;
        const answeredCount =
          item.schedule?.homeworks?.reduce(
            (count, hw) => count + (hw.answers?.length || 0),
            0
          ) || 0;

        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-white">
              {homeworkCount} تکلیف
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {answeredCount} پاسخ
            </span>
          </div>
        );
      },
    },
    {
      header: 'تاریخ ایجاد',
      accessor: 'created_at',
      render: (value): string => {
        if (!value || typeof value !== 'string') return '---';
        return value;
      },
    },
  ];

  const breadcrumbItems = [
    { label: 'پنل استاد', href: '/teacher' },
    { label: 'گزارش‌های ترم', href: '/teacher/reports', active: true },
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs breadcrumbs={breadcrumbItems} />

        {/* Header */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              گزارش‌های ترم
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              مدیریت و مشاهده گزارش‌های جلسات آموزشی
            </p>
          </div>
          <Button
            onClick={() => router.push('/teacher/reports/new')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            ایجاد گزارش جدید
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    کل گزارش‌ها
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {totalReports.toLocaleString('fa-IR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    گزارش‌های اخیر
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {recentReports.toLocaleString('fa-IR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    جلسات منحصر
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {totalSchedules.toLocaleString('fa-IR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    استادان فعال
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {uniqueTeachers.toLocaleString('fa-IR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-8">
          <Table
            data={reportList}
            columns={columns}
            loading={loading}
            emptyMessage="هیچ گزارشی یافت نشد"
            onView={(report) =>
              router.push(`/teacher/reports/${report.id}/view`)
            }
            onEdit={(report) => router.push(`/teacher/reports/${report.id}`)}
            onDelete={handleDeleteClick}
          />
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="حذف گزارش"
          description={`آیا از حذف این گزارش اطمینان دارید؟`}
          confirmText="حذف"
          loading={deleteLoading}
          variant="danger"
        />
      </div>
    </main>
  );
}
