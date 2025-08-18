import { create } from 'zustand';
import { faqService } from '@/app/lib/services/faq.service';
import {
  FAQ,
  CreateFAQRequest,
  UpdateFAQRequest,
} from '@/app/lib/types';
import toast from 'react-hot-toast';

interface FAQStore {
  // State
  faqs: FAQ[];
  currentFAQ: FAQ | null;
  isLoading: boolean;
  isListLoading: boolean;
  error: string | null;

  // Actions
  fetchFAQs: () => Promise<void>;
  fetchFAQById: (id: string) => Promise<void>;
  createFAQ: (payload: CreateFAQRequest) => Promise<void>;
  updateFAQ: (id: string, payload: UpdateFAQRequest) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;
  clearCurrentFAQ: () => void;
  clearError: () => void;
}

export const useFAQStore = create<FAQStore>((set, get) => ({
  // Initial state
  faqs: [],
  currentFAQ: null,
  isLoading: false,
  isListLoading: false,
  error: null,

  // Actions
  fetchFAQs: async () => {
    try {
      set({ isListLoading: true, error: null });
      const response = await faqService.getList();
      
      if (response.data) {
        set({ faqs: response.data });
      } else {
        throw new Error('خطا در دریافت سوالات متداول');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در دریافت سوالات متداول';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isListLoading: false });
    }
  },

  fetchFAQById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await faqService.getById(id);
      
      if (response.data) {
        set({ currentFAQ: response.data });
      } else {
        throw new Error('خطا در دریافت سوال متداول');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در دریافت سوال متداول';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  createFAQ: async (payload: CreateFAQRequest) => {
    try {
      set({ isLoading: true, error: null });
      const response = await faqService.create(payload);
      
      if (response.data) {
        const newFAQ = response.data;
        set(state => ({ 
          faqs: [newFAQ, ...state.faqs],
          currentFAQ: newFAQ
        }));
        toast.success('سوال متداول با موفقیت ایجاد شد');
      } else {
        throw new Error('خطا در ایجاد سوال متداول');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در ایجاد سوال متداول';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateFAQ: async (id: string, payload: UpdateFAQRequest) => {
    try {
      set({ isLoading: true, error: null });
      const response = await faqService.update(id, payload);
      
      if (response.data) {
        const updatedFAQ = response.data;
        const faqId = parseInt(id);
        set(state => ({
          faqs: state.faqs.map(faq => 
            faq.id === faqId ? updatedFAQ : faq
          ),
          currentFAQ: state.currentFAQ?.id === faqId ? updatedFAQ : state.currentFAQ
        }));
        toast.success('سوال متداول با موفقیت ویرایش شد');
      } else {
        throw new Error('خطا در ویرایش سوال متداول');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در ویرایش سوال متداول';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFAQ: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await faqService.delete(id);
      
      const faqId = parseInt(id);
      set(state => ({
        faqs: state.faqs.filter(faq => faq.id !== faqId),
        currentFAQ: state.currentFAQ?.id === faqId ? null : state.currentFAQ
      }));
      toast.success('سوال متداول با موفقیت حذف شد');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در حذف سوال متداول';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearCurrentFAQ: () => set({ currentFAQ: null }),
  clearError: () => set({ error: null }),
}));
