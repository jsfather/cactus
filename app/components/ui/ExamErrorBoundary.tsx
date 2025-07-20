'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

interface ExamErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ExamErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

class ExamErrorBoundary extends React.Component<
  ExamErrorBoundaryProps,
  ExamErrorBoundaryState
> {
  constructor(props: ExamErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ExamErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Exam Error Boundary caught an error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      return <DefaultErrorFallback error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; retry: () => void }> = ({
  error,
  retry,
}) => {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          خطایی رخ داده است
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          {error?.message || 'خطای غیرمنتظره‌ای در بارگذاری آزمون رخ داده است'}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={retry}
            className="flex items-center gap-2"
            variant="primary"
          >
            <RefreshCw className="h-4 w-4" />
            تلاش مجدد
          </Button>
          <Button
            onClick={() => (window.location.href = '/student/dashboard')}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            بازگشت به داشبورد
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamErrorBoundary;
