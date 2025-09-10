import { useCallback } from 'react';
import { useProductCategoryStore } from '@/app/lib/stores/productCategory.store';
import { ProductCategoryFormData } from '@/app/lib/api/admin/product-categories';

export const useProductCategory = () => {
  const store = useProductCategoryStore();

  const fetchCategories = useCallback(() => store.fetchCategories(), [store.fetchCategories]);

  const createCategory = useCallback(
    (payload: ProductCategoryFormData) => store.createCategory(payload),
    [store.createCategory]
  );

  const updateCategory = useCallback(
    (id: string | number, payload: ProductCategoryFormData) => store.updateCategory(id, payload),
    [store.updateCategory]
  );

  const deleteCategory = useCallback(
    (id: string | number) => store.deleteCategory(id),
    [store.deleteCategory]
  );

  const fetchCategoryById = useCallback(
    (id: string | number) => store.fetchCategoryById(id),
    [store.fetchCategoryById]
  );

  return {
    categories: store.categories,
    currentCategory: store.currentCategory,
    loading: store.loading,
    error: store.error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchCategoryById,
    clearCurrentCategory: store.clearCurrentCategory,
    clearError: store.clearError,
  };
};
