'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';
import DatePicker from 'react-multi-date-picker';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DateObject from 'react-date-object';

interface TimePickerProps {
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

const TimePickerComponent = forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      label,
      error,
      required,
      value,
      onChange,
      onBlur,
      name,
      placeholder = 'ساعت را انتخاب کنید',
      className,
      disabled,
      id,
    },
    ref
  ) => {
    console.log('TimePicker value prop:', value);

    const handleTimeChange = (date: any) => {
      if (date) {
        // Convert to HH:MM format
        const hour = String(date.hour).padStart(2, '0');
        const minute = String(date.minute).padStart(2, '0');
        const formattedTime = `${hour}:${minute}`;
        console.log('TimePicker onChange:', formattedTime);

        // Call react-hook-form onChange
        if (onChange) {
          onChange(formattedTime);
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

    const parseValue = (timeString: string) => {
      if (!timeString) return undefined;
      const [hour, minute] = timeString.split(':').map(Number);
      return new DateObject({
        year: 1400, // Default year
        month: 1, // Default month
        day: 1, // Default day
        hour: hour || 0,
        minute: minute || 0,
        calendar: persian,
        locale: persian_fa,
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
            onChange={() => {}} // Controlled by TimePicker
            style={{ display: 'none' }}
          />

          <DatePicker
            disableDayPicker
            format="HH:mm"
            plugins={[<TimePicker hideSeconds key="time" />]}
            calendar={persian}
            locale={persian_fa}
            value={parseValue(value || '')}
            onChange={handleTimeChange}
            onClose={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={'custom-rmdp'}
            calendarPosition="bottom-end"
            containerClassName="w-full"
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

TimePickerComponent.displayName = 'TimePicker';

export default TimePickerComponent;
