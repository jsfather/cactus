'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from './Button';

interface FileUploadProps {
  id: string;
  label: string;
  required?: boolean;
  accept?: string;
  error?: string;
  placeholder?: string;
  onChange?: (file: File | null) => void;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  required = false,
  accept = 'image/*',
  error,
  placeholder = 'فایل را انتخاب کنید',
  onChange,
  className = '',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    onChange?.(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full space-y-2 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="mr-1 text-red-500">*</span>}
      </label>

      <div className="space-y-3">
        <input
          id={id}
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="white"
            onClick={handleButtonClick}
            className="text-sm"
          >
            انتخاب فایل
          </Button>

          {selectedFile && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{selectedFile.name}</span>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-sm text-red-500 hover:text-red-700"
              >
                حذف
              </button>
            </div>
          )}

          {!selectedFile && (
            <span className="text-sm text-gray-500">{placeholder}</span>
          )}
        </div>

        {selectedFile && selectedFile.type.startsWith('image/') && (
          <div className="mt-2">
            <Image
              src={URL.createObjectURL(selectedFile)}
              alt="پیش‌نمایش"
              width={80}
              height={80}
              className="rounded-lg border object-cover"
            />
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileUpload;
