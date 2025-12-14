'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Table, { Column } from '@/app/components/ui/Table';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Term } from '@/app/lib/types';
import { useTerm } from '@/app/lib/hooks/use-term';
import { Plus, Calendar, Users, BookOpen, Clock } from 'lucide-react';

export default function TermsPage() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Term | null>(null);

  const { termList, loading, fetchTermList, deleteTerm, clearError } =
    useTerm();

  useEffect(() => {
    fetchTermList();
  }, [fetchTermList]);

  // Calculate summary statistics
  const totalTerms = termList.length;
  const activeTerms = termList.filter((term) => {
    const today = new Date();
    const endDate = new Date(term.end_date);
    return endDate >= today;
  }).length;
  const totalStudents = termList.reduce(
    (sum, term) => sum + (term.students?.length || 0),
    0
  );
  const totalCapacity = termList.reduce((sum, term) => sum + term.capacity, 0);

  const columns: Column<Term>[] = [
    {
      header: 'عنوان ترم',
      accessor: 'title',
      render: (value): string => {
        return value as string;
      },
    },
    {
      header: 'ترتیب',
      accessor: 'sort',
      render: (value): string => {
        return value ? `${value}` : 'نامشخص';
      },
    },
    {
      header: 'سطح',
      accessor: 'level',
      render: (value, item): React.JSX.Element => {
        const level = item.level;
        if (!level) {
          return (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-900 dark:text-gray-300">
              نامشخص
            </span>
          );
        }

        return (
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
            {level.name} - {level.label}
          </span>
        );
      },
    },
    {
      header: 'مدت زمان',
      accessor: 'duration',
      render: (value): string => {
        return `${value} دقیقه`;
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
      header: 'نوع ترم',
      accessor: 'type',
      render: (value): React.JSX.Element => {
        const typeMap = {
          normal: {
            label: 'عادی',
            color:
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
          },
          capacity_completion: {
            label: 'تکمیل ظرفیت',
            color:
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
          },
          project_based: {
            label: 'پروژه محور(ویژه)',
            color:
              'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
          },
          specialized: {
            label: 'گرایش تخصصی',
            color:
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          },
          ai: {
            label: 'هوش مصنوعی',
            color:
              'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
          },
        };
        const type = typeMap[value as keyof typeof typeMap] || {
          label: value as string,
          color: 'bg-gray-100 text-gray-800',
        };

        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${type.color}`}
          >
            {type.label}
          </span>
        );
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
      header: 'قیمت',
      accessor: 'price',
      render: (value): string => {
        return new Intl.NumberFormat('fa-IR').format(Number(value)) + ' تومان';
      },
    },
    {
      header: 'تاریخ شروع',
      accessor: 'start_date',
      render: (value): string => {
        if (!value || typeof value !== 'string') return '---';
        return value; // Already in Persian format
      },
    },
    {
      header: 'تاریخ پایان',
      accessor: 'end_date',
      render: (value): string => {
        if (!value || typeof value !== 'string') return '---';
        return value; // Already in Persian format
      },
    },
    {
      header: 'پیش‌نیازها',
      accessor: 'term_requirements',
      render: (value, item): React.JSX.Element => {
        const requirements = item.term_requirements;
        if (!requirements || requirements.length === 0) {
          return (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ندارد
            </span>
          );
        }

        return (
          <div className="flex flex-wrap gap-1">
            {requirements.slice(0, 2).map((reqId, index) => {
              const reqTerm = termList.find(
                (t) => t.id.toString() === reqId.toString()
              );
              return (
                <span
                  key={reqId}
                  className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                  title={reqTerm ? reqTerm.title : `ترم ${reqId}`}
                >
                  {reqTerm
                    ? reqTerm.title.substring(0, 10) +
                      (reqTerm.title.length > 10 ? '...' : '')
                    : `ترم ${reqId}`}
                </span>
              );
            })}
            {requirements.length > 2 && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                +{requirements.length - 2}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'نحوه ارائه',
      accessor: 'is_in_person',
      render: (value, item): React.JSX.Element => {
        const badges = [];

        if (item.is_in_person) {
          badges.push(
            <span
              key="in-person"
              className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
            >
              حضوری
            </span>
          );
        }

        if (item.is_online) {
          badges.push(
            <span
              key="online"
              className="inline-flex items-center rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-800 dark:bg-sky-900 dark:text-sky-300"
            >
              آنلاین
            </span>
          );
        }

        if (item.is_downloadable) {
          badges.push(
            <span
              key="downloadable"
              className="inline-flex items-center rounded-full bg-violet-100 px-2 py-1 text-xs font-medium text-violet-800 dark:bg-violet-900 dark:text-violet-300"
            >
              قابل دانلود
            </span>
          );
        }

        if (badges.length === 0) {
          return (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              نامشخص
            </span>
          );
        }

        return <div className="flex flex-wrap gap-1">{badges}</div>;
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumbs
          breadcrumbs={[
            { label: 'داشبورد', href: '/admin' },
            { label: 'ترم‌ها', href: '/admin/terms' },
          ]}
        />

        {/* Header */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              مدیریت ترم‌ها
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              مدیریت و ویرایش ترم‌های آموزشی
            </p>
          </div>
          <Button
            onClick={() => router.push('/admin/terms/new')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            ایجاد ترم جدید
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    کل ترم‌ها
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {totalTerms.toLocaleString('fa-IR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    ترم‌های فعال
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {activeTerms.toLocaleString('fa-IR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    کل دانش‌پژوهان
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {totalStudents.toLocaleString('fa-IR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    کل ظرفیت
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {totalCapacity.toLocaleString('fa-IR')} نفر
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-8">
          <Table
            data={termList}
            columns={columns}
            loading={loading}
            emptyMessage="هیچ ترمی یافت نشد"
            onView={(term) => router.push(`/admin/terms/${term.id}/view`)}
            onEdit={(term) => router.push(`/admin/terms/${term.id}`)}
            onDelete={handleDeleteClick}
          />
        </div>

        {/* Delete Confirmation Modal */}
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
    </main>
  );
}
