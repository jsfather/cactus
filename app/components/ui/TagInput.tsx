'use client';

import { useState, forwardRef, useCallback, KeyboardEvent } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

interface TagInputProps {
  id?: string;
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  value?: string[];
  onChange?: (tags: string[]) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
}

const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      id,
      label,
      error,
      required,
      placeholder = 'برچسب جدید...',
      value = [],
      onChange,
      onBlur,
      disabled,
      className,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState('');

    const addTag = useCallback(
      (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !value.includes(trimmedTag)) {
          onChange?.([...value, trimmedTag]);
        }
        setInputValue('');
      },
      [value, onChange]
    );

    const removeTag = useCallback(
      (tagToRemove: string) => {
        onChange?.(value.filter((tag) => tag !== tagToRemove));
      },
      [value, onChange]
    );

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag(inputValue);
      } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
        removeTag(value[value.length - 1]);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      // If user types a comma, add the tag
      if (newValue.includes(',')) {
        const parts = newValue.split(',');
        parts.forEach((part, index) => {
          if (index < parts.length - 1) {
            addTag(part);
          } else {
            setInputValue(part);
          }
        });
      } else {
        setInputValue(newValue);
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            {label}
            {required && <span className="mr-1 text-red-500">*</span>}
          </label>
        )}
        <div
          className={clsx(
            'flex min-h-[46px] w-full flex-wrap items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all',
            'bg-white dark:bg-gray-900',
            disabled && 'cursor-not-allowed opacity-50',
            error
              ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200 dark:border-red-500 dark:focus-within:border-red-500 dark:focus-within:ring-red-200/20'
              : 'focus-within:border-primary-500 focus-within:ring-primary-200 dark:focus-within:border-primary-500 dark:focus-within:ring-primary-200/20 border-gray-300 focus-within:ring-2 dark:border-gray-700',
            className
          )}
        >
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2.5 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="rounded-full p-0.5 transition-colors hover:bg-blue-200 dark:hover:bg-blue-800"
                  aria-label={`حذف برچسب ${tag}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </span>
          ))}
          <input
            ref={ref}
            id={id}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={value.length === 0 ? placeholder : ''}
            className={clsx(
              'min-w-[120px] flex-1 border-none bg-transparent text-sm outline-none',
              'text-gray-900 placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500'
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-errormessage={error ? `${id}-error` : undefined}
            aria-required={required}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          با Enter یا کاما برچسب جدید اضافه کنید
        </p>
        {error && (
          <p
            className="mt-2 text-sm text-red-600 dark:text-red-400"
            id={`${id}-error`}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

TagInput.displayName = 'TagInput';

export default TagInput;
