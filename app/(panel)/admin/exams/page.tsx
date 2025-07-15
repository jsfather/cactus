'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { getExams, deleteExam } from '@/app/lib/api/admin/exams';
import { getTerms } from '@/app/lib/api/admin/terms';
import { getUsers } from '@/app/lib/api/admin/users';
import { Exam, Term, User } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Exam | null>(null);

  const columns: Column<Exam>[] = [
    {
      header: 'عنوان',
      accessor: 'title',
    },
    {
      header: 'توضیحات',
      accessor: 'description',
    },
    {
      header: 'تاریخ آزمون',
      accessor: 'date',
    },
    {
      header: 'مدت زمان',
      accessor: 'duration',
    },
    {
      header: 'ترم',
      accessor: 'term_id',
      render: (value) => {
        if (!value) return '-';
        const term = terms.find((t) => t.id.toString() === value.toString());
        return term ? term.title : `ترم ${value}`;
      },
    },
    {
      header: 'ایجاد کننده',
      accessor: 'created_by',
      render: (value, item) => {
        if (!value || !item.created_by) return '-';
        
        const name =
          users.find((t) => t.id.toString() === value.toString())?.first_name +
          ' ' +
          users.find((t) => t.id.toString() === value.toString())?.last_name;
        return name;
      },
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsResponse, termsResponse, usersResponse] = await Promise.all([
        getExams(),
        getTerms(),
        getUsers(),
      ]);

      if (examsResponse) {
        setExams(examsResponse.data);
      }
      if (termsResponse) {
        setTerms(termsResponse.data);
      }
      if (usersResponse) {
        setUsers(usersResponse.data);
      }
    } catch (error) {
      toast.error('خطا در دریافت اطلاعات');
      setExams([]);
      setTerms([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (exam: Exam) => {
    setItemToDelete(exam);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteExam(itemToDelete.id);
      toast.success('آزمون با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchData();
    } catch (error) {
      toast.error('خطا در حذف آزمون');
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
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          آزمون ها
        </h1>
        <Button onClick={() => router.push('/admin/exams/new')}>
          ایجاد آزمون
        </Button>
      </div>
      <Table
        data={exams}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ آزمونی یافت نشد"
        onEdit={(exam) => router.push(`/admin/exams/${exam.id}`)}
        onDelete={handleDeleteClick}
        actions={() => (
          <button
            onClick={() => {
              // TODO: Implement declare exam questions functionality
              toast('قابلیت تعریف سوالات آزمون به زودی اضافه خواهد شد');
            }}
            className="rounded-md bg-green-50 p-2 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
            title="تعریف سوالات آزمون"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
              />
            </svg>
          </button>
        )}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف آزمون"
        description={`آیا از حذف آزمون "${itemToDelete?.title}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
