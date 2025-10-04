'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from './Button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  id: string;
  label: string;
  required?: boolean;
  accept?: string;
  error?: string;
  placeholder?: string;
  value?: File | string | null; // Support both File object and URL string
  onChange?: (file: File | null) => void;
  onBlur?: () => void;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  required = false,
  accept = 'image/*',
  error,
  placeholder = 'فایل را انتخاب کنید',
  value,
  onChange,
  onBlur,
  className = '',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle external value changes (for form integration)
  useEffect(() => {
    if (value instanceof File) {
      setSelectedFile(value);
      setExistingImageUrl(null);
    } else if (typeof value === 'string' && value) {
      setExistingImageUrl(value);
      setSelectedFile(null);
    } else {
      setSelectedFile(null);
      setExistingImageUrl(null);
    }
  }, [value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setExistingImageUrl(null);
    onChange?.(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setExistingImageUrl(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBlur = () => {
    onBlur?.();
  };

  const hasFile = selectedFile || existingImageUrl;
  const imageUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : existingImageUrl;

  return (
    <div className={`w-full space-y-2 ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
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
          onBlur={handleBlur}
          className="hidden"
        />

        {/* Upload Area */}
        <div
          className={`relative rounded-lg border-2 border-dashed p-6 transition-colors ${
            error
              ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/10'
              : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
          } ${hasFile ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} `}
        >
          {hasFile ? (
            <div className="space-y-4">
              {/* Image Preview */}
              {imageUrl && (
                <div className="flex justify-center">
                  <div className="relative">
                    <Image
                      src={imageUrl}
                      alt="پیش‌نمایش"
                      width={120}
                      height={120}
                      className="rounded-lg border object-cover shadow-sm"
                      onError={(e) => {
                        console.error('Failed to load image:', imageUrl);
                        // Optionally hide the image on error
                        e.currentTarget.style.display = 'none';
                      }}
                      // Add unoptimized for external URLs that might not be properly configured
                      unoptimized={typeof imageUrl === 'string' && imageUrl.startsWith('http')}
                    />
                  </div>
                </div>
              )}

              {/* File Info */}
              <div className="space-y-2 text-center">
                {selectedFile && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedFile.name}
                  </p>
                )}
                <div className="flex justify-center gap-2">
                  <Button
                    type="button"
                    variant="white"
                    onClick={handleButtonClick}
                    className="flex items-center gap-2 px-3 py-2 text-sm"
                  >
                    <Upload className="h-4 w-4" />
                    تغییر فایل
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={handleRemoveFile}
                    className="flex items-center gap-2 px-3 py-2 text-sm"
                  >
                    <X className="h-4 w-4" />
                    حذف
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="white"
                  onClick={handleButtonClick}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  انتخاب فایل
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {placeholder}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
          <X className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
