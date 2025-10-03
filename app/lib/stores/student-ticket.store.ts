import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { studentTicketService } from '@/app/lib/api/student/tickets';
import {
  Ticket,
  TicketDepartment,
  CreateStudentTicketRequest,
} from '@/app/lib/types';
import toast from 'react-hot-toast';

interface StudentTicketStore {
  // State
  tickets: Ticket[];
  currentTicket: Ticket | null;
  departments: TicketDepartment[];
  isLoading: boolean;
  isListLoading: boolean;
  isDepartmentsLoading: boolean;
  error: string | null;

  // Actions
  fetchTickets: () => Promise<void>;
  fetchTicketById: (id: string) => Promise<void>;
  createTicket: (payload: CreateStudentTicketRequest) => Promise<void>;
  fetchDepartments: () => Promise<void>;
  clearCurrentTicket: () => void;
  clearError: () => void;
}

export const useStudentTicketStore = create<StudentTicketStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      tickets: [],
      currentTicket: null,
      departments: [],
      isLoading: false,
      isListLoading: false,
      isDepartmentsLoading: false,
      error: null,

      // Actions
      fetchTickets: async () => {
        try {
          set({ isListLoading: true, error: null, tickets: [] });
          const response = await studentTicketService.getTickets();

          if (response.data) {
            set({ tickets: response.data });
          } else {
            throw new Error('خطا در دریافت تیکت‌ها');
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'خطا در دریافت تیکت‌ها';
          set({ error: errorMessage });
          toast.error(errorMessage);
        } finally {
          set({ isListLoading: false });
        }
      },

      fetchTicketById: async (id: string) => {
        try {
          set({ isLoading: true, error: null, currentTicket: null });
          const response = await studentTicketService.getTicketById(id);

          if (response.data) {
            set({ currentTicket: response.data });
          } else {
            throw new Error('خطا در دریافت تیکت');
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'خطا در دریافت تیکت';
          set({ error: errorMessage });
          toast.error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      createTicket: async (payload: CreateStudentTicketRequest) => {
        try {
          set({ isLoading: true, error: null });
          const response = await studentTicketService.createTicket(payload);

          if (response.ticket) {
            const newTicket = response.ticket;
            set((state) => ({
              tickets: [newTicket, ...state.tickets],
              currentTicket: newTicket,
            }));
          } else {
            throw new Error('خطا در ایجاد تیکت');
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'خطا در ایجاد تیکت';
          set({ error: errorMessage });
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchDepartments: async () => {
        try {
          set({ isDepartmentsLoading: true, error: null });
          const response = await studentTicketService.getDepartments();

          if (response.data) {
            set({ departments: response.data });
          } else {
            throw new Error('خطا در دریافت بخش‌ها');
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'خطا در دریافت بخش‌ها';
          set({ error: errorMessage });
          toast.error(errorMessage);
        } finally {
          set({ isDepartmentsLoading: false });
        }
      },

      clearCurrentTicket: () => set({ currentTicket: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'student-ticket-store',
    }
  )
);
