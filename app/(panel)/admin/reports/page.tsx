'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Report } from '@/lib/types/report';
import { useAdminReport } from '@/app/lib/hooks/use-admin-report';
import { useTerm } from '@/app/lib/hooks/use-term';
import { FileText, Calendar, User, Clock, Eye, X } from 'lucide-react';
import Select from '@/app/components/ui/Select';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { Button } from '@/app/components/ui/Button';

export default function AdminReportsPage() {
  const [selectedTermId, setSelectedTermId] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { reports, loading, fetchReports } = useAdminReport();
  const { termList, loading: termsLoading, fetchTermList } = useTerm();

  useEffect(() => {
    fetchTermList();
  }, [fetchTermList]);

  useEffect(() => {
    if (selectedTermId) {
      fetchReports({ term_id: parseInt(selectedTermId) });
    } else {
      fetchReports();
    }
  }, [selectedTermId, fetchReports]);

  // Calculate summary statistics
  const totalReports = reports.length;
  const recentReports = reports.filter((report) => {
    const reportDate = new Date(report.created_at);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return reportDate >= oneWeekAgo;
  }).length;
  const totalSchedules = new Set(reports.map((report) => report.schedule?.id))
    .size;
  const uniqueTeachers = new Set(
    reports.filter((r) => r.teacher).map((report) => report.teacher?.id)
  ).size;

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
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
        return content.length > 80 ? `${content.substring(0, 80)}...` : content;
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
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {teacher.email}
            </span>
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
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-white">
              {term.title}
            </span>
            {term.level && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                سطح: {term.level.name}
              </span>
            )}
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
            <span className="text-sm text-gray-900 dark:text-white">
              {schedule.session_date}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {schedule.start_time} - {schedule.end_time}
            </span>
          </div>
        );
      },
    },
    {
      header: 'تاریخ ایجاد',
      accessor: 'created_at',
    },
    {
      header: 'عملیات',
      accessor: 'id',
      render: (value, item): React.JSX.Element => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewReport(item)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title="مشاهده جزئیات"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  const breadcrumbItems = [
    { label: 'داشبورد', href: '/admin' },
    { label: 'گزارشات', href: '/admin/reports' },
  ];

  const termOptions = [
    { value: '', label: 'همه ترم‌ها' },
    ...termList.map((term) => ({
      value: term.id.toString(),
      label: term.title,
    })),
  ];

  if (loading && reports.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs breadcrumbs={breadcrumbItems} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          مدیریت گزارشات
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                کل گزارشات
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {totalReports}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                گزارشات هفته اخیر
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {recentReports}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                تعداد جلسات
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {totalSchedules}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                تعداد مدرسان
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {uniqueTeachers}
              </p>
            </div>
            <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
              <User className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Select
            id="term-filter"
            label="فیلتر بر اساس ترم"
            value={selectedTermId}
            onChange={(e) => setSelectedTermId(e.target.value)}
            options={termOptions}
            disabled={termsLoading}
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="rounded-lg bg-white shadow dark:bg-gray-800">
        <Table
          columns={columns}
          data={reports}
          emptyMessage="هیچ گزارشی یافت نشد"
        />
      </div>

      {/* Report Detail Modal */}
      {showModal && selectedReport && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              جزئیات گزارش #{selectedReport.id}
            </h2>

            <div className="space-y-6">
              {/* Report Info */}
              <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-2 dark:bg-gray-900">
                {selectedReport.teacher && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      استاد
                    </p>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {selectedReport.teacher.first_name}{' '}
                      {selectedReport.teacher.last_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedReport.teacher.email}
                    </p>
                  </div>
                )}

                {selectedReport.term && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      ترم
                    </p>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {selectedReport.term.title}
                    </p>
                    {selectedReport.term.level && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        سطح: {selectedReport.term.level.name}
                      </p>
                    )}
                  </div>
                )}

                {selectedReport.schedule && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      تاریخ و زمان جلسه
                    </p>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {selectedReport.schedule.session_date}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedReport.schedule.start_time} -{' '}
                      {selectedReport.schedule.end_time}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    تاریخ ایجاد
                  </p>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {selectedReport.created_at}
                  </p>
                </div>
              </div>

              {/* Report Content */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                  محتوای گزارش
                </h3>
                <div className="prose prose-sm dark:prose-invert max-w-none rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                  <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>
                    {selectedReport.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Homeworks if available */}
              {selectedReport.schedule?.homeworks &&
                selectedReport.schedule.homeworks.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                      تکالیف جلسه
                    </h3>
                    <div className="space-y-3">
                      {selectedReport.schedule.homeworks.map((homework) => (
                        <div
                          key={homework.id}
                          className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                        >
                          <p className="mb-2 font-medium text-gray-900 dark:text-white">
                            تکلیف #{homework.id}
                          </p>
                          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                            {homework.description}
                          </p>
                          {homework.answers && homework.answers.length > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              تعداد پاسخ‌ها: {homework.answers.length}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Close Button */}
              <div className="flex justify-end">
                <Button onClick={handleCloseModal} variant="secondary">
                  بستن
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
