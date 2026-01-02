'use client';

import { forwardRef, useRef, useCallback, useState, useEffect } from 'react';
import clsx from 'clsx';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

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
  // Server-side search props
  searchable?: boolean;
  onSearch?: (searchTerm: string) => void;
  searchPlaceholder?: string;
  searchDebounceMs?: number;
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
      searchable = false,
      onSearch,
      searchPlaceholder = 'جستجو...',
      searchDebounceMs = 500,
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
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    }, [isOpen, searchable]);

    // Cleanup debounce timer on unmount
    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);

    // Handle search input change with debounce
    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (onSearch) {
          // Clear existing timer
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }

          // Set new timer
          debounceTimerRef.current = setTimeout(() => {
            onSearch(value);
          }, searchDebounceMs);
        }
      },
      [onSearch, searchDebounceMs]
    );

    // Clear search
    const handleClearSearch = useCallback(() => {
      setSearchTerm('');
      if (onSearch) {
        onSearch('');
      }
      searchInputRef.current?.focus();
    }, [onSearch]);

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
            <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              {/* Search input */}
              {searchable && (
                <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder={searchPlaceholder}
                      className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-gray-300 py-2 pr-9 pl-9 text-sm outline-none focus:ring-1 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      onClick={(e) => e.stopPropagation()}
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearSearch();
                        }}
                        className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {loading && (
                    <div className="mt-2 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                      <div className="border-primary-500 mr-2 h-3 w-3 animate-spin rounded-full border-2 border-t-transparent"></div>
                      در حال جستجو...
                    </div>
                  )}
                </div>
              )}

              {/* Options list */}
              <div
                ref={listRef}
                onScroll={handleScroll}
                className="max-h-48 overflow-auto"
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

                {options.length === 0 && !loading && (
                  <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'نتیجه‌ای یافت نشد' : 'موردی وجود ندارد'}
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
              </div>

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
