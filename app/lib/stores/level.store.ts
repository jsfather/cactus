import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { levelService } from '@/app/lib/services/level.service';
import type { ApiError } from '@/app/lib/api/client';
import { Level } from '@/app/lib/types/level';

interface LevelState {
  // State
  levelList: Level[];
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchLevelList: () => Promise<void>;
}

export const useLevelStore = create<LevelState>()(
  devtools(
    (set, get) => ({
      // Initial state
      levelList: [],
      loading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      fetchLevelList: async () => {
        try {
          set({ loading: true, error: null });
          const response = await levelService.getList();
          set({
            levelList: response.data,
            loading: false,
          });
        } catch (error) {
          const apiError = error as ApiError;
          set({
            error: apiError.message || 'خطایی در دریافت لیست سطوح رخ داد',
            loading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: 'level-store',
    }
  )
);
