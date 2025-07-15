import { useForm, UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { ApiError, BackendError } from '@/app/lib/api/client';

// hooks/useAuthErrorHandler.ts
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuthErrorHandler() {
  const router = useRouter();

  const handleAuthError = (error: ApiError) => {
    if (error.status === 401) {
      // Clear any stored auth data
      localStorage.removeItem('authToken');
      
      // Redirect to login page
      router.push('/login');
      
      // Optionally show a toast notification
      // toast.error('جلسه شما منقضی شده است. لطفاً مجدداً وارد شوید');
    }
  };

  return { handleAuthError };
}

// Enhanced hook with auth error handling
export function useFormWithBackendErrors<T extends FieldValues>(
  schema: z.ZodSchema<T>
): UseFormReturn<T> & {
  setBackendErrors: (errors: BackendError[] | Record<string, string[]>) => void;
  clearBackendErrors: () => void;
  submitWithErrorHandling: (
    onSubmit: (data: T) => Promise<void>,
    onError?: (error: ApiError) => void
  ) => (data: T) => Promise<void>;
  globalError: string | null;
  setGlobalError: (error: string | null) => void;
} {
  const form = useForm<T>({
    resolver: zodResolver(schema),
  });

  const [globalError, setGlobalError] = useState<string | null>(null);
  const { handleAuthError } = useAuthErrorHandler();

  const setBackendErrors = (errors: BackendError[] | Record<string, string[]>) => {
    // Handle array format: [{field: "title", message: "error"}]
    if (Array.isArray(errors)) {
      errors.forEach((error) => {
        form.setError(error.field as Path<T>, {
          type: 'server',
          message: error.message,
        });
      });
    } 
    // Handle object format: {title: ["error1", "error2"], slug: ["error"]}
    else if (typeof errors === 'object') {
      Object.entries(errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          form.setError(field as Path<T>, {
            type: 'server',
            message: messages[0], // Use first error message
          });
        }
      });
    }
  };

  const clearBackendErrors = () => {
    form.clearErrors();
    setGlobalError(null);
  };

  const submitWithErrorHandling = (
    onSubmit: (data: T) => Promise<void>,
    onError?: (error: ApiError) => void
  ) => {
    return async (data: T) => {
      try {
        clearBackendErrors();
        await onSubmit(data);
      } catch (error: any) {
        if (error instanceof ApiError) {
          // Handle authentication errors globally
          if (error.status === 401) {
            handleAuthError(error);
            return;
          }
          
          // Handle validation errors (422) - your ApiError.errors contains the field errors
          if (error.status === 422 && error.errors) {
             setGlobalError(error.message);
            setBackendErrors(error.errors as any); // error.errors is the object format from backend
          } else {
            // Handle other API errors - set global error for toast
            setGlobalError(error.message);
          }
          
          // Always call onError for toast message
          if (onError) {
            onError(error);
          }
        } else {
          // Handle non-API errors
          setGlobalError('خطای غیرمنتظره‌ای رخ داده است');
          if (onError) {
            onError(error);
          }
        }
      }
    };
  };

  return {
    ...form,
    setBackendErrors,
    clearBackendErrors,
    submitWithErrorHandling,
    globalError,
    setGlobalError,
  };
}