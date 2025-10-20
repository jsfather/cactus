'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { 
  Calendar, 
  Users, 
  Clock, 
  BookOpen 
} from 'lucide-react';

// New implementation
import { useTermTeacher } from '@/app/lib/hooks/use-term-teacher';
import { TermTeacher } from '@/app/lib/types/term_teacher';

export default function Page() {
  const router = useRouter();
  const {
    termTeacherList,
    loading,
    error,
    fetchTermTeacherList,
    deleteTermTeacher,
    clearError,
  } = useTermTeacher();

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TermTeacher | null>(null);

  const columns: Column<TermTeacher>[] = [
    {
      header: 'نام مدرس',
      accessor: 'user',
      render: (value: any, item: TermTeacher) => {
        if (!item.user) return 'نامشخص';
        return `${item.user.first_name || ''} ${item.user.last_name || ''}`.trim();
      },
    },
    {
      header: 'شماره تماس',
      accessor: 'user',
      render: (value: any, item: TermTeacher) => item.user?.phone || 'ندارد',
    },
    {
      header: 'ترم',
      accessor: 'term',
      render: (value: any, item: TermTeacher) => item.term?.title || 'بدون ترم',
    },
    {
      header: 'سطح',
      accessor: 'term',
      render: (value: any, item: TermTeacher) => {
        if (!item.term?.level) return 'نامشخص';
        return `${item.term.level.name} (${item.term.level.label})`;
      },
    },
    {
      header: 'تعداد جلسات',
      accessor: 'schedules',
      render: (value: any, item: TermTeacher) => item.schedules?.length || 0,
    },
    {
      header: 'تعداد روزهای تدریس',
      accessor: 'days',
      render: (value: any, item: TermTeacher) => item.days?.length || 0,
    },
  ];

  // Summary stats
  const stats = [
    {
      name: 'کل ترم مدرسین',
      value: termTeacherList.length,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'ترم‌های فعال',
      value: termTeacherList.filter(item => item.term).length,
      icon: BookOpen,
      color: 'bg-green-500',
    },
    {
      name: 'کل جلسات',
      value: termTeacherList.reduce((sum, item) => sum + (item.schedules?.length || 0), 0),
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      name: 'میانگین جلسات',
      value: termTeacherList.length > 0 
        ? Math.round(termTeacherList.reduce((sum, item) => sum + (item.schedules?.length || 0), 0) / termTeacherList.length)
        : 0,
      icon: Clock,
      color: 'bg-orange-500',
    },
  ];

  const handleDeleteClick = (termTeacher: TermTeacher) => {
    setItemToDelete(termTeacher);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteTermTeacher(itemToDelete.id.toString());

      toast.success(
        `ترم مدرس "${itemToDelete.user?.first_name || 'نامشخص'} ${itemToDelete.user?.last_name || ''}" با موفقیت حذف شد`
      );

      closeDeleteModal();
    } catch (error: any) {
      console.error('Error deleting term teacher:', error);
      toast.error(`خطا در حذف ترم مدرس: ${error.message || 'خطای نامشخص'}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    closeDeleteModal();
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
    setDeleteLoading(false);
  };

  useEffect(() => {
    fetchTermTeacherList();
  }, [fetchTermTeacherList]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);



  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'ترم مدرسین', href: '/admin/term-teachers' },
        ]}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            ترم مدرسین
          </h1>
          <Button onClick={() => router.push('/admin/term-teachers/new')}>
            ایجاد ترم مدرس
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-md ${stat.color}`}>
                      <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="mr-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stat.value.toLocaleString('fa-IR')}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
          <Table
            data={termTeacherList}
            columns={columns}
            loading={loading}
            emptyMessage="هیچ ترم مدرسی یافت نشد"
            onEdit={(termTeacher) => router.push(`/admin/term-teachers/${termTeacher.id}`)}
            onDelete={handleDeleteClick}
            onView={(termTeacher) => router.push(`/admin/term-teachers/${termTeacher.id}/view`)}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف ترم مدرس"
        description={`آیا از حذف "${(itemToDelete?.user?.first_name || 'نامشخص') + ' ' + (itemToDelete?.user?.last_name || '')}" ${itemToDelete?.term ? `از ترم "${itemToDelete.term.title}"` : '(بدون ترم)'} اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </main>
  );
}
