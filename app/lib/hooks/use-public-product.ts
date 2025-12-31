import { useCallback } from 'react';
import { usePublicProductStore } from '@/app/lib/stores/public-product.store';
import { ProductSearchParams } from '@/app/lib/services/public-product.service';

export const usePublicProduct = () => {
  const store = usePublicProductStore();

  const fetchHomeProducts = useCallback(
    (params?: ProductSearchParams) => store.fetchHomeProducts(params),
    [store.fetchHomeProducts]
  );

  const fetchMoreProducts = useCallback(
    () => store.fetchMoreProducts(),
    [store.fetchMoreProducts]
  );

  const fetchAllProducts = useCallback(
    (params?: ProductSearchParams) => store.fetchAllProducts(params),
    [store.fetchAllProducts]
  );

  const findProductById = useCallback(
    (id: number) => store.findProductById(id),
    [store.findProductById]
  );

  const hasMoreProducts = useCallback(
    () => store.hasMoreProducts(),
    [store.hasMoreProducts]
  );

  const resetProducts = useCallback(
    () => store.resetProducts(),
    [store.resetProducts]
  );

  return {
    // State
    products: store.products,
    allProducts: store.allProducts,
    currentProduct: store.currentProduct,
    loading: store.loading,
    loadingMore: store.loadingMore,
    allProductsLoading: store.allProductsLoading,
    error: store.error,
    pagination: store.pagination,

    // Actions
    fetchHomeProducts,
    fetchMoreProducts,
    fetchAllProducts,
    findProductById,
    hasMoreProducts,
    resetProducts,
    setCurrentProduct: store.setCurrentProduct,
    clearError: store.clearError,
    clearCurrentProduct: store.clearCurrentProduct,
  };
};
