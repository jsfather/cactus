import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authService } from '@/app/lib/services/auth.service';
import { apiClient } from '@/app/lib/api/client';
import type { ApiError } from '@/app/lib/api/client';
import { User, SendOTPRequest, VerifyOTPRequest, SendOTPResponse, VerifyOTPResponse, GetProfileResponse, UpdateProfileRequest, OnboardingInformationRequest, OnboardingInformationResponse } from '@/app/lib/types';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  
  // Auth methods
  sendOtp: (payload: SendOTPRequest) => Promise<SendOTPResponse>;
  verifyOtp: (payload: VerifyOTPRequest) => Promise<VerifyOTPResponse>;
  logout: () => void;
  initialize: () => Promise<void>;
  
  // User profile methods
  fetchProfile: () => Promise<void>;
  updateProfile: (payload: UpdateProfileRequest) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        isInitialized: false,

        // Basic actions
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),
        
        setToken: (token) => {
          set({ 
            token, 
            isAuthenticated: !!token 
          });
          
          // Update API client immediately
          apiClient.setToken(token);
          
          // Update localStorage for backward compatibility
          if (typeof window !== 'undefined') {
            if (token) {
              localStorage.setItem('authToken', token);
            } else {
              localStorage.removeItem('authToken');
            }
          }
        },
        
        setUser: (user) => set({ user }),

        // Auth methods
        sendOtp: async (payload) => {
          try {
            set({ loading: true, error: null });
            const response = await authService.sendOTP(payload);
            set({ loading: false });
            return response;
          } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, loading: false });
            throw error;
          }
        },

        verifyOtp: async (payload) => {
          try {
            set({ loading: true, error: null });
            const response = await authService.verifyOTP(payload);
            
            if (response.token) {
              get().setToken(response.token);
              // Immediately fetch user profile after setting token
              await get().fetchProfile();
            }
            
            set({ loading: false });
            return response;
          } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, loading: false });
            throw error;
          }
        },

        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
          
          // Clear API client token
          apiClient.setToken(null);
          
          // Clear localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
          }
        },

        initialize: async () => {
          if (get().isInitialized) return;
          
          try {
            const state = get();
            if (state.token) {
              // Token exists from persisted store, fetch profile
              await get().fetchProfile();
            }
          } catch (error) {
            // If initialization fails, clear auth state
            get().logout();
          } finally {
            set({ isInitialized: true });
          }
        },

        fetchProfile: async () => {
          try {
            set({ loading: true, error: null });
            const response = await authService.getProfile();
            set({ 
              user: response.data,
              loading: false 
            });
          } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, loading: false });
            
            // If unauthorized, logout
            if (apiError.status === 401) {
              get().logout();
            }
            
            throw error;
          }
        },

        updateProfile: async (payload) => {
          try {
            set({ loading: true, error: null });
            const response = await authService.updateProfile(payload);
            set({ 
              user: response.data,
              loading: false 
            });
          } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, loading: false });
            throw error;
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ 
          token: state.token,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          if (state?.token) {
            // Set token in API client when rehydrated
            apiClient.setToken(state.token);
          }
        },
      }
    )
  )
);
