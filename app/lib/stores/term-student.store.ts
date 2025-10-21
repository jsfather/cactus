import { create } from 'zustand';
import { termStudentService } from '@/app/lib/services/term-student.service';
import { TermStudent } from '@/app/lib/types/term_student';

interface TermStudentState {
  termStudentList: TermStudent[];
  studentActiveTerms: TermStudent[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchTermStudents: (filters?: {
    student_id?: string;
    term_id?: string;
  }) => Promise<void>;
  fetchStudentActiveTerms: (studentId: string) => Promise<void>;
  createTermStudent: (data: {
    user_id: string;
    term_id: string;
    term_teacher_id: string;
  }) => Promise<TermStudent>;
  clearError: () => void;
  clearStudentActiveTerms: () => void;
}

export const useTermStudentStore = create<TermStudentState>((set, get) => ({
  termStudentList: [],
  studentActiveTerms: [],
  loading: false,
  error: null,

  fetchTermStudents: async (filters) => {
    set({ loading: true, error: null });
    try {
      const data = await termStudentService.getTermStudents(filters);
      set({ termStudentList: data, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'خطایی در دریافت اطلاعات رخ داده است',
        loading: false,
      });
    }
  },

  fetchStudentActiveTerms: async (studentId) => {
    set({ loading: true, error: null });
    try {
      const data = await termStudentService.getStudentActiveTerms(studentId);
      set({ studentActiveTerms: data, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'خطایی در دریافت ترم‌های دانش‌پژو رخ داده است',
        loading: false,
      });
    }
  },

  createTermStudent: async (data) => {
    set({ loading: true, error: null });
    try {
      const result = await termStudentService.createTermStudent(data);
      set({ loading: false });
      return result;
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'خطایی در ایجاد ترم دانش‌پژو رخ داده است',
        loading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  clearStudentActiveTerms: () => set({ studentActiveTerms: [] }),
}));
