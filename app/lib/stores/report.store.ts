import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { reportService } from '@/app/lib/services/report.service';
import type { ApiError } from '@/app/lib/api/client';
import {
  Report,
  CreateReportRequest,
  CreateReportResponse,
} from '@/lib/types/report';

interface ReportState {
  // State
  reportList: Report[];
  currentReport: Report | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchReportList: () => Promise<void>;
  createReport: (payload: CreateReportRequest) => Promise<CreateReportResponse>;
  deleteReport: (id: string) => Promise<void>;
  fetchReportById: (id: string) => Promise<void>;
}

export const useReportStore = create<ReportState>()(
  devtools((set, get) => ({
    // Initial state
    reportList: [],
    currentReport: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    fetchReportList: async () => {
      try {
        set({ loading: true, error: null });
        const response = await reportService.getList();
        set({
          reportList: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    createReport: async (payload) => {
      try {
        set({ loading: true, error: null });
        const newReport = await reportService.create(payload);
        // Refresh the list after creating
        await get().fetchReportList();
        set({ loading: false });
        return newReport;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    deleteReport: async (id) => {
      try {
        set({ loading: true, error: null });
        await reportService.delete(id);
        set((state) => ({
          reportList: state.reportList.filter(
            (report) => report.id !== parseInt(id)
          ),
          loading: false,
        }));
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchReportById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const report = await reportService.getById(id);
        set({ currentReport: report.data, loading: false });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);
