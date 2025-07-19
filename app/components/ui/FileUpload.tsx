import React from 'react';

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  required?: boolean;
  accept?: string;
  error?: string;
  register?: any;
}

const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  required = false,
  accept,
  error,
  register,
  ...props
}) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type="file"
        accept={accept}
        className={`block w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...register}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default FileUpload;
