import { useCallback } from 'react';
import { useExamStore } from '@/app/lib/stores/exam.store';
import { CreateExamRequest, UpdateExamRequest } from '@/app/lib/types/exam';

export const useExam = () => {
  const {
    exams,
    currentExam,
    isLoading,
    isListLoading,
    error,
    fetchExams,
    fetchExamById,
    createExam,
    updateExam,
    deleteExam,
    clearCurrentExam,
    clearError,
  } = useExamStore();

  const handleCreateExam = useCallback(async (payload: CreateExamRequest) => {
    await createExam(payload);
  }, [createExam]);

  const handleUpdateExam = useCallback(async (id: string, payload: UpdateExamRequest) => {
    await updateExam(id, payload);
  }, [updateExam]);

  const handleDeleteExam = useCallback(async (id: string) => {
    await deleteExam(id);
  }, [deleteExam]);

  return {
    // State
    exams,
    currentExam,
    isLoading,
    isListLoading,
    error,

    // Actions
    fetchExams,
    fetchExamById,
    createExam: handleCreateExam,
    updateExam: handleUpdateExam,
    deleteExam: handleDeleteExam,
    clearCurrentExam,
    clearError,
  };
};
