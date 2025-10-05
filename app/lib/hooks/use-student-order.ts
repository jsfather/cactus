import { useCallback } from 'react';
import { useStudentOrderStore } from '@/app/lib/stores/student-order.store';
import {
  CreateOrderRequest,
  ShowOrderWithCodeRequest,
} from '@/app/lib/types/order';

export const useStudentOrder = () => {
  const store = useStudentOrderStore();

  const fetchOrders = useCallback(
    () => store.fetchOrders(),
    [store.fetchOrders]
  );

  const fetchOrderById = useCallback(
    (id: string) => store.fetchOrderById(id),
    [store.fetchOrderById]
  );

  const buyOrder = useCallback(
    (payload: CreateOrderRequest) => store.buyOrder(payload),
    [store.buyOrder]
  );

  const showOrderWithCode = useCallback(
    (payload: ShowOrderWithCodeRequest) => store.showOrderWithCode(payload),
    [store.showOrderWithCode]
  );

  return {
    // State
    orders: store.orders,
    currentOrder: store.currentOrder,
    loading: store.loading,
    error: store.error,
    pagination: store.pagination,

    // Actions
    fetchOrders,
    fetchOrderById,
    buyOrder,
    showOrderWithCode,
    clearError: store.clearError,
  };
};
