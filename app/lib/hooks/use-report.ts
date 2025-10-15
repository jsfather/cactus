import { useCallback } from 'react';
import { useReportStore } from '@/app/lib/stores/report.store';
import { CreateReportRequest } from '@/lib/types/report';

export const useReport = () => {
  const store = useReportStore();

  const fetchReportList = useCallback(
    () => store.fetchReportList(),
    [store.fetchReportList]
  );

  const createReport = useCallback(
    (payload: CreateReportRequest) => store.createReport(payload),
    [store.createReport]
  );

  const deleteReport = useCallback(
    (id: string) => store.deleteReport(id),
    [store.deleteReport]
  );

  const fetchReportById = useCallback(
    (id: string) => store.fetchReportById(id),
    [store.fetchReportById]
  );

  return {
    // State
    reportList: store.reportList,
    currentReport: store.currentReport,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchReportList,
    createReport,
    deleteReport,
    fetchReportById,
    clearError: store.clearError,
  };
};
