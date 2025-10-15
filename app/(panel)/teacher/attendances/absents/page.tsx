'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Table, { Column } from '@/app/components/ui/Table';
import { Button } from '@/app/components/ui/Button';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Card } from '@/app/components/ui/Card';
import { useAttendance } from '@/app/lib/hooks/use-attendance';
import { Attendance } from '@/app/lib/types/attendance';
import { toast } from 'react-hot-toast';
import {
  UserX,
  Users,
  Calendar,
  ArrowRight,
  AlertTriangle,
  Clock,
  Phone,
} from 'lucide-react';

export default function AbsentStudentsPage() {
  const router = useRouter();

  const { absentStudents, loading, error, fetchAbsentStudents, clearError } =
    useAttendance();

  useEffect(() => {
    fetchAbsentStudents();
  }, [fetchAbsentStudents]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const columns: Column<Attendance>[] = [
    {
      header: 'دانش‌آموز',
      accessor: 'student',
      render: (value, item): string => {
        if (!item.student) return 'نامشخص';
        return `${item.student.first_name} ${item.student.last_name}`;
      },
    },
    {
      header: 'شماره تماس',
      accessor: 'student',
      render: (value, item): React.JSX.Element => {
        if (!item.student?.phone) {
          return <span className="text-gray-400">-</span>;
        }
        return (
          <a
            href={`tel:${item.student.phone}`}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            <Phone className="h-3 w-3" />
            {item.student.phone}
          </a>
        );
      },
    },
    {
      header: 'تاریخ جلسه',
      accessor: 'schedule',
      render: (value, item): string => {
        if (!item.schedule) return 'نامشخص';
        return new Date(item.schedule.session_date).toLocaleDateString('fa-IR');
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
      header: 'دلیل غیبت',
      accessor: 'absence_reason',
      render: (value): React.JSX.Element => {
        if (!value) {
          return (
            <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-300">
              <AlertTriangle className="ml-1 h-3 w-3" />
              بدون دلیل
            </span>
          );
        }
        return (
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {String(value)}
          </span>
        );
      },
    },
    {
      header: 'تاریخ ثبت',
      accessor: 'created_at',
      render: (value): string => {
        if (!value || typeof value !== 'string') return '';
        return new Date(value).toLocaleDateString('fa-IR');
      },
    },
  ];

  const todayAbsents = absentStudents.filter((attendance) => {
    if (!attendance.schedule) return false;
    const sessionDate = new Date(attendance.schedule.session_date);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'حضور و غیاب', href: '/teacher/attendances' },
          { label: 'دانش‌آموزان غایب', href: '/teacher/attendances/absents' },
        ]}
      />

      <div className="mt-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              دانش‌آموزان غایب
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              لیست دانش‌آموزان غایب در جلسات مختلف
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => router.push('/teacher/attendances')}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  کل غایبین
                </p>
                <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                  {absentStudents.length.toLocaleString('fa-IR')}
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
                  غایبین امروز
                </p>
                <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
                  {todayAbsents.length.toLocaleString('fa-IR')}
                </p>
              </div>
              <div className="rounded-md bg-orange-100 p-3 dark:bg-orange-900">
                <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  بدون دلیل
                </p>
                <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                  {absentStudents
                    .filter((a) => !a.absence_reason)
                    .length.toLocaleString('fa-IR')}
                </p>
              </div>
              <div className="rounded-md bg-yellow-100 p-3 dark:bg-yellow-900">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Alert for Today's Absents */}
        {todayAbsents.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
            <div className="flex items-center">
              <Clock className="ml-2 h-5 w-5 text-orange-600 dark:text-orange-400" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300">
                  توجه: غیبت‌های امروز
                </h3>
                <p className="mt-1 text-sm text-orange-700 dark:text-orange-400">
                  {todayAbsents.length} دانش‌آموز در جلسات امروز غایب هستند.
                  توصیه می‌شود با آنها تماس گیری شود.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {absentStudents.length === 0 ? (
          <Card className="p-8 text-center">
            <UserX className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              هیچ غیبتی ثبت نشده
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              در حال حاضر هیچ دانش‌آموز غایبی ثبت نشده است
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push('/teacher/attendances')}
            >
              بازگشت به لیست حضور و غیاب
            </Button>
          </Card>
        ) : (
          /* Table */
          <div className="mt-8">
            <Table
              data={absentStudents}
              columns={columns}
              loading={loading}
              emptyMessage="هیچ دانش‌آموز غایبی یافت نشد"
              onView={(attendance) =>
                router.push(`/teacher/attendances/${attendance.id}`)
              }
            />
          </div>
        )}
      </div>
    </main>
  );
}
