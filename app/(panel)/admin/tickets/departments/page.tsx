'use client';

import { useEffect, useState } from 'react';
import { useTicket } from '@/app/lib/hooks/use-ticket';
import { TicketDepartment } from '@/app/lib/types';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import {
  Plus,
  Building2,
  Trash2,
  Edit,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const departmentSchema = z.object({
  title: z.string().min(1, 'نام دپارتمان نمی‌تواند خالی باشد'),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

export default function TicketDepartmentsPage() {
  const {
    departments,
    isDepartmentsLoading,
    isLoading,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useTicket();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<TicketDepartment | null>(null);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
  });

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      if (editingDepartment) {
        await updateDepartment(editingDepartment.id.toString(), data);
        setEditingDepartment(null);
      } else {
        await createDepartment(data);
      }
      reset();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleEdit = (department: TicketDepartment) => {
    setEditingDepartment(department);
    setValue('title', department.title);
    setShowAddForm(true);
  };

  const handleCancelEdit = () => {
    setEditingDepartment(null);
    setShowAddForm(false);
    reset();
  };

  const handleDelete = async (id: number | string, title: string) => {
    if (!confirm(`آیا از حذف دپارتمان "${title}" مطمئن هستید؟`)) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteDepartment(id.toString());
    } catch (error) {
      console.error('Error deleting department:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (isDepartmentsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'مدیریت تیکت‌ها', href: '/admin/tickets' },
          {
            label: 'مدیریت دپارتمان‌ها',
            href: '/admin/tickets/departments',
            active: true,
          },
        ]}
      />

      <div className="mt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              مدیریت دپارتمان‌های تیکت
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              دپارتمان‌های مختلف برای دسته‌بندی تیکت‌ها
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            افزودن دپارتمان
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building2 className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      کل دپارتمان‌ها
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {departments.length}
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
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      دپارتمان‌های فعال
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {departments.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="mt-6 rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="px-6 py-4">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                {editingDepartment ? 'ویرایش دپارتمان' : 'افزودن دپارتمان جدید'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    نام دپارتمان
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="نام دپارتمان را وارد کنید"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="white"
                    onClick={handleCancelEdit}
                  >
                    انصراف
                  </Button>
                  <Button type="submit" loading={isSubmitting}>
                    {editingDepartment ? 'بروزرسانی' : 'افزودن'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Departments List */}
        <div className="mt-6">
          {departments.length === 0 ? (
            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
              <div className="px-6 py-12 text-center">
                <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">
                  هنوز هیچ دپارتمانی تعریف نشده است
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((department) => (
                <div
                  key={department.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-6 w-6 text-indigo-600" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {department.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="white"
                        onClick={() => handleEdit(department)}
                        className="flex items-center gap-1 px-3 py-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(department.id, department.title)}
                        loading={deletingId === department.id}
                        className="flex items-center gap-1 px-3 py-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}