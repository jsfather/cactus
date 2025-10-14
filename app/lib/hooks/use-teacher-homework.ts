import { useCallback } from 'react';
import { useTeacherHomeworkStore } from '@/app/lib/stores/teacher-homework.store';
import { CreateTeacherHomeworkRequest, UpdateTeacherHomeworkRequest } from '@/app/lib/types/teacher-homework';

export const useTeacherHomework = () => {
  const {
    homeworks,
    currentHomework,
    loading,
    creating,
    updating,
    deleting,
    error,
    fetchHomeworks,
    fetchHomeworkById,
    createHomework,
    updateHomework,
    deleteHomework,
    clearCurrentHomework,
    clearError,
  } = useTeacherHomeworkStore();

  // Memoized callbacks for better performance
  const handleFetchHomeworks = useCallback(async () => {
    await fetchHomeworks();
  }, [fetchHomeworks]);

  const handleFetchHomeworkById = useCallback(async (id: string) => {
    await fetchHomeworkById(id);
  }, [fetchHomeworkById]);

  const handleCreateHomework = useCallback(async (payload: CreateTeacherHomeworkRequest) => {
    return await createHomework(payload);
  }, [createHomework]);

  const handleUpdateHomework = useCallback(async (id: string, payload: UpdateTeacherHomeworkRequest) => {
    return await updateHomework(id, payload);
  }, [updateHomework]);

  const handleDeleteHomework = useCallback(async (id: string) => {
    return await deleteHomework(id);
  }, [deleteHomework]);

  const handleClearCurrentHomework = useCallback(() => {
    clearCurrentHomework();
  }, [clearCurrentHomework]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    // State
    homeworks,
    currentHomework,
    loading,
    creating,
    updating,
    deleting,
    error,

    // Actions
    fetchHomeworks: handleFetchHomeworks,
    fetchHomeworkById: handleFetchHomeworkById,
    createHomework: handleCreateHomework,
    updateHomework: handleUpdateHomework,
    deleteHomework: handleDeleteHomework,
    clearCurrentHomework: handleClearCurrentHomework,
    clearError: handleClearError,
  };
};