import { useCallback } from 'react';
import { usePublicProductStore } from '@/app/lib/stores/public-product.store';

export const usePublicProduct = () => {
  const store = usePublicProductStore();

  const fetchHomeProducts = useCallback(
    () => store.fetchHomeProducts(),
    [store.fetchHomeProducts]
  );

  const fetchAllProducts = useCallback(
    () => store.fetchAllProducts(),
    [store.fetchAllProducts]
  );

  const findProductById = useCallback(
    (id: number) => store.findProductById(id),
    [store.findProductById]
  );

  return {
    // State
    products: store.products,
    allProducts: store.allProducts,
    currentProduct: store.currentProduct,
    loading: store.loading,
    allProductsLoading: store.allProductsLoading,
    error: store.error,

    // Actions
    fetchHomeProducts,
    fetchAllProducts,
    findProductById,
    setCurrentProduct: store.setCurrentProduct,
    clearError: store.clearError,
    clearCurrentProduct: store.clearCurrentProduct,
  };
};
