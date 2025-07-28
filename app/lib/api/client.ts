// lib/api-client.ts
'use client';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://kaktos.kanoonbartarha.ir/api';

// Enhanced error types for better error handling
export interface BackendError {
  field: string;
  message: string;
}

export interface BackendErrorResponse {
  errors: BackendError[];
  message?: string;
}

export class ApiError extends Error {
  public status: number;
  public errors?: BackendError[];
  public response: Response;

  constructor(
    message: string,
    status: number,
    response: Response,
    errors?: BackendError[]
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.response = response;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // اطمینان از وجود API_URL
  if (!API_URL) {
    throw new Error(
      'API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.'
    );
  }

  const headers: Record<string, string> = {};

  // Only set Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers[key] = value;
      }
    });
  }

  const token = localStorage.getItem('authToken');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // اطمینان از صحت URL
  const baseUrl = API_URL?.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const fullUrl = `${baseUrl}/${path}`;

  console.log('API Request URL:', fullUrl); // Debug log

  const response = await fetch(fullUrl, {
    ...options,
    headers,
    redirect: 'manual',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    // Handle validation errors (422) vs other errors
    if (response.status === 422 && errorData.errors) {
      throw new ApiError(
        errorData.message || 'خطای اعتبارسنجی',
        response.status,
        response,
        errorData.errors
      );
    }

    throw new ApiError(
      errorData.message || 'خطایی رخ داده است',
      response.status,
      response
    );
  }

  return response.json();
}

// Enhanced API service with better error handling
export class ApiService {
  static async get<T>(path: string, options: RequestInit = {}): Promise<T> {
    return request<T>(path, { ...options, method: 'GET' });
  }

  static async post<T>(
    path: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put<T>(
    path: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async patch<T>(
    path: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete<T>(path: string, options: RequestInit = {}): Promise<T> {
    return request<T>(path, { ...options, method: 'DELETE' });
  }
}

// Re-export the original request function for backward compatibility
export default request;
