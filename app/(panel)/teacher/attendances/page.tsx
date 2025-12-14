'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Table, { Column } from '@/app/components/ui/Table';
import { Button } from '@/app/components/ui/Button';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import Select from '@/app/components/ui/Select';
import { Card } from '@/app/components/ui/Card';
import { useAttendance } from '@/app/lib/hooks/use-attendance';
import { useTeacherTerm } from '@/app/lib/hooks/use-teacher-term';
import { Attendance } from '@/app/lib/types/attendance';
import { TeacherTerm } from '@/app/lib/types/teacher-term';
import { formatDateToPersian } from '@/app/lib/utils';
import { toast } from 'react-hot-toast';
import {
  UserCheck,
  UserX,
  Users,
  Calendar,
  BookOpen,
  Plus,
  Eye,
  Trash2,
  TrendingUp,
  Award,
} from 'lucide-react';

export default function TeacherAttendancesPage() {
  const router = useRouter();
  const [selectedTermId, setSelectedTermId] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Attendance | null>(null);

  const {
    termAttendances,
    absentStudents,
    loading,
    error,
    fetchTermAttendances,
    fetchAbsentStudents,
    deleteAttendance,
    getAttendanceStats,
    clearError,
  } = useAttendance();

  const { terms, loading: termsLoading, fetchTerms } = useTeacherTerm();

  useEffect(() => {
    fetchTerms();
    fetchAbsentStudents();
  }, [fetchTerms, fetchAbsentStudents]);

  useEffect(() => {
    if (selectedTermId) {
      fetchTermAttendances(selectedTermId);
    }
  }, [selectedTermId, fetchTermAttendances]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Calculate summary statistics
  const stats = getAttendanceStats(termAttendances);
  const totalAbsents = absentStudents.length;

  const handleDeleteClick = (attendance: Attendance) => {
    setItemToDelete(attendance);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setDeleteLoading(true);
    try {
      await deleteAttendance(itemToDelete.id.toString());
      toast.success('حضور و غیاب با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);

      // Refresh data
      if (selectedTermId) {
        fetchTermAttendances(selectedTermId);
      }
      fetchAbsentStudents();
    } catch (error) {
      toast.error('خطا در حذف حضور و غیاب');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: Column<Attendance>[] = [
    {
      header: 'دانش‌پژوه',
      accessor: 'student',
      render: (value, item): string => {
        if (!item.student) return 'نامشخص';
        return `${item.student.first_name} ${item.student.last_name}`;
      },
    },
    {
      header: 'تاریخ جلسه',
      accessor: 'schedule',
      render: (value, item): string => {
        if (!item.schedule) return 'نامشخص';
        return formatDateToPersian(item.schedule.session_date);
      },
    },
    {
      header: 'زمان جلسه',
      accessor: 'schedule',
      render: (value, item): string => {
        if (!item.schedule) return 'نامشخص';
        return `${item.schedule.start_time} - ${item.schedule.end_time}`;
      },
    },
    {
      header: 'وضعیت حضور',
      accessor: 'status',
      render: (value): React.JSX.Element => {
        const isPresent = value === 'present';
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isPresent
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}
          >
            {isPresent ? (
              <>
                <UserCheck className="ml-1.5 h-3 w-3" />
                حاضر
              </>
            ) : (
              <>
                <UserX className="ml-1.5 h-3 w-3" />
                غایب
              </>
            )}
          </span>
        );
      },
    },
    {
      header: 'نمره',
      accessor: 'mark',
      render: (value): React.JSX.Element => {
        const mark = parseFloat((value as string) || '0');
        const colorClass =
          mark >= 18
            ? 'text-green-600 dark:text-green-400'
            : mark >= 15
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-red-600 dark:text-red-400';

        return <span className={`font-medium ${colorClass}`}>{mark}/20</span>;
      },
    },
    {
      header: 'دلیل غیبت',
      accessor: 'absence_reason',
      render: (value): string => {
        return value ? String(value) : '-';
      },
    },
    {
      header: 'تاریخ ثبت',
      accessor: 'created_at',
      render: (value): string => {
        if (!value || typeof value !== 'string') return '';
        return formatDateToPersian(value);
      },
    },
  ];

  const termOptions = terms.map((term: TeacherTerm) => ({
    value: term.id.toString(),
    label: term.title,
  }));

  // Add "all terms" option
  const termSelectOptions = [
    { value: '', label: 'انتخاب ترم' },
    ...termOptions,
  ];

  if (termsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[{ label: 'حضور و غیاب', href: '/teacher/attendances' }]}
      />

      <div className="mt-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              مدیریت حضور و غیاب
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              مدیریت و ثبت حضور و غیاب دانش‌پژوهان
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="w-full sm:w-64">
              <Select
                id="term-select"
                value={selectedTermId}
                onChange={(e) => setSelectedTermId(e.target.value)}
                options={termSelectOptions}
                label=""
                placeholder="انتخاب ترم"
              />
            </div>

            {selectedTermId && (
              <Button
                onClick={() =>
                  router.push(
                    `/teacher/attendances/new?termId=${selectedTermId}`
                  )
                }
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                ثبت حضور و غیاب جدید
              </Button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  کل حضور و غیاب‌ها
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.total.toLocaleString('fa-IR')}
                </p>
              </div>
              <div className="rounded-md bg-blue-100 p-3 dark:bg-blue-900">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  حاضرین
                </p>
                <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                  {stats.present.toLocaleString('fa-IR')}
                </p>
              </div>
              <div className="rounded-md bg-green-100 p-3 dark:bg-green-900">
                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  غایبین
                </p>
                <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                  {stats.absent.toLocaleString('fa-IR')}
                </p>
              </div>
              <div className="rounded-md bg-red-100 p-3 dark:bg-red-900">
                <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  میانگین نمره
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.averageMark.toLocaleString('fa-IR')}
                </p>
              </div>
              <div className="rounded-md bg-yellow-100 p-3 dark:bg-yellow-900">
                <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Absent Students Alert */}
        {totalAbsents > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
            <div className="flex items-center">
              <UserX className="ml-2 h-5 w-5 text-red-600 dark:text-red-400" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  دانش‌پژوهان غایب امروز
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                  {totalAbsents} دانش‌پژوه در جلسات امروز غایب هستند
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => router.push('/teacher/attendances/absents')}
                className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
              >
                مشاهده لیست
              </Button>
            </div>
          </Card>
        )}

        {/* Table */}
        <div className="mt-8">
          {selectedTermId ? (
            <Table
              data={termAttendances}
              columns={columns}
              loading={loading}
              emptyMessage="هیچ حضور و غیابی برای این ترم ثبت نشده است"
              onView={(attendance) =>
                router.push(`/teacher/attendances/${attendance.id}`)
              }
              onDelete={handleDeleteClick}
            />
          ) : (
            <Card className="p-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                انتخاب ترم
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                برای مشاهده حضور و غیاب دانش‌پژوهان، ابتدا یک ترم انتخاب کنید
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="حذف حضور و غیاب"
        description="آیا از حذف این حضور و غیاب اطمینان دارید؟ این عمل قابل بازگشت نیست."
        loading={deleteLoading}
      />
    </main>
  );
}
