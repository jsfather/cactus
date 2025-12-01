import { useCallback } from 'react';
import { useSearchStore } from '@/app/lib/stores/search.store';
import { SearchParams } from '@/app/lib/types/search';

export const useSearch = () => {
  const store = useSearchStore();

  const searchBlogs = useCallback(
    (params?: SearchParams) => store.searchBlogs(params),
    [store.searchBlogs]
  );

  const searchProducts = useCallback(
    (params?: SearchParams) => store.searchProducts(params),
    [store.searchProducts]
  );

  const searchAll = useCallback(
    (query: string) => store.searchAll(query),
    [store.searchAll]
  );

  const clearResults = useCallback(
    () => store.clearResults(),
    [store.clearResults]
  );

  const setQuery = useCallback(
    (query: string) => store.setQuery(query),
    [store.setQuery]
  );

  return {
    // State
    query: store.query,
    blogs: store.blogs,
    products: store.products,
    blogsLoading: store.blogsLoading,
    productsLoading: store.productsLoading,
    blogsError: store.blogsError,
    productsError: store.productsError,
    isLoading: store.blogsLoading || store.productsLoading,

    // Actions
    searchBlogs,
    searchProducts,
    searchAll,
    clearResults,
    clearErrors: store.clearErrors,
    setQuery,
  };
};
