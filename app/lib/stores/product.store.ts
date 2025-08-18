import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { productService } from '@/app/lib/services/product.service';
import type { ApiError } from '@/app/lib/api/client';
import { Product, ProductCategory, CreateProductRequest, UpdateProductRequest, GetProductResponse } from '@/app/lib/types';

interface ProductState {
  // State
  productList: Product[];
  categoryList: ProductCategory[];
  currentProduct: Product | null;
  currentCategory: ProductCategory | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Product actions
  fetchProductList: () => Promise<void>;
  createProduct: (payload: CreateProductRequest) => Promise<GetProductResponse>;
  updateProduct: (id: string, payload: UpdateProductRequest) => Promise<GetProductResponse>;
  deleteProduct: (id: string) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;

  // Category actions
  fetchCategoryList: () => Promise<void>;
  createCategory: (payload: any) => Promise<any>;
  updateCategory: (id: string, payload: any) => Promise<any>;
  deleteCategory: (id: string) => Promise<void>;
  fetchCategoryById: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>()(
  devtools((set, get) => ({
    // Initial state
    productList: [],
    categoryList: [],
    currentProduct: null,
    currentCategory: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // Product actions
    fetchProductList: async () => {
      try {
        set({ loading: true, error: null });
        const response = await productService.getList();
        set({
          productList: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    createProduct: async (payload) => {
      try {
        set({ loading: true, error: null });
        const newProduct = await productService.create(payload);
        set((state) => ({
          productList: [newProduct.data, ...state.productList],
          loading: false,
        }));
        return newProduct;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    updateProduct: async (id, payload) => {
      try {
        set({ loading: true, error: null });
        const updatedProduct = await productService.update(id, payload);
        set((state) => ({
          productList: state.productList.map((product) =>
            product.id.toString() === id ? updatedProduct.data : product
          ),
          currentProduct: updatedProduct.data,
          loading: false,
        }));
        return updatedProduct;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    deleteProduct: async (id) => {
      try {
        set({ loading: true, error: null });
        await productService.delete(id);
        set((state) => ({
          productList: state.productList.filter((product) => product.id.toString() !== id),
          loading: false,
        }));
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchProductById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const product = await productService.getById(id);
        set({ currentProduct: product.data, loading: false });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    // Category actions
    fetchCategoryList: async () => {
      try {
        set({ loading: true, error: null });
        const response = await productService.getCategoryList();
        set({
          categoryList: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    createCategory: async (payload) => {
      try {
        set({ loading: true, error: null });
        const newCategory = await productService.createCategory(payload);
        set((state) => ({
          categoryList: [newCategory.data, ...state.categoryList],
          loading: false,
        }));
        return newCategory;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    updateCategory: async (id, payload) => {
      try {
        set({ loading: true, error: null });
        const updatedCategory = await productService.updateCategory(id, payload);
        set((state) => ({
          categoryList: state.categoryList.map((category) =>
            category.id.toString() === id ? updatedCategory.data : category
          ),
          currentCategory: updatedCategory.data,
          loading: false,
        }));
        return updatedCategory;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    deleteCategory: async (id) => {
      try {
        set({ loading: true, error: null });
        await productService.deleteCategory(id);
        set((state) => ({
          categoryList: state.categoryList.filter((category) => category.id.toString() !== id),
          loading: false,
        }));
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchCategoryById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const category = await productService.getCategoryById(id);
        set({ currentCategory: category.data, loading: false });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);
