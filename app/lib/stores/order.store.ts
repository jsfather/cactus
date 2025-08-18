import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { orderService } from '@/app/lib/services/order.service';
import type { ApiError } from '@/app/lib/api/client';
import { Order, CreateOrderRequest, UpdateOrderRequest, GetOrderResponse } from '@/app/lib/types';

interface OrderState {
  // State
  orderList: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchOrderList: () => Promise<void>;
  createOrder: (payload: CreateOrderRequest) => Promise<GetOrderResponse>;
  updateOrder: (id: string, payload: UpdateOrderRequest) => Promise<GetOrderResponse>;
  deleteOrder: (id: string) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>()(
  devtools((set, get) => ({
    // Initial state
    orderList: [],
    currentOrder: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    fetchOrderList: async () => {
      try {
        set({ loading: true, error: null });
        const response = await orderService.getList();
        set({
          orderList: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    createOrder: async (payload) => {
      try {
        set({ loading: true, error: null });
        const newOrder = await orderService.create(payload);
        set((state) => ({
          orderList: [newOrder.data, ...state.orderList],
          loading: false,
        }));
        return newOrder;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    updateOrder: async (id, payload) => {
      try {
        set({ loading: true, error: null });
        const updatedOrder = await orderService.update(id, payload);
        set((state) => ({
          orderList: state.orderList.map((order) =>
            order.id.toString() === id ? updatedOrder.data : order
          ),
          currentOrder: updatedOrder.data,
          loading: false,
        }));
        return updatedOrder;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    deleteOrder: async (id) => {
      try {
        set({ loading: true, error: null });
        await orderService.delete(id);
        set((state) => ({
          orderList: state.orderList.filter((order) => order.id.toString() !== id),
          loading: false,
        }));
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchOrderById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const order = await orderService.getById(id);
        set({ currentOrder: order.data, loading: false });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);
