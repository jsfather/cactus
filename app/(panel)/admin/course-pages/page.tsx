'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Table, { Column } from '@/app/components/ui/Table';
import { Button } from '@/app/components/ui/Button';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { useCoursePage } from '@/app/lib/hooks/use-course-page';
import { CoursePageContent } from '@/app/lib/types/course';
import { BookOpen, Plus, Eye } from 'lucide-react';

export default function CoursePagesAdminPage() {
  const router = useRouter();
  const { coursePageList, loading, fetchCoursePageList } = useCoursePage();

  useEffect(() => {
    fetchCoursePageList();
  }, [fetchCoursePageList]);

  const columns: Column<CoursePageContent>[] = [
    { header: 'عنوان', accessor: 'title' },
    {
      header: 'ترم مرتبط',
      accessor: 'term_id',
      render: (value) => `ترم #${value}`,
    },
    {
      header: 'وضعیت',
      accessor: 'is_published',
      render: (value) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            value
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
          }`}
        >
          {value ? 'منتشر شده' : 'پیش‌نویس'}
        </span>
      ),
    },
    {
      header: 'امتیاز',
      accessor: 'rating',
      render: (value) => (value ? `${value} ⭐` : '—'),
    },
    {
      header: 'عملیات',
      accessor: 'id',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="info"
            className="h-8 px-3 text-xs"
            onClick={() => router.push(`/admin/course-pages/${row.id}`)}
          >
            ویرایش
          </Button>
          <Button
            variant="secondary"
            className="h-8 px-3 text-xs"
            onClick={() => window.open(`/courses/${row.course_id || row.term_id}`, '_blank')}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'داشبورد', href: '/admin/dashboard' },
          { label: 'صفحات دوره', href: '/admin/course-pages' },
        ]}
      />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold dark:text-white">
            <BookOpen className="h-7 w-7" />
            مدیریت صفحات دوره
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            توضیحات تکمیلی، ویدیو، FAQ، سرفصل و ابزارهای پیشنهادی هر دوره
          </p>
        </div>
        <Button onClick={() => router.push('/admin/course-pages/new')}>
          <Plus className="h-4 w-4" />
          صفحه دوره جدید
        </Button>
      </div>

      <Table data={coursePageList} columns={columns} />
    </main>
  );
}
