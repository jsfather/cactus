import { useCallback } from 'react';
import { useStudentTermStore } from '@/app/lib/stores/student-term.store';

export const useStudentTerm = () => {
  const {
    termList,
    currentTerm,
    stats,
    loading,
    error,
    skyRoomLoading,
    skyRoomError,
    setLoading,
    setError,
    clearError,
    setSkyRoomLoading,
    setSkyRoomError,
    clearSkyRoomError,
    fetchTermList,
    fetchTermById,
    clearCurrentTerm,
    fetchSkyRoomUrl,
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

  const getSkyRoomUrl = useCallback(
    async (scheduleId: string) => {
      return fetchSkyRoomUrl(scheduleId);
    },
    [fetchSkyRoomUrl]
  );

  const resetSkyRoomError = useCallback(() => {
    clearSkyRoomError();
  }, [clearSkyRoomError]);

  return {
    // State
    termList,
    currentTerm,
    stats,
    loading,
    error,
    skyRoomLoading,
    skyRoomError,

    // Actions
    getTermList,
    getTermById,
    clearTerm,
    resetError,
    getSkyRoomUrl,
    resetSkyRoomError,
    setLoading,
    setError,
  };
};
