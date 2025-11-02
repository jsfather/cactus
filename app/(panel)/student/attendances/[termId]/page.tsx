'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAttendance } from '@/app/lib/hooks/use-attendance';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Card } from '@/app/components/ui/Card';
import Table, { Column } from '@/app/components/ui/Table';
import {
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  User,
  BookOpen,
  FileText,
  AlertCircle,
  Star,
} from 'lucide-react';
import { Attendance } from '@/app/lib/types/attendance';

export default function TermAttendancesPage() {
  const params = useParams();
  const router = useRouter();
  const termId = params.termId as string;

  const {
    termAttendances,
    studentTerms,
    loading,
    error,
    fetchStudentTermAttendances,
    fetchStudentTerms,
    clearError,
    getAttendanceStats,
  } = useAttendance();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchStudentTermAttendances(termId),
          fetchStudentTerms(),
        ]);
      } catch (error) {
        toast.error('خطا در دریافت اطلاعات حضور و غیاب');
      }
    };

    fetchData();
  }, [termId, fetchStudentTermAttendances, fetchStudentTerms]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const currentTerm = studentTerms.find(
    (term) => term.term.id === parseInt(termId)
  );
  const stats = getAttendanceStats(termAttendances);

  const columns: Column<Attendance>[] = [
    {
      header: 'تاریخ جلسه',
      accessor: 'schedule',
      render: (value) => {
        const schedule = value as Attendance['schedule'];
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>
                {schedule?.session_date
                  ? new Date(schedule.session_date).toLocaleDateString('fa-IR')
                  : 'تاریخ نامشخص'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              <span>
                {schedule?.start_time || 'نامشخص'} -{' '}
                {schedule?.end_time || 'نامشخص'}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: 'مدرس',
      accessor: 'teacher',
      render: (value) => {
        const teacher = value as Attendance['teacher'];
        if (!teacher) return 'نامشخص';
        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 dark:text-white">
              {teacher.first_name} {teacher.last_name}
            </span>
          </div>
        );
      },
    },
    {
      header: 'وضعیت حضور',
      accessor: 'status',
      render: (value) => {
        const status = value as Attendance['status'];
        const isPresent = status === 'present';
        return (
          <div className="flex items-center gap-2">
            {isPresent ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                  حاضر
                </span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                  غائب
                </span>
              </>
            )}
          </div>
        );
      },
    },
    {
      header: 'نمره',
      accessor: 'mark',
      render: (value) => {
        const mark = value as string;
        return (
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {mark || '0'}
            </span>
          </div>
        );
      },
    },
    {
      header: 'دلیل غیبت',
      accessor: 'absence_reason',
      render: (value) => {
        const reason = value as string | null;
        if (!reason) {
          return (
            <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
          );
        }
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <AlertCircle className="h-4 w-4" />
            <span>{reason}</span>
          </div>
        );
      },
    },
    {
      header: 'زمان ثبت',
      accessor: 'created_at',
      render: (value) => {
        const createdAt = value as string;
        return (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {createdAt || 'نامشخص'}
          </div>
        );
      },
    },
  ];

  if (loading && termAttendances.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'حضور و غیاب', href: '/student/attendances' },
          {
            label: currentTerm?.term.title || 'جزئیات حضور و غیاب',
            href: `/student/attendances/${termId}`,
            active: true,
          },
        ]}
      />

      <div className="mt-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentTerm?.term.title || 'جزئیات حضور و غیاب'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            لیست کامل حضور و غیاب در جلسات این ترم
          </p>
        </div>

        {/* Term Info Card */}
        {currentTerm && (
          <Card className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  مدرس
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currentTerm.user.first_name} {currentTerm.user.last_name}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  سطح
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currentTerm.term.level.label} (
                    {currentTerm.term.level.name})
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  تاریخ شروع
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currentTerm.term.start_date}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  تاریخ پایان
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currentTerm.term.end_date}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    کل جلسات
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    حاضر
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.present}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    غائب
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.absent}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    میانگین نمره
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.averageMark.toFixed(1)}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        </div>

        {/* Attendances Table */}
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              لیست حضور و غیاب
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              وضعیت حضور و غیاب در تمام جلسات این ترم
            </p>
          </div>
          <Table
            data={termAttendances}
            columns={columns}
            loading={loading}
            emptyMessage="هنوز رکوردی از حضور و غیاب ثبت نشده است"
          />
        </Card>

        {/* Homework Notice */}
        {termAttendances.some(
          (att) => att.schedule?.homeworks && att.schedule.homeworks.length > 0
        ) && (
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  تکالیف موجود
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  برخی از جلسات دارای تکلیف هستند. برای مشاهده و پاسخ به تکالیف
                  به بخش{' '}
                  <button
                    onClick={() => router.push('/student/homeworks')}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    تکالیف
                  </button>{' '}
                  مراجعه کنید.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
