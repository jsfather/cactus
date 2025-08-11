'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// Dynamically import the MDEditor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  // Rich text editor specific props
  preview?: 'edit' | 'preview' | 'live';
  editorHeight?: number;
  hideToolbar?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
    disabled,
    preview = 'edit',
    editorHeight = 200,
    hideToolbar = false,
    ...props 
  }, ref) => {
    // Keep a ref to the hidden textarea so we can read/write its value (RHF controls this via register)
    const hiddenRef = useRef<HTMLTextAreaElement | null>(null);

    // Merge forwarded ref from RHF with our local ref
    const setRefs = (node: HTMLTextAreaElement | null) => {
      hiddenRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref && 'current' in ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
    };
    const [mounted, setMounted] = useState(false);
    // Internal editor value
    const [internalValue, setInternalValue] = useState('');

    useEffect(() => {
      setMounted(true);
    }, []);

    // Hook into hidden textarea .value so any programmatic updates (e.g., RHF reset) update the editor
    useEffect(() => {
      const el = hiddenRef.current;
      if (!el) return;
      const protoDesc = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
      if (!protoDesc?.set || !protoDesc?.get) return;
      const originalSet = protoDesc.set.bind(el);
      const originalGet = protoDesc.get.bind(el);

      Object.defineProperty(el, 'value', {
        configurable: true,
        get() {
          return originalGet();
        },
        set(newVal) {
          // Update DOM value
          originalSet(newVal as any);
          // Reflect into editor state
          setInternalValue(newVal != null ? String(newVal) : '');
        },
      });

      // Initialize internal value from current DOM value
      setInternalValue(el.value || '');

      return () => {
        // Restore default behavior
        try {
          delete (el as any).value;
        } catch {}
      };
    }, [name, id]);

    const handleChange = (val?: string) => {
      const newValue = val || '';
      setInternalValue(newValue);

      // Write into the hidden textarea so RHF sees the new value
      if (hiddenRef.current) {
        hiddenRef.current.value = newValue;
        // Dispatch an input event so RHF's listener is triggered
        const inputEvent = new Event('input', { bubbles: true });
        hiddenRef.current.dispatchEvent(inputEvent);
      }

      // Also call any onChange passed via props (compat with manual handlers)
      if (onChange) {
        const event = {
          target: { value: newValue, name: name || '' },
          type: 'change',
        } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
        onChange(event);
      }
    };

    const handleBlur = () => {
      if (onBlur) {
        const event = {
          target: {
            value: internalValue,
            name: name || '',
          },
          type: 'blur',
        } as React.FocusEvent<HTMLTextAreaElement>;
        
        onBlur(event);
      }

      // Dispatch a native blur event on hidden ref for RHF
      if (hiddenRef.current) {
        const blurEvent = new FocusEvent('blur', { bubbles: true });
        hiddenRef.current.dispatchEvent(blurEvent as unknown as Event);
      }
    };

    // If parent explicitly controls `value` prop, respect it (rare; not used with register)
    useEffect(() => {
      if (value !== undefined) {
        const str = value != null ? String(value) : '';
        if (str !== internalValue) setInternalValue(str);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    if (!mounted) {
      // Return a fallback textarea during SSR that works with react-hook-form
      const currentValue = value ? String(value) : '';
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
            ref={ref}
            id={id}
            name={name}
            value={currentValue}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            dir="rtl"
            className={clsx(
              'block w-full rounded-lg border px-4 py-3 text-sm transition-all outline-none',
              'bg-white dark:bg-gray-900',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'min-h-[120px] resize-y text-right font-dana-fanum',
              error
                ? 'border-red-500 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-500 dark:text-red-400 dark:focus:border-red-500 dark:focus:ring-red-200/20'
                : 'focus:border-primary-500 focus:ring-primary-200 dark:focus:border-primary-500 dark:focus:ring-primary-200/20 border-gray-300 text-gray-900 focus:ring-2 dark:border-gray-700 dark:text-white',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-errormessage={error ? `${id}-error` : undefined}
            aria-required={required}
            {...props}
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
        
        {/* Hidden textarea for react-hook-form compatibility */}
        <textarea
          ref={setRefs}
          id={`${id}-hidden`}
          name={name}
          defaultValue={value ? String(value) : undefined}
          onChange={() => {}} // Controlled by MDEditor; RHF will set .value directly
          onBlur={handleBlur}
          style={{ display: 'none' }}
          tabIndex={-1}
          aria-hidden="true"
          {...props}
        />
        
        <div
          className={clsx(
            'rich-text-editor-wrapper rounded-lg border transition-all',
            error
              ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200 dark:border-red-500 dark:focus-within:border-red-500 dark:focus-within:ring-red-200/20'
              : 'focus-within:border-primary-500 focus-within:ring-primary-200 dark:focus-within:border-primary-500 dark:focus-within:ring-primary-200/20 border-gray-300 focus-within:ring-2 dark:border-gray-700',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          dir="rtl"
        >
          <MDEditor
            key={`md-editor-${mounted ? 'mounted' : 'unmounted'}`}
            value={internalValue}
            onChange={handleChange}
            preview={preview}
            height={editorHeight}
            visibleDragbar={false}
            hideToolbar={hideToolbar}
            data-color-mode="light"
            textareaProps={{
              placeholder,
              disabled,
              dir: 'rtl',
              style: { 
                textAlign: 'right',
                direction: 'rtl',
                fontFamily: 'var(--font-dana-fanum), var(--font-dana), Dana, Tahoma, sans-serif'
              }
            }}
            style={{
              backgroundColor: 'transparent',
              direction: 'rtl',
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
            direction: rtl !important;
          }
          .rich-text-editor-wrapper .w-md-editor.w-md-editor-focus {
            border: none !important;
            box-shadow: none !important;
          }
          .rich-text-editor-wrapper .w-md-editor-text-textarea,
          .rich-text-editor-wrapper .w-md-editor-text {
            font-size: 14px !important;
            color: #111827 !important;
            background-color: #ffffff !important;
            direction: rtl !important;
            text-align: right !important;
            font-family: var(--font-dana-fanum), var(--font-dana), 'Dana', 'Tahoma', sans-serif !important;
            line-height: 1.5 !important;
            padding: 12px 16px !important;
          }
          .rich-text-editor-wrapper .w-md-editor-text-textarea::placeholder {
            color: #9ca3af !important;
            text-align: right !important;
            direction: rtl !important;
          }
          .rich-text-editor-wrapper .w-md-editor-toolbar {
            border-bottom: 1px solid #e5e7eb !important;
            background-color: #f9fafb !important;
            border-radius: 0.5rem 0.5rem 0 0 !important;
            direction: ltr !important;
          }
          .rich-text-editor-wrapper .w-md-editor-toolbar button {
            color: #374151 !important;
          }
          .rich-text-editor-wrapper .w-md-editor-toolbar button:hover {
            background-color: #e5e7eb !important;
          }
          /* Dark mode styles */
          .dark .rich-text-editor-wrapper .w-md-editor-text-textarea,
          .dark .rich-text-editor-wrapper .w-md-editor-text {
            color: #f3f4f6 !important;
            background-color: #111827 !important;
          }
          .dark .rich-text-editor-wrapper .w-md-editor-text-textarea::placeholder {
            color: #6b7280 !important;
          }
          .dark .rich-text-editor-wrapper .w-md-editor-toolbar {
            border-bottom: 1px solid #374151 !important;
            background-color: #1f2937 !important;
            color: #f3f4f6 !important;
          }
          .dark .rich-text-editor-wrapper .w-md-editor-toolbar button {
            color: #f3f4f6 !important;
          }
          .dark .rich-text-editor-wrapper .w-md-editor-toolbar button:hover {
            background-color: #374151 !important;
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
          /* Preview styles for RTL */
          .rich-text-editor-wrapper .w-md-editor-preview {
            direction: rtl !important;
            text-align: right !important;
            padding: 12px 16px !important;
            font-family: var(--font-dana-fanum), var(--font-dana), 'Dana', 'Tahoma', sans-serif !important;
          }
          .rich-text-editor-wrapper .wmde-markdown {
            direction: rtl !important;
            text-align: right !important;
            font-family: var(--font-dana-fanum), var(--font-dana), 'Dana', 'Tahoma', sans-serif !important;
          }
          /* Ensure proper RTL handling for all text elements */
          .rich-text-editor-wrapper * {
            direction: inherit;
          }
          .rich-text-editor-wrapper .w-md-editor-text-textarea,
          .rich-text-editor-wrapper .w-md-editor-text,
          .rich-text-editor-wrapper .w-md-editor-preview {
            direction: rtl !important;
          }
        `}</style>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
