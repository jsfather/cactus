import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { offlineSessionService } from '@/app/lib/services/offline-session.service';
import type { ApiError } from '@/app/lib/api/client';
import {
  OfflineSession,
  CreateOfflineSessionRequest,
  UpdateOfflineSessionRequest,
  CreateOfflineSessionResponse,
  GetOfflineSessionResponse,
} from '@/app/lib/types/offline-session';

interface OfflineSessionState {
  // State
  offlineSessionList: OfflineSession[];
  currentOfflineSession: OfflineSession | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchOfflineSessionList: () => Promise<void>;
  createOfflineSession: (
    payload: CreateOfflineSessionRequest
  ) => Promise<CreateOfflineSessionResponse>;
  updateOfflineSession: (
    id: string,
    payload: UpdateOfflineSessionRequest
  ) => Promise<GetOfflineSessionResponse>;
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

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    fetchOfflineSessionList: async () => {
      try {
        set({ loading: true, error: null });
        const response = await offlineSessionService.getList();
        set({
          offlineSessionList: response.data,
          loading: false,
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
        const newOfflineSession = await offlineSessionService.create(payload);
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
        const updatedOfflineSession = await offlineSessionService.update(
          id,
          payload
        );
        set((state) => ({
          offlineSessionList: state.offlineSessionList.map((session) =>
            session.id.toString() === id ? updatedOfflineSession.data : session
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
        await offlineSessionService.delete(id);
        set((state) => ({
          offlineSessionList: state.offlineSessionList.filter(
            (session) => session.id.toString() !== id
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
        const offlineSession = await offlineSessionService.getById(id);
        set({ currentOfflineSession: offlineSession.data, loading: false });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);
