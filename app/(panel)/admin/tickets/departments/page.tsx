'use client';

import { useEffect, useState } from 'react';
import { useTicket } from '@/app/lib/hooks/use-ticket';
import { TicketDepartment } from '@/app/lib/types';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Plus, Building2, Trash2, Edit } from 'lucide-react';
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
  const [editingDepartment, setEditingDepartment] =
    useState<TicketDepartment | null>(null);
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              مدیریت دپارتمان‌های تیکت
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              دپارتمان‌های مختلف برای دسته‌بندی تیکت‌ها
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full gap-2 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            افزودن دپارتمان
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-6">
          <div className="flex max-w-sm items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <span className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {departments.length.toLocaleString('fa-IR')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                دپارتمان تعریف‌شده
              </p>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="p-5 sm:p-6">
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
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              {departments.map((department) => (
                <div
                  key={department.id}
                  className="flex flex-col gap-4 border-b border-gray-100 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="shrink-0 rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-medium break-words text-gray-900 dark:text-gray-100">
                        {department.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        شناسه #{department.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(department)}
                      className="flex-1 gap-1 sm:flex-none"
                    >
                      <Edit className="h-4 w-4" />
                      ویرایش
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() =>
                        handleDelete(department.id, department.title)
                      }
                      loading={deletingId === department.id}
                      className="flex-1 gap-1 sm:flex-none"
                    >
                      <Trash2 className="h-4 w-4" />
                      حذف
                    </Button>
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
