import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { availableTermService } from '@/app/lib/services/available-term.service';
import type { ApiError } from '@/app/lib/api/client';
import { AvailableTerm, AvailableTermsStats } from '@/app/lib/types/available-term';

interface AvailableTermState {
  // State
  availableTerms: AvailableTerm[];
  stats: AvailableTermsStats;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchAvailableTerms: () => Promise<void>;
}

const calculateStats = (terms: AvailableTerm[]): AvailableTermsStats => {
  let affordable = 0;
  let qualified = 0;
  let recommended = 0;

  terms.forEach((term) => {
    // Count affordable terms (assuming a basic price threshold or could be dynamic)
    if (term.price <= 1000000) { // Example threshold
      affordable++;
    }

    // Count qualified terms (where prerequisites are met)
    if (!term.prerequisite_missing) {
      qualified++;
    }

    // Count recommended terms (normal type and not bought)
    if (term.type === 'normal' && !term.is_bought && !term.prerequisite_missing) {
      recommended++;
    }
  });

  return {
    total: terms.length,
    affordable,
    qualified,
    recommended,
  };
};

export const useAvailableTermStore = create<AvailableTermState>()(
  devtools(
    (set, get) => ({
      // Initial state
      availableTerms: [],
      stats: {
        total: 0,
        affordable: 0,
        qualified: 0,
        recommended: 0,
      },
      loading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      fetchAvailableTerms: async () => {
        try {
          set({ loading: true, error: null });
          const response = await availableTermService.getAvailableTerms();
          const stats = calculateStats(response.data);
          set({
            availableTerms: response.data,
            stats,
            loading: false,
          });
        } catch (error) {
          const apiError = error as ApiError;
          set({
            error: apiError.message || 'خطا در دریافت ترم‌های در دسترس',
            loading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: 'available-term-store',
    }
  )
);