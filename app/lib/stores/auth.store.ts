import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authService } from '@/app/lib/services/auth.service';
import type { ApiError } from '@/app/lib/api/client';
import type { User } from '@/app/lib/types';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  login: (token: string) => Promise<void>;
  logout: () => void;
  fetchProfile: (force?: boolean) => Promise<User | null>;
  updateProfile: (payload: any) => Promise<User>;
}

export const useAuthStore = create<AuthState>()(
  devtools((set, get) => ({
    // Initial state
    user: null,
    isAuthenticated: false,
    token: typeof window !== 'undefined' ? localStorage.getItem('authToken') : null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    login: async (token: string) => {
      try {
        set({ loading: true, error: null });
        
        // Store token
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', token);
        }
        
        set({ token });
        
        // Fetch user profile
        const user = await get().fetchProfile(true);
        
        set({
          isAuthenticated: !!user,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ 
          error: apiError.message, 
          loading: false,
          isAuthenticated: false,
          user: null,
          token: null
        });
        
        // Clear invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
        }
        
        throw error;
      }
    },

    logout: () => {
      // Clear token from storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
      
      set({
        user: null,
        isAuthenticated: false,
        token: null,
        error: null,
        loading: false,
      });
    },

    fetchProfile: async (force = false) => {
      try {
        const { user, token, loading } = get();
        
        // If already loading, return current user
        if (loading) return user;
        
        // If no token, can't fetch profile
        if (!token) {
          set({ user: null, isAuthenticated: false });
          return null;
        }
        
        // If already loaded and not forcing refresh
        if (!force && user) {
          return user;
        }

        set({ loading: true, error: null });
        
        const response = await authService.getProfile();
        const fetchedUser = response.data;

        set({
          user: fetchedUser,
          isAuthenticated: true,
          loading: false,
        });

        return fetchedUser;
      } catch (error) {
        const apiError = error as ApiError;
        
        // If unauthorized, clear auth state
        if (apiError.status === 401) {
          get().logout();
        } else {
          set({ error: apiError.message, loading: false });
        }
        
        throw error;
      }
    },

    updateProfile: async (payload) => {
      try {
        set({ loading: true, error: null });
        
        const response = await authService.updateProfile(payload);
        const updatedUser = response.data;
        
        set({
          user: updatedUser,
          loading: false,
        });
        
        return updatedUser;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);