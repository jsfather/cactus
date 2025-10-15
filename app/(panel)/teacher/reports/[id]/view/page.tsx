'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  ArrowRight,
  FileText,
  User,
  Calendar,
  Clock,
  Users,
  BookOpen,
} from 'lucide-react';

// UI Components
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Card } from '@/app/components/ui/Card';

// Hooks and Types
import { useReport } from '@/app/lib/hooks/use-report';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const ReportViewPage: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const { fetchReportById, currentReport, loading } = useReport();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParamsData = await params;
      setResolvedParams(resolvedParamsData);

      try {
        await fetchReportById(resolvedParamsData.id);
      } catch (error) {
        toast.error('خطا در بارگذاری اطلاعات گزارش');
        router.push('/teacher/reports');
      }
    };

    resolveParams();
  }, [fetchReportById, router]);

  const breadcrumbItems = [
    { label: 'پنل استاد', href: '/teacher' },
    { label: 'گزارش‌ها', href: '/teacher/reports' },
    {
      label: 'جزئیات گزارش',
      href: `/teacher/reports/${resolvedParams?.id}/view`,
      active: true,
    },
  ];

  const formatDate = (date: string) => {
    return date;
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds
  };

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

  if (!currentReport) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              گزارش یافت نشد
            </h2>
            <Button onClick={() => router.push('/teacher/reports')}>
              <ArrowRight className="ml-2 h-4 w-4" />
              بازگشت به لیست گزارش‌ها
            </Button>
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
              جزئیات گزارش #{currentReport.id}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              مشاهده کامل اطلاعات گزارش جلسه
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="white"
              onClick={() =>
                router.push(`/teacher/reports/${resolvedParams?.id}`)
              }
              className="flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              ویرایش گزارش
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push('/teacher/reports')}
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              بازگشت به لیست
            </Button>
          </div>
        </div>

        {/* Report Information */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  محتوای گزارش
                </h2>
              </div>

              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div className="leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {currentReport.content}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                اطلاعات کلی
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className="mt-1 h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      شناسه گزارش
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      #{currentReport.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      تاریخ ایجاد
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(currentReport.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Teacher Information */}
            {currentReport.teacher && (
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  اطلاعات استاد
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="mt-1 h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        نام و نام خانوادگی
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {currentReport.teacher.first_name}{' '}
                        {currentReport.teacher.last_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="mt-1 h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        نام کاربری
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {currentReport.teacher.username}
                      </p>
                    </div>
                  </div>

                  {currentReport.teacher.email && (
                    <div className="flex items-start gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="mt-1 h-4 w-4 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          ایمیل
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {currentReport.teacher.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Schedule Information */}
            {currentReport.schedule && (
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  اطلاعات جلسه
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-1 h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        تاریخ جلسه
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {formatDate(currentReport.schedule.session_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        زمان جلسه
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {formatTime(currentReport.schedule.start_time)} -{' '}
                        {formatTime(currentReport.schedule.end_time)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BookOpen className="mt-1 h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        تعداد تکالیف
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {currentReport.schedule.homeworks?.length || 0} تکلیف
                      </p>
                    </div>
                  </div>

                  {currentReport.schedule.homeworks &&
                    currentReport.schedule.homeworks.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Users className="mt-1 h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            پاسخ‌های دریافتی
                          </p>
                          <p className="text-gray-900 dark:text-white">
                            {currentReport.schedule.homeworks.reduce(
                              (total, hw) => total + (hw.answers?.length || 0),
                              0
                            )}{' '}
                            پاسخ
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ReportViewPage;
