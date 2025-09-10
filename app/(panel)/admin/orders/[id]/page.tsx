'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useOrder } from '@/app/lib/hooks/use-order';
import { Order, OrderStatus } from '@/app/lib/types';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import {
  ShoppingCart,
  ArrowRight,
  User,
  Phone,
  MapPin,
  Calendar,
  Package,
  Edit,
  Trash2,
  Check,
  AlertCircle,
  Clock,
  Truck,
  CheckCircle,
  X,
} from 'lucide-react';

const statusOptions = [
  { value: 'pending', label: 'در انتظار', icon: Clock, color: 'yellow' },
  {
    value: 'processing',
    label: 'در حال پردازش',
    icon: AlertCircle,
    color: 'blue',
  },
  { value: 'shipped', label: 'ارسال شده', icon: Truck, color: 'purple' },
  {
    value: 'delivered',
    label: 'تحویل داده شده',
    icon: CheckCircle,
    color: 'green',
  },
  { value: 'cancelled', label: 'لغو شده', icon: X, color: 'red' },
];

const statusColors: Record<string, string> = {
  pending:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  shipped:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  delivered:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  canceled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('pending');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    currentOrder: order,
    loading,
    fetchOrderById,
    updateOrderStatus,
    deleteOrder,
  } = useOrder();

  useEffect(() => {
    if (resolvedParams.id) {
      fetchOrderById(resolvedParams.id);
    }
  }, [resolvedParams.id, fetchOrderById]);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  const handleStatusUpdate = async () => {
    if (!order || selectedStatus === order.status) return;

    try {
      setStatusLoading(true);
      await updateOrderStatus(order.id.toString(), { status: selectedStatus });
      toast.success('وضعیت سفارش با موفقیت به‌روزرسانی شد');
      setShowStatusModal(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('خطا در به‌روزرسانی وضعیت سفارش');
      setSelectedStatus(order.status);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!order) return;

    try {
      setDeleteLoading(true);
      await deleteOrder(order.id.toString());
      toast.success('سفارش با موفقیت حذف شد');
      router.push('/admin/orders');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('خطا در حذف سفارش');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusOption = (status: string) => {
    return (
      statusOptions.find((option) => option.value === status) ||
      statusOptions[0]
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!order) {
    return (
      <div className="py-12 text-center">
        <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <p className="text-gray-500 dark:text-gray-400">سفارش یافت نشد</p>
      </div>
    );
  }

  const currentStatusOption = getStatusOption(order.status);
  const StatusIcon = currentStatusOption.icon;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'مدیریت سفارش‌ها', href: '/admin/orders' },
          {
            label: `سفارش #${order.id}`,
            href: `/admin/orders/${order.id}`,
            active: true,
          },
        ]}
      />

      <div className="mt-8">
        {/* Header */}
        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <Button
                    variant="white"
                    onClick={() => router.push('/admin/orders')}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    بازگشت
                  </Button>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                      statusColors[order.status] || statusColors.pending
                    }`}
                  >
                    <StatusIcon className="h-4 w-4" />
                    {currentStatusOption.label}
                  </span>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  سفارش #{order.id}
                </h1>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {`${order.user?.first_name || ''} ${order.user?.last_name || ''}`.trim() || order.user?.phone || 'کاربر نامشخص'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(order.created_at || new Date().toISOString())}
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    {order.items?.length || 0} محصول
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={deleteLoading}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  حذف سفارش
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Customer Info */}
          <div className="rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="px-6 py-4">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                <User className="h-5 w-5" />
                اطلاعات مشتری
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    نام مشتری
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {`${order.user?.first_name || ''} ${order.user?.last_name || ''}`.trim() || 'نامشخص'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    ایمیل
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {order.user?.email || 'نامشخص'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    شماره تماس
                  </label>
                  <p className="flex items-center gap-1 text-gray-900 dark:text-gray-100">
                    <Phone className="h-4 w-4" />
                    {order.user?.phone || 'نامشخص'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    آدرس تحویل
                  </label>
                  <p className="flex items-start gap-1 text-gray-900 dark:text-gray-100">
                    <MapPin className="mt-0.5 h-4 w-4" />
                    {order.shipping_address}
                  </p>
                </div>
                {order.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      یادداشت
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {order.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="px-6 py-4">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                <Edit className="h-5 w-5" />
                مدیریت وضعیت
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    وضعیت فعلی
                  </label>
                  <div
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                      statusColors[order.status] || statusColors.pending
                    }`}
                  >
                    <StatusIcon className="h-4 w-4" />
                    {currentStatusOption.label}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    تغییر وضعیت
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  onClick={() => setShowStatusModal(true)}
                  disabled={selectedStatus === order.status || statusLoading}
                  className="flex w-full items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {statusLoading ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی وضعیت'}
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="px-6 py-4">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                <ShoppingCart className="h-5 w-5" />
                خلاصه سفارش
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    تعداد محصولات:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {order.items?.length || 0} محصول
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    مجموع کل:
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      تاریخ سفارش:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {formatDate(order.created_at || new Date().toISOString())}
                    </span>
                  </div>
                  {order.updated_at &&
                    order.updated_at !== order.created_at && (
                      <div className="mt-1 flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          آخرین بروزرسانی:
                        </span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {formatDate(order.updated_at)}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <div className="mt-6 rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                محصولات سفارش
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      محصول
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      قیمت واحد
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      تعداد
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      مجموع
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            {item.product?.image ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={item.product.image}
                                alt={item.product.title}
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-600">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {item.product?.title ||
                                `محصول #${item.product_id}`}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              کد محصول: {item.product_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="حذف سفارش"
        description={`آیا از حذف سفارش شماره "${order?.id}" مطمئن هستید؟`}
        confirmText="حذف"
        cancelText="انصراف"
        loading={deleteLoading}
      />

      {/* Status Update Modal */}
      <ConfirmModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleStatusUpdate}
        title="تغییر وضعیت سفارش"
        description={`آیا از تغییر وضعیت سفارش به "${statusOptions.find(s => s.value === selectedStatus)?.label}" مطمئن هستید؟`}
        confirmText="به‌روزرسانی"
        cancelText="انصراف"
        loading={statusLoading}
      />
    </main>
  );
}
