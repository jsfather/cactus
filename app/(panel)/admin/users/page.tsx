'use client';

import { useState, useEffect } from 'react';
import Table from '@/app/components/ui/Table';
import { toast } from 'react-toastify';
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
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      if (response && response.data) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('خطا در دریافت لیست کاربران');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserList = async () => {
    try {
      const response = await getUsers();
      if (response && response.data) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error refreshing users:', error);
      toast.error('خطا در بروزرسانی لیست کاربران');
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
      
      // نمایش پیام موفقیت
      toast.success(`کاربر "${itemToDelete.first_name} ${itemToDelete.last_name}" با موفقیت حذف شد`);
      
      // بستن مدال
      closeDeleteModal();
      
      // بروزرسانی لیست کاربران بدون loading
      await refreshUserList();
      
    } catch (error: any) {
      console.error('Error deleting user:', error);
      const errorMessage = error?.message || 'خطا در حذف کاربر';
      toast.error(errorMessage);
      
      // در صورت خطا هم مدال رو ببند
      closeDeleteModal();
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
    setDeleteLoading(false); // اطمینان از reset شدن loading state
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
    setDeleteLoading(false);
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
