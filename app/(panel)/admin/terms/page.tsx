'use client';

import { useState, useEffect } from 'react';
import Table from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { getTerms, deleteTerm } from '@/app/lib/api/admin/terms';
import { Term } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Term | null>(null);

  const columns = [
    {
      header: 'عنوان',
      accessor: 'title' as keyof Term,
    },
    {
      header: 'مدت زمان',
      accessor: 'duration' as keyof Term,
    },
    {
      header: 'تعداد جلسات',
      accessor: 'number_of_sessions' as keyof Term,
    },
    {
      header: 'ظرفیت',
      accessor: 'capacity' as keyof Term,
    },
    {
      header: 'سطح',
      accessor: 'level' as keyof Term,
      render: (value: any) => value?.label || '',
    },
    {
      header: 'تاریخ شروع',
      accessor: 'start_date' as keyof Term,
    },
    {
      header: 'تاریخ پایان',
      accessor: 'end_date' as keyof Term,
    },
  ];

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const response = await getTerms();
      if (response) {
        setTerms(response.data);
      }
    } catch (error) {
      toast.error('خطا در دریافت لیست ترم ها');
      setTerms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (term: Term) => {
    setItemToDelete(term);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteTerm(itemToDelete.id);
      toast.success('ترم با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchTerms();
    } catch (error) {
      toast.error('خطا در حذف ترم');
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
    fetchTerms();
  }, []);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ترم ها
        </h1>
        <Button onClick={() => router.push('/admin/terms/new')}>
          ایجاد ترم
        </Button>
      </div>
      <Table
        data={terms}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ ترمی یافت نشد"
        onEdit={(term) => router.push(`/admin/terms/${term.id}`)}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف ترم"
        description={`آیا از حذف ترم "${itemToDelete?.title}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
