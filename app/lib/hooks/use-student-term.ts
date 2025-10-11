import { useCallback } from 'react';
import { useStudentTermStore } from '@/app/lib/stores/student-term.store';

export const useStudentTerm = () => {
  const {
    termList,
    currentTerm,
    stats,
    loading,
    error,
    setLoading,
    setError,
    clearError,
    fetchTermList,
    fetchTermById,
    clearCurrentTerm,
  } = useStudentTermStore();

  const getTermList = useCallback(async () => {
    return fetchTermList();
  }, [fetchTermList]);

  const getTermById = useCallback(
    async (id: string) => {
      return fetchTermById(id);
    },
    [fetchTermById]
  );

  const clearTerm = useCallback(() => {
    clearCurrentTerm();
  }, [clearCurrentTerm]);

  const resetError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    // State
    termList,
    currentTerm,
    stats,
    loading,
    error,

    // Actions
    getTermList,
    getTermById,
    clearTerm,
    resetError,
    setLoading,
    setError,
  };
};
