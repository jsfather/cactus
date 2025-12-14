import { toast } from 'react-toastify';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]> | any;
}

/**
 * Parse and display API errors with react-toastify
 * Handles various error formats from Laravel backend
 */
export function handleApiError(
  error: ApiError | any,
  showToast: boolean = true
): string {
  let errorMessage = 'خطای ناشناخته رخ داده است';

  // Handle different error formats
  if (error.errors && typeof error.errors === 'object') {
    // Laravel validation errors format: { field: ['error1', 'error2'] }
    const errorMessages: string[] = [];

    for (const field in error.errors) {
      const fieldErrors = error.errors[field];
      if (Array.isArray(fieldErrors)) {
        errorMessages.push(...fieldErrors);
      } else if (typeof fieldErrors === 'string') {
        errorMessages.push(fieldErrors);
      }
    }

    if (errorMessages.length > 0) {
      errorMessage = errorMessages.join('\n');

      if (showToast) {
        // Show each error as a separate toast for better visibility
        if (errorMessages.length <= 3) {
          errorMessages.forEach((msg) => {
            toast.error(msg, {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          });
        } else {
          // If too many errors, show first 3 and a count
          errorMessages.slice(0, 3).forEach((msg) => {
            toast.error(msg, {
              position: 'top-center',
              autoClose: 5000,
            });
          });
          toast.warning(`و ${errorMessages.length - 3} خطای دیگر...`, {
            position: 'top-center',
            autoClose: 3000,
          });
        }
      }

      return errorMessage;
    }
  }

  // Handle string message
  if (error.message && typeof error.message === 'string') {
    errorMessage = error.message;
  }

  // Handle specific HTTP status codes
  if (error.status) {
    switch (error.status) {
      case 400:
        errorMessage = error.message || 'درخواست نامعتبر است';
        break;
      case 401:
        errorMessage = 'لطفا وارد حساب کاربری خود شوید';
        break;
      case 403:
        errorMessage = error.message || 'شما اجازه دسترسی به این بخش را ندارید';
        break;
      case 404:
        errorMessage = error.message || 'موردی یافت نشد';
        break;
      case 422:
        // Validation errors - already handled above
        errorMessage = error.message || 'اطلاعات وارد شده نامعتبر است';
        break;
      case 429:
        errorMessage =
          'تعداد درخواست‌های شما بیش از حد مجاز است. لطفا کمی صبر کنید';
        break;
      case 500:
        errorMessage =
          error.message || 'خطای سرور رخ داده است. لطفا دوباره تلاش کنید';
        break;
      case 502:
      case 503:
      case 504:
        errorMessage = 'سرور موقتا در دسترس نیست. لطفا دوباره تلاش کنید';
        break;
    }
  }

  if (showToast) {
    toast.error(errorMessage, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  return errorMessage;
}

/**
 * Get validation errors as a record for form field errors
 */
export function getValidationErrors(
  error: ApiError | any
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  if (error.errors && typeof error.errors === 'object') {
    for (const field in error.errors) {
      const fieldError = error.errors[field];
      if (Array.isArray(fieldError) && fieldError.length > 0) {
        fieldErrors[field] = fieldError[0];
      } else if (typeof fieldError === 'string') {
        fieldErrors[field] = fieldError;
      }
    }
  }

  return fieldErrors;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return (
    error.message === 'Network Error' ||
    error.code === 'ECONNABORTED' ||
    error.status === 0
  );
}

/**
 * Show success toast
 */
export function showSuccess(message: string): void {
  toast.success(message, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}

/**
 * Show warning toast
 */
export function showWarning(message: string): void {
  toast.warning(message, {
    position: 'top-center',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}

/**
 * Show info toast
 */
export function showInfo(message: string): void {
  toast.info(message, {
    position: 'top-center',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}
