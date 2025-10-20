'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { Student } from '@/app/lib/types/student';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useTeacherStudent } from '@/app/lib/hooks/use-teacher-student';
import { useTeacherTerm } from '@/app/lib/hooks/use-teacher-term';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import {
  Users,
  UserCheck,
  GraduationCap,
  Phone,
  Eye,
  CalendarDays,
  BookOpen,
} from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Card from '@/app/components/ui/Card';
import { getTeacherTermTypeLabel } from '@/app/lib/types/teacher-term';

export default function TeacherStudentsPage() {
  const router = useRouter();
  const { studentList, loading, pagination, fetchStudentList } =
    useTeacherStudent();
  const { terms, loading: termsLoading, fetchTerms } = useTeacherTerm();

  useEffect(() => {
    fetchStudentList();
    fetchTerms();
  }, [fetchStudentList, fetchTerms]);

  // Calculate summary stats
  const totalStudents = studentList.length;
  const studentsWithLevel = studentList.filter(
    (student) => student.level_id !== null
  ).length;
  const studentsWithProfile = studentList.filter(
    (student) => student.user !== null
  ).length;
  const studentsWithAllergy = studentList.filter(
    (student) => student.has_allergy === 1
  ).length;

  const columns: Column<Student>[] = [
    {
      header: 'نام و نام خانوادگی',
      accessor: 'user',
      render: (value): any => {
        const user = value as Student['user'];
        if (!user) return <span className="text-gray-400">-</span>;
        return (
          <div className="flex items-center">
            {user.profile_picture && (
              <img
                className="ml-3 h-8 w-8 rounded-full"
                src={user.profile_picture}
                alt={`${user.first_name} ${user.last_name}`}
              />
            )}
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user.first_name} {user.last_name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {user.username}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'شماره تماس',
      accessor: 'user',
      render: (value): any => {
        const user = value as Student['user'];
        if (!user?.phone) return <span className="text-gray-400">-</span>;
        return (
          <div className="flex items-center">
            <Phone className="ml-2 h-4 w-4 text-gray-400" />
            <span className="text-sm">{user.phone}</span>
          </div>
        );
      },
    },
    {
      header: 'سطح',
      accessor: 'level_id',
      render: (value): any => {
        if (!value) return <span className="text-gray-400">-</span>;
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            سطح {String(value)}
          </span>
        );
      },
    },
    {
      header: 'نام پدر و مادر',
      accessor: 'father_name',
      render: (_value, row): any => {
        const fatherName = row.father_name;
        const motherName = row.mother_name;
        if (!fatherName && !motherName)
          return <span className="text-gray-400">-</span>;
        return (
          <div className="text-sm">
            {fatherName && <div>پدر: {fatherName}</div>}
            {motherName && <div>مادر: {motherName}</div>}
          </div>
        );
      },
    },
    {
      header: 'تاریخ تولد',
      accessor: 'birth_date',
      render: (value): string => {
        if (!value || typeof value !== 'string') return '-';
        return value;
      },
    },
    {
      header: 'سطح علاقه',
      accessor: 'interest_level',
      render: (value): any => {
        if (!value) return <span className="text-gray-400">-</span>;
        const level = Number(value);
        const color = level >= 70 ? 'green' : level >= 40 ? 'yellow' : 'red';
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              color === 'green'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : color === 'yellow'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}
          >
            {level}%
          </span>
        );
      },
    },
    {
      header: 'سطح تمرکز',
      accessor: 'focus_level',
      render: (value): any => {
        if (!value) return <span className="text-gray-400">-</span>;
        const level = Number(value);
        const color = level >= 70 ? 'green' : level >= 40 ? 'yellow' : 'red';
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              color === 'green'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : color === 'yellow'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}
          >
            {level}%
          </span>
        );
      },
    },
    {
      header: 'حساسیت',
      accessor: 'has_allergy',
      render: (value): any => {
        const hasAllergy = Number(value) === 1;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              hasAllergy
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            }`}
          >
            {hasAllergy ? 'دارد' : 'ندارد'}
          </span>
        );
      },
    },
  ];

  const handleViewStudent = (student: Student) => {
    router.push(`/teacher/students/${student.user_id}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدرس', href: '/teacher' },
          { label: 'دانش‌پژوهان من', href: '/teacher/students', active: true },
        ]}
      />

      <div className="mt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              دانش‌پژوهان من
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              مشاهده و مدیریت دانش‌پژوهان تحت نظر شما
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      کل دانش‌پژوهان
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {totalStudents.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      دارای سطح
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {studentsWithLevel.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      کامل شده
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {studentsWithProfile.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600">
                    <span className="text-xs font-bold text-white">!</span>
                  </div>
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      دارای حساسیت
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {studentsWithAllergy.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Terms Section */}
        <div className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                ترم‌های من
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                برای مشاهده دانش‌پژوهان هر ترم روی ترم مورد نظر کلیک کنید
              </p>
            </div>
          </div>

          {termsLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                </div>
              ))}
            </div>
          ) : terms && terms.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {terms.map((term) => (
                <Card
                  key={term.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {term.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {getTeacherTermTypeLabel(term.type)}
                        </p>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <CalendarDays className="ml-2 h-4 w-4" />
                            <span>
                              {term.start_date} تا {term.end_date}
                            </span>
                          </div>

                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <BookOpen className="ml-2 h-4 w-4" />
                            <span>{term.number_of_sessions} جلسه</span>
                          </div>

                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Users className="ml-2 h-4 w-4" />
                            <span>{term.students.length} دانش‌پژو</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button
                        className="w-full"
                        onClick={() =>
                          router.push(`/teacher/students/term/${term.id}`)
                        }
                      >
                        <Users className="ml-2 h-4 w-4" />
                        مشاهده دانش‌پژوهان ({term.students.length})
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="p-8 text-center">
                <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                  هیچ ترمی یافت نشد
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  شما در حال حاضر در هیچ ترمی فعالیت ندارید.
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* All Students Section */}
        <div className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                تمام دانش‌پژوهان
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                لیست کامل تمام دانش‌پژوهان شما از همه ترم‌ها
              </p>
            </div>
          </div>

          {/* Students Table */}
          <div className="mt-6">
            <Table
              data={studentList}
              columns={columns}
              loading={loading}
              emptyMessage="هیچ دانش‌پژویی یافت نشد"
              onView={handleViewStudent}
              getRowId={(student) => String(student.user_id)}
            />
          </div>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  صفحه {pagination.current_page.toLocaleString('fa-IR')} از{' '}
                  {pagination.last_page.toLocaleString('fa-IR')}
                </span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button
                  variant="secondary"
                  disabled={pagination.current_page === 1}
                  onClick={() => fetchStudentList(pagination.current_page - 1)}
                >
                  قبلی
                </Button>
                <Button
                  variant="secondary"
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() => fetchStudentList(pagination.current_page + 1)}
                >
                  بعدی
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
