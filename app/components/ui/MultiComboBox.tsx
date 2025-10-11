'use client';

import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import {
  ChevronDownIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export interface Option {
  label: string;
  value: string | number;
  description?: string;
}

interface MultiComboBoxProps {
  id?: string;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  options: Option[];
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  onBlur?: () => void;
  className?: string;
  maxDisplayItems?: number;
}

const MultiComboBox: React.FC<MultiComboBoxProps> = ({
  id,
  label,
  placeholder = 'انتخاب کنید...',
  searchPlaceholder = 'جستجو...',
  error,
  required,
  disabled,
  options,
  value = [],
  onChange,
  onBlur,
  className,
  maxDisplayItems = 2,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected options
  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
        onBlur?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggleOption = (optionValue: string | number) => {
    if (disabled) return;

    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];

    onChange?.(newValue);
  };

  const handleRemoveOption = (
    optionValue: string | number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    if (disabled) return;

    const newValue = value.filter((v) => v !== optionValue);
    onChange?.(newValue);
  };

  const displayText = () => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }

    if (selectedOptions.length <= maxDisplayItems) {
      return selectedOptions.map((option) => option.label).join('، ');
    }

    const displayedOptions = selectedOptions.slice(0, maxDisplayItems);
    const remainingCount = selectedOptions.length - maxDisplayItems;

    return `${displayedOptions.map((option) => option.label).join('، ')} و ${remainingCount} مورد دیگر`;
  };

  return (
    <div className={clsx('w-full', className)} ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
          {required && <span className="mr-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Main trigger button */}
        <button
          type="button"
          id={id}
          className={clsx(
            'block w-full appearance-none rounded-lg border px-4 py-3 text-right text-sm transition-all outline-none',
            'bg-white dark:bg-gray-900',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-red-500 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-500 dark:text-red-400 dark:focus:border-red-500 dark:focus:ring-red-200/20'
              : 'focus:border-primary-500 focus:ring-primary-200 dark:focus:border-primary-500 dark:focus:ring-primary-200/20 border-gray-300 text-gray-900 focus:ring-2 dark:border-gray-700 dark:text-white',
            selectedOptions.length === 0 && 'text-gray-500 dark:text-gray-400'
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={error ? 'true' : 'false'}
          aria-errormessage={error ? `${id}-error` : undefined}
          aria-required={required}
        >
          <div className="flex items-center justify-between">
            <span className="truncate">{displayText()}</span>
            <ChevronDownIcon
              className={clsx(
                'h-5 w-5 text-gray-400 transition-transform dark:text-gray-500',
                isOpen && 'rotate-180'
              )}
            />
          </div>
        </button>

        {/* Selected items as badges (when dropdown is closed and items are selected) */}
        {!isOpen && selectedOptions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {selectedOptions.slice(0, maxDisplayItems).map((option) => (
              <span
                key={option.value}
                className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
              >
                {option.label}
                <button
                  type="button"
                  onClick={(e) => handleRemoveOption(option.value, e)}
                  className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                  disabled={disabled}
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
            {selectedOptions.length > maxDisplayItems && (
              <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                +{selectedOptions.length - maxDisplayItems}
              </span>
            )}
          </div>
        )}

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-64 w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
            {/* Search input */}
            <div className="border-b border-gray-200 p-3 dark:border-gray-700">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 w-full rounded-md border border-gray-300 bg-white py-2 pr-10 pl-4 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Options list */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  موردی یافت نشد
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleOption(option.value)}
                        className="text-primary-600 focus:ring-primary-500 rounded border-gray-300 focus:ring-2 dark:border-gray-600"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

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
};

export default MultiComboBox;
