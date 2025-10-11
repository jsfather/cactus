'use client';

import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected options
  const selectedOptions = options.filter(option => value.includes(option.value));

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    
    onChange?.(newValue);
  };

  const handleRemoveOption = (optionValue: string | number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (disabled) return;
    
    const newValue = value.filter(v => v !== optionValue);
    onChange?.(newValue);
  };

  const displayText = () => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }

    if (selectedOptions.length <= maxDisplayItems) {
      return selectedOptions.map(option => option.label).join('، ');
    }

    const displayedOptions = selectedOptions.slice(0, maxDisplayItems);
    const remainingCount = selectedOptions.length - maxDisplayItems;
    
    return `${displayedOptions.map(option => option.label).join('، ')} و ${remainingCount} مورد دیگر`;
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
            'block w-full appearance-none rounded-lg border px-4 py-3 text-sm transition-all outline-none text-right',
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
                'h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform',
                isOpen && 'rotate-180'
              )} 
            />
          </div>
        </button>

        {/* Selected items as badges (when dropdown is closed and items are selected) */}
        {!isOpen && selectedOptions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedOptions.slice(0, maxDisplayItems).map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-md dark:bg-primary-900 dark:text-primary-300"
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
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md dark:bg-gray-800 dark:text-gray-400">
                +{selectedOptions.length - maxDisplayItems}
              </span>
            )}
          </div>
        )}

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
            {/* Search input */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleOption(option.value)}
                        className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 focus:ring-2"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
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