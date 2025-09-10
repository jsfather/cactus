import { useCallback } from 'react';
import { useOrderStore } from '@/app/lib/stores/order.store';
import { UpdateOrderStatusRequest } from '@/app/lib/types';

export const useOrder = () => {
  const store = useOrderStore();

  const fetchOrderList = useCallback(() => store.fetchOrderList(), [store.fetchOrderList]);

  const updateOrderStatus = useCallback(
    (id: string, payload: UpdateOrderStatusRequest) => store.updateOrderStatus(id, payload),
    [store.updateOrderStatus]
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
    updateOrderStatus,
    deleteOrder,
    fetchOrderById,
    clearError: store.clearError,
  };
};
