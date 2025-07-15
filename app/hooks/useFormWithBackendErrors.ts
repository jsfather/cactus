import { useForm, UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { ApiError, BackendError } from '@/app/lib/api/client';

// Enhanced hook with better error handling
export function useFormWithBackendErrors<T extends FieldValues>(
  schema: z.ZodSchema<T>
): UseFormReturn<T> & {
  setBackendErrors: (errors: BackendError[]) => void;
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
          // Handle validation errors (422)
          if (error.status === 422 && error.errors) {
            setBackendErrors(error.errors);
          } else {
            // Handle other API errors
            setGlobalError(error.message);
          }
          
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