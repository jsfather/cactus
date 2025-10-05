import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

export const getOrderStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return Clock;
    case 'processing':
      return Package;
    case 'shipped':
      return Truck;
    case 'delivered':
      return CheckCircle;
    case 'cancelled':
      return XCircle;
    default:
      return Clock;
  }
};

export const getOrderStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'در انتظار پردازش';
    case 'processing':
      return 'در حال پردازش';
    case 'shipped':
      return 'ارسال شده';
    case 'delivered':
      return 'تحویل داده شده';
    case 'cancelled':
      return 'لغو شده';
    default:
      return 'نامشخص';
  }
};

export const getOrderStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
    case 'processing':
      return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
    case 'shipped':
      return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
    case 'delivered':
      return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
    case 'cancelled':
      return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
    default:
      return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
  }
};

export const formatOrderPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
};

export const formatOrderDate = (dateString: string) => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};
