import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { coursePageService } from '@/app/lib/services/course-page.service';
import {
  CoursePageContent,
  CreateCoursePageRequest,
  UpdateCoursePageRequest,
} from '@/app/lib/types/course';

interface CoursePageStore {
  coursePageList: CoursePageContent[];
  currentCoursePage: CoursePageContent | null;
  loading: boolean;
  error: string | null;
  fetchCoursePageList: () => Promise<void>;
  fetchCoursePageById: (id: string) => Promise<void>;
  createCoursePage: (payload: CreateCoursePageRequest) => Promise<CoursePageContent>;
  updateCoursePage: (
    id: string,
    payload: UpdateCoursePageRequest
  ) => Promise<CoursePageContent>;
  deleteCoursePage: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCoursePageStore = create<CoursePageStore>()(
  devtools((set) => ({
    coursePageList: [],
    currentCoursePage: null,
    loading: false,
    error: null,

    fetchCoursePageList: async () => {
      set({ loading: true, error: null });
      try {
        const response = await coursePageService.getList();
        set({ coursePageList: response.data, loading: false });
      } catch (error: any) {
        set({
          error: error?.message || 'خطا در دریافت صفحات دوره',
          loading: false,
        });
      }
    },

    fetchCoursePageById: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const response = await coursePageService.getById(id);
        set({ currentCoursePage: response.data, loading: false });
      } catch (error: any) {
        set({
          error: error?.message || 'خطا در دریافت صفحه دوره',
          loading: false,
        });
      }
    },

    createCoursePage: async (payload: CreateCoursePageRequest) => {
      const response = await coursePageService.create(payload);
      return response.data;
    },

    updateCoursePage: async (id: string, payload: UpdateCoursePageRequest) => {
      const response = await coursePageService.update(id, payload);
      return response.data;
    },

    deleteCoursePage: async (id: string) => {
      await coursePageService.delete(id);
    },

    clearError: () => set({ error: null }),
  }))
);
