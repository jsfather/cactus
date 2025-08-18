import { useCallback } from 'react';
import { useStudentStore } from '@/app/lib/stores/student.store';
import { StudentRequest } from '@/app/lib/services/student.service';

export const useStudent = () => {
  const store = useStudentStore();

  const fetchStudentList = useCallback(() => store.fetchStudentList(), [store.fetchStudentList]);

  const createStudent = useCallback(
    (payload: StudentRequest | FormData) => store.createStudent(payload),
    [store.createStudent]
  );

  const updateStudent = useCallback(
    (id: string, payload: StudentRequest | FormData) => store.updateStudent(id, payload),
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

  const getExamPlacement = useCallback(
    (id: string) => store.getExamPlacement(id),
    [store.getExamPlacement]
  );

  return {
    // State
    studentList: store.studentList,
    currentStudent: store.currentStudent,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchStudentList,
    updateStudent,
    createStudent,
    deleteStudent,
    fetchStudentById,
    getExamPlacement,
    clearError: store.clearError,
  };
};