'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  getProductCategories, 
  createProductCategory, 
  updateProductCategory,
  deleteProductCategory,
  ProductCategory,
  ProductCategoryFormData
} from '@/app/lib/api/admin/product-categories';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { 
  Plus, 
  Package, 
  Trash2, 
  Edit, 
  AlertTriangle,
  Tag
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'نام دسته‌بندی نمی‌تواند خالی باشد'),
  description: z.string().optional(),
});

export default function ProductCategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductCategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getProductCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('خطا در بارگذاری دسته‌بندی‌ها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingCategory) {
      reset({ 
        name: editingCategory.name,
        description: editingCategory.description || ''
      });
    } else {
      reset({ name: '', description: '' });
    }
  }, [editingCategory, reset]);

  const onSubmit = async (data: ProductCategoryFormData) => {
    try {
      if (editingCategory) {
        await updateProductCategory(editingCategory.id, data);
        toast.success('دسته‌بندی با موفقیت بروزرسانی شد');
        setEditingCategory(null);
      } else {
        await createProductCategory(data);
        toast.success('دسته‌بندی با موفقیت ایجاد شد');
      }
      reset();
      setShowAddForm(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(editingCategory ? 'خطا در بروزرسانی دسته‌بندی' : 'خطا در ایجاد دسته‌بندی');
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

  const handleDelete = async (id: number | string, name: string) => {
    if (!confirm(`آیا از حذف دسته‌بندی "${name}" مطمئن هستید؟`)) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteProductCategory(id);
      toast.success('دسته‌بندی با موفقیت حذف شد');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('خطا در حذف دسته‌بندی');
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
          { label: 'مدیریت محصولات', href: '/admin/products' },
          { label: 'مدیریت دسته‌بندی‌ها', href: '/admin/product-categories', active: true },
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
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Tag className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
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

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
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
          <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                {editingCategory ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label 
                      htmlFor="name" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      نام دسته‌بندی *
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      placeholder={editingCategory ? editingCategory.name : "نام دسته‌بندی را وارد کنید..."}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label 
                      htmlFor="description" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      توضیحات
                    </label>
                    <input
                      type="text"
                      id="description"
                      {...register('description')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      placeholder="توضیحات دسته‌بندی (اختیاری)"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>
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
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-6 py-12 text-center">
                <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  هیچ دسته‌بندی یافت نشد
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  برای شروع، اولین دسته‌بندی خود را ایجاد کنید
                </p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  افزودن دسته‌بندی
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {categories.map((category, index) => (
                  <li key={category.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <Tag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                              {category.name}
                            </h3>
                            <span className="mr-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                              فعال
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {category.description || 'بدون توضیحات'} • شناسه: {category.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="white"
                          onClick={() => handleEdit(category)}
                          className="flex items-center gap-1 text-sm px-3 py-1"
                        >
                          <Edit className="h-4 w-4" />
                          ویرایش
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(category.id, category.name)}
                          loading={deletingId === category.id}
                          className="flex items-center gap-1 text-sm px-3 py-1"
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
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
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
                    حذف یک دسته‌بندی ممکن است بر محصولات موجود تأثیر بگذارد. 
                    قبل از حذف، مطمئن شوید که هیچ محصولی به این دسته‌بندی وابسته نیست.
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
