import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ApiError } from '@/app/lib/api/client';
import {
  Product,
  CreateProductFormData,
  UpdateProductFormData,
  GetProductResponse,
} from '@/app/lib/types/product';
import { productService } from '@/app/lib/services/product.service';
import type { ProductCategory } from '@/app/lib/types/product';

interface ProductState {
  // State
  productList: Product[];
  categoryList: ProductCategory[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Product actions
  fetchProductList: () => Promise<void>;
  createProduct: (
    payload: CreateProductFormData
  ) => Promise<GetProductResponse>;
  updateProduct: (
    id: string,
    payload: UpdateProductFormData
  ) => Promise<GetProductResponse>;
  deleteProduct: (id: string) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;

  // Category actions
  fetchCategoryList: () => Promise<void>;
}

export const useProductStore = create<ProductState>()(
  devtools(
    (set, get) => ({
      // Initial state
      productList: [],
      categoryList: [],
      currentProduct: null,
      loading: false,
      error: null,

      // Basic actions
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
            productList: state.productList.filter(
              (product) => product.id.toString() !== id
            ),
            loading: false,
          }));
        } catch (error) {
          const apiError = error as ApiError;
          set({ error: apiError.message, loading: false });
          throw error;
        }
      },

      fetchProductById: async (id) => {
        try {
          set({ loading: true, error: null });
          const response = await productService.getById(id);
          set({
            currentProduct: response.data,
            loading: false,
          });
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
            categoryList: response.data || [],
            loading: false,
          });
        } catch (error) {
          const apiError = error as ApiError;
          set({ error: apiError.message, loading: false });
          throw error;
        }
      },
    }),
    {
      name: 'product-store',
    }
  )
);
