'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { Term } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useTerm } from '@/app/lib/hooks/use-term';

export default function Page() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Term | null>(null);
  const {
    termList,
    loading,
    fetchTermList,
    deleteTerm,
  } = useTerm();

  useEffect(() => {
    fetchTermList();
  }, [fetchTermList]);

  const columns: Column<Term>[] = [
    {
      header: 'عنوان ترم',
      accessor: 'title',
    },
    {
      header: 'مدت دوره',
      accessor: 'duration',
      render: (value): string => {
        return `${value} ماه`;
      },
    },
    {
      header: 'تعداد جلسات',
      accessor: 'number_of_sessions',
      render: (value): string => {
        return `${value} جلسه`;
      },
    },
    {
      header: 'سطح',
      accessor: 'level',
      render: (value): string => {
        const level = value as any;
        return level?.name || '---';
      },
    },
    {
      header: 'ظرفیت',
      accessor: 'capacity',
      render: (value): string => {
        return `${value} نفر`;
      },
    },
    {
      header: 'نوع ترم',
      accessor: 'type',
      render: (value): string => {
        const typeMap = {
          normal: 'عادی',
          capacity_completion: 'تکمیل ظرفیت',
          vip: 'VIP',
        };
        return typeMap[value as keyof typeof typeMap] || value as string;
      },
    },
    {
      header: 'تاریخ شروع',
      accessor: 'start_date',
      render: (value): string => {
        if (!value || typeof value !== 'string') return '---';
        return new Date(value).toLocaleDateString('fa-IR');
      },
    },
    {
      header: 'تاریخ پایان',
      accessor: 'end_date',
      render: (value): string => {
        if (!value || typeof value !== 'string') return '---';
        return new Date(value).toLocaleDateString('fa-IR');
      },
    },
  ];

  const handleDeleteClick = (term: Term) => {
    setItemToDelete(term);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteTerm(itemToDelete.id.toString());
      toast.success('ترم با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchTermList();
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

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ترم‌ها
        </h1>
        <Button onClick={() => router.push('/admin/terms/new')}>
          ایجاد ترم
        </Button>
      </div>
      <Table
        data={termList}
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
