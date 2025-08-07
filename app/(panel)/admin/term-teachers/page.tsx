'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import Table from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { getTermTeachers, deleteTermTeacher } from '@/app/lib/api/admin/term-teachers';
import { SessionRecord } from '@/app/lib/types/term_teacher';
import ConfirmModal from '@/app/components/ui/ConfirmModal';

export default function Page() {
  const router = useRouter();
  const [termTeachers, setTermTeachers] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SessionRecord | null>(null);

  const columns = [
    {
      header: 'نام مدرس',
      accessor: 'id' as keyof SessionRecord,
      render: (item: SessionRecord) => 
        item.user ? `${item.user.first_name} ${item.user.last_name}` : 'نامشخص',
    },
    {
      header: 'نام ترم',
      accessor: 'id' as keyof SessionRecord,
      render: (item: SessionRecord) => item.term?.title || item.term?.name || 'تعریف نشده',
    },
  ];

  const fetchTermTeachers = async () => {
    try {
      setLoading(true);
      const response = await getTermTeachers();
      if (response && response.data) {
        console.log('API Response:', response.data);
        console.log('First item structure:', response.data[0]);
        setTermTeachers(response.data);
      } else {
        setTermTeachers([]);
      }
    } catch (error) {
      console.error('Error fetching term teachers:', error);
      toast.error('خطا در دریافت لیست ترم مدرسین');
      setTermTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshTermTeacherList = async () => {
    try {
      const response = await getTermTeachers();
      if (response && response.data) {
        setTermTeachers(response.data);
      } else {
        setTermTeachers([]);
      }
    } catch (error) {
      console.error('Error refreshing term teachers:', error);
      toast.error('خطا در بروزرسانی لیست ترم مدرسین');
    }
  };

  const handleDeleteClick = (termTeacher: SessionRecord) => {
    setItemToDelete(termTeacher);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteTermTeacher(itemToDelete.id);

      // نمایش پیام موفقیت
      toast.success(
        `ترم مدرس "${itemToDelete.user?.first_name || 'نامشخص'} ${itemToDelete.user?.last_name || ''}" با موفقیت حذف شد`
      );

      // بستن مدال
      closeDeleteModal();

      // بروزرسانی لیست بدون loading
      await refreshTermTeacherList();
    } catch (error: any) {
      console.error('Error deleting term teacher:', error);
      const errorMessage = error?.message || 'خطا در حذف ترم مدرس';
      toast.error(errorMessage);

      // در صورت خطا هم مدال رو ببند
      closeDeleteModal();
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
    setDeleteLoading(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
    setDeleteLoading(false);
  };

  useEffect(() => {
    fetchTermTeachers();
  }, []);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ترم مدرسین
        </h1>
        <Button onClick={() => router.push('/admin/term-teachers/new')}>
          ایجاد ترم مدرس
        </Button>
      </div>
      
      <Table
        data={termTeachers}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ ترم مدرسی یافت نشد"
        onEdit={(termTeacher) => router.push(`/admin/term-teachers/${termTeacher.id}`)}
        onDelete={handleDeleteClick}
        onView={(termTeacher) => router.push(`/admin/term-teachers/${termTeacher.id}/view`)}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف ترم مدرس"
        description={`آیا از حذف ترم مدرس "${(itemToDelete?.user?.first_name || 'نامشخص') + ' ' + (itemToDelete?.user?.last_name || '')}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
