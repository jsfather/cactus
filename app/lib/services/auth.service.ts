import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from '@/app/lib/types';

export class AuthService {
  async sendOTP(payload: SendOTPRequest): Promise<SendOTPResponse> {
    return apiClient.post<SendOTPResponse>(
      API_ENDPOINTS.AUTH.SEND_OTP,
      payload
    );
  }

  async verifyOTP(payload: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    return apiClient.post<VerifyOTPResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      payload
    );
  }
}

export const authService = new AuthService();
