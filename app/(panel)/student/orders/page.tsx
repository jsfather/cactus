'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Eye,
  Calendar,
  MapPin,
  Search,
  Receipt,
  Package,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useStudentOrder } from '@/app/lib/hooks/use-student-order';
import { Order } from '@/app/lib/types/order';
import {
  getOrderStatusIcon,
  getOrderStatusText,
  getOrderStatusColor,
  formatOrderPrice,
  formatOrderDate,
} from '@/app/lib/utils/order';

const getStatusIcon = (status: string) => {
  const IconComponent = getOrderStatusIcon(status);
  return <IconComponent className="h-4 w-4" />;
};

const getStatusText = (status: string) => {
  return getOrderStatusText(status);
};

const getStatusColor = (status: string) => {
  return getOrderStatusColor(status);
};

const formatPrice = (price: number) => {
  return formatOrderPrice(price);
};

const formatDate = (dateString: string) => {
  return formatOrderDate(dateString);
};

export default function OrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  const {
    orders,
    loading,
    error,
    pagination,
    fetchOrders,
    showOrderWithCode,
    clearError,
  } = useStudentOrder();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.product.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Calculate summary stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === 'pending'
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === 'delivered'
  ).length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total_price, 0);

  const handleViewOrder = (orderId: number) => {
    router.push(`/student/orders/${orderId}`);
  };

  const handleTrackOrder = async () => {
    if (!trackingCode.trim()) return;

    try {
      await showOrderWithCode({ code: trackingCode });
      setShowTrackingModal(false);
      setTrackingCode('');
    } catch (error) {
      // Error handling is done in the store
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <span>داشبورد</span>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">سفارشات</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            سفارشات من
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            مدیریت و پیگیری سفارشات شما
          </p>
        </div>

        <button
          onClick={() => setShowTrackingModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <Search className="h-4 w-4" />
          پیگیری با کد
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                کل سفارشات
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {totalOrders}
              </p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/20">
              <Receipt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                در انتظار
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {pendingOrders}
              </p>
            </div>
            <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900/20">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                تحویل شده
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {deliveredOrders}
              </p>
            </div>
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/20">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                مجموع خرید
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(totalSpent)}
              </p>
            </div>
            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/20">
              <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="جستجو در سفارشات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-4 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              {searchTerm ? 'سفارشی یافت نشد' : 'هیچ سفارشی ثبت نشده است'}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {searchTerm
                ? 'کلمه کلیدی دیگری امتحان کنید'
                : 'اولین سفارش خود را از فروشگاه ثبت کنید'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        سفارش #{order.code}
                      </h3>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          {order.items.length} کالا
                        </div>
                      </div>
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      {getStatusText(order.status)}
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        اطلاعات سفارش
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          مبلغ کل:{' '}
                          <span className="font-semibold">
                            {formatPrice(order.total_price)}
                          </span>
                        </div>
                        <div className="flex items-start gap-1">
                          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                          <span>{order.address}</span>
                        </div>
                        <div>کد پستی: {order.postal_code}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        کالاها
                      </h4>
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div
                            key={idx}
                            className="text-sm text-gray-600 dark:text-gray-400"
                          >
                            {item.product.title} × {item.quantity}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-sm text-gray-500">
                            و {order.items.length - 2} کالای دیگر
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                  <button
                    onClick={() => handleViewOrder(order.id)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                  >
                    <Eye className="h-4 w-4" />
                    مشاهده جزئیات
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            صفحه {pagination.current_page} از {pagination.last_page}
          </span>
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              پیگیری سفارش با کد
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  کد سفارش
                </label>
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="مثال: O-20251004-000002"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleTrackOrder}
                  disabled={!trackingCode.trim() || loading}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? 'در حال جستجو...' : 'جستجو'}
                </button>
                <button
                  onClick={() => {
                    setShowTrackingModal(false);
                    setTrackingCode('');
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  انصراف
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
