import { useCallback } from 'react';
import { usePublicProductStore } from '@/app/lib/stores/public-product.store';

export const usePublicProduct = () => {
  const store = usePublicProductStore();

  const fetchHomeProducts = useCallback(
    () => store.fetchHomeProducts(),
    [store.fetchHomeProducts]
  );

  return {
    // State
    products: store.products,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchHomeProducts,
    clearError: store.clearError,
  };
};
