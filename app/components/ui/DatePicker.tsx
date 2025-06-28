'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

interface DatePickerProps {
  label?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

const DatePickerComponent = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ 
    label, 
    error, 
    required, 
    value, 
    onChange, 
    onBlur,
    name,
    placeholder = "تاریخ را انتخاب کنید",
    className,
    disabled,
    id,
  }, ref) => {
    console.log('DatePicker value prop:', value);

    const handleDateChange = (date: any) => {
      if (date) {
        // Convert to YYYY-MM-DD format
        const year = date.year;
        const month = String(date.month.number).padStart(2, '0');
        const day = String(date.day).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        console.log('DatePicker onChange:', formattedDate);
        
        // Call react-hook-form onChange
        if (onChange) {
          onChange(formattedDate);
        }
      } else {
        // Call react-hook-form onChange
        if (onChange) {
          onChange('');
        }
      }
    };

    const handleBlur = () => {
      if (onBlur) {
        onBlur();
      }
    };

    const parseValue = (dateString: string) => {
      if (!dateString) return undefined;
      const [year, month, day] = dateString.split('-').map(Number);
      return new DateObject({
        year,
        month: month,
        day,
        calendar: persian,
        locale: persian_fa
      });
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
        <div className="relative">
          {/* Hidden input for react-hook-form */}
          <input
            ref={ref}
            name={name}
            value={value || ''}
            onChange={() => {}} // Controlled by DatePicker
            style={{ display: 'none' }}
          />
          
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={parseValue(value || '')}
            onChange={handleDateChange}
            onClose={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={'custom-rmdp'}
            calendarPosition='bottom-end'
            containerClassName='w-full'
            inputClass={clsx(
              'w-full rounded-lg border px-4 py-3 text-sm transition-all outline-none',
              'bg-white dark:bg-gray-900',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              error
                ? 'border-red-500 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-500 dark:text-red-400 dark:focus:border-red-500 dark:focus:ring-red-200/20'
                : 'focus:border-primary-500 focus:ring-primary-200 dark:focus:border-primary-500 dark:focus:ring-primary-200/20 border-gray-300 text-gray-900 focus:ring-2 dark:border-gray-700 dark:text-white',
              className
            )}
            portal
            aria-invalid={error ? 'true' : 'false'}
            aria-errormessage={error ? `${id}-error` : undefined}
            aria-required={required}
          />
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
  }
);

DatePickerComponent.displayName = 'DatePicker';

export default DatePickerComponent;