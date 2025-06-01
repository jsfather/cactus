'use client';

import { useState, useEffect } from 'react';
import Table , {Column} from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { getReports , deleteReport } from '@/app/lib/api/teacher/reports';
import { Report } from '@/app/lib/types';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import ConfirmModal from '@/app/components/ui/ConfirmModal';


export default function Page() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Report | null>(null);

  const columns: Column<Report>[] = [
    {
      header: 'ترم',
      accessor: 'term_id',
    },
    {
      header: 'محتوا',
      accessor: 'content',
    },
  ];

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getReports();
      if (response) {
        setReports(response.data);
      }
    } catch (error) {
      toast.error('خطا در دریافت لیست گزارش ها');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (report: Report) => {
    setItemToDelete(report);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteReport(itemToDelete.id);
      toast.success('گزارش با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchReports();
    } catch (error) {
      toast.error('خطا در حذف گزارش');
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
    fetchReports();
  }, []);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          گزارش ها
        </h1>
        <Button onClick={() => router.push('/teacher/reports/new')}>
          ایجاد گزارش
        </Button>
      </div>
      <Table
        data={reports}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ گزارشی یافت نشد"
        onEdit={(report) => router.push(`/teacher/reports/${report.id}`)}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف گزارش"
        description={`آیا از حذف گزارش اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
