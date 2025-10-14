import { create } from 'zustand';
import { toast } from 'react-toastify';
import { TeacherTerm } from '@/app/lib/types/teacher-term';
import { teacherTermService } from '@/app/lib/services/teacher-term.service';

interface TeacherTermState {
  // State
  terms: TeacherTerm[];
  currentTerm: TeacherTerm | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchTerms: () => Promise<void>;
  fetchTermById: (id: string) => Promise<void>;
  clearCurrentTerm: () => void;
  clearError: () => void;
}

export const useTeacherTermStore = create<TeacherTermState>((set, get) => ({
  // Initial state
  terms: [],
  currentTerm: null,
  loading: false,
  error: null,

  // Actions
  fetchTerms: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await teacherTermService.getList();
      set({ 
        terms: response.data, 
        loading: false,
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطایی در دریافت لیست ترم‌ها رخ داده است';
      
      set({ 
        loading: false, 
        error: errorMessage,
        terms: []
      });
      
      toast.error(errorMessage);
      console.error('Error fetching teacher terms:', error);
    }
  },

  fetchTermById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await teacherTermService.getById(id);
      set({ 
        currentTerm: response.data, 
        loading: false,
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطایی در دریافت ترم رخ داده است';
      
      set({ 
        loading: false, 
        error: errorMessage,
        currentTerm: null
      });
      
      toast.error(errorMessage);
      console.error('Error fetching teacher term:', error);
    }
  },

  clearCurrentTerm: () => {
    set({ currentTerm: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));