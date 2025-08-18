'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { Product } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useProduct } from '@/app/lib/hooks/use-product';

export default function Page() {
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

  const columns: Column<Product>[] = [
    {
      header: 'نام محصول',
      accessor: 'name',
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
      accessor: 'stock_quantity',
      render: (value): string => {
        const stock = Number(value);
        return `${stock.toLocaleString('fa-IR')} عدد`;
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
      header: 'وضعیت',
      accessor: 'is_active',
      render: (value): string => {
        return value ? 'فعال' : 'غیرفعال';
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

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          محصولات
        </h1>
        <Button onClick={() => router.push('/admin/products/new')}>
          ایجاد محصول
        </Button>
      </div>
      <Table
        data={productList}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ محصولی یافت نشد"
        onEdit={(product) => router.push(`/admin/products/${product.id}`)}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف محصول"
        description={`آیا از حذف محصول "${itemToDelete?.name}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
