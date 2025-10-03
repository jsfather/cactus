import { useCallback } from 'react';
import { useTermStudentStore } from '@/app/lib/stores/term-student.store';

export const useTermStudent = () => {
  const store = useTermStudentStore();

  const fetchTermStudents = useCallback(
    (filters?: { student_id?: string; term_id?: string }) =>
      store.fetchTermStudents(filters),
    [store.fetchTermStudents]
  );

  const fetchStudentActiveTerms = useCallback(
    (studentId: string) => store.fetchStudentActiveTerms(studentId),
    [store.fetchStudentActiveTerms]
  );

  const createTermStudent = useCallback(
    (data: { user_id: string; term_id: string; term_teacher_id: string }) =>
      store.createTermStudent(data),
    [store.createTermStudent]
  );

  const clearError = useCallback(() => store.clearError(), [store.clearError]);

  const clearStudentActiveTerms = useCallback(
    () => store.clearStudentActiveTerms(),
    [store.clearStudentActiveTerms]
  );

  return {
    // State
    termStudentList: store.termStudentList,
    studentActiveTerms: store.studentActiveTerms,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchTermStudents,
    fetchStudentActiveTerms,
    createTermStudent,
    clearError,
    clearStudentActiveTerms,
  };
};
