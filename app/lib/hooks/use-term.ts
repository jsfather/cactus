import { useCallback } from 'react';
import { useTermStore } from '@/app/lib/stores/term.store';
import { CreateTermRequest, UpdateTermRequest } from '@/app/lib/types';

export const useTerm = () => {
  const store = useTermStore();

  const fetchTermList = useCallback(() => store.fetchTermList(), [store.fetchTermList]);

  const createTerm = useCallback(
    (payload: CreateTermRequest) => store.createTerm(payload),
    [store.createTerm]
  );

  const updateTerm = useCallback(
    (id: string, payload: UpdateTermRequest) => store.updateTerm(id, payload),
    [store.updateTerm]
  );

  const deleteTerm = useCallback(
    (id: string) => store.deleteTerm(id),
    [store.deleteTerm]
  );

  const fetchTermById = useCallback(
    (id: string) => store.fetchTermById(id),
    [store.fetchTermById]
  );

  return {
    // State
    termList: store.termList,
    currentTerm: store.currentTerm,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchTermList,
    createTerm,
    updateTerm,
    deleteTerm,
    fetchTermById,
    clearError: store.clearError,
  };
};
