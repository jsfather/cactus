import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { teacherTicketService } from '@/app/lib/services/teacher-ticket.service';
import type { ApiError } from '@/app/lib/api/client';
import {
  Ticket,
  TeacherReplyTicketRequest,
  GetTeacherTicketResponse,
  TeacherReplyTicketResponse,
} from '@/app/lib/types';

interface TeacherTicketState {
  // State
  ticketList: Ticket[];
  currentTicket: Ticket | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchTicketList: () => Promise<void>;
  fetchTicketById: (id: string) => Promise<void>;
  replyToTicket: (
    id: string,
    payload: TeacherReplyTicketRequest
  ) => Promise<TeacherReplyTicketResponse>;
}

export const useTeacherTicketStore = create<TeacherTicketState>()(
  devtools((set, get) => ({
    // Initial state
    ticketList: [],
    currentTicket: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    fetchTicketList: async () => {
      try {
        set({ loading: true, error: null });
        const response = await teacherTicketService.getList();
        set({
          ticketList: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({
          error: apiError.message || 'خطا در دریافت لیست تیکت‌ها',
          loading: false,
        });
        throw error;
      }
    },

    fetchTicketById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const response = await teacherTicketService.getById(id);
        set({
          currentTicket: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({
          error: apiError.message || 'خطا در دریافت جزئیات تیکت',
          loading: false,
        });
        throw error;
      }
    },

    replyToTicket: async (
      id: string,
      payload: TeacherReplyTicketRequest
    ): Promise<TeacherReplyTicketResponse> => {
      try {
        set({ loading: true, error: null });
        const response = await teacherTicketService.replyToTicket(id, payload);

        // Optimistically update the current ticket with the new reply
        const currentTicket = get().currentTicket;
        if (currentTicket && currentTicket.id.toString() === id) {
          const newMessage = {
            sender: 'شما', // Current teacher
            is_student: 0,
            message: payload.message,
            attachment: null,
            created_at: new Date().toISOString(),
          };

          set({
            currentTicket: {
              ...currentTicket,
              messages: [...(currentTicket.messages || []), newMessage],
            },
            loading: false,
          });
        } else {
          set({ loading: false });
        }

        return response;
      } catch (error) {
        const apiError = error as ApiError;
        set({
          error: apiError.message || 'خطا در ارسال پاسخ',
          loading: false,
        });
        throw error;
      }
    },
  }))
);
