import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { faqService } from '@/app/lib/services/faq.service';
import type { ApiError } from '@/app/lib/api/client';
import { FAQ, CreateFAQRequest, UpdateFAQRequest, GetFAQResponse } from '@/app/lib/types';

interface FAQState {
  // State
  faqList: FAQ[];
  currentFAQ: FAQ | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchFAQList: () => Promise<void>;
  createFAQ: (payload: CreateFAQRequest) => Promise<GetFAQResponse>;
  updateFAQ: (id: string, payload: UpdateFAQRequest) => Promise<GetFAQResponse>;
  deleteFAQ: (id: string) => Promise<void>;
  fetchFAQById: (id: string) => Promise<void>;
}

export const useFAQStore = create<FAQState>()(
  devtools((set, get) => ({
    // Initial state
    faqList: [],
    currentFAQ: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    fetchFAQList: async () => {
      try {
        set({ loading: true, error: null });
        const response = await faqService.getList();
        set({
          faqList: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    createFAQ: async (payload) => {
      try {
        set({ loading: true, error: null });
        const newFAQ = await faqService.create(payload);
        set((state) => ({
          faqList: [newFAQ.data, ...state.faqList],
          loading: false,
        }));
        return newFAQ;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    updateFAQ: async (id, payload) => {
      try {
        set({ loading: true, error: null });
        const updatedFAQ = await faqService.update(id, payload);
        set((state) => ({
          faqList: state.faqList.map((faq) =>
            faq.id === updatedFAQ.data.id ? updatedFAQ.data : faq
          ),
          currentFAQ: updatedFAQ.data,
          loading: false,
        }));
        return updatedFAQ;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    deleteFAQ: async (id) => {
      try {
        set({ loading: true, error: null });
        await faqService.delete(id);
        set((state) => ({
          faqList: state.faqList.filter((faq) => faq.id !== id),
          loading: false,
        }));
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchFAQById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const faq = await faqService.getById(id);
        set({ currentFAQ: faq.data, loading: false });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);
