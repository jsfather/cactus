import { useCallback } from 'react';
import { useFAQStore } from '@/app/lib/stores/faq.store';
import { CreateFAQRequest, UpdateFAQRequest } from '@/app/lib/types';

export const useFAQ = () => {
  const {
    faqs,
    currentFAQ,
    isLoading,
    isListLoading,
    error,
    fetchFAQs,
    fetchFAQById,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    clearCurrentFAQ,
    clearError,
  } = useFAQStore();

  const handleCreateFAQ = useCallback(async (payload: CreateFAQRequest) => {
    await createFAQ(payload);
  }, [createFAQ]);

  const handleUpdateFAQ = useCallback(async (id: string, payload: UpdateFAQRequest) => {
    await updateFAQ(id, payload);
  }, [updateFAQ]);

  const handleDeleteFAQ = useCallback(async (id: string) => {
    await deleteFAQ(id);
  }, [deleteFAQ]);

  return {
    // State
    faqs,
    currentFAQ,
    isLoading,
    isListLoading,
    error,

    // Actions
    fetchFAQs,
    fetchFAQById,
    createFAQ: handleCreateFAQ,
    updateFAQ: handleUpdateFAQ,
    deleteFAQ: handleDeleteFAQ,
    clearCurrentFAQ,
    clearError,
  };
};
