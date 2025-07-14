// hooks/useFormWithBackendErrors.ts
import { useForm, UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

// Type for backend error response
interface BackendError {
  field: string;
  message: string;
}

interface BackendErrorResponse {
  errors: BackendError[];
}

// Generic hook for forms with backend error handling
export function useFormWithBackendErrors<T extends FieldValues>(
  schema: z.ZodSchema<T>
): UseFormReturn<T> & {
  setBackendErrors: (errors: BackendError[]) => void;
  clearBackendErrors: () => void;
  submitWithErrorHandling: (
    onSubmit: (data: T) => Promise<void>,
    onError?: (error: any) => void
  ) => (data: T) => Promise<void>;
} {
  const form = useForm<T>({
    resolver: zodResolver(schema),
  });

  const setBackendErrors = (errors: BackendError[]) => {
    errors.forEach((error) => {
      form.setError(error.field as Path<T>, {
        type: 'server',
        message: error.message,
      });
    });
  };

  const clearBackendErrors = () => {
    form.clearErrors();
  };

  const submitWithErrorHandling = (
    onSubmit: (data: T) => Promise<void>,
    onError?: (error: any) => void
  ) => {
    return async (data: T) => {
      try {
        clearBackendErrors();
        await onSubmit(data);
      } catch (error: any) {
        if (error.response?.data?.errors) {
          setBackendErrors(error.response.data.errors);
        } else if (onError) {
          onError(error);
        }
      }
    };
  };

  return {
    ...form,
    setBackendErrors,
    clearBackendErrors,
    submitWithErrorHandling,
  };
}

// API service helper
export class ApiService {
  static async post<T>(url: string, data: any): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        response: {
          data: errorData,
        },
      };
    }

    return response.json();
  }
}