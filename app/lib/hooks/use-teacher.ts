import { useCallback } from 'react';
import { useTeacherStore } from '@/app/lib/stores/teacher.store';
import { CreateTeacherRequest, UpdateTeacherRequest } from '@/app/lib/types/teacher';

export const useTeacher = () => {
  const store = useTeacherStore();

  const fetchTeacherList = useCallback(() => store.fetchTeacherList(), [store.fetchTeacherList]);

  const createTeacher = useCallback(
    (payload: CreateTeacherRequest) => store.createTeacher(payload),
    [store.createTeacher]
  );

  const updateTeacher = useCallback(
    (id: string, payload: UpdateTeacherRequest) => store.updateTeacher(id, payload),
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
    totalTeachers: store.totalTeachers,

    // Actions
    fetchTeacherList,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    fetchTeacherById,
    clearError: store.clearError,
  };
};
