'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { Product } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useProduct } from '@/app/lib/hooks/use-product';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Package, Plus, ShoppingCart, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default function ProductsPage() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Product | null>(null);
  const {
    productList,
    loading,
    fetchProductList,
    deleteProduct,
  } = useProduct();

  useEffect(() => {
    fetchProductList();
  }, [fetchProductList]);

  // Calculate summary stats
  const totalProducts = productList.length;
  const totalValue = productList.reduce((sum, product) => sum + (Number(product.price) * Number(product.stock || 0)), 0);
  const lowStockProducts = productList.filter(product => Number(product.stock || 0) < 10).length;
  const averagePrice = totalProducts > 0 ? productList.reduce((sum, product) => sum + Number(product.price), 0) / totalProducts : 0;

  const columns: Column<Product>[] = [
    {
      header: 'نام محصول',
      accessor: 'title',
    },
    {
      header: 'قیمت',
      accessor: 'price',
      render: (value): string => {
        return `${Number(value).toLocaleString('fa-IR')} تومان`;
      },
    },
    {
      header: 'موجودی',
      accessor: 'stock',
      render: (value): any => {
        const stock = Number(value);
        const isLowStock = stock < 10;
        return (
          <span className={isLowStock ? 'text-red-600 font-medium' : ''}>
            {stock.toLocaleString('fa-IR')} عدد
            {isLowStock && ' ⚠️'}
          </span>
        );
      },
    },
    {
      header: 'دسته‌بندی',
      accessor: 'category',
      render: (value): string => {
        return (value as any)?.name || '-';
      },
    },
    {
      header: 'تاریخ ایجاد',
      accessor: 'created_at',
      render: (value): string => {
        if (!value || typeof value !== 'string') return '';
        return new Date(value).toLocaleDateString('fa-IR');
      },
    },
  ];

  const handleDeleteClick = (product: Product) => {
    setItemToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteProduct(itemToDelete.id.toString());
      toast.success('محصول با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchProductList();
    } catch (error) {
      toast.error('خطا در حذف محصول');
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
          { label: 'مدیریت محصولات', href: '/admin/products', active: true },
        ]}
      />

      <div className="mt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              مدیریت محصولات
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              مدیریت و نظارت بر محصولات فروشگاه
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="white"
              onClick={() => router.push('/admin/product-categories')}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              مدیریت دسته‌بندی‌ها
            </Button>
            <Button
              onClick={() => router.push('/admin/products/new')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              افزودن محصول
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      کل محصولات
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {totalProducts.toLocaleString('fa-IR')}
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
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      ارزش کل موجودی
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {totalValue.toLocaleString('fa-IR')} تومان
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
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      میانگین قیمت
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {averagePrice.toLocaleString('fa-IR')} تومان
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
                  <AlertTriangle className={`h-6 w-6 ${lowStockProducts > 0 ? 'text-red-600' : 'text-gray-400'}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      موجودی کم
                    </dt>
                    <dd className={`text-lg font-medium ${lowStockProducts > 0 ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>
                      {lowStockProducts.toLocaleString('fa-IR')} محصول
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts > 0 && (
          <div className="mt-6 rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  هشدار موجودی کم
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>
                    {lowStockProducts} محصول موجودی کمتر از ۱۰ عدد دارند. لطفاً موجودی آن‌ها را تکمیل کنید.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="mt-6">
          <Table
            data={productList}
            columns={columns}
            loading={loading}
            emptyMessage="هیچ محصولی یافت نشد"
            onEdit={(product) => router.push(`/admin/products/${product.id}`)}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف محصول"
        description={`آیا از حذف محصول "${itemToDelete?.title}" مطمئن هستید؟`}
        confirmText="حذف"
        cancelText="انصراف"
        loading={deleteLoading}
      />
    </main>
  );
}
