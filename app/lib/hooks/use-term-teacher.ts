import { useTermTeacherStore } from '@/app/lib/stores/term-teacher.store';
import {
  CreateTermTeacherRequest,
  UpdateTermTeacherRequest,
} from '@/app/lib/types/term_teacher';

export const useTermTeacher = () => {
  const store = useTermTeacherStore();

  return {
    // State
    termTeacherList: store.termTeacherList,
    currentTermTeacher: store.currentTermTeacher,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchTermTeacherList: store.fetchTermTeacherList,
    createTermTeacher: store.createTermTeacher,
    updateTermTeacher: store.updateTermTeacher,
    deleteTermTeacher: store.deleteTermTeacher,
    fetchTermTeacherById: store.fetchTermTeacherById,
    setLoading: store.setLoading,
    setError: store.setError,
    clearError: store.clearError,
    clearCurrentTermTeacher: store.clearCurrentTermTeacher,
  };
};
