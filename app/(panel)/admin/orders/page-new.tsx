'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { Order } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/app/lib/hooks/use-order';

export default function Page() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Order | null>(null);
  const {
    orderList,
    loading,
    fetchOrderList,
    deleteOrder,
  } = useOrder();

  useEffect(() => {
    fetchOrderList();
  }, [fetchOrderList]);

  const columns: Column<Order>[] = [
    {
      header: 'شماره سفارش',
      accessor: 'id',
    },
    {
      header: 'مشتری',
      accessor: 'user',
      render: (value): string => {
        const user = value as any;
        return `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.phone || '-';
      },
    },
    {
      header: 'مبلغ کل',
      accessor: 'total_amount',
      render: (value): string => {
        return `${Number(value).toLocaleString('fa-IR')} تومان`;
      },
    },
    {
      header: 'وضعیت سفارش',
      accessor: 'status',
      render: (value): string => {
        const statusMap = {
          pending: 'در انتظار',
          processing: 'در حال پردازش',
          shipped: 'ارسال شده',
          delivered: 'تحویل داده شده',
          cancelled: 'لغو شده',
        };
        return statusMap[value as keyof typeof statusMap] || value as string;
      },
    },
    {
      header: 'وضعیت پرداخت',
      accessor: 'payment_status',
      render: (value): string => {
        const paymentMap = {
          pending: 'در انتظار',
          paid: 'پرداخت شده',
          failed: 'ناموفق',
          refunded: 'بازگشت داده شده',
        };
        return paymentMap[value as keyof typeof paymentMap] || value as string;
      },
    },
    {
      header: 'تاریخ سفارش',
      accessor: 'created_at',
      render: (value): string => {
        if (!value || typeof value !== 'string') return '';
        return new Date(value).toLocaleDateString('fa-IR');
      },
    },
  ];

  const handleDeleteClick = (order: Order) => {
    setItemToDelete(order);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteOrder(itemToDelete.id.toString());
      toast.success('سفارش با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchOrderList();
    } catch (error) {
      toast.error('خطا در حذف سفارش');
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
          سفارشات
        </h1>
        <Button onClick={() => router.push('/admin/orders/new')}>
          ایجاد سفارش
        </Button>
      </div>
      <Table
        data={orderList}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ سفارشی یافت نشد"
        onEdit={(order) => router.push(`/admin/orders/${order.id}`)}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف سفارش"
        description={`آیا از حذف سفارش شماره "${itemToDelete?.id}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
