'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import {
  getOfflineSessions,
  deleteOfflineSession,
} from '@/app/lib/api/teacher/offline_sessions';
import { OfflineSession } from '@/app/lib/types';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import ConfirmModal from '@/app/components/ui/ConfirmModal';

export default function Page() {
  const router = useRouter();
  const [offlineSessions, setOfflineSessions] = useState<OfflineSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<OfflineSession | null>(null);

  const columns: Column<OfflineSession>[] = [
    {
      header: 'عنوان',
      accessor: 'title',
    },
    {
      header: 'ترم',
      accessor: 'term_id',
    },
    {
      header: 'مدرس ترم',
      accessor: 'term_teacher_id',
    },
  ];

  const fetchOfflineSessions = async () => {
    try {
      setLoading(true);
      const response = await getOfflineSessions();
      if (response) {
        setOfflineSessions(response.data);
      }
    } catch (error) {
      toast.error('خطا در دریافت لیست کلاس های آفلاین');
      setOfflineSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (offlineSessions: OfflineSession) => {
    setItemToDelete(offlineSessions);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteOfflineSession(itemToDelete.id);
      toast.success('کلاس آفلاین با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchOfflineSessions();
    } catch (error) {
      toast.error('خطا در حذف کلاس آفلاین');
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
    fetchOfflineSessions();
  }, []);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          کلاس های آفلاین
        </h1>
        <Button onClick={() => router.push('/teacher/offline_sessions/new')}>
          ایجاد کلاس آفلاین
        </Button>
      </div>
      <Table
        data={offlineSessions}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ کلاس آفلاینی یافت نشد"
        onEdit={(offlineSession) =>
          router.push(`/teacher/offline_sessions/${offlineSession.id}`)
        }
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف کلاس آفلاین"
        description={`آیا از حذف کلاس آفلاین "${itemToDelete?.title}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
