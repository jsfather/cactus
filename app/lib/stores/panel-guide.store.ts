import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { panelGuideService } from '@/app/lib/services/panel-guide.service';
import {
  PanelGuide,
  CreatePanelGuideRequest,
  UpdatePanelGuideRequest,
} from '@/app/lib/types';
import toast from 'react-hot-toast';

interface PanelGuideStore {
  // State
  panelGuides: PanelGuide[];
  currentPanelGuide: PanelGuide | null;
  isLoading: boolean;
  isListLoading: boolean;
  error: string | null;

  // Actions
  fetchPanelGuides: () => Promise<void>;
  fetchPanelGuideById: (id: string) => Promise<void>;
  createPanelGuide: (payload: CreatePanelGuideRequest | FormData) => Promise<void>;
  updatePanelGuide: (id: string, payload: UpdatePanelGuideRequest | FormData) => Promise<void>;
  deletePanelGuide: (id: string) => Promise<void>;
  clearCurrentPanelGuide: () => void;
  clearError: () => void;
}

export const usePanelGuideStore = create<PanelGuideStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      panelGuides: [],
      currentPanelGuide: null,
      isLoading: false,
      isListLoading: false,
      error: null,

      // Actions
      fetchPanelGuides: async () => {
        try {
          set({ isListLoading: true, error: null, panelGuides: [] });
          const response = await panelGuideService.getList();
          
          if (response.data) {
            set({ panelGuides: response.data });
          } else {
            throw new Error('خطا در دریافت راهنماهای پنل');
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'خطا در دریافت راهنماهای پنل';
          set({ error: errorMessage });
          toast.error(errorMessage);
        } finally {
          set({ isListLoading: false });
        }
      },

      fetchPanelGuideById: async (id: string) => {
        try {
          set({ isLoading: true, error: null, currentPanelGuide: null });
          const response = await panelGuideService.getById(id);
          
          if (response.data) {
            set({ currentPanelGuide: response.data });
          } else {
            throw new Error('خطا در دریافت راهنمای پنل');
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'خطا در دریافت راهنمای پنل';
          set({ error: errorMessage });
          toast.error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      createPanelGuide: async (payload: CreatePanelGuideRequest | FormData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await panelGuideService.create(payload);
          
          if (response.data) {
            const newPanelGuide = response.data;
            set(state => ({ 
              panelGuides: [newPanelGuide, ...state.panelGuides],
              currentPanelGuide: newPanelGuide
            }));
          } else {
            throw new Error('خطا در ایجاد راهنمای پنل');
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'خطا در ایجاد راهنمای پنل';
          set({ error: errorMessage });
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updatePanelGuide: async (id: string, payload: UpdatePanelGuideRequest | FormData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await panelGuideService.update(id, payload);
          
          if (response.data) {
            const updatedPanelGuide = response.data;
            const panelGuideId = parseInt(id);
            set(state => ({
              panelGuides: state.panelGuides.map(guide => 
                guide.id === panelGuideId ? updatedPanelGuide : guide
              ),
              currentPanelGuide: state.currentPanelGuide?.id === panelGuideId ? updatedPanelGuide : state.currentPanelGuide
            }));
          } else {
            throw new Error('خطا در ویرایش راهنمای پنل');
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'خطا در ویرایش راهنمای پنل';
          set({ error: errorMessage });
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      deletePanelGuide: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          await panelGuideService.delete(id);
          
          const panelGuideId = parseInt(id);
          set(state => ({
            panelGuides: state.panelGuides.filter(guide => guide.id !== panelGuideId),
            currentPanelGuide: state.currentPanelGuide?.id === panelGuideId ? null : state.currentPanelGuide
          }));
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'خطا در حذف راهنمای پنل';
          set({ error: errorMessage });
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      clearCurrentPanelGuide: () => set({ currentPanelGuide: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'panel-guide-store',
    }
  )
);