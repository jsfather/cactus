import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { studentService, StudentRequest, GetStudentResponse } from '@/app/lib/services/student.service';
import type { ApiError } from '@/app/lib/api/client';
import { Student } from '@/app/lib/types';

interface StudentState {
  // State
  studentList: Student[];
  currentStudent: Student | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchStudentList: () => Promise<void>;
  createStudent: (payload: StudentRequest | FormData) => Promise<GetStudentResponse>;
  updateStudent: (id: string, payload: StudentRequest | FormData) => Promise<GetStudentResponse>;
  deleteStudent: (id: string) => Promise<void>;
  fetchStudentById: (id: string) => Promise<void>;
  getExamPlacement: (id: string) => Promise<GetStudentResponse>;
}

export const useStudentStore = create<StudentState>()(
  devtools((set, get) => ({
    // Initial state
    studentList: [],
    currentStudent: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    fetchStudentList: async () => {
      try {
        set({ loading: true, error: null });
        const response = await studentService.getList();
        set({
          studentList: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
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
            student.user_id.toString() === updatedStudent.data.user_id.toString() 
              ? updatedStudent.data 
              : student
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
          studentList: state.studentList.filter((student) => 
            student.user_id.toString() !== id
          ),
          currentStudent: state.currentStudent?.user_id.toString() === id 
            ? null 
            : state.currentStudent,
          loading: false,
        }));
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchStudentById: async (id) => {
      try {
        set({ loading: true, error: null });
        const response = await studentService.getById(id);
        set({
          currentStudent: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    getExamPlacement: async (id) => {
      try {
        set({ loading: true, error: null });
        const response = await studentService.getExamPlacement(id);
        set({ loading: false });
        return response;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);