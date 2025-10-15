import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { teacherStudentService } from '@/app/lib/services/teacher-student.service';
import type { ApiError } from '@/app/lib/api/client';
import { Student, GetStudentListResponse } from '@/app/lib/types/student';

interface TeacherStudentState {
  // State
  studentList: Student[];
  termStudents: Student[];
  currentStudent: Student | null;
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  } | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchStudentList: (page?: number) => Promise<void>;
  fetchStudentById: (id: string) => Promise<void>;
  fetchStudentsByTermId: (termId: string, page?: number) => Promise<void>;
  clearCurrentStudent: () => void;
  clearTermStudents: () => void;
}

export const useTeacherStudentStore = create<TeacherStudentState>()(
  devtools((set, get) => ({
    // Initial state
    studentList: [],
    termStudents: [],
    currentStudent: null,
    loading: false,
    error: null,
    pagination: null,

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    clearCurrentStudent: () => set({ currentStudent: null }),

    clearTermStudents: () => set({ termStudents: [] }),

    fetchStudentList: async (page = 1) => {
      try {
        set({ loading: true, error: null });
        const response = await teacherStudentService.getAll(page);
        set({
          studentList: response.data,
          pagination: {
            current_page: response.meta.current_page,
            last_page: response.meta.last_page,
            total: response.meta.total,
            per_page: response.meta.per_page,
          },
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchStudentById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const response = await teacherStudentService.getById(id);
        set({ currentStudent: response.data, loading: false });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchStudentsByTermId: async (termId: string, page = 1) => {
      try {
        set({ loading: true, error: null });
        const response = await teacherStudentService.getByTermId(termId, page);
        set({
          termStudents: response.data,
          pagination: {
            current_page: response.meta.current_page,
            last_page: response.meta.last_page,
            total: response.meta.total,
            per_page: response.meta.per_page,
          },
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);
