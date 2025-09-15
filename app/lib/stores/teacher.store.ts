import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { teacherService } from '@/app/lib/services/teacher.service';
import type { ApiError } from '@/app/lib/api/client';
import {
  Teacher,
  CreateTeacherRequest,
  UpdateTeacherRequest,
  GetTeacherResponse,
} from '@/app/lib/types/teacher';

interface TeacherState {
  // State
  teacherList: Teacher[];
  currentTeacher: Teacher | null;
  loading: boolean;
  error: string | null;
  totalTeachers: number;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchTeacherList: () => Promise<void>;
  createTeacher: (payload: CreateTeacherRequest) => Promise<GetTeacherResponse>;
  updateTeacher: (
    id: string,
    payload: UpdateTeacherRequest
  ) => Promise<GetTeacherResponse>;
  deleteTeacher: (id: string) => Promise<void>;
  fetchTeacherById: (id: string) => Promise<void>;
}

export const useTeacherStore = create<TeacherState>()(
  devtools((set, get) => ({
    // Initial state
    teacherList: [],
    currentTeacher: null,
    loading: false,
    error: null,
    totalTeachers: 0,

    // Actions
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    fetchTeacherList: async () => {
      try {
        set({ loading: true, error: null });
        const response = await teacherService.getList();
        set({
          teacherList: response.data,
          totalTeachers: response.meta?.total || response.data.length,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    createTeacher: async (payload) => {
      try {
        set({ loading: true, error: null });
        const newTeacher = await teacherService.create(payload);
        set((state) => ({
          teacherList: [newTeacher.data, ...state.teacherList],
          totalTeachers: state.totalTeachers + 1,
          loading: false,
        }));
        return newTeacher;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    updateTeacher: async (id, payload) => {
      try {
        set({ loading: true, error: null });
        const updatedTeacher = await teacherService.update(id, payload);
        set((state) => ({
          teacherList: state.teacherList.map((teacher) =>
            teacher.user_id.toString() === id ? updatedTeacher.data : teacher
          ),
          currentTeacher: updatedTeacher.data,
          loading: false,
        }));
        return updatedTeacher;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    deleteTeacher: async (id) => {
      try {
        set({ loading: true, error: null });
        await teacherService.delete(id);
        set((state) => ({
          teacherList: state.teacherList.filter(
            (teacher) => teacher.user_id.toString() !== id
          ),
          totalTeachers: Math.max(0, state.totalTeachers - 1),
          loading: false,
        }));
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchTeacherById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const teacher = await teacherService.getById(id);
        set({ currentTeacher: teacher.data, loading: false });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);
