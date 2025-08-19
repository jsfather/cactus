import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { onboardingService, OnboardingDocumentsRequest, OnboardingDocumentsResponse } from '@/app/lib/services/onboarding.service';
import type { ApiError } from '@/app/lib/api/client';
import { OnboardingInformationRequest, OnboardingInformationResponse } from '@/app/lib/types';

interface OnboardingState {
  // State
  loading: boolean;
  error: string | null;
  informationSubmitted: boolean;
  documentsSubmitted: boolean;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Onboarding methods
  submitInformation: (payload: OnboardingInformationRequest) => Promise<OnboardingInformationResponse>;
  uploadDocuments: (payload: OnboardingDocumentsRequest) => Promise<OnboardingDocumentsResponse>;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  devtools(
    (set, get) => ({
      // Initial state
      loading: false,
      error: null,
      informationSubmitted: false,
      documentsSubmitted: false,

      // Basic actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Onboarding methods
      submitInformation: async (payload) => {
        try {
          set({ loading: true, error: null });
          const response = await onboardingService.submitInformation(payload);
          set({ loading: false, informationSubmitted: true });
          return response;
        } catch (error) {
          const apiError = error as ApiError;
          set({ error: apiError.message, loading: false });
          throw error;
        }
      },

      uploadDocuments: async (payload) => {
        try {
          set({ loading: true, error: null });
          const response = await onboardingService.uploadDocuments(payload);
          set({ loading: false, documentsSubmitted: true });
          return response;
        } catch (error) {
          const apiError = error as ApiError;
          set({ error: apiError.message, loading: false });
          throw error;
        }
      },

      reset: () => set({
        loading: false,
        error: null,
        informationSubmitted: false,
        documentsSubmitted: false,
      }),
    }),
    {
      name: 'onboarding-store',
    }
  )
);
