import { create } from 'zustand';
import { toast } from 'react-toastify';
import { 
  TeacherHomework, 
  CreateTeacherHomeworkRequest, 
  TeacherHomeworkConversation,
  SendHomeworkConversationMessageRequest,
} from '@/app/lib/types/teacher-homework';
import { teacherHomeworkService } from '@/app/lib/services/teacher-homework.service';

interface TeacherHomeworkState {
  // State
  homeworks: TeacherHomework[];
  currentHomework: TeacherHomework | null;
  conversations: { [conversationId: string]: TeacherHomeworkConversation };
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  conversationLoading: boolean;
  sendingMessage: boolean;
  error: string | null;

  // Actions
  fetchHomeworks: () => Promise<void>;
  fetchHomeworkById: (id: string) => Promise<void>;
  createHomework: (payload: CreateTeacherHomeworkRequest) => Promise<TeacherHomework | null>;
  deleteHomework: (id: string) => Promise<boolean>;
  fetchConversation: (conversationId: string) => Promise<void>;
  sendConversationMessage: (conversationId: string, message: string) => Promise<boolean>;
  clearCurrentHomework: () => void;
  clearError: () => void;
}

export const useTeacherHomeworkStore = create<TeacherHomeworkState>((set, get) => ({
  // Initial state
  homeworks: [],
  currentHomework: null,
  conversations: {},
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  conversationLoading: false,
  sendingMessage: false,
  error: null,

  // Actions
  fetchHomeworks: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await teacherHomeworkService.getList();
      set({ 
        homeworks: response.data, 
        loading: false,
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطایی در دریافت لیست تکالیف رخ داده است';
      
      set({ 
        loading: false, 
        error: errorMessage,
        homeworks: []
      });
      
      toast.error(errorMessage);
      console.error('Error fetching teacher homeworks:', error);
    }
  },

  fetchHomeworkById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await teacherHomeworkService.getById(id);
      set({ 
        currentHomework: response.data, 
        loading: false,
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطایی در دریافت تکلیف رخ داده است';
      
      set({ 
        loading: false, 
        error: errorMessage,
        currentHomework: null
      });
      
      toast.error(errorMessage);
      console.error('Error fetching teacher homework:', error);
    }
  },

  createHomework: async (payload: CreateTeacherHomeworkRequest) => {
    set({ creating: true, error: null });
    
    try {
      const response = await teacherHomeworkService.create(payload);
      const newHomework = response.data;
      
      // Add to the list optimistically
      set(state => ({ 
        homeworks: [newHomework, ...state.homeworks],
        creating: false,
        error: null 
      }));
      
      toast.success('تکلیف با موفقیت ایجاد شد');
      return newHomework;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطایی در ایجاد تکلیف رخ داده است';
      
      set({ 
        creating: false, 
        error: errorMessage 
      });
      
      toast.error(errorMessage);
      console.error('Error creating teacher homework:', error);
      return null;
    }
  },

  deleteHomework: async (id: string) => {
    set({ deleting: true, error: null });
    
    try {
      await teacherHomeworkService.delete(id);
      
      // Remove from the list optimistically
      set(state => ({ 
        homeworks: state.homeworks.filter(homework => homework.id.toString() !== id),
        currentHomework: state.currentHomework?.id.toString() === id ? null : state.currentHomework,
        deleting: false,
        error: null 
      }));
      
      toast.success('تکلیف با موفقیت حذف شد');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطایی در حذف تکلیف رخ داده است';
      
      set({ 
        deleting: false, 
        error: errorMessage 
      });
      
      toast.error(errorMessage);
      console.error('Error deleting teacher homework:', error);
      return false;
    }
  },

  clearCurrentHomework: () => {
    set({ currentHomework: null });
  },

  clearError: () => {
    set({ error: null });
  },

  fetchConversation: async (conversationId: string) => {
    set({ conversationLoading: true, error: null });
    
    try {
      const response = await teacherHomeworkService.getConversation(conversationId);
      set(state => ({ 
        conversations: {
          ...state.conversations,
          [conversationId]: response.data
        },
        conversationLoading: false,
        error: null 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطایی در دریافت گفتگو رخ داده است';
      
      set({ 
        conversationLoading: false, 
        error: errorMessage 
      });
      
      toast.error(errorMessage);
      console.error('Error fetching conversation:', error);
    }
  },

  sendConversationMessage: async (conversationId: string, message: string) => {
    set({ sendingMessage: true, error: null });
    
    try {
      const response = await teacherHomeworkService.sendConversationReply({
        conversation_id: conversationId,
        message: message,
      });
      
      if (response.status === 'sent') {
        // Refresh the conversation to get the latest messages
        await get().fetchConversation(conversationId);
        
        set({ sendingMessage: false, error: null });
        toast.success('پیام با موفقیت ارسال شد');
        return true;
      } else {
        throw new Error('خطایی در ارسال پیام رخ داده است');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطایی در ارسال پیام رخ داده است';
      
      set({ 
        sendingMessage: false, 
        error: errorMessage 
      });
      
      toast.error(errorMessage);
      console.error('Error sending conversation message:', error);
      return false;
    }
  },
}));