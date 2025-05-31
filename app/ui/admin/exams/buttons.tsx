'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteExam } from '@/app/lib/api/admin/exams';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import Modal from '@/app/components/ui/Modal';

export function CreateExam() {
  return (
    <Link
      href="/admin/exams/create"
      className="bg-primary-600 hover:bg-primary-400 focus-visible:outline-primary-400 flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span className="hidden md:block">ساخت آزمون</span>{' '}
      <PlusIcon className="h-5 md:mr-4" />
    </Link>
  );
}

export function UpdateExam({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/exams/${id}/edit`}
      className="rounded-md border border-gray-200 p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteExam({ id }: { id: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteExam(id);
      toast.success('آزمون با موفقیت حذف شد');
      window.location.reload();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطا در حذف آزمون';
      toast.error(errorMessage);
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
        title="حذف آزمون"
        description="آیا از حذف این آزمون مطمئن هستید؟"
        confirmText="حذف"
        cancelText="انصراف"
        loading={isDeleting}
      />
    </>
  );
}
