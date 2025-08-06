'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { getStudents, deleteStudent } from '@/app/lib/api/admin/students';
import { Student } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Student | null>(null);

  const columns: Column<Student>[] = [
    {
      header: 'نام',
      accessor: 'user',
      render: (value, item: Student) => item.user?.first_name || '---',
    },
    {
      header: 'نام خانوادگی',
      accessor: 'user',
      render: (value, item: Student) => item.user?.last_name || '---',
    },
    {
      header: 'تاریخ تولد',
      accessor: 'birth_date',
      render: (value, item: Student) => item.birth_date || '---',
    },
  ];

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudents();
      if (response) {
        setStudents(response.data);
      }
    } catch (error) {
      toast.error('خطا در دریافت لیست دانش‌آموزان');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (student: Student) => {
    setItemToDelete(student);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteStudent(itemToDelete.user_id);
      toast.success('دانش‌آموز با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchStudents();
    } catch (error) {
      toast.error('خطا در حذف دانش‌آموز');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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
        data={students}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ دانش‌آموزی یافت نشد"
        onEdit={(student) => router.push(`/admin/students/${student.user_id}`)}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف دانش‌آموز"
        description={`آیا از حذف دانش‌آموز "${itemToDelete?.user.first_name} ${itemToDelete?.user.last_name}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
