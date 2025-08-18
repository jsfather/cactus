import { create } from 'zustand';
import { examService } from '@/app/lib/services/exam.service';
import {
  Exam,
  CreateExamRequest,
  UpdateExamRequest,
} from '@/app/lib/types';
import toast from 'react-hot-toast';

interface ExamStore {
  // State
  exams: Exam[];
  currentExam: Exam | null;
  isLoading: boolean;
  isListLoading: boolean;
  error: string | null;

  // Actions
  fetchExams: () => Promise<void>;
  fetchExamById: (id: string) => Promise<void>;
  createExam: (payload: CreateExamRequest) => Promise<void>;
  updateExam: (id: string, payload: UpdateExamRequest) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  clearCurrentExam: () => void;
  clearError: () => void;
}

export const useExamStore = create<ExamStore>((set, get) => ({
  // Initial state
  exams: [],
  currentExam: null,
  isLoading: false,
  isListLoading: false,
  error: null,

  // Actions
  fetchExams: async () => {
    try {
      set({ isListLoading: true, error: null });
      const response = await examService.getList();
      
      if (response.data) {
        set({ exams: response.data });
      } else {
        throw new Error('خطا در دریافت آزمون‌ها');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در دریافت آزمون‌ها';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isListLoading: false });
    }
  },

  fetchExamById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await examService.getById(id);
      
      if (response.data) {
        set({ currentExam: response.data });
      } else {
        throw new Error('خطا در دریافت آزمون');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در دریافت آزمون';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  createExam: async (payload: CreateExamRequest) => {
    try {
      set({ isLoading: true, error: null });
      const response = await examService.create(payload);
      
      if (response.data) {
        const newExam = response.data;
        set(state => ({ 
          exams: [newExam, ...state.exams],
          currentExam: newExam
        }));
        toast.success('آزمون با موفقیت ایجاد شد');
      } else {
        throw new Error('خطا در ایجاد آزمون');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در ایجاد آزمون';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateExam: async (id: string, payload: UpdateExamRequest) => {
    try {
      set({ isLoading: true, error: null });
      const response = await examService.update(id, payload);
      
      if (response.data) {
        const updatedExam = response.data;
        const examId = parseInt(id);
        set(state => ({
          exams: state.exams.map(exam => 
            exam.id === examId ? updatedExam : exam
          ),
          currentExam: state.currentExam?.id === examId ? updatedExam : state.currentExam
        }));
        toast.success('آزمون با موفقیت ویرایش شد');
      } else {
        throw new Error('خطا در ویرایش آزمون');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در ویرایش آزمون';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteExam: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await examService.delete(id);
      
      const examId = parseInt(id);
      set(state => ({
        exams: state.exams.filter(exam => exam.id !== examId),
        currentExam: state.currentExam?.id === examId ? null : state.currentExam
      }));
      toast.success('آزمون با موفقیت حذف شد');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در حذف آزمون';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearCurrentExam: () => set({ currentExam: null }),
  clearError: () => set({ error: null }),
}));
