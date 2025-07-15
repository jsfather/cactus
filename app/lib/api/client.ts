'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  constructor(message: string, status: number, response: Response, errors?: BackendError[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.response = response;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json', // Explicitly request JSON response
    'X-Requested-With': 'XMLHttpRequest', // Indicate this is an AJAX request
  };

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

  let response: Response;
  
  try {
    response = await fetch(`${API_URL}/${path}`, {
      ...options,
      headers,
      // Prevent automatic redirect following
      redirect: 'manual',
    });

    // Handle manual redirect detection
    if (response.type === 'opaqueredirect' || response.status === 302) {
      console.warn('Received redirect response, treating as authentication error');
      throw new ApiError(
        'Authentication required',
        401,
        response
      );
    }

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Network error occurred',
      0,
      new Response(null, { status: 0 })
    );
  }

  if (!response.ok) {
    let errorData: any = {};
    
    try {
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        // If not JSON, try to get text for debugging
        const textResponse = await response.text();
        console.warn('Non-JSON error response:', textResponse);
        errorData = { message: 'Invalid response format' };
      }
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      errorData = { message: 'Failed to parse error response' };
    }

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

  try {
    return await response.json();
  } catch (parseError) {
    console.error('Error parsing success response:', parseError);
    throw new ApiError(
      'Invalid response format',
      response.status,
      response
    );
  }
}

// Enhanced API service with better error handling
export class ApiService {
  static async get<T>(path: string, options: RequestInit = {}): Promise<T> {
    return request<T>(path, { ...options, method: 'GET' });
  }

  static async post<T>(path: string, data?: any, options: RequestInit = {}): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put<T>(path: string, data?: any, options: RequestInit = {}): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async patch<T>(path: string, data?: any, options: RequestInit = {}): Promise<T> {
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