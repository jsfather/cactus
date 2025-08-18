import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { termService } from '@/app/lib/services/term.service';
import type { ApiError } from '@/app/lib/api/client';
import { Term, CreateTermRequest, UpdateTermRequest, GetTermResponse } from '@/app/lib/types';

interface TermState {
  // State
  termList: Term[];
  currentTerm: Term | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchTermList: () => Promise<void>;
  createTerm: (payload: CreateTermRequest) => Promise<GetTermResponse>;
  updateTerm: (id: string, payload: UpdateTermRequest) => Promise<GetTermResponse>;
  deleteTerm: (id: string) => Promise<void>;
  fetchTermById: (id: string) => Promise<void>;
}

export const useTermStore = create<TermState>()(
  devtools((set, get) => ({
    // Initial state
    termList: [],
    currentTerm: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    fetchTermList: async () => {
      try {
        set({ loading: true, error: null });
        const response = await termService.getList();
        set({
          termList: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    createTerm: async (payload) => {
      try {
        set({ loading: true, error: null });
        const newTerm = await termService.create(payload);
        set((state) => ({
          termList: [newTerm.data, ...state.termList],
          loading: false,
        }));
        return newTerm;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    updateTerm: async (id, payload) => {
      try {
        set({ loading: true, error: null });
        const updatedTerm = await termService.update(id, payload);
        set((state) => ({
          termList: state.termList.map((term) =>
            term.id.toString() === id ? updatedTerm.data : term
          ),
          currentTerm: updatedTerm.data,
          loading: false,
        }));
        return updatedTerm;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    deleteTerm: async (id) => {
      try {
        set({ loading: true, error: null });
        await termService.delete(id);
        set((state) => ({
          termList: state.termList.filter((term) => term.id.toString() !== id),
          loading: false,
        }));
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchTermById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const term = await termService.getById(id);
        set({ currentTerm: term.data, loading: false });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);
