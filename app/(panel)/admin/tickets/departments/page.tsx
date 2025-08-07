'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  getTicketDepartments,
  createTicketDepartment,
  updateTicketDepartment,
  deleteTicketDepartment,
} from '@/app/lib/api/admin/tickets';
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

interface Department {
  id: number | string;
  title: string;
}

const departmentSchema = z.object({
  title: z.string().min(1, 'نام دپارتمان نمی‌تواند خالی باشد'),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

export default function TicketDepartmentsPage() {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<number | string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
  });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await getTicketDepartments();
      setDepartments(response.data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('خطا در بارگذاری دپارتمان‌ها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (editingDepartment) {
      reset({ title: editingDepartment.title });
    } else {
      reset({ title: '' });
    }
  }, [editingDepartment, reset]);

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      if (editingDepartment) {
        await updateTicketDepartment(editingDepartment.id, data.title);
        toast.success('دپارتمان با موفقیت بروزرسانی شد');
        setEditingDepartment(null);
      } else {
        await createTicketDepartment(data.title);
        toast.success('دپارتمان با موفقیت ایجاد شد');
      }
      reset();
      setShowAddForm(false);
      fetchDepartments();
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error(
        editingDepartment
          ? 'خطا در بروزرسانی دپارتمان'
          : 'خطا در ایجاد دپارتمان'
      );
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
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
      await deleteTicketDepartment(id);
      toast.success('دپارتمان با موفقیت حذف شد');
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('خطا در حذف دپارتمان');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
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
                <div className="ml-5 w-0 flex-1">
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
                <div className="ml-5 w-0 flex-1">
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

        {/* Add Form */}
        {showAddForm && (
          <div className="mt-6 rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="px-6 py-4">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                {editingDepartment ? 'ویرایش دپارتمان' : 'افزودن دپارتمان جدید'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    نام دپارتمان
                  </label>
                  <input
                    type="text"
                    id="title"
                    {...register('title')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    placeholder={
                      editingDepartment
                        ? editingDepartment.title
                        : 'نام دپارتمان را وارد کنید...'
                    }
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
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {editingDepartment ? (
                      <>
                        <Edit className="h-4 w-4" />
                        بروزرسانی دپارتمان
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        ایجاد دپارتمان
                      </>
                    )}
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
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  هیچ دپارتمانی یافت نشد
                </h3>
                <p className="mb-6 text-gray-500 dark:text-gray-400">
                  برای شروع، اولین دپارتمان خود را ایجاد کنید
                </p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="mx-auto flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  افزودن دپارتمان
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden bg-white shadow sm:rounded-md dark:bg-gray-800">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {departments.map((department, index) => (
                  <li key={department.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
                            <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                              {department.title}
                            </h3>
                            <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                              فعال
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            شناسه: {department.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="white"
                          onClick={() => handleEdit(department)}
                          className="flex items-center gap-1 px-3 py-1 text-sm"
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
                          className="flex items-center gap-1 px-3 py-1 text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Warning */}
        {departments.length > 0 && (
          <div className="mt-6 rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  توجه
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>
                    حذف یک دپارتمان ممکن است بر تیکت‌های موجود تأثیر بگذارد. قبل
                    از حذف، مطمئن شوید که هیچ تیکت فعالی به این دپارتمان وابسته
                    نیست.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
