import { useCallback } from 'react';
import { useAdminReportStore } from '@/app/lib/stores/admin-report.store';

export const useAdminReport = () => {
  const { reports, loading, error, fetchReports, clearReports } =
    useAdminReportStore();

  const handleFetchReports = useCallback(
    (params?: { term_id?: number; term_teacher_schedule_id?: number }) => {
      return fetchReports(params);
    },
    [fetchReports]
  );

  const handleClearReports = useCallback(() => {
    clearReports();
  }, [clearReports]);

  return {
    reports,
    loading,
    error,
    fetchReports: handleFetchReports,
    clearReports: handleClearReports,
  };
};
