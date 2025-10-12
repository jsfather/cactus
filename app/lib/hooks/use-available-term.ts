import { useCallback } from 'react';
import { useAvailableTermStore } from '@/app/lib/stores/available-term.store';

export const useAvailableTerm = () => {
  const {
    availableTerms,
    stats,
    loading,
    error,
    setLoading,
    setError,
    clearError,
    fetchAvailableTerms,
  } = useAvailableTermStore();

  const getAvailableTerms = useCallback(async () => {
    return fetchAvailableTerms();
  }, [fetchAvailableTerms]);

  const resetError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    // State
    availableTerms,
    stats,
    loading,
    error,

    // Actions
    getAvailableTerms,
    resetError,
  };
};