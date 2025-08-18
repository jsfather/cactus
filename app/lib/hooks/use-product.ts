import { useCallback } from 'react';
import { useProductStore } from '@/app/lib/stores/product.store';
import { CreateProductRequest, UpdateProductRequest } from '@/app/lib/types';

export const useProduct = () => {
  const store = useProductStore();

  const fetchProductList = useCallback(() => store.fetchProductList(), [store.fetchProductList]);
  const fetchCategoryList = useCallback(() => store.fetchCategoryList(), [store.fetchCategoryList]);

  const createProduct = useCallback(
    (payload: CreateProductRequest) => store.createProduct(payload),
    [store.createProduct]
  );

  const updateProduct = useCallback(
    (id: string, payload: UpdateProductRequest) => store.updateProduct(id, payload),
    [store.updateProduct]
  );

  const deleteProduct = useCallback(
    (id: string) => store.deleteProduct(id),
    [store.deleteProduct]
  );

  const fetchProductById = useCallback(
    (id: string) => store.fetchProductById(id),
    [store.fetchProductById]
  );

  const createCategory = useCallback(
    (payload: any) => store.createCategory(payload),
    [store.createCategory]
  );

  const updateCategory = useCallback(
    (id: string, payload: any) => store.updateCategory(id, payload),
    [store.updateCategory]
  );

  const deleteCategory = useCallback(
    (id: string) => store.deleteCategory(id),
    [store.deleteCategory]
  );

  const fetchCategoryById = useCallback(
    (id: string) => store.fetchCategoryById(id),
    [store.fetchCategoryById]
  );

  return {
    // State
    productList: store.productList,
    categoryList: store.categoryList,
    currentProduct: store.currentProduct,
    currentCategory: store.currentCategory,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchProductList,
    fetchCategoryList,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProductById,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchCategoryById,
    clearError: store.clearError,
  };
};
