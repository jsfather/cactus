import { useCallback } from 'react';
import { useTeacherStore } from '@/app/lib/stores/teacher.store';
import {
  CreateTeacherRequest,
  UpdateTeacherRequest,
} from '@/app/lib/types/teacher';
import { TeacherSearchFilters } from '@/app/lib/services/teacher.service';

export const useTeacher = () => {
  const store = useTeacherStore();

  const fetchTeacherList = useCallback(
    (filters?: TeacherSearchFilters) => store.fetchTeacherList(filters),
    [store.fetchTeacherList]
  );

  const setSearchFilters = useCallback(
    (filters: TeacherSearchFilters) => store.setSearchFilters(filters),
    [store.setSearchFilters]
  );

  const clearSearchFilters = useCallback(
    () => store.clearSearchFilters(),
    [store.clearSearchFilters]
  );

  const createTeacher = useCallback(
    (payload: CreateTeacherRequest) => store.createTeacher(payload),
    [store.createTeacher]
  );

  const updateTeacher = useCallback(
    (id: string, payload: UpdateTeacherRequest) =>
      store.updateTeacher(id, payload),
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
    searchFilters: store.searchFilters,

    // Actions
    fetchTeacherList,
    setSearchFilters,
    clearSearchFilters,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    fetchTeacherById,
    clearError: store.clearError,
  };
};
