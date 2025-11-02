import React from 'react';

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onBlur?: () => void;
  error?: string;
  description?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  onBlur,
  error,
  description,
  disabled = false,
}) => {
  return (
    <div className="flex items-start">
      <div className="flex h-6 items-center">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          onBlur={onBlur}
          disabled={disabled}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
        />
      </div>
      <div className="mr-3 text-sm leading-6">
        <label
          htmlFor={id}
          className={`font-medium ${
            disabled
              ? 'text-gray-400 dark:text-gray-600'
              : 'text-gray-900 dark:text-white'
          }`}
        >
          {label}
        </label>
        {description && (
          <p className="text-gray-500 dark:text-gray-400">{description}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Checkbox;
