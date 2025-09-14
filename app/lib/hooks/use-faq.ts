import { useCallback } from 'react';
import { useFAQStore } from '@/app/lib/stores/faq.store';
import { CreateFAQRequest, UpdateFAQRequest } from '@/app/lib/types';

export const useFAQ = () => {
  const store = useFAQStore();

  const fetchFAQList = useCallback(() => store.fetchFAQList(), [store.fetchFAQList]);

  const createFAQ = useCallback(
    (payload: CreateFAQRequest) => store.createFAQ(payload),
    [store.createFAQ]
  );

  const updateFAQ = useCallback(
    (id: string, payload: UpdateFAQRequest) => store.updateFAQ(id, payload),
    [store.updateFAQ]
  );

  const deleteFAQ = useCallback(
    (id: string) => store.deleteFAQ(id),
    [store.deleteFAQ]
  );

  const fetchFAQById = useCallback(
    (id: string) => store.fetchFAQById(id),
    [store.fetchFAQById]
  );

  return {
    // State
    faqList: store.faqList,
    currentFAQ: store.currentFAQ,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchFAQList,
    updateFAQ,
    createFAQ,
    deleteFAQ,
    fetchFAQById,
    clearError: store.clearError,
  };
};