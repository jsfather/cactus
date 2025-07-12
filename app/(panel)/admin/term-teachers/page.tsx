'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { getTermTeachers, deleteTermTeacher } from '@/app/lib/api/admin/term-teachers';
import { TermTeacher } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [termTeachers, setTermTeachers] = useState<TermTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TermTeacher | null>(null);

  const columns: Column<TermTeacher>[] = [
    {
      header: 'نام مدرس',
      accessor: 'user',
      render: (value, item: TermTeacher) => 
        item.user ? 
          `${item.user.first_name || ''} ${item.user.last_name || ''}`.trim() || '---' 
          : '---',
    },
    {
      header: 'شناسه ترم',
      accessor: 'term_id',
      render: (value, item: TermTeacher) => item.term_id || '---',
    },
    {
      header: 'شناسه مدرس',
      accessor: 'teacher_id',
      render: (value, item: TermTeacher) => item.teacher_id || '---',
    },
    {
      header: 'تاریخ ایجاد',
      accessor: 'created_at',
      render: (value, item: TermTeacher) => {
        if (!item.created_at) return '---';
        return new Date(item.created_at).toLocaleDateString('fa-IR');
      },
    },
    {
      header: 'تعداد جلسات',
      accessor: 'schedules',
      render: (value, item: TermTeacher) => item.schedules?.length || 0,
    },
  ];

  const fetchTermTeachers = async () => {
    try {
      setLoading(true);
      const termTeachers = await getTermTeachers();
      setTermTeachers(termTeachers);
    } catch (error) {
      toast.error('خطا در دریافت لیست ترم مدرسین');
      setTermTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (termTeacher: TermTeacher) => {
    setItemToDelete(termTeacher);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteTermTeacher(itemToDelete.id);
      toast.success('ترم مدرس با موفقیت حذف شد');
      await fetchTermTeachers();
    } catch (error) {
      toast.error('خطا در حذف ترم مدرس');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
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
          ایجاد ترم مدرس جدید
        </Button>
      </div>

      <Table
        data={termTeachers}
        columns={columns}
        loading={loading}
        onEdit={(item) => router.push(`/admin/term-teachers/${item.id}`)}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="حذف ترم مدرس"
        message="آیا از حذف این ترم مدرس اطمینان دارید؟"
        loading={deleteLoading}
      />
    </div>
  );
}
