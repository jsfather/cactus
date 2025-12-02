'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAttendance } from '@/app/lib/hooks/use-attendance';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Card } from '@/app/components/ui/Card';
import Table, { Column } from '@/app/components/ui/Table';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { StudentTerm } from '@/app/lib/types/attendance';

export default function StudentAttendancesPage() {
  const router = useRouter();
  const {
    studentTerms,
    studentAbsents,
    loading,
    error,
    fetchStudentTerms,
    fetchStudentAbsents,
    clearError,
  } = useAttendance();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchStudentTerms(), fetchStudentAbsents()]);
      } catch (error) {
        toast.error('خطا در دریافت اطلاعات حضور و غیاب');
      }
    };

    fetchData();
  }, [fetchStudentTerms, fetchStudentAbsents]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const getTermStats = () => {
    const total = studentTerms.length;
    const active = studentTerms.filter((term) => {
      const now = new Date();
      const schedules = term.schedules || [];
      if (schedules.length === 0) return false;

      const sessionDates = schedules.map((s) => new Date(s.session_date));
      const firstSession = new Date(
        Math.min(...sessionDates.map((d) => d.getTime()))
      );
      const lastSession = new Date(
        Math.max(...sessionDates.map((d) => d.getTime()))
      );

      return firstSession <= now && lastSession >= now;
    }).length;

    const totalAbsents = studentAbsents.length;

    // Calculate attendance rate
    let totalSessions = 0;
    let attendedSessions = 0;

    studentTerms.forEach((term) => {
      const now = new Date();
      const pastSchedules = term.schedules.filter(
        (s) => new Date(s.session_date) < now
      );
      totalSessions += pastSchedules.length;
    });

    // Assuming absent count from studentAbsents
    attendedSessions = totalSessions - totalAbsents;
    const attendanceRate =
      totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0;

    return {
      total,
      active,
      totalAbsents,
      attendanceRate: Math.round(attendanceRate),
    };
  };

  const stats = getTermStats();

  const getAttendanceInfo = (schedules: StudentTerm['schedules']) => {
    const now = new Date();
    const pastSessions = schedules.filter(
      (s) => new Date(s.session_date) < now
    );
    const upcomingSessions = schedules.filter(
      (s) => new Date(s.session_date) >= now
    );

    return {
      totalSessions: schedules.length,
      pastSessions: pastSessions.length,
      upcomingSessions: upcomingSessions.length,
    };
  };

  const columns: Column<StudentTerm>[] = [
    {
      header: 'عنوان ترم',
      accessor: 'term',
      render: (value) => {
        const term = value as StudentTerm['term'];
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {term.title}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              سطح: {term.level.name} ({term.level.label})
            </div>
          </div>
        );
      },
    },
    {
      header: 'مدرس',
      accessor: 'user',
      render: (value) => {
        const teacher = value as StudentTerm['user'];
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {teacher.first_name} {teacher.last_name}
            </div>
          </div>
        );
      },
    },
    {
      header: 'تعداد جلسات',
      accessor: 'term',
      render: (value) => {
        const term = value as StudentTerm['term'];
        return (
          <div className="text-sm text-gray-900 dark:text-white">
            {term.number_of_sessions} جلسه
          </div>
        );
      },
    },
    {
      header: 'جلسات برگزار شده',
      accessor: 'schedules',
      render: (value) => {
        const schedules = value as StudentTerm['schedules'];
        const attendanceInfo = getAttendanceInfo(schedules);
        return (
          <div className="space-y-1">
            <div className="text-sm text-gray-900 dark:text-white">
              {attendanceInfo.pastSessions} / {attendanceInfo.totalSessions}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {attendanceInfo.upcomingSessions} جلسه باقی‌مانده
            </div>
          </div>
        );
      },
    },
    {
      header: 'تاریخ شروع - پایان',
      accessor: 'term',
      render: (value) => {
        const term = value as StudentTerm['term'];
        return (
          <div className="space-y-1">
            <div className="text-sm text-gray-900 dark:text-white">
              {term.start_date}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {term.end_date}
            </div>
          </div>
        );
      },
    },
  ];

  const handleViewAttendances = (term: StudentTerm) => {
    router.push(`/student/attendances/${term.term.id}`);
  };

  if (loading && studentTerms.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'حضور و غیاب', href: '/student/attendances', active: true },
        ]}
      />

      <div className="mt-8 space-y-6">
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
                    کل ترم‌ها
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
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    ترم‌های فعال
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.active}
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
                    تعداد غیبت‌ها
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.totalAbsents}
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
                    نرخ حضور
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.attendanceRate}%
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        </div>

        {/* Absent Sessions Section */}
        {studentAbsents.length > 0 && (
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                غیبت‌های اخیر
              </h2>
            </div>
            <div className="space-y-3">
              {studentAbsents.slice(0, 5).map((attendance) => (
                <div
                  key={attendance.id}
                  className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
                >
                  <div className="flex items-center gap-4">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {attendance.term?.title || 'نامشخص'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {attendance.schedule?.session_date
                          ? new Date(
                              attendance.schedule.session_date
                            ).toLocaleDateString('fa-IR')
                          : 'تاریخ نامشخص'}{' '}
                        - {attendance.schedule?.start_time || 'زمان نامشخص'}
                      </div>
                    </div>
                  </div>
                  {attendance.absence_reason && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      دلیل: {attendance.absence_reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Terms Table */}
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              لیست ترم‌ها
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              برای مشاهده جزئیات حضور و غیاب هر ترم، روی دکمه مشاهده کلیک کنید
            </p>
          </div>
          <Table
            data={studentTerms}
            columns={columns}
            loading={loading}
            emptyMessage="هیچ ترمی یافت نشد"
            actions={(term) => (
              <button
                onClick={() => handleViewAttendances(term)}
                className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                title="مشاهده حضور و غیاب"
              >
                <Eye className="h-3 w-3" />
                مشاهده
              </button>
            )}
          />
        </Card>
      </div>
    </main>
  );
}
