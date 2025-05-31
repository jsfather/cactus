'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          {...props}
          className={clsx(
            'block w-full rounded-lg border px-4 py-3 text-sm transition-all outline-none',
            'bg-white dark:bg-gray-900',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            error
              ? 'border-red-500 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-500 dark:text-red-400 dark:focus:border-red-500 dark:focus:ring-red-200/20'
              : 'focus:border-primary-500 focus:ring-primary-200 dark:focus:border-primary-500 dark:focus:ring-primary-200/20 border-gray-300 text-gray-900 focus:ring-2 dark:border-gray-700 dark:text-white',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-errormessage={error ? `${props.id}-error` : undefined}
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

Input.displayName = 'Input';

export default Input;
