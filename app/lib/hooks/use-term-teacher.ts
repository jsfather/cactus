import { useCallback } from 'react';
import { useTermTeacherStore } from '@/app/lib/stores/term-teacher.store';
import {
  CreateTermTeacherRequest,
  UpdateTermTeacherRequest,
} from '@/app/lib/types/term_teacher';

export const useTermTeacher = () => {
  const store = useTermTeacherStore();

  const fetchTermTeacherList = useCallback(
    () => store.fetchTermTeacherList(),
    [store.fetchTermTeacherList]
  );

  const createTermTeacher = useCallback(
    (payload: CreateTermTeacherRequest) => store.createTermTeacher(payload),
    [store.createTermTeacher]
  );

  const updateTermTeacher = useCallback(
    (id: string, payload: UpdateTermTeacherRequest) =>
      store.updateTermTeacher(id, payload),
    [store.updateTermTeacher]
  );

  const deleteTermTeacher = useCallback(
    (id: string) => store.deleteTermTeacher(id),
    [store.deleteTermTeacher]
  );

  const fetchTermTeacherById = useCallback(
    (id: string) => store.fetchTermTeacherById(id),
    [store.fetchTermTeacherById]
  );

  return {
    // State
    termTeacherList: store.termTeacherList,
    currentTermTeacher: store.currentTermTeacher,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchTermTeacherList,
    createTermTeacher,
    updateTermTeacher,
    deleteTermTeacher,
    fetchTermTeacherById,
    setLoading: store.setLoading,
    setError: store.setError,
    clearError: store.clearError,
  };
};