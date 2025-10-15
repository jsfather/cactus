import { useCallback } from 'react';
import { useTeacherStudentStore } from '@/app/lib/stores/teacher-student.store';

export const useTeacherStudent = () => {
  const store = useTeacherStudentStore();

  const fetchStudentList = useCallback(
    (page?: number) => store.fetchStudentList(page),
    [store.fetchStudentList]
  );

  const fetchStudentById = useCallback(
    (id: string) => store.fetchStudentById(id),
    [store.fetchStudentById]
  );

  const fetchStudentsByTermId = useCallback(
    (termId: string, page?: number) =>
      store.fetchStudentsByTermId(termId, page),
    [store.fetchStudentsByTermId]
  );

  return {
    // State
    studentList: store.studentList,
    termStudents: store.termStudents,
    currentStudent: store.currentStudent,
    loading: store.loading,
    error: store.error,
    pagination: store.pagination,

    // Actions
    fetchStudentList,
    fetchStudentById,
    fetchStudentsByTermId,
    clearError: store.clearError,
    clearCurrentStudent: store.clearCurrentStudent,
    clearTermStudents: store.clearTermStudents,
  };
};
