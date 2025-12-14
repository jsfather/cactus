'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Table, { Column } from '@/app/components/ui/Table';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import {
  TeacherTerm,
  getTeacherTermTypeLabel,
} from '@/app/lib/types/teacher-term';
import { useTeacherTerm } from '@/app/lib/hooks/use-teacher-term';
import { formatDateToPersian } from '@/app/lib/utils';
import {
  Calendar,
  Users,
  BookOpen,
  Clock,
  GraduationCap,
  Eye,
  CalendarDays,
  UserCheck,
} from 'lucide-react';

export default function TeacherTermsPage() {
  const router = useRouter();

  const { terms, loading, fetchTerms } = useTeacherTerm();

  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  // Calculate summary statistics
  const totalTerms = terms.length;
  const activeTerms = terms.filter((term) => {
    const today = new Date();
    const endDate = new Date(term.end_date.replace(/\//g, '-'));
    return endDate >= today;
  }).length;
  const totalStudents = terms.reduce(
    (sum, term) => sum + (term.students?.filter((s) => s.user).length || 0),
    0
  );
  const totalSessions = terms.reduce(
    (sum, term) => sum + term.number_of_sessions,
    0
  );

  const columns: Column<TeacherTerm>[] = [
    {
      header: 'عنوان ترم',
      accessor: 'title',
      render: (value): string => {
        return value as string;
      },
    },
    {
      header: 'سطح',
      accessor: 'level',
      render: (value, item): React.JSX.Element => {
        const level = item.level;
        if (!level) {
          return (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-900 dark:text-gray-300">
              نامشخص
            </span>
          );
        }

        return (
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
            {level.name} - {level.label}
          </span>
        );
      },
    },
    {
      header: 'نوع ترم',
      accessor: 'type',
      render: (value): React.JSX.Element => {
        const typeMap = {
          normal: {
            label: 'عادی',
            color:
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
          },
          capacity_completion: {
            label: 'تکمیل ظرفیت',
            color:
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
          },
          project_based: {
            label: 'پروژه محور(ویژه)',
            color:
              'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
          },
          specialized: {
            label: 'گرایش تخصصی',
            color:
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          },
          ai: {
            label: 'هوش مصنوعی',
            color:
              'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
          },
        };
        const type = typeMap[value as keyof typeof typeMap] || {
          label: getTeacherTermTypeLabel(value),
          color: 'bg-gray-100 text-gray-800',
        };

        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${type.color}`}
          >
            {type.label}
          </span>
        );
      },
    },
    {
      header: 'مدت زمان',
      accessor: 'duration',
      render: (value): string => {
        return `${value} دقیقه`;
      },
    },
    {
      header: 'تعداد جلسات',
      accessor: 'number_of_sessions',
      render: (value): string => {
        return `${value} جلسه`;
      },
    },
    {
      header: 'ظرفیت',
      accessor: 'capacity',
      render: (value): string => {
        return `${value} نفر`;
      },
    },
    {
      header: 'دانش‌پژوهان',
      accessor: 'students',
      render: (value, item): React.JSX.Element => {
        const studentsWithUser = item.students?.filter((s) => s.user) || [];
        const enrolledCount = studentsWithUser.length;
        const capacity = item.capacity;

        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {enrolledCount.toLocaleString('fa-IR')} /{' '}
              {capacity.toLocaleString('fa-IR')}
            </span>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{
                  width: `${Math.min((enrolledCount / capacity) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'تاریخ شروع',
      accessor: 'start_date',
      render: (value): string => {
        if (!value || typeof value !== 'string') return '---';
        return formatDateToPersian(value);
      },
    },
    {
      header: 'تاریخ پایان',
      accessor: 'end_date',
      render: (value): string => {
        if (!value || typeof value !== 'string') return '---';
        return formatDateToPersian(value);
      },
    },
    {
      header: 'برنامه کلاس‌ها',
      accessor: 'teachers',
      render: (value, item): React.JSX.Element => {
        const teacher = item.teachers?.find((t) => t.days?.length > 0);
        if (!teacher || !teacher.days?.length) {
          return (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              تعریف نشده
            </span>
          );
        }

        return (
          <div className="space-y-1">
            {teacher.days.slice(0, 2).map((day, index) => (
              <div key={index} className="text-xs">
                <span className="font-medium">{day.day_of_week}</span>
                <span className="mr-2 text-gray-500">
                  {day.start_time.substring(0, 5)} -{' '}
                  {day.end_time.substring(0, 5)}
                </span>
              </div>
            ))}
            {teacher.days.length > 2 && (
              <span className="text-xs text-gray-500">
                +{teacher.days.length - 2} روز دیگر
              </span>
            )}
          </div>
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
            { label: 'ترم‌های من', href: '/teacher/terms' },
          ]}
        />

        {/* Header */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              ترم‌های من
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              مشاهده و مدیریت ترم‌های تدریس شما
            </p>
          </div>
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
                    کل ترم‌ها
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {totalTerms.toLocaleString('fa-IR')}
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
                    ترم‌های فعال
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {activeTerms.toLocaleString('fa-IR')}
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
                    کل دانش‌پژوهان
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {totalStudents.toLocaleString('fa-IR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    کل جلسات
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {totalSessions.toLocaleString('fa-IR')} جلسه
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-8">
          <Table
            data={terms}
            columns={columns}
            loading={loading}
            emptyMessage="هیچ ترمی برای شما تعریف نشده است"
            onView={(term) => router.push(`/teacher/terms/${term.id}`)}
          />
        </div>
      </div>
    </main>
  );
}
