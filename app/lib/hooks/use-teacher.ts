import { useCallback } from 'react';
import { useTeacherStore } from '@/app/lib/stores/teacher.store';
import { TeacherRequest } from '@/app/lib/services/teacher.service';

export const useTeacher = () => {
  const store = useTeacherStore();

  const fetchTeacherList = useCallback(() => store.fetchTeacherList(), [store.fetchTeacherList]);

  const createTeacher = useCallback(
    (payload: TeacherRequest | FormData) => store.createTeacher(payload),
    [store.createTeacher]
  );

  const updateTeacher = useCallback(
    (id: string, payload: TeacherRequest | FormData) => store.updateTeacher(id, payload),
    [store.updateTeacher]
  );

  const deleteTeacher = useCallback(
    (id: string) => store.deleteTeacher(id),
    [store.deleteTeacher]
  );

  const fetchTeacherById = useCallback(
    (id: string) => store.fetchTeacherById(id),
    [store.fetchTeacherById]
  );

  return {
    // State
    teacherList: store.teacherList,
    currentTeacher: store.currentTeacher,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchTeacherList,
    updateTeacher,
    createTeacher,
    deleteTeacher,
    fetchTeacherById,
    clearError: store.clearError,
  };
};