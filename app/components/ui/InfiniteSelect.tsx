'use client';

import { forwardRef, useRef, useCallback, useState, useEffect } from 'react';
import clsx from 'clsx';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Option {
  label: string;
  value: string | number;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
}

interface InfiniteSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  // Infinite scroll props
  onLoadMore?: () => void;
  loading?: boolean;
  loadingMore?: boolean;
  pagination?: PaginationMeta | null;
}

const InfiniteSelect = forwardRef<HTMLSelectElement, InfiniteSelectProps>(
  (
    {
      label,
      error,
      options,
      className,
      placeholder,
      required,
      onLoadMore,
      loading,
      loadingMore,
      pagination,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | number>(() => {
      const val = props.value;
      if (Array.isArray(val)) return val[0] || '';
      return val || '';
    });
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Update selected value when props.value changes
    useEffect(() => {
      if (props.value !== undefined) {
        const val = props.value;
        if (Array.isArray(val)) {
          setSelectedValue(val[0] || '');
        } else {
          setSelectedValue(val as string | number);
        }
      }
    }, [props.value]);

    const hasMore = pagination
      ? pagination.current_page < pagination.last_page
      : false;

    const handleScroll = useCallback(() => {
      if (!listRef.current || !onLoadMore || loadingMore || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      // Load more when user scrolls to 80% of the list
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        onLoadMore();
      }
    }, [onLoadMore, loadingMore, hasMore]);

    const handleSelect = (option: Option) => {
      setSelectedValue(option.value);
      setIsOpen(false);

      // Trigger onChange event
      if (props.onChange) {
        const syntheticEvent = {
          target: { value: option.value.toString(), name: props.name },
        } as React.ChangeEvent<HTMLSelectElement>;
        props.onChange(syntheticEvent);
      }
    };

    const handleClickOutside = useCallback((event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }, []);

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [handleClickOutside]);

    const selectedLabel = options.find(
      (opt) => opt.value.toString() === selectedValue?.toString()
    )?.label;

    return (
      <div className="w-full" ref={dropdownRef}>
        {label && (
          <label
            htmlFor={props.id}
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            {label}
            {required && <span className="mr-1 text-red-500">*</span>}
          </label>
        )}

        {/* Hidden select for form compatibility */}
        <select
          ref={ref}
          {...props}
          value={selectedValue}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => !props.disabled && setIsOpen(!isOpen)}
            disabled={props.disabled}
            className={clsx(
              'flex w-full items-center justify-between rounded-lg border px-4 py-3 text-right text-sm transition-all outline-none',
              'bg-white dark:bg-gray-900',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-red-500 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-500 dark:text-red-400'
                : isOpen
                  ? 'border-primary-500 ring-primary-200 dark:border-primary-500 dark:ring-primary-200/20 ring-2'
                  : 'border-gray-300 text-gray-900 hover:border-gray-400 dark:border-gray-700 dark:text-white',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-required={required}
          >
            <span
              className={clsx(
                'block truncate',
                !selectedLabel && 'text-gray-500 dark:text-gray-400'
              )}
            >
              {loading
                ? 'در حال بارگذاری...'
                : selectedLabel || placeholder || 'انتخاب کنید'}
            </span>
            <ChevronDownIcon
              className={clsx(
                'h-5 w-5 text-gray-400 transition-transform dark:text-gray-500',
                isOpen && 'rotate-180'
              )}
            />
          </button>

          {/* Dropdown list */}
          {isOpen && (
            <div
              ref={listRef}
              onScroll={handleScroll}
              className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              {placeholder && (
                <div
                  onClick={() =>
                    handleSelect({ label: placeholder, value: '' })
                  }
                  className={clsx(
                    'cursor-pointer px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700',
                    selectedValue === '' &&
                      'bg-primary-50 dark:bg-primary-900/20'
                  )}
                >
                  {placeholder}
                </div>
              )}

              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={clsx(
                    'cursor-pointer px-4 py-2.5 text-sm transition-colors',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    selectedValue?.toString() === option.value.toString()
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-900 dark:text-white'
                  )}
                >
                  {option.label}
                </div>
              ))}

              {/* Loading more indicator */}
              {loadingMore && (
                <div className="flex items-center justify-center py-3">
                  <div className="border-primary-500 h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div>
                  <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">
                    در حال بارگذاری...
                  </span>
                </div>
              )}

              {/* Show total count */}
              {pagination && !loadingMore && (
                <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  نمایش {options.length} از {pagination.total}
                </div>
              )}
            </div>
          )}
        </div>

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

InfiniteSelect.displayName = 'InfiniteSelect';

export default InfiniteSelect;
