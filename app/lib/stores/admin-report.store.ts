import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { adminReportService } from '@/app/lib/services/admin-report.service';
import { Report } from '@/lib/types/report';

interface AdminReportState {
  reports: Report[];
  loading: boolean;
  error: string | null;
  fetchReports: (params?: {
    term_id?: number;
    term_teacher_schedule_id?: number;
  }) => Promise<void>;
  clearReports: () => void;
}

export const useAdminReportStore = create<AdminReportState>()(
  devtools(
    (set) => ({
      reports: [],
      loading: false,
      error: null,

      fetchReports: async (params) => {
        set({ loading: true, error: null });
        try {
          const response = await adminReportService.getList(params);
          set({ reports: response.data, loading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'خطا در دریافت گزارشات',
            loading: false,
          });
        }
      },

      clearReports: () => {
        set({ reports: [], error: null });
      },
    }),
    { name: 'AdminReportStore' }
  )
);
