'use client';

import { forwardRef, useState } from 'react';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Heading1,
  Heading2,
  Quote,
  Code,
  Eye,
  Edit3,
  CornerDownLeft,
} from 'lucide-react';

interface SimpleMarkdownEditorProps {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const SimpleMarkdownEditor = forwardRef<
  HTMLTextAreaElement,
  SimpleMarkdownEditorProps
>(
  (
    {
      id,
      label,
      value = '',
      onChange,
      onBlur,
      error,
      required,
      placeholder = 'محتوای خود را در اینجا وارد کنید...',
      rows = 10,
      className = '',
    },
    ref
  ) => {
    const [isPreview, setIsPreview] = useState(false);

    const insertMarkdown = (before: string, after: string = '') => {
      const textarea = document.getElementById(
        id || 'markdown-editor'
      ) as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const newText =
        value.substring(0, start) +
        before +
        selectedText +
        after +
        value.substring(end);

      onChange?.(newText);

      // Set cursor position after insertion
      setTimeout(() => {
        textarea.focus();
        const newCursorPos =
          start + before.length + selectedText.length + after.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    };

    const toolbarButtons = [
      { icon: Bold, action: () => insertMarkdown('**', '**'), title: 'بولد' },
      {
        icon: Italic,
        action: () => insertMarkdown('*', '*'),
        title: 'ایتالیک',
      },
      {
        icon: Heading1,
        action: () => insertMarkdown('\n# ', '\n'),
        title: 'تیتر ۱',
      },
      {
        icon: Heading2,
        action: () => insertMarkdown('\n## ', '\n'),
        title: 'تیتر ۲',
      },
      { icon: List, action: () => insertMarkdown('\n- ', ''), title: 'لیست' },
      {
        icon: ListOrdered,
        action: () => insertMarkdown('\n1. ', ''),
        title: 'لیست شماره‌دار',
      },
      {
        icon: Quote,
        action: () => insertMarkdown('\n> ', '\n'),
        title: 'نقل قول',
      },
      { icon: Code, action: () => insertMarkdown('`', '`'), title: 'کد' },
      {
        icon: Link2,
        action: () => insertMarkdown('[', '](url)'),
        title: 'لینک',
      },
      {
        icon: CornerDownLeft,
        action: () => insertMarkdown('\\\n', ''),
        title: 'خط جدید',
      },
    ];

    return (
      <div className={clsx('w-full', className)} dir="rtl">
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
          className={clsx(
            'overflow-hidden rounded-lg border',
            'bg-white dark:bg-gray-900',
            error
              ? 'border-red-500'
              : 'focus-within:border-primary-500 focus-within:ring-primary-200 dark:focus-within:ring-primary-200/20 border-gray-300 focus-within:ring-2 dark:border-gray-700'
          )}
        >
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                type="button"
                onClick={button.action}
                title={button.title}
                className="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <button.icon className="h-4 w-4" />
              </button>
            ))}

            <div className="mx-2 h-6 w-px bg-gray-300 dark:bg-gray-600" />

            {/* Preview Toggle */}
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              title={isPreview ? 'ویرایش' : 'پیش‌نمایش'}
              className={clsx(
                'flex items-center gap-1.5 rounded px-2 py-1.5 text-sm transition-colors',
                isPreview
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
              )}
            >
              {isPreview ? (
                <>
                  <Edit3 className="h-4 w-4" />
                  ویرایش
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  پیش‌نمایش
                </>
              )}
            </button>
          </div>

          {/* Editor / Preview */}
          {isPreview ? (
            <div
              className="min-h-[200px] p-4 text-right text-gray-900 dark:text-gray-100"
              dir="rtl"
              style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}
            >
              {value ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  components={{
                    p: ({ children }) => (
                      <p className="mb-4 leading-relaxed">{children}</p>
                    ),
                    h1: ({ children }) => (
                      <h1 className="mt-6 mb-4 text-2xl font-bold">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mt-5 mb-3 text-xl font-bold">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mt-4 mb-2 text-lg font-bold">
                        {children}
                      </h3>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-4 list-inside list-disc space-y-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-4 list-inside list-decimal space-y-1">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    strong: ({ children }) => (
                      <strong className="font-bold">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="my-4 border-r-4 border-gray-300 pr-4 text-gray-600 italic dark:border-gray-600 dark:text-gray-400">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800">
                        {children}
                      </code>
                    ),
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        className="text-primary-600 dark:text-primary-400 underline"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {value}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-400 dark:text-gray-500">
                  محتوایی برای پیش‌نمایش وجود ندارد
                </p>
              )}
            </div>
          ) : (
            <textarea
              ref={ref}
              id={id || 'markdown-editor'}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onBlur={onBlur}
              placeholder={placeholder}
              rows={rows}
              dir="rtl"
              className={clsx(
                'block w-full resize-y border-0 bg-white p-4 text-sm text-gray-900 outline-none',
                'placeholder:text-gray-400 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500',
                'font-dana-fanum min-h-[200px] leading-relaxed'
              )}
            />
          )}
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="mt-2 text-right text-xs text-gray-500 dark:text-gray-400">
          💡 از Markdown استفاده کنید: **بولد**، *ایتالیک*، # تیتر، - لیست
          <span className="mx-2">|</span>
          برای خط جدید دو بار Enter بزنید یا دو فاصله در انتهای خط بگذارید
        </div>
      </div>
    );
  }
);

SimpleMarkdownEditor.displayName = 'SimpleMarkdownEditor';

export default SimpleMarkdownEditor;
