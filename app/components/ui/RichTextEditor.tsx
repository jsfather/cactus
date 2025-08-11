'use client';

import { forwardRef, useEffect, useState } from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// Dynamically import the MDEditor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface RichTextEditorProps {
  label?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (value?: string) => void;
  onBlur?: () => void;
  name?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
  preview?: 'edit' | 'preview' | 'live';
  height?: number;
  visibleDragBar?: boolean;
  toolbarHeight?: number;
  hideToolbar?: boolean;
  colorMode?: 'light' | 'dark';
}

const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ 
    label, 
    error, 
    className, 
    required, 
    value,
    onChange,
    onBlur,
    name,
    placeholder = 'متن خود را بنویسید...',
    id,
    disabled = false,
    preview = 'edit',
    height = 200,
    visibleDragBar = false,
    toolbarHeight = 29,
    hideToolbar = false,
    colorMode = 'light',
    ...props 
  }, ref) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    const handleChange = (val?: string) => {
      if (onChange) {
        onChange(val);
      }
    };

    if (!mounted) {
      // Return a fallback textarea during SSR
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
          <textarea
            id={id}
            name={name}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={clsx(
              'block w-full rounded-lg border px-4 py-3 text-sm transition-all outline-none',
              'bg-white dark:bg-gray-900',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'min-h-[120px] resize-y',
              error
                ? 'border-red-500 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-500 dark:text-red-400 dark:focus:border-red-500 dark:focus:ring-red-200/20'
                : 'focus:border-primary-500 focus:ring-primary-200 dark:focus:border-primary-500 dark:focus:ring-primary-200/20 border-gray-300 text-gray-900 focus:ring-2 dark:border-gray-700 dark:text-white',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-errormessage={error ? `${id}-error` : undefined}
            aria-required={required}
          />
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
        <div
          ref={ref}
          className={clsx(
            'rich-text-editor-wrapper rounded-lg border transition-all',
            error
              ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200 dark:border-red-500 dark:focus-within:border-red-500 dark:focus-within:ring-red-200/20'
              : 'focus-within:border-primary-500 focus-within:ring-primary-200 dark:focus-within:border-primary-500 dark:focus-within:ring-primary-200/20 border-gray-300 focus-within:ring-2 dark:border-gray-700',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          {...props}
        >
          <MDEditor
            value={value || ''}
            onChange={handleChange}
            preview={preview}
            height={height}
            visibleDragbar={visibleDragBar}
            toolbarHeight={toolbarHeight}
            hideToolbar={hideToolbar}
            data-color-mode={colorMode}
            textareaProps={{
              placeholder,
              disabled,
              id,
              name,
              onBlur,
              'aria-invalid': error ? 'true' : 'false',
              'aria-errormessage': error ? `${id}-error` : undefined,
              'aria-required': required,
            }}
            style={{
              backgroundColor: 'transparent',
            }}
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
        
        {/* Custom styles for the editor */}
        <style jsx global>{`
          .rich-text-editor-wrapper .w-md-editor {
            background-color: transparent !important;
            border: none !important;
          }
          .rich-text-editor-wrapper .w-md-editor.w-md-editor-focus {
            border: none !important;
            box-shadow: none !important;
          }
          .rich-text-editor-wrapper .w-md-editor-text-textarea,
          .rich-text-editor-wrapper .w-md-editor-text {
            font-size: 14px !important;
            color: inherit !important;
            background-color: transparent !important;
          }
          .rich-text-editor-wrapper .w-md-editor-toolbar {
            border-bottom: 1px solid #e5e7eb !important;
            background-color: #f9fafb !important;
            border-radius: 0.5rem 0.5rem 0 0 !important;
          }
          .dark .rich-text-editor-wrapper .w-md-editor-toolbar {
            border-bottom: 1px solid #374151 !important;
            background-color: #1f2937 !important;
            color: #f3f4f6 !important;
          }
          .dark .rich-text-editor-wrapper .w-md-editor-text-textarea,
          .dark .rich-text-editor-wrapper .w-md-editor-text {
            color: #f3f4f6 !important;
            background-color: transparent !important;
          }
          .dark .rich-text-editor-wrapper .w-md-editor {
            background-color: transparent !important;
            color: #f3f4f6 !important;
          }
          .rich-text-editor-wrapper .w-md-editor-text-container,
          .rich-text-editor-wrapper .w-md-editor-text-input,
          .rich-text-editor-wrapper .w-md-editor-text-textarea {
            border-radius: 0 0 0.5rem 0.5rem !important;
          }
        `}</style>
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
