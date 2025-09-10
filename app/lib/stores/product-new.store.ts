import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ApiError } from '@/app/lib/api/client';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  GetProductResponse,
} from '@/app/lib/types/product';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/app/lib/api/admin/products';
import { getProductCategories } from '@/app/lib/api/admin/product-categories';
import type { ProductCategory } from '@/app/lib/api/admin/product-categories';

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
  createProduct: (payload: CreateProductRequest) => Promise<GetProductResponse>;
  updateProduct: (id: string, payload: UpdateProductRequest) => Promise<GetProductResponse>;
  deleteProduct: (id: string) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;

  // Category actions
  fetchCategoryList: () => Promise<void>;
}

export const useProductStore = create<ProductState>()(
  devtools((set, get) => ({
    // Initial state
    productList: [],
    categoryList: [],
    currentProduct: null,
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
        const response = await getProducts();
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
        const newProduct = await createProduct(payload);
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
        const updatedProduct = await updateProduct(id, payload);
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
        await deleteProduct(id);
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

    fetchProductById: async (id) => {
      try {
        set({ loading: true, error: null });
        const product = await getProduct(id);
        set({
          currentProduct: product.data,
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
        const response = await getProductCategories();
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
  }), {
    name: 'product-store',
  })
);
