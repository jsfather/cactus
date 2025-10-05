import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  publicProductService,
  PublicProduct,
} from '@/app/lib/services/public-product.service';
import type { ApiError } from '@/app/lib/api/client';

interface PublicProductState {
  // State
  products: PublicProduct[];
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  fetchHomeProducts: () => Promise<void>;
}

export const usePublicProductStore = create<PublicProductState>()(
  devtools((set, get) => ({
    // Initial state
    products: [],
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    fetchHomeProducts: async () => {
      try {
        set({ loading: true, error: null });
        const response = await publicProductService.getHomeProducts();
        set({
          products: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);
