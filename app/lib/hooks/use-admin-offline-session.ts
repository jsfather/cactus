import { useCallback } from 'react';
import { useOfflineSessionStore } from '@/app/lib/stores/admin-offline-session.store';
import {
  OfflineSessionCreateRequest,
  OfflineSessionUpdateRequest,
} from '@/lib/types/offline-session';

export const useAdminOfflineSession = () => {
  const store = useOfflineSessionStore();

  const fetchOfflineSessionList = useCallback(
    (termId?: string | number, page?: number) =>
      store.fetchOfflineSessionList(termId, page),
    [store.fetchOfflineSessionList]
  );

  const createOfflineSession = useCallback(
    (payload: OfflineSessionCreateRequest) =>
      store.createOfflineSession(payload),
    [store.createOfflineSession]
  );

  const updateOfflineSession = useCallback(
    (id: string, payload: OfflineSessionUpdateRequest) =>
      store.updateOfflineSession(id, payload),
    [store.updateOfflineSession]
  );

  const deleteOfflineSession = useCallback(
    (id: string) => store.deleteOfflineSession(id),
    [store.deleteOfflineSession]
  );

  const fetchOfflineSessionById = useCallback(
    (id: string) => store.fetchOfflineSessionById(id),
    [store.fetchOfflineSessionById]
  );

  const setCurrentTermId = useCallback(
    (termId: string | number | null) => store.setCurrentTermId(termId),
    [store.setCurrentTermId]
  );

  return {
    // State
    offlineSessionList: store.offlineSessionList,
    currentOfflineSession: store.currentOfflineSession,
    loading: store.loading,
    error: store.error,
    currentTermId: store.currentTermId,
    paginationMeta: store.paginationMeta,

    // Actions
    fetchOfflineSessionList,
    updateOfflineSession,
    createOfflineSession,
    deleteOfflineSession,
    fetchOfflineSessionById,
    setCurrentTermId,
    clearError: store.clearError,
  };
};
