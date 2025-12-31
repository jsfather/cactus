import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { termTeacherService } from '@/app/lib/services/term-teacher.service';
import type { ApiError } from '@/app/lib/api/client';
import {
  TermTeacher,
  TermTeacherDetail,
  CreateTermTeacherRequest,
  UpdateTermTeacherRequest,
  GetTermTeacherResponse,
  CreateTermTeacherResponse,
  UpdateTermTeacherResponse,
} from '@/app/lib/types/term_teacher';

interface TermTeacherState {
  // State
  termTeacherList: TermTeacher[];
  currentTermTeacher: TermTeacherDetail | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearCurrentTermTeacher: () => void;

  fetchTermTeacherList: () => Promise<void>;
  createTermTeacher: (
    payload: CreateTermTeacherRequest
  ) => Promise<CreateTermTeacherResponse>;
  updateTermTeacher: (
    id: string,
    payload: UpdateTermTeacherRequest
  ) => Promise<UpdateTermTeacherResponse>;
  deleteTermTeacher: (id: string) => Promise<void>;
  fetchTermTeacherById: (id: string) => Promise<void>;
}

export const useTermTeacherStore = create<TermTeacherState>()(
  devtools((set, get) => ({
    // Initial state
    termTeacherList: [],
    currentTermTeacher: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    clearCurrentTermTeacher: () => set({ currentTermTeacher: null }),

    fetchTermTeacherList: async () => {
      try {
        set({ loading: true, error: null });
        const response = await termTeacherService.getList();
        set({
          termTeacherList: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({
          error: apiError.message || 'خطا در دریافت لیست ترم مدرسین',
          loading: false,
        });
        throw error;
      }
    },

    createTermTeacher: async (payload: CreateTermTeacherRequest) => {
      try {
        set({ loading: true, error: null });
        const response = await termTeacherService.create(payload);

        // Optimistic update
        await get().fetchTermTeacherList();

        set({ loading: false });
        return response;
      } catch (error) {
        const apiError = error as ApiError;
        set({
          error: apiError.message || 'خطا در ایجاد ترم مدرس',
          loading: false,
        });
        throw error;
      }
    },

    updateTermTeacher: async (
      id: string,
      payload: UpdateTermTeacherRequest
    ) => {
      try {
        set({ loading: true, error: null });
        const response = await termTeacherService.update(id, payload);

        // Optimistic update
        await get().fetchTermTeacherList();

        set({ loading: false });
        return response;
      } catch (error) {
        const apiError = error as ApiError;
        set({
          error: apiError.message || 'خطا در بروزرسانی ترم مدرس',
          loading: false,
        });
        throw error;
      }
    },

    deleteTermTeacher: async (id: string) => {
      try {
        set({ loading: true, error: null });
        await termTeacherService.delete(id);

        // Optimistic update
        const currentList = get().termTeacherList;
        set({
          termTeacherList: currentList.filter(
            (item) => item.id.toString() !== id
          ),
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({
          error: apiError.message || 'خطا در حذف ترم مدرس',
          loading: false,
        });
        throw error;
      }
    },

    fetchTermTeacherById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const response = await termTeacherService.getById(id);
        set({
          currentTermTeacher: response,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({
          error: apiError.message || 'خطا در دریافت ترم مدرس',
          currentTermTeacher: null,
          loading: false,
        });
        throw error;
      }
    },
  }))
);
