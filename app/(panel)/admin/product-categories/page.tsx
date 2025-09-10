'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useProductCategory } from '@/app/lib/hooks/use-product-category';
import { ProductCategory, ProductCategoryFormData } from '@/app/lib/api/admin/product-categories';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Plus, Package, Trash2, Edit, AlertTriangle, Tag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'نام دسته‌بندی نمی‌تواند خالی باشد'),
  type: z.string().min(1, 'نوع دسته‌بندی نمی‌تواند خالی باشد'),
});

export default function ProductCategoriesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);

  // Hook
  const { 
    categories, 
    loading, 
    error, 
    fetchCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    clearError 
  } = useProductCategory();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductCategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    if (editingCategory) {
      reset({
        name: editingCategory.name,
        type: editingCategory.type,
      });
    } else {
      reset({ name: '', type: '' });
    }
  }, [editingCategory, reset]);

  const onSubmit = async (data: ProductCategoryFormData) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        toast.success('دسته‌بندی با موفقیت بروزرسانی شد');
        setEditingCategory(null);
      } else {
        await createCategory(data);
        toast.success('دسته‌بندی با موفقیت ایجاد شد');
      }
      reset();
      setShowAddForm(false);
    } catch (error) {
      // Error is handled by the store and toast
    }
  };

  const handleEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    setShowAddForm(true);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setShowAddForm(false);
    reset();
  };

  const handleDelete = (category: ProductCategory) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      setDeletingId(categoryToDelete.id);
      await deleteCategory(categoryToDelete.id);
      toast.success('دسته‌بندی با موفقیت حذف شد');
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      // Error is handled by the store and toast
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'مدیریت محصولات', href: '/admin/products' },
          {
            label: 'مدیریت دسته‌بندی‌ها',
            href: '/admin/product-categories',
            active: true,
          },
        ]}
      />

      <div className="mt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              مدیریت دسته‌بندی‌های محصولات
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              دسته‌بندی‌های مختلف برای سازماندهی محصولات
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            افزودن دسته‌بندی
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Tag className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      کل دسته‌بندی‌ها
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {categories.length}
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
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      دسته‌بندی‌های فعال
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {categories.length}
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
                {editingCategory ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    id="name"
                    label="نام دسته‌بندی"
                    required
                    placeholder="نام دسته‌بندی را وارد کنید..."
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  <Input
                    id="type"
                    label="نوع دسته‌بندی"
                    required
                    placeholder="نوع دسته‌بندی را وارد کنید..."
                    error={errors.type?.message}
                    {...register('type')}
                  />
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
                    {editingCategory ? (
                      <>
                        <Edit className="h-4 w-4" />
                        بروزرسانی دسته‌بندی
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        ایجاد دسته‌بندی
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="mt-6">
          {categories.length === 0 ? (
            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
              <div className="px-6 py-12 text-center">
                <Tag className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  هیچ دسته‌بندی یافت نشد
                </h3>
                <p className="mb-6 text-gray-500 dark:text-gray-400">
                  برای شروع، اولین دسته‌بندی خود را ایجاد کنید
                </p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="mx-auto flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  افزودن دسته‌بندی
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden bg-white shadow sm:rounded-md dark:bg-gray-800">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {categories.map((category: ProductCategory, index: number) => (
                  <li key={category.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
                            <Tag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                              {category.name}
                            </h3>
                            <span className="mr-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              {category.type}
                            </span>
                            <span className="mr-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                              فعال
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            شناسه: {category.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="white"
                          onClick={() => handleEdit(category)}
                          className="flex items-center gap-1 px-3 py-1 text-sm"
                        >
                          <Edit className="h-4 w-4" />
                          ویرایش
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(category)}
                          loading={deletingId === category.id}
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
        {categories.length > 0 && (
          <div className="mt-6 rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="mr-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  توجه
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>
                    حذف یک دسته‌بندی ممکن است بر محصولات موجود تأثیر بگذارد. قبل
                    از حذف، مطمئن شوید که هیچ محصولی به این دسته‌بندی وابسته
                    نیست.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف دسته‌بندی"
        description={`آیا از حذف دسته‌بندی "${categoryToDelete?.name}" مطمئن هستید؟`}
        confirmText="حذف"
        cancelText="انصراف"
        loading={deletingId === categoryToDelete?.id}
      />
    </main>
  );
}
