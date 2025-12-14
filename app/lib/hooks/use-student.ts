import { useCallback } from 'react';
import { useStudentStore } from '@/app/lib/stores/student.store';
import { CreateStudentRequest, UpdateStudentRequest } from '@/app/lib/types';

export const useStudent = () => {
  const store = useStudentStore();

  const fetchStudentList = useCallback(
    (page?: number) => store.fetchStudentList(page),
    [store.fetchStudentList]
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

  return {
    // State
    studentList: store.studentList,
    currentStudent: store.currentStudent,
    loading: store.loading,
    error: store.error,
    pagination: store.pagination,

    // Actions
    fetchStudentList,
    createStudent,
    updateStudent,
    deleteStudent,
    fetchStudentById,
    clearCurrentStudent,
    clearError: store.clearError,
  };
};
