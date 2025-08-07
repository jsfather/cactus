'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';
import { convertToEnglishNumbers } from '@/app/lib/utils/persian';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  convertNumbers?: boolean; // New prop to enable number conversion
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      className,
      required,
      convertNumbers = false,
      onChange,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (convertNumbers) {
        // Convert Persian/Arabic numbers to English
        const englishValue = convertToEnglishNumbers(e.target.value);
        // Create new event with converted value
        const newEvent = {
          ...e,
          target: {
            ...e.target,
            value: englishValue,
          },
        };
        onChange?.(newEvent as React.ChangeEvent<HTMLInputElement>);
      } else {
        onChange?.(e);
      }
    };
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            {label}
            {required && <span className="mr-1 text-red-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          {...props}
          onChange={handleChange}
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

Input.displayName = 'Input';

export default Input;
