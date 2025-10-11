'use client';

import { useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { StudentTerm } from '@/app/lib/types/student-term';
import { useRouter } from 'next/navigation';
import { useStudentTerm } from '@/app/lib/hooks/use-student-term';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Eye,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  CalendarDays,
  ClockIcon,
} from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Card } from '@/app/components/ui/Card';

export default function StudentTermsPage() {
  const router = useRouter();
  const { termList, stats, loading, error, getTermList, resetError } =
    useStudentTerm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getTermList();
      } catch (error) {
        toast.error('خطا در دریافت لیست ترم‌ها');
      }
    };

    fetchData();
  }, [getTermList]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      resetError();
    }
  }, [error, resetError]);

  const getTermTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
      normal: 'عادی',
      capacity_completion: 'تکمیل ظرفیت',
      project_based: 'پروژه محور',
      specialized: 'گرایش تخصصی',
      ai: 'هوش مصنوعی',
    };
    return typeLabels[type] || type;
  };

  const getTermStatus = (
    term: StudentTerm
  ): { label: string; color: string } => {
    // Use schedules to determine status since start_date and end_date are in Jalali format
    const now = new Date();
    const schedules = term.schedules || [];
    
    if (schedules.length === 0) {
      return {
        label: 'بدون جلسه',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      };
    }

    const sessionDates = schedules.map(s => new Date(s.session_date));
    const firstSession = new Date(Math.min(...sessionDates.map(d => d.getTime())));
    const lastSession = new Date(Math.max(...sessionDates.map(d => d.getTime())));

    if (firstSession > now) {
      return {
        label: 'آینده',
        color:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      };
    } else if (lastSession < now) {
      return {
        label: 'تمام شده',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      };
    } else {
      return {
        label: 'در حال برگزاری',
        color:
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      };
    }
  };

  const getAttendanceInfo = (schedules: StudentTerm['schedules']) => {
    const now = new Date();
    const pastSessions = schedules.filter(s => new Date(s.session_date) < now);
    const upcomingSessions = schedules.filter(s => new Date(s.session_date) >= now);
    
    // Sort upcoming sessions by date to get the next one
    upcomingSessions.sort((a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime());
    
    return {
      totalSessions: schedules.length,
      pastSessions: pastSessions.length,
      upcomingSessions: upcomingSessions.length,
      nextSession: upcomingSessions.length > 0 ? upcomingSessions[0] : null
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
              سطح: {term.level.label} ({term.level.name})
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
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {teacher.phone}
            </div>
          </div>
        );
      },
    },
    {
      header: 'نوع',
      accessor: 'term',
      render: (value) => {
        const term = value as StudentTerm['term'];
        return getTermTypeLabel(term.type);
      },
    },
    {
      header: 'مدت زمان / جلسات',
      accessor: 'term',
      render: (value) => {
        const term = value as StudentTerm['term'];
        return (
          <div className="space-y-1">
            <div className="text-sm text-gray-900 dark:text-white">
              {term.duration} دقیقه
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {term.number_of_sessions} جلسه
            </div>
          </div>
        );
      },
    },
    {
      header: 'تاریخ شروع',
      accessor: 'term',
      render: (value) => {
        const term = value as StudentTerm['term'];
        return term.start_date; // Already in Jalali format
      },
    },
    {
      header: 'تاریخ پایان',
      accessor: 'term',
      render: (value) => {
        const term = value as StudentTerm['term'];
        return term.end_date; // Already in Jalali format
      },
    },
    {
      header: 'جلسات برگزار شده / کل',
      accessor: 'schedules',
      render: (value, row) => {
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
      header: 'آینده جلسه',
      accessor: 'schedules',
      render: (value) => {
        const schedules = value as StudentTerm['schedules'];
        const attendanceInfo = getAttendanceInfo(schedules);
        if (!attendanceInfo.nextSession) {
          return (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              جلسه‌ای باقی نمانده
            </span>
          );
        }
        const nextSession = attendanceInfo.nextSession;
        return (
          <div className="space-y-1">
            <div className="text-sm text-gray-900 dark:text-white">
              {new Date(nextSession.session_date).toLocaleDateString('fa-IR')}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {nextSession.start_time} - {nextSession.end_time}
            </div>
          </div>
        );
      },
    },
    {
      header: 'وضعیت',
      accessor: 'term',
      render: (value, row) => {
        const status = getTermStatus(row as StudentTerm);
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}
          >
            {status.label}
          </span>
        );
      },
    },
  ];

  const handleView = (term: StudentTerm) => {
    router.push(`/student/terms/${term.term.id}`);
  };

  if (loading && termList.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'ترم‌ها', href: '/student/terms', active: true },
        ]}
      />

      <div className="mt-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            ترم‌های من
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            لیست ترم‌های آموزشی که در آن‌ها شرکت کرده‌اید
          </p>
        </div>

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
                <PlayCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    در حال برگزاری
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
                <CheckCircle className="h-8 w-8 text-gray-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    تمام شده
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.completed}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    آینده
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.upcoming}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        </div>

        {/* Terms Table */}
        <Card className="p-6">
          <Table
            data={termList}
            columns={columns}
            loading={loading}
            emptyMessage="هیچ ترمی یافت نشد"
            actions={(term) => (
              <button
                onClick={() => handleView(term)}
                className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                title="مشاهده جزئیات"
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
