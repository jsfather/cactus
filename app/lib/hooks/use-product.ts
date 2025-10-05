import { useCallback } from 'react';
import { useProductStore } from '@/app/lib/stores/product.store';
import {
  CreateProductFormData,
  UpdateProductFormData,
} from '@/app/lib/types/product';

export const useProduct = () => {
  const store = useProductStore();

  const fetchProductList = useCallback(
    () => store.fetchProductList(),
    [store.fetchProductList]
  );
  const fetchCategoryList = useCallback(
    () => store.fetchCategoryList(),
    [store.fetchCategoryList]
  );

  const createProduct = useCallback(
    (payload: CreateProductFormData) => store.createProduct(payload),
    [store.createProduct]
  );

  const updateProduct = useCallback(
    (id: string, payload: UpdateProductFormData) =>
      store.updateProduct(id, payload),
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

  return {
    // State
    productList: store.productList,
    categoryList: store.categoryList,
    currentProduct: store.currentProduct,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchProductList,
    fetchCategoryList,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProductById,
    clearError: store.clearError,
  };
};
