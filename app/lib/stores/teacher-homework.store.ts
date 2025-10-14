import { create } from 'zustand';
import { toast } from 'react-toastify';
import { 
  TeacherHomework, 
  CreateTeacherHomeworkRequest, 
  UpdateTeacherHomeworkRequest 
} from '@/app/lib/types/teacher-homework';
import { teacherHomeworkService } from '@/app/lib/services/teacher-homework.service';

interface TeacherHomeworkState {
  // State
  homeworks: TeacherHomework[];
  currentHomework: TeacherHomework | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;

  // Actions
  fetchHomeworks: () => Promise<void>;
  fetchHomeworkById: (id: string) => Promise<void>;
  createHomework: (payload: CreateTeacherHomeworkRequest) => Promise<TeacherHomework | null>;
  updateHomework: (id: string, payload: UpdateTeacherHomeworkRequest) => Promise<TeacherHomework | null>;
  deleteHomework: (id: string) => Promise<boolean>;
  clearCurrentHomework: () => void;
  clearError: () => void;
}

export const useTeacherHomeworkStore = create<TeacherHomeworkState>((set, get) => ({
  // Initial state
  homeworks: [],
  currentHomework: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
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

  updateHomework: async (id: string, payload: UpdateTeacherHomeworkRequest) => {
    set({ updating: true, error: null });
    
    try {
      const response = await teacherHomeworkService.update(id, payload);
      const updatedHomework = response.data;
      
      // Update in the list optimistically
      set(state => ({ 
        homeworks: state.homeworks.map(homework => 
          homework.id.toString() === id ? updatedHomework : homework
        ),
        currentHomework: state.currentHomework?.id.toString() === id ? updatedHomework : state.currentHomework,
        updating: false,
        error: null 
      }));
      
      toast.success('تکلیف با موفقیت بروزرسانی شد');
      return updatedHomework;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطایی در بروزرسانی تکلیف رخ داده است';
      
      set({ 
        updating: false, 
        error: errorMessage 
      });
      
      toast.error(errorMessage);
      console.error('Error updating teacher homework:', error);
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
}));