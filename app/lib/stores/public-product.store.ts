import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  publicProductService,
  PublicProduct,
  ProductSearchParams,
  GetPublicProductsResponse,
} from '@/app/lib/services/public-product.service';
import type { ApiError } from '@/app/lib/api/client';

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface PublicProductState {
  // State
  products: PublicProduct[];
  allProducts: PublicProduct[];
  currentProduct: PublicProduct | null;
  loading: boolean;
  loadingMore: boolean;
  allProductsLoading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  currentSearchParams: ProductSearchParams;

  // Actions
  setLoading: (loading: boolean) => void;
  setAllProductsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  fetchHomeProducts: (params?: ProductSearchParams) => Promise<void>;
  fetchMoreProducts: () => Promise<void>;
  resetProducts: () => void;
  fetchAllProducts: (params?: ProductSearchParams) => Promise<void>;
  findProductById: (id: number) => PublicProduct | null;
  setCurrentProduct: (product: PublicProduct | null) => void;
  clearCurrentProduct: () => void;
  hasMoreProducts: () => boolean;
}

export const usePublicProductStore = create<PublicProductState>()(
  devtools((set, get) => ({
    // Initial state
    products: [],
    allProducts: [],
    currentProduct: null,
    loading: false,
    loadingMore: false,
    allProductsLoading: false,
    error: null,
    pagination: null,
    currentSearchParams: {},

    // Actions
    setLoading: (loading) => set({ loading }),

    setAllProductsLoading: (loading) => set({ allProductsLoading: loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    clearCurrentProduct: () => set({ currentProduct: null }),

    setCurrentProduct: (product) => set({ currentProduct: product }),

    resetProducts: () =>
      set({ products: [], pagination: null, currentSearchParams: {} }),

    hasMoreProducts: () => {
      const { pagination } = get();
      if (!pagination) return false;
      return pagination.current_page < pagination.last_page;
    },

    findProductById: (id: number) => {
      const { allProducts } = get();
      return allProducts.find((product) => product.id === id) || null;
    },

    fetchHomeProducts: async (params?: ProductSearchParams) => {
      try {
        set({ loading: true, error: null, currentSearchParams: params || {} });
        const response = await publicProductService.getHomeProducts({
          ...params,
          page: 1,
        });
        set({
          products: response.data,
          pagination: response.meta,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchMoreProducts: async () => {
      const { pagination, loadingMore, products, currentSearchParams } = get();

      // Don't fetch if already loading or no more pages
      if (
        loadingMore ||
        !pagination ||
        pagination.current_page >= pagination.last_page
      ) {
        return;
      }

      try {
        set({ loadingMore: true, error: null });
        const nextPage = pagination.current_page + 1;
        const response = await publicProductService.getHomeProducts({
          ...currentSearchParams,
          page: nextPage,
        });
        set({
          products: [...products, ...response.data],
          pagination: response.meta,
          loadingMore: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loadingMore: false });
        throw error;
      }
    },

    fetchAllProducts: async (params?: ProductSearchParams) => {
      try {
        set({ allProductsLoading: true, error: null });
        const response = await publicProductService.getProducts(params);
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
