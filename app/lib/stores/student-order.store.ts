import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { studentOrderService } from '@/app/lib/services/student-order.service';
import type { ApiError } from '@/app/lib/api/client';
import {
  Order,
  CreateOrderRequest,
  CreateOrderResponse,
  ShowOrderWithCodeRequest,
  GetOrderResponse,
} from '@/app/lib/types/order';
import toast from 'react-hot-toast';

interface StudentOrderState {
  // State
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  } | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  buyOrder: (payload: CreateOrderRequest) => Promise<CreateOrderResponse>;
  showOrderWithCode: (payload: ShowOrderWithCodeRequest) => Promise<void>;
}

export const useStudentOrderStore = create<StudentOrderState>()(
  devtools((set, get) => ({
    // Initial state
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    pagination: null,

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    fetchOrders: async () => {
      try {
        set({ loading: true, error: null });
        const response = await studentOrderService.getList();
        set({
          orders: response.data,
          pagination: response.meta
            ? {
                current_page: response.meta.current_page,
                last_page: response.meta.last_page,
                total: response.meta.total,
                per_page: response.meta.per_page,
              }
            : null,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        toast.error(apiError.message || 'خطا در دریافت لیست سفارشات');
        throw error;
      }
    },

    fetchOrderById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const response = await studentOrderService.getById(id);
        set({ currentOrder: response.data, loading: false });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        toast.error(apiError.message || 'خطا در دریافت جزئیات سفارش');
        throw error;
      }
    },

    buyOrder: async (payload: CreateOrderRequest) => {
      try {
        set({ loading: true, error: null });
        const response = await studentOrderService.buyOrder(payload);
        set({ loading: false });
        toast.success('سفارش با موفقیت ثبت شد');
        return response;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        toast.error(apiError.message || 'خطا در ثبت سفارش');
        throw error;
      }
    },

    showOrderWithCode: async (payload: ShowOrderWithCodeRequest) => {
      try {
        set({ loading: true, error: null });
        const response = await studentOrderService.showWithCode(payload);
        set({ currentOrder: response.data, loading: false });
        toast.success('سفارش پیدا شد');
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        toast.error(apiError.message || 'سفارش با این کد پیدا نشد');
        throw error;
      }
    },
  }))
);
