import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { adminOfflineSessionService } from '@/app/lib/services/admin-offline-session.service';
import type { ApiError } from '@/app/lib/api/client';
import {
  OfflineSession,
  OfflineSessionCreateRequest,
  OfflineSessionUpdateRequest,
  OfflineSessionResponse,
} from '@/lib/types/offline-session';

interface OfflineSessionState {
  // State
  offlineSessionList: OfflineSession[];
  currentOfflineSession: OfflineSession | null;
  loading: boolean;
  error: string | null;
  currentTermId: string | number | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setCurrentTermId: (termId: string | number | null) => void;

  fetchOfflineSessionList: (termId?: string | number) => Promise<void>;
  createOfflineSession: (
    payload: OfflineSessionCreateRequest
  ) => Promise<OfflineSessionResponse>;
  updateOfflineSession: (
    id: string,
    payload: OfflineSessionUpdateRequest
  ) => Promise<OfflineSessionResponse>;
  deleteOfflineSession: (id: string) => Promise<void>;
  fetchOfflineSessionById: (id: string) => Promise<void>;
}

export const useOfflineSessionStore = create<OfflineSessionState>()(
  devtools((set, get) => ({
    // Initial state
    offlineSessionList: [],
    currentOfflineSession: null,
    loading: false,
    error: null,
    currentTermId: null,

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    setCurrentTermId: (termId) => set({ currentTermId: termId }),

    fetchOfflineSessionList: async (termId) => {
      try {
        set({ loading: true, error: null });
        const useTermId = termId !== undefined ? termId : get().currentTermId;
        const response = await adminOfflineSessionService.getList(
          useTermId !== null ? useTermId : undefined
        );
        set({
          offlineSessionList: response.data,
          loading: false,
          currentTermId: useTermId,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    createOfflineSession: async (payload) => {
      try {
        set({ loading: true, error: null });
        const newOfflineSession =
          await adminOfflineSessionService.create(payload);
        set((state) => ({
          offlineSessionList: [
            newOfflineSession.data,
            ...state.offlineSessionList,
          ],
          loading: false,
        }));
        return newOfflineSession;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    updateOfflineSession: async (id, payload) => {
      try {
        set({ loading: true, error: null });
        const updatedOfflineSession = await adminOfflineSessionService.update(
          id,
          payload
        );
        set((state) => ({
          offlineSessionList: state.offlineSessionList.map((session) =>
            session.id === updatedOfflineSession.data.id
              ? updatedOfflineSession.data
              : session
          ),
          currentOfflineSession: updatedOfflineSession.data,
          loading: false,
        }));
        return updatedOfflineSession;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    deleteOfflineSession: async (id) => {
      try {
        set({ loading: true, error: null });
        await adminOfflineSessionService.delete(id);
        set((state) => ({
          offlineSessionList: state.offlineSessionList.filter(
            (session) => session.id !== parseInt(id)
          ),
          loading: false,
        }));
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchOfflineSessionById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const offlineSession = await adminOfflineSessionService.getById(id);
        set({ currentOfflineSession: offlineSession.data, loading: false });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);
