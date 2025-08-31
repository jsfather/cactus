'use client';

import React from 'react';
import DatePicker from 'react-multi-date-picker';

interface DateTimePickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  error?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange, label, error }) => {
  const handleChange = (date: any) => {
    if (date && date.format) {
      onChange(date.format('YYYY-MM-DD'));
    } else {
      onChange('');
    }
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <DatePicker
        value={value}
        onChange={handleChange}
        format="YYYY-MM-DD"
        containerStyle={{ width: '100%' }}
        inputClass="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default DateTimePicker;
