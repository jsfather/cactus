'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Table, { Column } from '@/app/components/ui/Table';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Student } from '@/app/lib/types';
import { useStudent } from '@/app/lib/hooks/use-student';
import { Plus, Users, UserCheck, Phone, GraduationCap, Eye } from 'lucide-react';

export default function StudentsPage() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Student | null>(null);

  const { studentList, loading, fetchStudentList, deleteStudent, clearError } =
    useStudent();

  useEffect(() => {
    fetchStudentList();
  }, [fetchStudentList]);

  // Calculate summary statistics
  const totalStudents = studentList.length;
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
      toast.success('دانش‌آموز با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchStudentList();
    } catch (error) {
      toast.error('خطا در حذف دانش‌آموز');
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
          { label: 'دانش‌آموزان', href: '/admin/students' },
        ]}
      />

      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          مدیریت دانش‌آموزان
        </h1>
        <Button
          onClick={() => router.push('/admin/students/new')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          افزودن دانش‌آموز
        </Button>
      </div>

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
                  کل دانش‌آموزان
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
          emptyMessage="هیچ دانش‌آموزی یافت نشد"
          onView={(student) =>
            router.push(`/admin/students/${student.user_id}/view`)
          }
          onEdit={(student) =>
            router.push(`/admin/students/${student.user_id}`)
          }
          onDelete={handleDeleteClick}
          getRowId={(student) => String(student.user_id)}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف دانش‌آموز"
        description={`آیا از حذف دانش‌آموز "${itemToDelete?.user?.first_name} ${itemToDelete?.user?.last_name}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
