'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { getTermStudents, deleteTermStudent } from '@/app/lib/api/admin/term-students';
import { TermStudent } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [termStudents, setTermStudents] = useState<TermStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TermStudent | null>(null);

  const columns: Column<TermStudent>[] = [
    {
      header: 'نام دانش پژوه',
      accessor: 'user',
      render: (value, item: TermStudent) => 
        item.user ? 
          `${item.user.first_name || ''} ${item.user.last_name || ''}`.trim() || '---' 
          : '---',
    },
    {
      header: 'ایمیل',
      accessor: 'user',
      render: (value, item: TermStudent) => item.user?.email || '---',
    },
    {
      header: 'شناسه ترم',
      accessor: 'term_id',
      render: (value, item: TermStudent) => item.term_id || '---',
    },
    {
      header: 'شناسه دانش پژوه',
      accessor: 'student_id',
      render: (value, item: TermStudent) => item.student_id || '---',
    },
    {
      header: 'تاریخ ثبت نام',
      accessor: 'created_at',
      render: (value, item: TermStudent) => {
        if (!item.created_at) return '---';
        return new Date(item.created_at).toLocaleDateString('fa-IR');
      },
    },
  ];

  const fetchTermStudents = async () => {
    try {
      setLoading(true);
      const termStudents = await getTermStudents();
      setTermStudents(termStudents);
    } catch (error) {
      toast.error('خطا در دریافت لیست ترم دانش پژوهان');
      setTermStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (termStudent: TermStudent) => {
    setItemToDelete(termStudent);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteTermStudent(itemToDelete.id);
      toast.success('ترم دانش پژوه با موفقیت حذف شد');
      await fetchTermStudents();
    } catch (error) {
      toast.error('خطا در حذف ترم دانش پژوه');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  useEffect(() => {
    fetchTermStudents();
  }, []);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ترم دانش پژوهان
        </h1>
        <Button onClick={() => router.push('/admin/term-students/new')}>
          ایجاد ترم دانش پژوه جدید
        </Button>
      </div>

      <Table
        data={termStudents}
        columns={columns}
        loading={loading}
        onEdit={(item) => router.push(`/admin/term-students/${item.id}`)}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="حذف ترم دانش پژوه"
        message="آیا از حذف این ترم دانش پژوه اطمینان دارید؟"
        loading={deleteLoading}
      />
    </div>
  );
}
