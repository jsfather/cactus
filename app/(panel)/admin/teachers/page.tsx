'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { Teacher } from '@/app/lib/types/teacher';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useTeacher } from '@/app/lib/hooks/use-teacher';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Users, Plus, UserCheck, Clock, Award, TrendingUp } from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default function TeachersPage() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Teacher | null>(null);
  const {
    teacherList,
    loading,
    totalTeachers,
    fetchTeacherList,
    deleteTeacher,
  } = useTeacher();

  useEffect(() => {
    fetchTeacherList();
  }, [fetchTeacherList]);

  // Calculate summary stats
  const activeTeachers = teacherList.filter(teacher => teacher.user?.role === 'teacher').length;
  const skillfulTeachers = teacherList.filter(teacher => 
    teacher.skills && Array.isArray(teacher.skills) && teacher.skills.length > 0
  ).length;
  const experiencedTeachers = teacherList.filter(teacher => 
    teacher.work_experiences && Array.isArray(teacher.work_experiences) && teacher.work_experiences.length > 0
  ).length;

  const columns: Column<Teacher>[] = [
    {
      header: 'نام',
      accessor: 'user',
      render: (value): string => {
        const user = value as any;
        return user?.first_name || '---';
      },
    },
    {
      header: 'نام خانوادگی',
      accessor: 'user',
      render: (value): string => {
        const user = value as any;
        return user?.last_name || '---';
      },
    },
    {
      header: 'تلفن همراه',
      accessor: 'user',
      render: (value): string => {
        const user = value as any;
        return user?.phone || '---';
      },
    },
    {
      header: 'ایمیل',
      accessor: 'user',
      render: (value): string => {
        const user = value as any;
        return user?.email || '---';
      },
    },
    {
      header: 'بیوگرافی',
      accessor: 'bio',
      render: (value): string => {
        const bio = value as string;
        return bio ? (bio.length > 50 ? bio.substring(0, 50) + '...' : bio) : '---';
      },
    },
    {
      header: 'مهارت‌ها',
      accessor: 'skills',
      render: (value): any => {
        const skills = value as any[];
        if (!Array.isArray(skills) || skills.length === 0) return '-';
        return (
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 2).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              >
                {skill.name}
              </span>
            ))}
            {skills.length > 2 && (
              <span className="text-xs text-gray-500">+{skills.length - 2}</span>
            )}
          </div>
        );
      },
    },
    {
      header: 'شهر',
      accessor: 'city',
      render: (value): string => {
        return (value as string) || '---';
      },
    },
  ];

  const handleDeleteClick = (teacher: Teacher) => {
    setItemToDelete(teacher);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteTeacher(itemToDelete.user_id.toString());
      toast.success('مربی با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchTeacherList();
    } catch (error) {
      toast.error('خطا در حذف مربی');
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
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'مدیریت مربیان', href: '/admin/teachers', active: true },
        ]}
      />

      <div className="mt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              مدیریت مربیان
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              ایجاد، ویرایش و مدیریت مربیان آموزشگاه
            </p>
          </div>
          <Button onClick={() => router.push('/admin/teachers/new')}>
            <Plus className="h-4 w-4 ml-2" />
            افزودن مربی جدید
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      کل مربیان
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {totalTeachers.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      فعال
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {activeTeachers.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      با مهارت
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {skillfulTeachers.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      با تجربه
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {experiencedTeachers.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teachers Table */}
        <div className="mt-6">
          <Table
            data={teacherList}
            columns={columns}
            loading={loading}
            emptyMessage="هیچ مربی‌ای یافت نشد"
            onEdit={(teacher) => router.push(`/admin/teachers/${teacher.user_id}`)}
            onDelete={handleDeleteClick}
            getRowId={(teacher) => String(teacher.user_id)}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف مربی"
        description={`آیا از حذف مربی "${itemToDelete?.user?.first_name} ${itemToDelete?.user?.last_name}" اطمینان دارید؟`}
        confirmText="حذف"
        cancelText="انصراف"
        loading={deleteLoading}
        variant="danger"
      />
    </main>
  );
}
