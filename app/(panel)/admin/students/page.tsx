'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { Student } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useStudent } from '@/app/lib/hooks/use-student';

export default function Page() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Student | null>(null);
  const {
    studentList,
    loading,
    fetchStudentList,
    deleteStudent,
  } = useStudent();

  useEffect(() => {
    fetchStudentList();
  }, [fetchStudentList]);

  const columns: Column<Student>[] = [
    {
      header: 'نام',
      accessor: 'user',
      render: (value): string => {
        const user = value as any;
        return user?.first_name || '---';
      },
    },
    {
      header: 'نام خانوادگی',
      accessor: 'user',
      render: (value): string => {
        const user = value as any;
        return user?.last_name || '---';
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
        return value as string || '---';
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
      render: (value): string => {
        return value ? `${value}/10` : '---';
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

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          دانش‌آموزان
        </h1>
        <Button onClick={() => router.push('/admin/students/new')}>
          ایجاد دانش‌آموز
        </Button>
      </div>
      <Table
        data={studentList}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ دانش‌آموزی یافت نشد"
        onEdit={(student) => router.push(`/admin/students/${student.user_id}`)}
        onDelete={handleDeleteClick}
        getRowId={(student) => String(student.user_id)}
      />

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
