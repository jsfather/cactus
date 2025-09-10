'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { Order } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/app/lib/hooks/use-order';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { ShoppingCart, DollarSign, Clock, CheckCircle, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default function OrdersPage() {
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

  // Calculate summary stats
  const totalOrders = orderList.length;
  const totalRevenue = orderList.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const pendingOrders = orderList.filter(order => order.status === 'pending').length;
  const deliveredOrders = orderList.filter(order => order.status === 'delivered').length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

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
      render: (value): any => {
        const statusColors = {
          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
          processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
          shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
          delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        const statusMap = {
          pending: 'در انتظار',
          processing: 'در حال پردازش',
          shipped: 'ارسال شده',
          delivered: 'تحویل داده شده',
          cancelled: 'لغو شده',
        };
        const status = value as keyof typeof statusMap;
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
            {statusMap[status] || String(value)}
          </span>
        );
      },
    },
    {
      header: 'وضعیت پرداخت',
      accessor: 'payment_status',
      render: (value): any => {
        const paymentColors = {
          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
          paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
          refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        };
        const paymentMap = {
          pending: 'در انتظار',
          paid: 'پرداخت شده',
          failed: 'ناموفق',
          refunded: 'بازگشت داده شده',
        };
        const payment = value as keyof typeof paymentMap;
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentColors[payment] || 'bg-gray-100 text-gray-800'}`}>
            {paymentMap[payment] || String(value)}
          </span>
        );
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'مدیریت سفارشات', href: '/admin/orders', active: true },
        ]}
      />

      <div className="mt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              مدیریت سفارشات
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              مدیریت و نظارت بر سفارشات مشتریان
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      کل سفارشات
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {totalOrders.toLocaleString('fa-IR')}
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
                      کل درآمد
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {totalRevenue.toLocaleString('fa-IR')} تومان
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
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      سفارشات در انتظار
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {pendingOrders.toLocaleString('fa-IR')}
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
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      سفارشات تحویل شده
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {deliveredOrders.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      میانگین ارزش سفارش
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {averageOrderValue.toLocaleString('fa-IR')} تومان
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
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      نرخ تکمیل سفارشات
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(1) : 0}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Orders Alert */}
        {pendingOrders > 0 && (
          <div className="mt-6 rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  سفارشات در انتظار پردازش
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>
                    {pendingOrders} سفارش در انتظار پردازش هستند. لطفاً وضعیت آن‌ها را بررسی و به‌روزرسانی کنید.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="mt-6">
          <Table
            data={orderList}
            columns={columns}
            loading={loading}
            emptyMessage="هیچ سفارشی یافت نشد"
            onEdit={(order) => router.push(`/admin/orders/${order.id}`)}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف سفارش"
        description={`آیا از حذف سفارش شماره "${itemToDelete?.id}" مطمئن هستید؟`}
        confirmText="حذف"
        cancelText="انصراف"
        loading={deleteLoading}
      />
    </main>
  );
}
