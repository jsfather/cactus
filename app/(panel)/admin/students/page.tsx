'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Table, { Column } from '@/app/components/ui/Table';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import SearchFilters, { SearchFilter } from '@/app/components/ui/SearchFilters';
import { Student } from '@/app/lib/types';
import { useStudent } from '@/app/lib/hooks/use-student';
import { StudentSearchFilters } from '@/app/lib/services/student.service';
import {
  Plus,
  Users,
  UserCheck,
  Phone,
  GraduationCap,
  Eye,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
} from 'lucide-react';

// Search filter configuration
const searchFiltersConfig: SearchFilter[] = [
  {
    key: 'first_name',
    label: 'نام',
    placeholder: 'جستجو بر اساس نام...',
    type: 'text',
  },
  {
    key: 'last_name',
    label: 'نام خانوادگی',
    placeholder: 'جستجو بر اساس نام خانوادگی...',
    type: 'text',
  },
  {
    key: 'username',
    label: 'نام کاربری',
    placeholder: 'جستجو بر اساس نام کاربری...',
    type: 'text',
  },
  {
    key: 'phone',
    label: 'شماره موبایل',
    placeholder: 'جستجو بر اساس شماره موبایل...',
    type: 'tel',
    convertNumbers: true,
  },
];

export default function StudentsPage() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Student | null>(null);

  const {
    studentList,
    loading,
    pagination,
    searchFilters,
    fetchStudentList,
    deleteStudent,
    clearError,
  } = useStudent();

  useEffect(() => {
    fetchStudentList();
  }, [fetchStudentList]);

  // Handle search with filters
  const handleSearch = useCallback(
    (filters: Record<string, string>) => {
      const searchFilters: StudentSearchFilters = {
        first_name: filters.first_name,
        last_name: filters.last_name,
        username: filters.username,
        phone: filters.phone,
      };
      fetchStudentList(1, 15, searchFilters);
    },
    [fetchStudentList]
  );

  // Handle pagination with current filters
  const handlePageChange = useCallback(
    (page: number) => {
      fetchStudentList(page, 15, searchFilters);
    },
    [fetchStudentList, searchFilters]
  );

  // Calculate summary statistics from current page
  const totalStudents = pagination?.total ?? studentList.length;
  const studentsWithInfo = studentList.filter(
    (student) =>
      student.father_name && student.mother_name && student.birth_date
  ).length;
  const studentsWithAllergy = studentList.filter(
    (student) => student.has_allergy === 1
  ).length;
  const averageInterest =
    studentList.filter((s) => s.interest_level).length > 0
      ? Math.round(
          studentList.reduce((sum, s) => sum + (s.interest_level || 0), 0) /
            studentList.filter((s) => s.interest_level).length
        )
      : 0;

  const columns: Column<Student>[] = [
    {
      header: 'نام و نام خانوادگی',
      accessor: 'user',
      render: (value): string => {
        const user = value as any;
        return (
          `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || '---'
        );
      },
    },
    {
      header: 'نام کاربری',
      accessor: 'user',
      render: (value): string => {
        const user = value as any;
        return user?.username || '---';
      },
    },
    {
      header: 'تلفن همراه',
      accessor: 'user',
      render: (value): string => {
        const user = value as any;
        return user?.phone || '---';
      },
    },
    {
      header: 'نام پدر',
      accessor: 'father_name',
      render: (value): string => {
        return (value as string) || '---';
      },
    },
    {
      header: 'تاریخ تولد',
      accessor: 'birth_date',
      render: (value): string => {
        return value ? String(value) : '---';
      },
    },
    {
      header: 'سطح علاقه',
      accessor: 'interest_level',
      render: (value): React.JSX.Element => {
        if (!value) return <span className="text-gray-400">---</span>;
        const level = Number(value);
        const colorClass =
          level >= 70
            ? 'text-green-600 dark:text-green-400'
            : level >= 40
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-red-600 dark:text-red-400';
        return <span className={colorClass}>{level}</span>;
      },
    },
    {
      header: 'آلرژی',
      accessor: 'has_allergy',
      render: (value): React.JSX.Element => {
        const hasAllergy = Number(value) === 1;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
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

  const handleDeleteClick = (student: Student) => {
    setItemToDelete(student);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteStudent(itemToDelete.user_id.toString());
      toast.success('دانش‌پژوه با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      // Stay on current page after deletion with current filters
      await fetchStudentList(pagination?.current_page ?? 1, 15, searchFilters);
    } catch (error) {
      toast.error('خطا در حذف دانش‌پژوه');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTimeout(() => {
      setItemToDelete(null);
    }, 500);
  };

  if (loading && studentList.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'دانش‌پژوهان', href: '/admin/students' },
        ]}
      />

      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          مدیریت دانش‌پژوهان
        </h1>
        <Button
          onClick={() => router.push('/admin/students/new')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          افزودن دانش‌پژوه
        </Button>
      </div>

      {/* Search Filters */}
      <SearchFilters
        filters={searchFiltersConfig}
        onSearch={handleSearch}
        loading={loading}
        initialValues={searchFilters as Record<string, string>}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="mr-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  کل دانش‌پژوهان
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {totalStudents.toLocaleString('fa-IR')}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="mr-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  با اطلاعات کامل
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {studentsWithInfo.toLocaleString('fa-IR')}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Phone className="h-6 w-6 text-red-600" />
            </div>
            <div className="mr-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  دارای آلرژی
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {studentsWithAllergy.toLocaleString('fa-IR')}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>
            <div className="mr-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  میانگین علاقه
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {averageInterest.toLocaleString('fa-IR')}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <Table
          data={studentList}
          columns={columns}
          loading={loading}
          emptyMessage="هیچ دانش‌پژوهی یافت نشد"
          onView={(student) =>
            router.push(`/admin/students/${student.user_id}/view`)
          }
          onEdit={(student) =>
            router.push(`/admin/students/${student.user_id}`)
          }
          onDelete={handleDeleteClick}
          getRowId={(student) => String(student.user_id)}
        />

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex flex-col items-center justify-center border-t border-gray-200 bg-white px-4 py-4 sm:px-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.current_page === 1}
                onClick={() => handlePageChange(1)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                title="اولین صفحه"
              >
                <ChevronsRight className="h-5 w-5" />
              </button>
              <button
                disabled={pagination.current_page === 1}
                onClick={() => handlePageChange(pagination.current_page - 1)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                title="صفحه قبل"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                  .filter((page) => {
                    const current = pagination.current_page;
                    return (
                      page === 1 ||
                      page === pagination.last_page ||
                      (page >= current - 1 && page <= current + 1)
                    );
                  })
                  .map((page, index, array) => (
                    <span key={page} className="flex items-center">
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`min-w-[2.5rem] rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          pagination.current_page === page
                            ? 'bg-primary-600 dark:bg-primary-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page.toLocaleString('fa-IR')}
                      </button>
                    </span>
                  ))}
              </div>

              <button
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => handlePageChange(pagination.current_page + 1)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                title="صفحه بعد"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => handlePageChange(pagination.last_page)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                title="آخرین صفحه"
              >
                <ChevronsLeft className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              نمایش{' '}
              {(
                (pagination.current_page - 1) * pagination.per_page +
                1
              ).toLocaleString('fa-IR')}{' '}
              تا{' '}
              {Math.min(
                pagination.current_page * pagination.per_page,
                pagination.total
              ).toLocaleString('fa-IR')}{' '}
              از {pagination.total.toLocaleString('fa-IR')} دانش‌پژوه
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف دانش‌پژوه"
        description={`آیا از حذف دانش‌پژوه "${itemToDelete?.user?.first_name} ${itemToDelete?.user?.last_name}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
