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
  allProducts: PublicProduct[];
  currentProduct: PublicProduct | null;
  loading: boolean;
  allProductsLoading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setAllProductsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  fetchHomeProducts: () => Promise<void>;
  fetchAllProducts: () => Promise<void>;
  findProductById: (id: number) => PublicProduct | null;
  setCurrentProduct: (product: PublicProduct | null) => void;
  clearCurrentProduct: () => void;
}

export const usePublicProductStore = create<PublicProductState>()(
  devtools((set, get) => ({
    // Initial state
    products: [],
    allProducts: [],
    currentProduct: null,
    loading: false,
    allProductsLoading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),

    setAllProductsLoading: (loading) => set({ allProductsLoading: loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    clearCurrentProduct: () => set({ currentProduct: null }),

    setCurrentProduct: (product) => set({ currentProduct: product }),

    findProductById: (id: number) => {
      const { allProducts } = get();
      return allProducts.find(product => product.id === id) || null;
    },

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

    fetchAllProducts: async () => {
      try {
        set({ allProductsLoading: true, error: null });
        const response = await publicProductService.getProducts();
        set({
          allProducts: response.data,
          allProductsLoading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, allProductsLoading: false });
        throw error;
      }
    },
  }))
);
