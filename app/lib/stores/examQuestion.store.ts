import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { examQuestionService } from '@/app/lib/services/examQuestion.service';
import type { ApiError } from '@/app/lib/api/client';
import { ExamQuestion, CreateQuestionRequest, UpdateQuestionRequest, GetQuestionResponse } from '@/app/lib/types';

interface ExamQuestionState {
  // State
  questions: ExamQuestion[];
  currentQuestion: ExamQuestion | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchQuestions: (examId: string) => Promise<void>;
  createQuestion: (examId: string, payload: CreateQuestionRequest) => Promise<GetQuestionResponse>;
  updateQuestion: (examId: string, questionId: string, payload: UpdateQuestionRequest) => Promise<GetQuestionResponse>;
  deleteQuestion: (examId: string, questionId: string) => Promise<void>;
}

export const useExamQuestionStore = create<ExamQuestionState>()(
  devtools((set, get) => ({
    // Initial state
    questions: [],
    currentQuestion: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    fetchQuestions: async (examId: string) => {
      try {
        set({ loading: true, error: null });
        const response = await examQuestionService.getQuestions(examId);
        set({
          questions: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    createQuestion: async (examId: string, payload: CreateQuestionRequest) => {
      try {
        set({ loading: true, error: null });
        const newQuestion = await examQuestionService.createQuestion(examId, payload);
        set((state) => ({
          questions: [newQuestion.data, ...state.questions],
          loading: false,
        }));
        return newQuestion;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    updateQuestion: async (examId: string, questionId: string, payload: UpdateQuestionRequest) => {
      try {
        set({ loading: true, error: null });
        const updatedQuestion = await examQuestionService.updateQuestion(examId, questionId, payload);
        set((state) => ({
          questions: state.questions.map((question) =>
            question.id.toString() === questionId ? updatedQuestion.data : question
          ),
          currentQuestion: updatedQuestion.data,
          loading: false,
        }));
        return updatedQuestion;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    deleteQuestion: async (examId: string, questionId: string) => {
      try {
        set({ loading: true, error: null });
        await examQuestionService.deleteQuestion(examId, questionId);
        set((state) => ({
          questions: state.questions.filter((question) => question.id.toString() !== questionId),
          loading: false,
        }));
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);
