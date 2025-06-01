'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, required, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            {label}
            {required && <span className="text-red-500 mr-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          {...props}
          className={clsx(
            'block w-full rounded-lg border px-4 py-3 text-sm transition-all outline-none',
            'bg-white dark:bg-gray-900',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'min-h-[120px] resize-y',
            error
              ? 'border-red-500 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-500 dark:text-red-400 dark:focus:border-red-500 dark:focus:ring-red-200/20'
              : 'focus:border-primary-500 focus:ring-primary-200 dark:focus:border-primary-500 dark:focus:ring-primary-200/20 border-gray-300 text-gray-900 focus:ring-2 dark:border-gray-700 dark:text-white',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-errormessage={error ? `${props.id}-error` : undefined}
          aria-required={required}
        />
        {error && (
          <p
            className="mt-2 text-sm text-red-600 dark:text-red-400"
            id={`${props.id}-error`}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
