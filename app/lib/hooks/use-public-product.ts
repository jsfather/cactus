import { useCallback } from 'react';
import { usePublicProductStore } from '@/app/lib/stores/public-product.store';
import { ProductSearchParams } from '@/app/lib/services/public-product.service';

export const usePublicProduct = () => {
  const store = usePublicProductStore();

  const fetchHomeProducts = useCallback(
    (params?: ProductSearchParams) => store.fetchHomeProducts(params),
    [store.fetchHomeProducts]
  );

  const fetchAllProducts = useCallback(
    (params?: ProductSearchParams) => store.fetchAllProducts(params),
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
