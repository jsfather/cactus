import { create } from 'zustand';
import { ticketService } from '@/app/lib/services/ticket.service';
import {
  Ticket,
  CreateTicketRequest,
  UpdateTicketRequest,
  ReplyTicketRequest,
  TicketDepartment,
  CreateTicketDepartmentRequest,
  UpdateTicketDepartmentRequest,
} from '@/app/lib/types';
import toast from 'react-hot-toast';

interface TicketStore {
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
  fetchTeacherTickets: () => Promise<void>;
  fetchAllTickets: () => Promise<void>;
  fetchTicketById: (id: string) => Promise<void>;
  createTicket: (payload: CreateTicketRequest) => Promise<void>;
  updateTicket: (id: string, payload: UpdateTicketRequest) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  closeTicket: (id: string) => Promise<void>;
  replyToTicket: (id: string, payload: ReplyTicketRequest) => Promise<void>;
  
  // Department actions
  fetchDepartments: () => Promise<void>;
  createDepartment: (payload: CreateTicketDepartmentRequest) => Promise<void>;
  updateDepartment: (id: string, payload: UpdateTicketDepartmentRequest) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  
  // Utility actions
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
  isDepartmentsLoading: false,
  error: null,

  // Actions
  fetchTickets: async () => {
    try {
      set({ isListLoading: true, error: null });
      const response = await ticketService.getList();
      
      if (response.data) {
        // Mark tickets as student type
        const ticketsWithType = response.data.map(ticket => ({
          ...ticket,
          type: 'student' as const
        }));
        set({ tickets: ticketsWithType });
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

  fetchTeacherTickets: async () => {
    try {
      set({ isListLoading: true, error: null });
      const response = await ticketService.getTeacherTickets();
      
      if (response.data) {
        // Mark tickets as teacher type
        const ticketsWithType = response.data.map(ticket => ({
          ...ticket,
          type: 'teacher' as const
        }));
        set({ tickets: ticketsWithType });
      } else {
        throw new Error('خطا در دریافت تیکت‌های مدرس');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در دریافت تیکت‌های مدرس';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isListLoading: false });
    }
  },

  fetchAllTickets: async () => {
    try {
      set({ isListLoading: true, error: null });
      const [studentsResponse, teachersResponse] = await Promise.all([
        ticketService.getList(),
        ticketService.getTeacherTickets(),
      ]);
      
      const allTickets = [
        ...studentsResponse.data.map(ticket => ({
          ...ticket,
          type: 'student' as const
        })),
        ...teachersResponse.data.map(ticket => ({
          ...ticket,
          type: 'teacher' as const
        })),
      ];
      
      set({ tickets: allTickets });
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
        set(state => ({
          tickets: state.tickets.map(ticket => 
            ticket.id.toString() === id ? updatedTicket : ticket
          ),
          currentTicket: state.currentTicket?.id.toString() === id ? updatedTicket : state.currentTicket
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
      
      set(state => ({
        tickets: state.tickets.filter(ticket => ticket.id.toString() !== id),
        currentTicket: state.currentTicket?.id.toString() === id ? null : state.currentTicket
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

  closeTicket: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await ticketService.close(id);
      
      if (response.data) {
        const updatedTicket = response.data;
        set(state => ({
          tickets: state.tickets.map(ticket => 
            ticket.id.toString() === id ? updatedTicket : ticket
          ),
          currentTicket: state.currentTicket?.id.toString() === id ? updatedTicket : state.currentTicket
        }));
        toast.success('تیکت با موفقیت بسته شد');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در بستن تیکت';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  replyToTicket: async (id: string, payload: ReplyTicketRequest) => {
    try {
      set({ isLoading: true, error: null });
      const response = await ticketService.reply(id, payload);
      
      if (response.data) {
        set({ currentTicket: response.data });
        toast.success('پاسخ با موفقیت ارسال شد');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در ارسال پاسخ';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Department actions
  fetchDepartments: async () => {
    try {
      set({ isDepartmentsLoading: true, error: null });
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
      set({ isDepartmentsLoading: false });
    }
  },

  createDepartment: async (payload: CreateTicketDepartmentRequest) => {
    try {
      set({ isLoading: true, error: null });
      const response = await ticketService.createDepartment(payload);
      
      if (response.data) {
        const newDepartment = response.data;
        set(state => ({ 
          departments: [...state.departments, newDepartment]
        }));
        toast.success('دپارتمان با موفقیت ایجاد شد');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در ایجاد دپارتمان';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateDepartment: async (id: string, payload: UpdateTicketDepartmentRequest) => {
    try {
      set({ isLoading: true, error: null });
      const response = await ticketService.updateDepartment(id, payload);
      
      if (response.data) {
        const updatedDepartment = response.data;
        set(state => ({
          departments: state.departments.map(dept => 
            dept.id.toString() === id ? updatedDepartment : dept
          )
        }));
        toast.success('دپارتمان با موفقیت ویرایش شد');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در ویرایش دپارتمان';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteDepartment: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await ticketService.deleteDepartment(id);
      
      set(state => ({
        departments: state.departments.filter(dept => dept.id.toString() !== id)
      }));
      toast.success('دپارتمان با موفقیت حذف شد');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در حذف دپارتمان';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Utility actions
  clearCurrentTicket: () => set({ currentTicket: null }),
  clearError: () => set({ error: null }),
}));
