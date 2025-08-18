'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { Teacher } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useTeacher } from '@/app/lib/hooks/use-teacher';

export default function Page() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Teacher | null>(null);
  
  const {
    teacherList,
    loading,
    fetchTeacherList,
    deleteTeacher,
  } = useTeacher();

  useEffect(() => {
    fetchTeacherList();
  }, [fetchTeacherList]);

  const columns: Column<Teacher>[] = [
    {
      header: 'نام',
      accessor: 'user',
      render: (value, item: Teacher) => item.user?.first_name || '---',
    },
    {
      header: 'نام خانوادگی',
      accessor: 'user',
      render: (value, item: Teacher) => item.user?.last_name || '---',
    },
  ];

  const handleDeleteClick = (teacher: Teacher) => {
    setItemToDelete(teacher);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteTeacher(itemToDelete.user_id.toString());
      toast.success('مدرس با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchTeacherList();
    } catch (error) {
      toast.error('خطا در حذف مدرس');
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
          مدرسین
        </h1>
        <Button onClick={() => router.push('/admin/teachers/new')}>
          ایجاد مدرس
        </Button>
      </div>
      <Table<Teacher>
        data={teacherList}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ مدرسی یافت نشد"
        onEdit={(teacher) => router.push(`/admin/teachers/${teacher.user_id}`)}
        onDelete={handleDeleteClick}
        getRowId={(teacher) => teacher.user_id.toString()}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف مدرس"
        description={`آیا از حذف مدرس "${itemToDelete?.user.first_name} ${itemToDelete?.user.last_name}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
