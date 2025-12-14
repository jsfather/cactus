import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { handleApiError as showApiError } from '@/app/lib/utils/error';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]> | any;
}

export interface BackendError {
  field: string;
  message: string;
}

class ApiClient {
  private client: AxiosInstance;
  private currentToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.initializeToken();
  }

  // Initialize token from storage on app start
  private initializeToken(): void {
    if (typeof window !== 'undefined') {
      const token = this.getToken();
      this.currentToken = token;
    }
  }

  // Method to set token directly (for immediate use after login)
  setToken(token: string | null): void {
    this.currentToken = token;
  }

  // Method to get current token
  private getToken(): string | null {
    // First check if we have a token set directly
    if (this.currentToken) {
      return this.currentToken;
    }

    if (typeof window !== 'undefined') {
      // Try to get from zustand persisted storage
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          const token = parsed?.state?.token;
          if (token) {
            this.currentToken = token;
            return token;
          }
        }
      } catch (error) {
        console.warn('Failed to parse auth-storage from localStorage:', error);
      }

      // Fallback to direct localStorage access for backward compatibility
      const token = localStorage.getItem('authToken');
      if (token) {
        this.currentToken = token;
        return token;
      }
    }

    return null;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Don't override Content-Type if it's FormData
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message,
          status: error.response?.status || 500,
          code: error.response?.data?.code,
          errors: error.response?.data?.errors,
        };

        // Show toast error automatically (except for 401 which redirects)
        if (error.response?.status !== 401) {
          showApiError(apiError);
        }

        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            // Clear both zustand store and localStorage
            this.currentToken = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('auth-storage');

            // Redirect to login
            window.location.href = '/send-otp';
          }
        }

        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Public method to clear token
  clearToken(): void {
    this.currentToken = null;
  }
}

export const apiClient = new ApiClient();

// Default request function for backward compatibility
const request = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return apiClient.get<T>(url, config);
};

export default request;

// Public API client for unauthenticated requests
class PublicApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const apiError: ApiError = {
          message:
            error.response?.data?.message || error.message || 'خطای ناشناخته',
          status: error.response?.status || 500,
          code: error.response?.data?.code,
          errors: error.response?.data?.errors,
        };

        // Show toast error automatically
        showApiError(apiError);

        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }
}

export const publicApiClient = new PublicApiClient();
