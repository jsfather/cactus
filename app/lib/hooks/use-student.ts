import { useCallback } from 'react';
import { useStudentStore } from '@/app/lib/stores/student.store';
import { CreateStudentRequest, UpdateStudentRequest } from '@/app/lib/types';

export const useStudent = () => {
  const store = useStudentStore();

  const fetchStudentList = useCallback(
    (page?: number, perPage?: number) => store.fetchStudentList(page, perPage),
    [store.fetchStudentList]
  );

  const fetchMoreStudents = useCallback(
    (perPage?: number) => store.fetchMoreStudents(perPage),
    [store.fetchMoreStudents]
  );

  const createStudent = useCallback(
    (payload: CreateStudentRequest) => store.createStudent(payload),
    [store.createStudent]
  );

  const updateStudent = useCallback(
    (id: string, payload: UpdateStudentRequest) =>
      store.updateStudent(id, payload),
    [store.updateStudent]
  );

  const deleteStudent = useCallback(
    (id: string) => store.deleteStudent(id),
    [store.deleteStudent]
  );

  const fetchStudentById = useCallback(
    (id: string) => store.fetchStudentById(id),
    [store.fetchStudentById]
  );

  const clearCurrentStudent = useCallback(
    () => store.clearCurrentStudent(),
    [store.clearCurrentStudent]
  );

  const resetStudentList = useCallback(
    () => store.resetStudentList(),
    [store.resetStudentList]
  );

  return {
    // State
    studentList: store.studentList,
    currentStudent: store.currentStudent,
    loading: store.loading,
    loadingMore: store.loadingMore,
    error: store.error,
    pagination: store.pagination,

    // Actions
    fetchStudentList,
    fetchMoreStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    fetchStudentById,
    clearCurrentStudent,
    resetStudentList,
    clearError: store.clearError,
  };
};
