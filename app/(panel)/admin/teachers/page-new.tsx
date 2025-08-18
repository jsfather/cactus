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
      header: 'بیوگرافی',
      accessor: 'bio',
      render: (value): string => {
        const bio = value as string;
        return bio ? (bio.length > 50 ? bio.substring(0, 50) + '...' : bio) : '---';
      },
    },
    {
      header: 'تاریخ تولد',
      accessor: 'birth_date',
      render: (value): string => {
        if (!value || typeof value !== 'string') return '---';
        return new Date(value).toLocaleDateString('fa-IR');
      },
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
      toast.success('مربی با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchTeacherList();
    } catch (error) {
      toast.error('خطا در حذف مربی');
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
          مربیان
        </h1>
        <Button onClick={() => router.push('/admin/teachers/new')}>
          ایجاد مربی
        </Button>
      </div>
      <Table
        data={teacherList}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ مربی‌ای یافت نشد"
        onEdit={(teacher) => router.push(`/admin/teachers/${teacher.user_id}`)}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف مربی"
        description={`آیا از حذف مربی "${itemToDelete?.user?.first_name} ${itemToDelete?.user?.last_name}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
