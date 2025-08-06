'use client';

import { useState, useEffect } from 'react';
import Table from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import {
  getPanelGuides,
  deletePanelGuide,
} from '@/app/lib/api/admin/panel_guides';
import { PanelGuide } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [panelGuides, setPanelGuides] = useState<PanelGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PanelGuide | null>(null);

  const columns = [
    {
      header: 'عنوان',
      accessor: 'title' as keyof PanelGuide,
    },
    {
      header: 'نوع',
      accessor: 'type' as keyof PanelGuide,
    },
    {
      header: 'توضیحات',
      accessor: 'description' as keyof PanelGuide,
    },
    {
      header: 'تاریخ ایجاد',
      accessor: 'created_at' as keyof PanelGuide,
      render: (value: string | number | null, item: PanelGuide) =>
        value ? new Date(value).toLocaleDateString('fa-IR') : '',
    },
  ];

  const fetchPanelGuides = async () => {
    try {
      setLoading(true);
      const response = await getPanelGuides();
      if (response && response.data) {
        setPanelGuides(response.data);
      } else {
        setPanelGuides([]);
      }
    } catch (error) {
      console.error('Fetch panel guides error:', error);
      toast.error('خطا در دریافت لیست راهنماهای پنل');
      setPanelGuides([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (panelGuide: PanelGuide) => {
    setItemToDelete(panelGuide);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deletePanelGuide(itemToDelete.id);
      toast.success('راهنمای پنل با موفقیت حذف شد');
      
      // Close modal and clear item first
      setShowDeleteModal(false);
      setItemToDelete(null);
      
      // Then refresh the list
      await fetchPanelGuides();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('خطا در حذف راهنمای پنل');
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
    fetchPanelGuides();
  }, []);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          راهنماهای پنل
        </h1>
        <Button onClick={() => router.push('/admin/panel-guides/new')}>
          ایجاد راهنمای پنل
        </Button>
      </div>
      <Table
        data={panelGuides}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ راهنمای پنلی یافت نشد"
        onEdit={(panelGuide) =>
          router.push(`/admin/panel-guides/${panelGuide.id}`)
        }
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف راهنمای پنل"
        description={`آیا از حذف راهنمای پنل "${itemToDelete?.title}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
