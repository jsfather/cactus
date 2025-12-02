import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { searchService } from '@/app/lib/services/search.service';
import type { ApiError } from '@/app/lib/api/client';
import { Blog } from '@/app/lib/types';
import { PublicProduct } from '@/app/lib/services/public-product.service';
import { SearchParams } from '@/app/lib/types/search';

interface SearchState {
  // State
  query: string;
  blogs: Blog[];
  products: PublicProduct[];
  blogsLoading: boolean;
  productsLoading: boolean;
  blogsError: string | null;
  productsError: string | null;

  // Actions
  setQuery: (query: string) => void;
  searchBlogs: (params?: SearchParams) => Promise<void>;
  searchProducts: (params?: SearchParams) => Promise<void>;
  searchAll: (query: string) => Promise<void>;
  clearResults: () => void;
  clearErrors: () => void;
}

export const useSearchStore = create<SearchState>()(
  devtools((set, get) => ({
    // Initial state
    query: '',
    blogs: [],
    products: [],
    blogsLoading: false,
    productsLoading: false,
    blogsError: null,
    productsError: null,

    // Actions
    setQuery: (query) => set({ query }),

    searchBlogs: async (params) => {
      try {
        set({ blogsLoading: true, blogsError: null });
        const response = await searchService.searchBlogs(params);
        set({
          blogs: response.data,
          blogsLoading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ blogsError: apiError.message, blogsLoading: false });
      }
    },

    searchProducts: async (params) => {
      try {
        set({ productsLoading: true, productsError: null });
        const response = await searchService.searchProducts(params);
        set({
          products: response.data,
          productsLoading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ productsError: apiError.message, productsLoading: false });
      }
    },

    searchAll: async (query) => {
      set({ query });

      // Run both searches in parallel
      await Promise.all([
        get().searchBlogs({ search: query }),
        get().searchProducts({ search: query }),
      ]);
    },

    clearResults: () =>
      set({
        query: '',
        blogs: [],
        products: [],
        blogsError: null,
        productsError: null,
      }),

    clearErrors: () =>
      set({
        blogsError: null,
        productsError: null,
      }),
  }))
);
