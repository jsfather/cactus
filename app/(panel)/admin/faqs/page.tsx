'use client';

import { useState, useEffect } from 'react';
import Table from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { getFAQs, deleteFAQ } from '@/app/lib/api/admin/faqs';
import { FAQ } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FAQ | null>(null);

  const columns = [
    {
      header: 'سوال',
      accessor: 'question' as keyof FAQ,
    },
    {
      header: 'پاسخ',
      accessor: 'answer' as keyof FAQ,
    },
    {
      header: 'تاریخ ایجاد',
      accessor: 'created_at' as keyof FAQ,
      render: (value: string | null, item: FAQ) =>
        value ? new Date(value).toLocaleDateString('fa-IR') : '',
    },
  ];

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await getFAQs();
      if (response) {
        setFAQs(response.data);
      }
    } catch (error) {
      toast.error('خطا در دریافت لیست سوالات متداول');
      setFAQs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (faq: FAQ) => {
    setItemToDelete(faq);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteFAQ(itemToDelete.id);
      toast.success('سوال متداول با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchFAQs();
    } catch (error) {
      toast.error('خطا در حذف سوال متداول');
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
    fetchFAQs();
  }, []);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          سوالات متداول
        </h1>
        <Button onClick={() => router.push('/admin/faqs/new')}>
          ایجاد سوال متداول
        </Button>
      </div>
      <Table
        data={faqs}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ سوال متداولی یافت نشد"
        onEdit={(faq) => router.push(`/admin/faqs/${faq.id}`)}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف سوال متداول"
        description={`آیا از حذف سوال متداول اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
