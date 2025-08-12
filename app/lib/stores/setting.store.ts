import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { settingsService } from '@/app/lib/services/settings.service';
import type { GetSettingsResponse, Settings } from '@/app/lib/types/settings';
import type { ApiError } from '@/app/lib/api/client';

interface SettingsState {
  // State
  settings: Settings;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // User CRUD
  fetchSettings: () => Promise<void>;
  updateSettings: (settingsData: Settings) => Promise<GetSettingsResponse>;
}

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        settings: {
          id: '',
          about_us: '',
          phone: '',
          email: '',
          address: '',
          our_mission: '',
          our_vision: '',
          footer_text: '',
        },
        loading: false,
        error: null,

        // Actions
        setLoading: (loading) => set({ loading }),

        setError: (error) => set({ error }),

        clearError: () => set({ error: null }),

        fetchSettings: async () => {
          try {
            set({ loading: true, error: null });
            const response = await settingsService.getSettings();
            set({
              settings: response.data,
              loading: false,
            });
          } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, loading: false });
            throw error;
          }
        },

        updateSettings: async (settingsData) => {
          try {
            set({ loading: true, error: null });
            const updatedSettings =
              await settingsService.updateSettings(settingsData);
            set((state) => ({
              settings: state.settings,
              loading: false,
            }));
            return updatedSettings;
          } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, loading: false });
            throw error;
          }
        },
      }),
      {
        name: 'settings-store',
        partialize: (state) => ({ settings: state.settings }),
      }
    ),
    { name: 'settings-store' }
  )
);
