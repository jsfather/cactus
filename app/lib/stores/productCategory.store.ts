import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ApiError } from '@/app/lib/api/client';
import {
  getProductCategories,
  getProductCategory,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  ProductCategory,
  ProductCategoryFormData,
} from '@/app/lib/api/admin/product-categories';

interface ProductCategoryState {
  // State
  categories: ProductCategory[];
  currentCategory: ProductCategory | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchCategories: () => Promise<void>;
  fetchCategoryById: (id: string | number) => Promise<void>;
  createCategory: (payload: ProductCategoryFormData) => Promise<ProductCategory>;
  updateCategory: (id: string | number, payload: ProductCategoryFormData) => Promise<ProductCategory>;
  deleteCategory: (id: string | number) => Promise<void>;
  clearCurrentCategory: () => void;
}

export const useProductCategoryStore = create<ProductCategoryState>()(
  devtools((set, get) => ({
    // Initial state
    categories: [],
    currentCategory: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    clearCurrentCategory: () => set({ currentCategory: null }),

    fetchCategories: async () => {
      try {
        set({ loading: true, error: null });
        const response = await getProductCategories();
        set({
          categories: response.data || [],
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({
          error: apiError.message || 'خطا در بارگذاری دسته‌بندی‌ها',
          loading: false,
        });
        throw error;
      }
    },

    fetchCategoryById: async (id: string | number) => {
      try {
        set({ loading: true, error: null });
        const response = await getProductCategory(id);
        set({
          currentCategory: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({
          error: apiError.message || 'خطا در بارگذاری دسته‌بندی',
          loading: false,
        });
        throw error;
      }
    },

    createCategory: async (payload: ProductCategoryFormData) => {
      try {
        set({ loading: true, error: null });
        const response = await createProductCategory(payload);
        
        // Update categories list
        const currentCategories = get().categories;
        set({
          categories: [...currentCategories, response.data],
          loading: false,
        });
        
        return response.data;
      } catch (error) {
        const apiError = error as ApiError;
        set({
          error: apiError.message || 'خطا در ایجاد دسته‌بندی',
          loading: false,
        });
        throw error;
      }
    },

    updateCategory: async (id: string | number, payload: ProductCategoryFormData) => {
      try {
        set({ loading: true, error: null });
        const response = await updateProductCategory(id, payload);
        
        // Update categories list
        const currentCategories = get().categories;
        const updatedCategories = currentCategories.map(category =>
          category.id === id ? response.data : category
        );
        
        set({
          categories: updatedCategories,
          currentCategory: response.data,
          loading: false,
        });
        
        return response.data;
      } catch (error) {
        const apiError = error as ApiError;
        set({
          error: apiError.message || 'خطا در بروزرسانی دسته‌بندی',
          loading: false,
        });
        throw error;
      }
    },

    deleteCategory: async (id: string | number) => {
      try {
        set({ loading: true, error: null });
        await deleteProductCategory(id);
        
        // Remove from categories list
        const currentCategories = get().categories;
        const filteredCategories = currentCategories.filter(category => category.id !== id);
        
        set({
          categories: filteredCategories,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({
          error: apiError.message || 'خطا در حذف دسته‌بندی',
          loading: false,
        });
        throw error;
      }
    },
  }), {
    name: 'product-category-store',
  })
);
