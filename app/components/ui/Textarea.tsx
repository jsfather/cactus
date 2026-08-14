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
      <div className="w-full min-w-0">
        {label && (
          <label
            htmlFor={props.id}
            className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
          >
            {label}
            {required && <span className="mr-1 text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          {...props}
          className={clsx(
            'block w-full min-w-0 resize-y rounded-xl border px-3.5 py-3 text-sm transition-[border-color,box-shadow,background-color] outline-none',
            'bg-white shadow-sm shadow-gray-950/[0.02] disabled:bg-gray-100 disabled:text-gray-500 dark:bg-gray-900 dark:disabled:bg-gray-800',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'font-dana-fanum min-h-32 text-right leading-7',
            error
              ? 'border-red-500 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-red-500 dark:text-red-300 dark:focus:ring-red-950'
              : 'focus:border-primary-600 focus:ring-primary-100 dark:focus:border-primary-400 dark:focus:ring-primary-950/60 border-gray-300 text-gray-900 focus:ring-4 dark:border-gray-700 dark:text-white',
            className
          )}
          dir="rtl"
          aria-invalid={error ? 'true' : 'false'}
          aria-errormessage={error ? `${props.id}-error` : undefined}
          aria-required={required}
        />
        {error && (
          <p
            className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400"
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
