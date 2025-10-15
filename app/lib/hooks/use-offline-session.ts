import { useCallback } from 'react';
import { useOfflineSessionStore } from '@/app/lib/stores/offline-session.store';
import {
  CreateOfflineSessionRequest,
  UpdateOfflineSessionRequest,
} from '@/app/lib/types/offline-session';

export const useOfflineSession = () => {
  const store = useOfflineSessionStore();

  const fetchOfflineSessionList = useCallback(
    () => store.fetchOfflineSessionList(),
    [store.fetchOfflineSessionList]
  );

  const createOfflineSession = useCallback(
    (payload: CreateOfflineSessionRequest) =>
      store.createOfflineSession(payload),
    [store.createOfflineSession]
  );

  const updateOfflineSession = useCallback(
    (id: string, payload: UpdateOfflineSessionRequest) =>
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

  return {
    // State
    offlineSessionList: store.offlineSessionList,
    currentOfflineSession: store.currentOfflineSession,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchOfflineSessionList,
    updateOfflineSession,
    createOfflineSession,
    deleteOfflineSession,
    fetchOfflineSessionById,
    clearError: store.clearError,
  };
};
