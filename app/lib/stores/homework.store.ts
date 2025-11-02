import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { homeworkService } from '@/app/lib/services/homework.service';
import type { ApiError } from '@/app/lib/api/client';
import {
  Homework,
  HomeworkConversation,
  SendMessageRequest,
  ReplyMessageRequest,
  SubmitAnswerRequest,
} from '@/app/lib/types/homework';

interface HomeworkState {
  // State
  homeworkList: Homework[];
  currentConversation: HomeworkConversation | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setSubmitting: (submitting: boolean) => void;

  fetchHomeworksByTerm: (termId: string) => Promise<void>;
  submitAnswer: (payload: SubmitAnswerRequest) => Promise<void>;
  sendMessage: (payload: SendMessageRequest) => Promise<void>;
  replyMessage: (payload: ReplyMessageRequest) => Promise<void>;
  fetchConversation: (conversationId: string) => Promise<void>;
  clearCurrentConversation: () => void;
}

export const useHomeworkStore = create<HomeworkState>()(
  devtools((set, get) => ({
    // Initial state
    homeworkList: [],
    currentConversation: null,
    loading: false,
    error: null,
    submitting: false,

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    setSubmitting: (submitting) => set({ submitting }),

    fetchHomeworksByTerm: async (termId: string) => {
      try {
        set({ loading: true, error: null });
        const response = await homeworkService.getByTerm(termId);
        set({
          homeworkList: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    submitAnswer: async (payload: SubmitAnswerRequest) => {
      try {
        set({ submitting: true, error: null });
        await homeworkService.submitAnswer(payload);

        // Optimistically update the homework list
        // Since backend doesn't return proper response, we'll just mark as submitted locally
        set((state) => ({
          homeworkList: state.homeworkList.map((hw) =>
            hw.id === payload.homework_id
              ? {
                  ...hw,
                  answers: [
                    ...hw.answers,
                    {
                      id: Date.now(), // Temporary ID
                      description: payload.description,
                      file_url: payload.file
                        ? URL.createObjectURL(payload.file)
                        : null,
                      created_at: new Date().toISOString(),
                    },
                  ],
                }
              : hw
          ),
          submitting: false,
        }));
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, submitting: false });
        throw error;
      }
    },

    sendMessage: async (payload: SendMessageRequest) => {
      try {
        set({ submitting: true, error: null });
        const response = await homeworkService.sendMessage(payload);

        // Update the homework with new conversation
        set((state) => ({
          homeworkList: state.homeworkList.map((hw) =>
            hw.id === payload.homework_id
              ? {
                  ...hw,
                  conversations: [
                    ...hw.conversations,
                    {
                      id: response.message.homework_conversation_id,
                      messages: [
                        {
                          id: response.message.id,
                          message: response.message.message,
                          sender_type: response.message.sender_type as
                            | 'student'
                            | 'teacher',
                          sender: {} as any, // Will be populated when fetching conversation
                          created_at: response.message.created_at,
                        },
                      ],
                    },
                  ],
                }
              : hw
          ),
          submitting: false,
        }));
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, submitting: false });
        throw error;
      }
    },

    replyMessage: async (payload: ReplyMessageRequest) => {
      try {
        set({ submitting: true, error: null });
        const response = await homeworkService.replyMessage(payload);

        // Update current conversation if it's loaded
        if (get().currentConversation?.id === payload.conversation_id) {
          set((state) => ({
            currentConversation: state.currentConversation
              ? {
                  ...state.currentConversation,
                  messages: [
                    ...(state.currentConversation.messages || []),
                    {
                      id: response.message.id,
                      message: response.message.message,
                      sender_type: response.message.sender_type as
                        | 'student'
                        | 'teacher',
                      sender: {} as any, // Will be populated when fetching conversation
                      created_at: response.message.created_at,
                    },
                  ],
                }
              : null,
            submitting: false,
          }));
        } else {
          set({ submitting: false });
        }
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, submitting: false });
        throw error;
      }
    },

    fetchConversation: async (conversationId: string) => {
      try {
        set({ loading: true, error: null });
        const response = await homeworkService.getConversation(conversationId);
        set({
          currentConversation: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    clearCurrentConversation: () => set({ currentConversation: null }),
  }))
);
