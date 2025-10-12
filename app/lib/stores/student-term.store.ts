import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { studentTermService } from '@/app/lib/services/student-term.service';
import type { ApiError } from '@/app/lib/api/client';
import { StudentTerm, StudentTermStats } from '@/app/lib/types/student-term';

interface StudentTermState {
  // State
  termList: StudentTerm[];
  currentTerm: StudentTerm | null;
  stats: StudentTermStats;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchTermList: () => Promise<void>;
  fetchTermById: (id: string) => Promise<void>;
  clearCurrentTerm: () => void;
}

const calculateStats = (terms: StudentTerm[]): StudentTermStats => {
  const now = new Date();

  let active = 0;
  let completed = 0;
  let upcoming = 0;

  terms.forEach((term) => {
    const schedules = term.schedules || [];
    
    if (schedules.length === 0) {
      // If no schedules, consider it upcoming
      upcoming++;
      return;
    }

    const sessionDates = schedules.map(s => new Date(s.session_date));
    const firstSession = new Date(Math.min(...sessionDates.map(d => d.getTime())));
    const lastSession = new Date(Math.max(...sessionDates.map(d => d.getTime())));

    if (firstSession > now) {
      upcoming++;
    } else if (lastSession < now) {
      completed++;
    } else {
      active++;
    }
  });

  return {
    total: terms.length,
    active,
    completed,
    upcoming,
  };
};

export const useStudentTermStore = create<StudentTermState>()(
  devtools(
    (set, get) => ({
      // Initial state
      termList: [],
      currentTerm: null,
      stats: {
        total: 0,
        active: 0,
        completed: 0,
        upcoming: 0,
      },
      loading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      fetchTermList: async () => {
        try {
          set({ loading: true, error: null });
          const response = await studentTermService.getList();
          const stats = calculateStats(response.data);
          set({
            termList: response.data,
            stats,
            loading: false,
          });
        } catch (error) {
          const apiError = error as ApiError;
          const errorMessage = apiError.message || 'خطا در دریافت لیست ترم‌ها';
          set({
            termList: [],
            stats: {
              total: 0,
              active: 0,
              completed: 0,
              upcoming: 0,
            },
            error: errorMessage,
            loading: false,
          });
          throw error;
        }
      },

      fetchTermById: async (id: string) => {
        try {
          set({ loading: true, error: null });
          const response = await studentTermService.getById(id);
          set({
            currentTerm: response.data,
            loading: false,
          });
        } catch (error) {
          const apiError = error as ApiError;
          const errorMessage = apiError.message || 'خطا در دریافت اطلاعات ترم';
          set({
            currentTerm: null,
            error: errorMessage,
            loading: false,
          });
          throw error;
        }
      },

      clearCurrentTerm: () => set({ currentTerm: null }),
    }),
    {
      name: 'student-term-store',
    }
  )
);
