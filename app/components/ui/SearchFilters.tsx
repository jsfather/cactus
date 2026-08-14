'use client';

import { useState, useCallback, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import Input from './Input';
import { Button } from './Button';

export interface SearchFilter {
  key: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'tel';
  convertNumbers?: boolean;
}

interface SearchFiltersProps {
  filters: SearchFilter[];
  onSearch: (filters: Record<string, string>) => void;
  loading?: boolean;
  className?: string;
  debounceMs?: number;
  showSearchButton?: boolean;
  initialValues?: Record<string, string>;
}

export default function SearchFilters({
  filters,
  onSearch,
  loading = false,
  className = '',
  debounceMs = 500,
  showSearchButton = true,
  initialValues = {},
}: SearchFiltersProps) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [isExpanded, setIsExpanded] = useState(false);

  // Initialize values from initialValues
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      setValues(initialValues);
      // Auto-expand if there are initial values
      const hasValues = Object.values(initialValues).some((v) => v && v.trim());
      setIsExpanded(hasValues);
    }
  }, [initialValues]);

  // Debounced search for auto-search mode
  const debouncedSearch = useDebouncedCallback(
    (searchValues: Record<string, string>) => {
      const cleanedValues: Record<string, string> = {};
      Object.entries(searchValues).forEach(([key, value]) => {
        if (value && value.trim()) {
          cleanedValues[key] = value.trim();
        }
      });
      onSearch(cleanedValues);
    },
    debounceMs
  );

  const handleChange = useCallback(
    (key: string, value: string) => {
      const newValues = { ...values, [key]: value };
      setValues(newValues);

      // Auto-search when not showing button
      if (!showSearchButton) {
        debouncedSearch(newValues);
      }
    },
    [values, showSearchButton, debouncedSearch]
  );

  const handleSearch = useCallback(() => {
    const cleanedValues: Record<string, string> = {};
    Object.entries(values).forEach(([key, value]) => {
      if (value && value.trim()) {
        cleanedValues[key] = value.trim();
      }
    });
    onSearch(cleanedValues);
  }, [values, onSearch]);

  const handleClear = useCallback(() => {
    setValues({});
    onSearch({});
  }, [onSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && showSearchButton) {
        e.preventDefault();
        handleSearch();
      }
    },
    [showSearchButton, handleSearch]
  );

  const hasActiveFilters = Object.values(values).some((v) => v && v.trim());

  return (
    <div className={`w-full ${className}`}>
      {/* Toggle Button for Mobile / Collapsed View */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex min-h-11 items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          aria-expanded={isExpanded}
        >
          <Filter className="h-4 w-4" />
          فیلتر جستجو
          {hasActiveFilters && (
            <span className="bg-primary-600 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold text-white">
              {Object.values(values).filter((v) => v && v.trim()).length}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="flex min-h-11 items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <X className="h-4 w-4" />
            پاک کردن فیلترها
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <Input
                  id={`filter-${filter.key}`}
                  label={filter.label}
                  placeholder={filter.placeholder || `جستجو ${filter.label}...`}
                  type={filter.type || 'text'}
                  value={values[filter.key] || ''}
                  onChange={(e) => handleChange(filter.key, e.target.value)}
                  onKeyDown={handleKeyDown}
                  convertNumbers={filter.convertNumbers}
                  className="text-sm"
                />
              </div>
            ))}
          </div>

          {showSearchButton && (
            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end dark:border-gray-700">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClear}
                disabled={!hasActiveFilters}
              >
                <X className="ml-2 h-4 w-4" />
                پاک کردن
              </Button>
              <Button type="button" onClick={handleSearch} disabled={loading}>
                <Search className="ml-2 h-4 w-4" />
                {loading ? 'در حال جستجو...' : 'جستجو'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
