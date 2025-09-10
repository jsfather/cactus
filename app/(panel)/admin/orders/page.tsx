'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { Order, OrderStatus } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/app/lib/hooks/use-order';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { ShoppingCart, DollarSign, Clock, CheckCircle, Users, TrendingUp, AlertTriangle, Eye, Trash2, Edit } from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default function OrdersPage() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Order | null>(null);
  const [itemToUpdateStatus, setItemToUpdateStatus] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('pending');
  const [statusLoading, setStatusLoading] = useState(false);
  const {
    orderList,
    loading,
    fetchOrderList,
    deleteOrder,
    updateOrderStatus,
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

  const handleStatusUpdateClick = (order: Order) => {
    setItemToUpdateStatus(order);
    setSelectedStatus(order.status);
    setShowStatusModal(true);
  };

  const handleStatusUpdateConfirm = async () => {
    if (!itemToUpdateStatus) return;

    try {
      setStatusLoading(true);
      await updateOrderStatus(itemToUpdateStatus.id.toString(), { status: selectedStatus });
      toast.success('وضعیت سفارش با موفقیت به‌روزرسانی شد');
      setShowStatusModal(false);
      setItemToUpdateStatus(null);
      await fetchOrderList();
    } catch (error) {
      toast.error('خطا در به‌روزرسانی وضعیت سفارش');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleStatusUpdateCancel = () => {
    setShowStatusModal(false);
    setTimeout(() => {
      setItemToUpdateStatus(null);
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
                <div className="mr-5 w-0 flex-1">
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
                <div className="mr-5 w-0 flex-1">
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
                <div className="mr-5 w-0 flex-1">
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
                <div className="mr-5 w-0 flex-1">
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
                <div className="mr-5 w-0 flex-1">
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
                <div className="mr-5 w-0 flex-1">
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
              <div className="mr-3">
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
            actions={(order: Order) => (
              <div className="flex items-center gap-2">
                <Button
                  variant="info"
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                  className="p-1 text-xs"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="warning"
                  onClick={() => handleStatusUpdateClick(order)}
                  className="p-1 text-xs"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(order)}
                  className="p-1 text-xs"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
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

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleStatusUpdateCancel}></div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-right align-bottom shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mr-4 sm:mt-0 sm:text-right">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                    تغییر وضعیت سفارش
                  </h3>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      وضعیت جدید سفارش شماره "{itemToUpdateStatus?.id}" را انتخاب کنید:
                    </p>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="pending">در انتظار</option>
                      <option value="processing">در حال پردازش</option>
                      <option value="shipped">ارسال شده</option>
                      <option value="delivered">تحویل داده شده</option>
                      <option value="cancelled">لغو شده</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button
                  onClick={handleStatusUpdateConfirm}
                  disabled={statusLoading}
                  className="w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mr-3 sm:w-auto sm:text-sm"
                >
                  {statusLoading ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleStatusUpdateCancel}
                  className="mt-3 w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  انصراف
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
