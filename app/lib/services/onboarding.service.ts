import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  OnboardingInformationRequest,
  OnboardingInformationResponse,
} from '@/app/lib/types';

export interface OnboardingDocumentsRequest {
  national_card: globalThis.File;
  certificate: globalThis.File;
}

export interface OnboardingDocumentsResponse {
  message: string;
  data?: any;
}

export const onboardingService = {
  async submitInformation(payload: OnboardingInformationRequest): Promise<OnboardingInformationResponse> {
    return apiClient.post<OnboardingInformationResponse>(
      API_ENDPOINTS.ONBOARDING.INFORMATION,
      payload
    );
  },

  async uploadDocuments(payload: OnboardingDocumentsRequest): Promise<OnboardingDocumentsResponse> {
    const formData = new FormData();
    formData.append('national_card', payload.national_card);
    formData.append('certificate', payload.certificate);
    
    return apiClient.post<OnboardingDocumentsResponse>(
      API_ENDPOINTS.ONBOARDING.UPLOAD_DOCUMENTS,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
};
