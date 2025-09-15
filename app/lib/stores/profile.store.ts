import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { profileService } from '@/app/lib/services/profile.service';
import type { ApiError } from '@/app/lib/api/client';
import { User, UpdateProfileRequest, GetProfileResponse } from '@/app/lib/types';

interface ProfileState {
  // State
  profile: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchProfile: () => Promise<void>;
  updateProfile: (payload: UpdateProfileRequest) => Promise<GetProfileResponse>;
  setProfile: (profile: User) => void;
}

export const useProfileStore = create<ProfileState>()(
  devtools((set, get) => ({
    // Initial state
    profile: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    setProfile: (profile) => set({ profile }),

    fetchProfile: async () => {
      try {
        set({ loading: true, error: null });
        const response = await profileService.getProfile();
        set({
          profile: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({
          loading: false,
          error: apiError.message || 'خطایی در دریافت اطلاعات پروفایل رخ داد',
        });
        throw error;
      }
    },

    updateProfile: async (payload: UpdateProfileRequest) => {
      try {
        set({ loading: true, error: null });
        const response = await profileService.updateProfile(payload);
        
        // Optimistic update
        set({
          profile: response.data,
          loading: false,
        });
        
        return response;
      } catch (error) {
        const apiError = error as ApiError;
        set({
          loading: false,
          error: apiError.message || 'خطایی در بروزرسانی پروفایل رخ داد',
        });
        throw error;
      }
    },
  }))
);