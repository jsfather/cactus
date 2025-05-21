'use client';

import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteReport } from '@/lib/api/panel/teacher/reports';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import Modal from '@/components/ui/modal';

export function CreateReport() {
  return (
    <Link
      href="/teacher/reports/create"
      className="bg-primary-600 hover:bg-primary-400 focus-visible:outline-primary-400 flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span className="hidden md:block">ساخت گزارش ترم</span>{' '}
      <PlusIcon className="h-5 md:mr-4" />
    </Link>
  );
}


export function DeleteReport({ id }: { id: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteReport(id);
      toast.success('گزارش ترم با موفقیت حذف شد');
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'خطا در حذف گزارش ترم');
      console.error('Failed to delete report:', error);
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-md border border-gray-200 p-2 hover:bg-gray-100"
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="حذف گزارش ترم"
        description="آیا از حذف این گزارش ترم مطمئن هستید؟"
        confirmText="حذف"
        cancelText="انصراف"
        loading={isDeleting}
      />
    </>
  );
}
