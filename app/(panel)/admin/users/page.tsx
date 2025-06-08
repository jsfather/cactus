'use client';

import { useState, useEffect } from 'react';
import Table from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { getUsers, deleteUser } from '@/app/lib/api/admin/users';
import { User } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<User | null>(null);

  const columns = [
    {
      header: 'نام',
      accessor: 'first_name' as keyof User,
    },
    {
      header: 'نام خانوادگی',
      accessor: 'last_name' as keyof User,
    },
    {
      header: 'تلفن همراه',
      accessor: 'phone' as keyof User,
    },
    {
      header: 'ایمیل',
      accessor: 'email' as keyof User,
    },
    {
      header: 'کد ملی',
      accessor: 'national_code' as keyof User,
    },
    {
      header: 'تاریخ ایجاد',
      accessor: 'created_at' as keyof User,
      render: (value: string | null, item: User) =>
        value ? new Date(value).toLocaleDateString('fa-IR') : '',
    },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      if (response) {
        setUsers(response.data);
      }
    } catch (error) {
      toast.error('خطا در دریافت لیست کاربران');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setItemToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteUser(itemToDelete.id);
      toast.success('کاربر با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchUsers();
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

  useEffect(() => {
    fetchUsers();
  }, []);

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
        data={users}
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
        description={`آیا از حذف کاربر "${itemToDelete?.first_name + ' ' + itemToDelete?.last_name}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
