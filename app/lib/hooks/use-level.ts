import { useCallback } from 'react';
import { useLevelStore } from '@/app/lib/stores/level.store';

export const useLevel = () => {
  const store = useLevelStore();

  const fetchLevelList = useCallback(
    () => store.fetchLevelList(),
    [store.fetchLevelList]
  );

  return {
    // State
    levelList: store.levelList,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchLevelList,
    setLoading: store.setLoading,
    setError: store.setError,
    clearError: store.clearError,
  };
};
