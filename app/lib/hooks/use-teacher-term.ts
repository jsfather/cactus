import { useCallback } from 'react';
import { useTeacherTermStore } from '@/app/lib/stores/teacher-term.store';

export const useTeacherTerm = () => {
  const {
    terms,
    currentTerm,
    loading,
    error,
    fetchTerms,
    fetchTermById,
    clearCurrentTerm,
    clearError,
  } = useTeacherTermStore();

  // Memoized callbacks for better performance
  const handleFetchTerms = useCallback(async () => {
    await fetchTerms();
  }, [fetchTerms]);

  const handleFetchTermById = useCallback(async (id: string) => {
    await fetchTermById(id);
  }, [fetchTermById]);

  const handleClearCurrentTerm = useCallback(() => {
    clearCurrentTerm();
  }, [clearCurrentTerm]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    // State
    terms,
    currentTerm,
    loading,
    error,

    // Actions
    fetchTerms: handleFetchTerms,
    fetchTermById: handleFetchTermById,
    clearCurrentTerm: handleClearCurrentTerm,
    clearError: handleClearError,
  };
};