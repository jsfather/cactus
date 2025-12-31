import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { studentService } from '@/app/lib/services/student.service';
import type { ApiError } from '@/app/lib/api/client';
import {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  GetStudentResponse,
} from '@/app/lib/types';

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface StudentState {
  // State
  studentList: Student[];
  currentStudent: Student | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  pagination: PaginationMeta | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchStudentList: (page?: number, perPage?: number) => Promise<void>;
  fetchMoreStudents: (perPage?: number) => Promise<void>;
  createStudent: (payload: CreateStudentRequest) => Promise<GetStudentResponse>;
  updateStudent: (
    id: string,
    payload: UpdateStudentRequest
  ) => Promise<GetStudentResponse>;
  deleteStudent: (id: string) => Promise<void>;
  fetchStudentById: (id: string) => Promise<void>;
  clearCurrentStudent: () => void;
  resetStudentList: () => void;
}

export const useStudentStore = create<StudentState>()(
  devtools((set, get) => ({
    // Initial state
    studentList: [],
    currentStudent: null,
    loading: false,
    loadingMore: false,
    error: null,
    pagination: null,

    // Actions
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
    clearCurrentStudent: () => set({ currentStudent: null }),
    resetStudentList: () => set({ studentList: [], pagination: null }),

    fetchStudentList: async (page = 1, perPage = 15) => {
      try {
        set({ loading: true, error: null });
        const response = await studentService.getList(page, perPage);
        set({
          studentList: response.data,
          pagination: response.meta,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchMoreStudents: async (perPage = 50) => {
      const { pagination, loadingMore, studentList } = get();

      // Don't fetch if already loading or no more pages
      if (
        loadingMore ||
        !pagination ||
        pagination.current_page >= pagination.last_page
      ) {
        return;
      }

      try {
        set({ loadingMore: true, error: null });
        const nextPage = pagination.current_page + 1;
        const response = await studentService.getList(nextPage, perPage);
        set({
          studentList: [...studentList, ...response.data],
          pagination: response.meta,
          loadingMore: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loadingMore: false });
        throw error;
      }
    },

    createStudent: async (payload) => {
      try {
        set({ loading: true, error: null });
        const newStudent = await studentService.create(payload);
        set((state) => ({
          studentList: [newStudent.data, ...state.studentList],
          loading: false,
        }));
        return newStudent;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    updateStudent: async (id, payload) => {
      try {
        set({ loading: true, error: null });
        const updatedStudent = await studentService.update(id, payload);
        set((state) => ({
          studentList: state.studentList.map((student) =>
            student.user_id.toString() === id ? updatedStudent.data : student
          ),
          currentStudent: updatedStudent.data,
          loading: false,
        }));
        return updatedStudent;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    deleteStudent: async (id) => {
      try {
        set({ loading: true, error: null });
        await studentService.delete(id);
        set((state) => ({
          studentList: state.studentList.filter(
            (student) => student.user_id.toString() !== id
          ),
          loading: false,
        }));
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchStudentById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const student = await studentService.getById(id);
        set({ currentStudent: student.data, loading: false });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);
