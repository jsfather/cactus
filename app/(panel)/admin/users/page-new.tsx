'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { User } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/lib/hooks/use-user';

export default function Page() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<User | null>(null);
  const {
    userList,
    loading,
    fetchUserList,
    deleteUser,
  } = useUser();

  useEffect(() => {
    fetchUserList();
  }, [fetchUserList]);

  const columns: Column<User>[] = [
    {
      header: 'نام',
      accessor: 'first_name',
    },
    {
      header: 'نام خانوادگی',
      accessor: 'last_name',
    },
    {
      header: 'تلفن همراه',
      accessor: 'phone',
    },
    {
      header: 'ایمیل',
      accessor: 'email',
    },
    {
      header: 'کد ملی',
      accessor: 'national_code',
    },
    {
      header: 'نقش',
      accessor: 'role',
      render: (value): string => {
        const roleMap = {
          admin: 'مدیر',
          teacher: 'مربی',
          student: 'دانش‌پژوه',
        };
        return roleMap[value as keyof typeof roleMap] || (value as string);
      },
    },
  ];

  const handleDeleteClick = (user: User) => {
    setItemToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteUser(itemToDelete.id.toString());
      toast.success('کاربر با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchUserList();
    } catch (error) {
      toast.error('خطا در حذف کاربر');
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
          کاربران
        </h1>
        <Button onClick={() => router.push('/admin/users/new')}>
          ایجاد کاربر
        </Button>
      </div>
      <Table
        data={userList}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ کاربری یافت نشد"
        onEdit={(user) => router.push(`/admin/users/${user.id}`)}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف کاربر"
        description={`آیا از حذف کاربر "${itemToDelete?.first_name} ${itemToDelete?.last_name}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
