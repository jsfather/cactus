import { useCallback } from 'react';
import { useOrderStore } from '@/app/lib/stores/order.store';
import { CreateOrderRequest, UpdateOrderRequest } from '@/app/lib/types';

export const useOrder = () => {
  const store = useOrderStore();

  const fetchOrderList = useCallback(() => store.fetchOrderList(), [store.fetchOrderList]);

  const createOrder = useCallback(
    (payload: CreateOrderRequest) => store.createOrder(payload),
    [store.createOrder]
  );

  const updateOrder = useCallback(
    (id: string, payload: UpdateOrderRequest) => store.updateOrder(id, payload),
    [store.updateOrder]
  );

  const deleteOrder = useCallback(
    (id: string) => store.deleteOrder(id),
    [store.deleteOrder]
  );

  const fetchOrderById = useCallback(
    (id: string) => store.fetchOrderById(id),
    [store.fetchOrderById]
  );

  return {
    // State
    orderList: store.orderList,
    currentOrder: store.currentOrder,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchOrderList,
    createOrder,
    updateOrder,
    deleteOrder,
    fetchOrderById,
    clearError: store.clearError,
  };
};
