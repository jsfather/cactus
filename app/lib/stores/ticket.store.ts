import { create } from 'zustand';
import { ticketService } from '@/app/lib/services/ticket.service';
import {
  Ticket,
  CreateTicketRequest,
  UpdateTicketRequest,
  TicketDepartment,
  Reply,
} from '@/app/lib/types';
import toast from 'react-hot-toast';

interface TicketStore {
  // State
  tickets: Ticket[];
  currentTicket: Ticket | null;
  departments: TicketDepartment[];
  isLoading: boolean;
  isListLoading: boolean;
  error: string | null;

  // Actions
  fetchTickets: () => Promise<void>;
  fetchTicketById: (id: string) => Promise<void>;
  createTicket: (payload: CreateTicketRequest) => Promise<void>;
  updateTicket: (id: string, payload: UpdateTicketRequest) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  fetchDepartments: () => Promise<void>;
  replyToTicket: (id: string, payload: Reply) => Promise<void>;
  clearCurrentTicket: () => void;
  clearError: () => void;
}

export const useTicketStore = create<TicketStore>((set, get) => ({
  // Initial state
  tickets: [],
  currentTicket: null,
  departments: [],
  isLoading: false,
  isListLoading: false,
  error: null,

  // Actions
  fetchTickets: async () => {
    try {
      set({ isListLoading: true, error: null });
      const response = await ticketService.getList();
      
      if (response.data) {
        set({ tickets: response.data });
      } else {
        throw new Error('خطا در دریافت تیکت‌ها');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در دریافت تیکت‌ها';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isListLoading: false });
    }
  },

  fetchTicketById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await ticketService.getById(id);
      
      if (response.data) {
        set({ currentTicket: response.data });
      } else {
        throw new Error('خطا در دریافت تیکت');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در دریافت تیکت';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  createTicket: async (payload: CreateTicketRequest) => {
    try {
      set({ isLoading: true, error: null });
      const response = await ticketService.create(payload);
      
      if (response.data) {
        const newTicket = response.data;
        set(state => ({ 
          tickets: [newTicket, ...state.tickets],
          currentTicket: newTicket
        }));
        toast.success('تیکت با موفقیت ایجاد شد');
      } else {
        throw new Error('خطا در ایجاد تیکت');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در ایجاد تیکت';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTicket: async (id: string, payload: UpdateTicketRequest) => {
    try {
      set({ isLoading: true, error: null });
      const response = await ticketService.update(id, payload);
      
      if (response.data) {
        const updatedTicket = response.data;
        const ticketId = parseInt(id);
        set(state => ({
          tickets: state.tickets.map(ticket => 
            ticket.id === ticketId ? updatedTicket : ticket
          ),
          currentTicket: state.currentTicket?.id === ticketId ? updatedTicket : state.currentTicket
        }));
        toast.success('تیکت با موفقیت ویرایش شد');
      } else {
        throw new Error('خطا در ویرایش تیکت');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در ویرایش تیکت';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTicket: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await ticketService.delete(id);
      
      const ticketId = parseInt(id);
      set(state => ({
        tickets: state.tickets.filter(ticket => ticket.id !== ticketId),
        currentTicket: state.currentTicket?.id === ticketId ? null : state.currentTicket
      }));
      toast.success('تیکت با موفقیت حذف شد');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در حذف تیکت';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDepartments: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await ticketService.getDepartments();
      
      if (response.data) {
        set({ departments: response.data });
      } else {
        throw new Error('خطا در دریافت دپارتمان‌ها');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در دریافت دپارتمان‌ها';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  replyToTicket: async (id: string, payload: Reply) => {
    try {
      set({ isLoading: true, error: null });
      await ticketService.reply(id, payload);
      
      // Refresh the current ticket to show new reply
      await get().fetchTicketById(id);
      toast.success('پاسخ با موفقیت ارسال شد');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در ارسال پاسخ';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearCurrentTicket: () => set({ currentTicket: null }),
  clearError: () => set({ error: null }),
}));
