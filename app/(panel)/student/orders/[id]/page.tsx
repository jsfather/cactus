'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  ArrowRight,
  Package,
  Calendar,
  MapPin,
  Phone,
  User,
  Mail,
  XCircle,
  CreditCard,
  Barcode,
} from 'lucide-react';
import { useStudentOrder } from '@/app/lib/hooks/use-student-order';
import {
  getOrderStatusIcon,
  getOrderStatusText,
  getOrderStatusColor,
  formatOrderPrice,
  formatOrderDate,
} from '@/app/lib/utils/order';

const getStatusIcon = (status: string) => {
  const IconComponent = getOrderStatusIcon(status);
  return <IconComponent className="h-5 w-5" />;
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

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const { currentOrder, loading, error, fetchOrderById, clearError } =
    useStudentOrder();

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId, fetchOrderById]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleGoBack = () => {
    router.push('/student/orders');
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          خطا در بارگذاری سفارش
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={handleGoBack}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          بازگشت به لیست سفارشات
        </button>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="py-12 text-center">
        <Package className="mx-auto h-16 w-16 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          سفارش یافت نشد
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          سفارش مورد نظر شما یافت نشد
        </p>
        <button
          onClick={handleGoBack}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          بازگشت به لیست سفارشات
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <span>داشبورد</span>
        <span>/</span>
        <button
          onClick={handleGoBack}
          className="transition-colors hover:text-blue-600"
        >
          سفارشات
        </button>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">
          #{currentOrder.code}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              جزئیات سفارش #{currentOrder.code}
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              ثبت شده در {formatDate(currentOrder.created_at)}
            </p>
          </div>
        </div>

        <div
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium ${getStatusColor(currentOrder.status)}`}
        >
          {getStatusIcon(currentOrder.status)}
          {getStatusText(currentOrder.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="space-y-6 lg:col-span-2">
          {/* Items List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Package className="h-5 w-5" />
              کالاهای سفارش ({currentOrder.items.length} مورد)
            </h3>

            <div className="space-y-4">
              {currentOrder.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.product.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {item.product.description}
                    </p>
                    {Object.keys(item.product.attributes).length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {Object.entries(item.product.attributes).map(
                          ([key, value]) => (
                            <span
                              key={key}
                              className="rounded-md bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700"
                            >
                              {key}: {value}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-left">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      تعداد: {item.quantity}
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Order Summary & Info */}
        <div className="space-y-6">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <CreditCard className="h-5 w-5" />
              خلاصه سفارش
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  قیمت کالاها:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatPrice(
                    currentOrder.items.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    )
                  )}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-900 dark:text-white">مجموع:</span>
                  <span className="text-lg text-gray-900 dark:text-white">
                    {formatPrice(currentOrder.total_price)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Barcode className="h-5 w-5" />
              اطلاعات سفارش
            </h3>

            <div className="space-y-4">
              <div>
                <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                  کد سفارش:
                </div>
                <div className="font-mono text-gray-900 dark:text-white">
                  {currentOrder.code}
                </div>
              </div>

              <div>
                <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                  تاریخ ثبت:
                </div>
                <div className="text-gray-900 dark:text-white">
                  {formatDate(currentOrder.created_at)}
                </div>
              </div>

              <div>
                <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                  وضعیت:
                </div>
                <div
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 font-medium ${getStatusColor(currentOrder.status)}`}
                >
                  {getStatusIcon(currentOrder.status)}
                  {getStatusText(currentOrder.status)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Customer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <User className="h-5 w-5" />
              اطلاعات مشتری
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {currentOrder.user.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900 dark:text-white" dir="ltr">
                  {currentOrder.user.phone}
                </span>
              </div>

              {currentOrder.user.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {currentOrder.user.email}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <MapPin className="h-5 w-5" />
              آدرس تحویل
            </h3>

            <div className="space-y-3">
              <div className="leading-relaxed text-gray-900 dark:text-white">
                {currentOrder.address}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  کد پستی:
                </span>
                <span className="font-mono text-gray-900 dark:text-white">
                  {currentOrder.postal_code}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
