'use client';

import { forwardRef, useRef, useEffect } from 'react';
import { 
  MDXEditor, 
  headingsPlugin, 
  listsPlugin, 
  quotePlugin, 
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  BlockTypeSelect,
  CodeToggle,
  type MDXEditorMethods
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import clsx from 'clsx';

interface MarkdownEditorProps {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

const MarkdownEditor = forwardRef<MDXEditorMethods, MarkdownEditorProps>(
  (
    {
      id,
      label,
      value = '',
      onChange,
      error,
      required,
      placeholder = 'محتوای خود را در اینجا وارد کنید...',
      readOnly = false,
      className = '',
    },
    ref
  ) => {
    const editorRef = useRef<MDXEditorMethods>(null);

    useEffect(() => {
      if (ref && typeof ref === 'object') {
        (ref as any).current = editorRef.current;
      }
    }, [ref]);

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
            'markdown-editor-wrapper rounded-lg border transition-all overflow-hidden',
            'bg-white dark:bg-gray-900',
            error
              ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200 dark:border-red-500 dark:focus-within:border-red-500 dark:focus-within:ring-red-200/20'
              : 'border-gray-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200 dark:border-gray-700 dark:focus-within:border-primary-500 dark:focus-within:ring-primary-200/20'
          )}
        >
          <div style={{ direction: 'rtl', position: 'relative' }}>
            {/* Custom Placeholder */}
            {!value && (
              <div className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 pointer-events-none text-sm" style={{ direction: 'rtl' }}>
                {placeholder}
              </div>
            )}
            <MDXEditor
              ref={editorRef}
              markdown={value}
              onChange={(newValue) => onChange?.(newValue)}
              readOnly={readOnly}
              autoFocus={false}
              plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                imagePlugin(),
                tablePlugin(),
                codeBlockPlugin({ defaultCodeBlockLanguage: 'javascript' }),
                codeMirrorPlugin({ 
                  codeBlockLanguages: { 
                    js: 'JavaScript', 
                    css: 'CSS', 
                    html: 'HTML',
                    tsx: 'TypeScript',
                    python: 'Python',
                    json: 'JSON',
                    txt: 'Plain Text'
                  } 
                }),
                toolbarPlugin({
                  toolbarContents: () => (
                    <div className="flex flex-wrap flex-row-reverse items-center gap-1 p-2 w-full" style={{ direction: 'rtl' }}>
                      <UndoRedo />
                      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                      <BlockTypeSelect />
                      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                      <BoldItalicUnderlineToggles />
                      <CodeToggle />
                      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                      <CreateLink />
                      <InsertImage />
                      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                      <ListsToggle />
                      <InsertTable />
                      <InsertThematicBreak />
                    </div>
                  )
                })
              ]}
              contentEditableClassName="prose prose-slate dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-none"
            />
          </div>
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
          💡 ویرایشگر پیشرفته با پشتیبانی کامل از Markdown و MDX.
          <span className="mx-1">|</span>
          <button
            type="button"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            onClick={() => window.open('https://www.markdownguide.org/cheat-sheet/', '_blank')}
          >
            راهنمای Markdown
          </button>
        </div>

        {/* Custom RTL and Dark Mode Styles */}
        <style jsx global>{`
          .markdown-editor-wrapper {
            direction: rtl !important;
            font-family: var(--font-dana-fanum), var(--font-dana), 'Dana', 'Tahoma', sans-serif !important;
          }

          /* Force RTL on editor container */
          .markdown-editor-wrapper * {
            direction: rtl !important;
            text-align: right !important;
          }

          /* Keep toolbar LTR for icons */
          .markdown-editor-wrapper .mdxeditor-toolbar,
          .markdown-editor-wrapper .mdxeditor-toolbar * {
            direction: ltr !important;
            text-align: left !important;
          }

          /* Editor Container */
          .markdown-editor-wrapper .mdxeditor {
            background: transparent !important;
            border: none !important;
            font-family: inherit !important;
            direction: rtl !important;
          }

          /* Toolbar Styling */
          .markdown-editor-wrapper .mdxeditor-toolbar {
            background-color: #f9fafb !important;
            border-bottom: 1px solid #e5e7eb !important;
            border-radius: 0.5rem 0.5rem 0 0 !important;
            padding: 0 !important;
            direction: ltr !important;
          }

          .dark .markdown-editor-wrapper .mdxeditor-toolbar {
            background-color: #1f2937 !important;
            border-bottom: 1px solid #374151 !important;
          }

          /* Toolbar Buttons */
          .markdown-editor-wrapper .mdxeditor-toolbar button {
            color: #374151 !important;
            background: transparent !important;
            border: none !important;
            padding: 6px 8px !important;
            border-radius: 4px !important;
            transition: all 0.2s !important;
            font-size: 14px !important;
          }

          .markdown-editor-wrapper .mdxeditor-toolbar button:hover {
            background-color: #e5e7eb !important;
            color: #111827 !important;
          }

          .markdown-editor-wrapper .mdxeditor-toolbar button[aria-pressed="true"] {
            background-color: #dbeafe !important;
            color: #1d4ed8 !important;
          }

          .dark .markdown-editor-wrapper .mdxeditor-toolbar button {
            color: #ffffff !important;
          }

          .dark .markdown-editor-wrapper .mdxeditor-toolbar button:hover {
            background-color: #4b5563 !important;
            color: #ffffff !important;
          }

          .dark .markdown-editor-wrapper .mdxeditor-toolbar button[aria-pressed="true"] {
            background-color: #2563eb !important;
            color: #ffffff !important;
          }

          /* Toolbar Icons and SVGs in Dark Mode */
          .dark .markdown-editor-wrapper .mdxeditor-toolbar button svg {
            color: #ffffff !important;
            fill: currentColor !important;
          }

          .dark .markdown-editor-wrapper .mdxeditor-toolbar button:hover svg {
            color: #ffffff !important;
            fill: currentColor !important;
          }

          .dark .markdown-editor-wrapper .mdxeditor-toolbar select,
          .dark .markdown-editor-wrapper .mdxeditor-toolbar option {
            color: #ffffff !important;
            background-color: #1f2937 !important;
          }

          /* Content Editable Area - Force RTL */
          .markdown-editor-wrapper .mdxeditor-root-contenteditable,
          .markdown-editor-wrapper [contenteditable="true"] {
            background-color: #ffffff !important;
            color: #111827 !important;
            direction: rtl !important;
            text-align: right !important;
            font-family: inherit !important;
            font-size: 14px !important;
            line-height: 1.6 !important;
            border: none !important;
            outline: none !important;
            padding: 16px !important;
            min-height: 200px !important;
            position: relative !important;
            cursor: text !important;
          }

          /* Remove any default placeholder */
          .markdown-editor-wrapper .mdxeditor-root-contenteditable::placeholder,
          .markdown-editor-wrapper [contenteditable="true"]::placeholder {
            opacity: 0 !important;
            display: none !important;
          }

          .markdown-editor-wrapper .mdxeditor-root-contenteditable:empty::before,
          .markdown-editor-wrapper [contenteditable="true"]:empty::before {
            display: none !important;
            content: none !important;
          }

          .dark .markdown-editor-wrapper .mdxeditor-root-contenteditable,
          .dark .markdown-editor-wrapper [contenteditable="true"] {
            background-color: #111827 !important;
            color: #f3f4f6 !important;
          }

          /* Cursor positioning fix */
          .markdown-editor-wrapper .mdxeditor-root-contenteditable:focus,
          .markdown-editor-wrapper [contenteditable="true"]:focus {
            caret-color: #111827 !important;
          }

          .dark .markdown-editor-wrapper .mdxeditor-root-contenteditable:focus,
          .dark .markdown-editor-wrapper [contenteditable="true"]:focus {
            caret-color: #f3f4f6 !important;
          }

          /* Force RTL on all text content */
          .markdown-editor-wrapper .mdxeditor-root-contenteditable *,
          .markdown-editor-wrapper [contenteditable="true"] * {
            direction: rtl !important;
            text-align: right !important;
            unicode-bidi: embed !important;
          }

          /* Prose Styling for RTL */
          .markdown-editor-wrapper .prose,
          .markdown-editor-wrapper .prose * {
            direction: rtl !important;
            text-align: right !important;
            max-width: none !important;
            unicode-bidi: embed !important;
          }

          .markdown-editor-wrapper .prose h1,
          .markdown-editor-wrapper .prose h2,
          .markdown-editor-wrapper .prose h3,
          .markdown-editor-wrapper .prose h4,
          .markdown-editor-wrapper .prose h5,
          .markdown-editor-wrapper .prose h6 {
            text-align: right !important;
            font-family: inherit !important;
            direction: rtl !important;
          }

          .markdown-editor-wrapper .prose p {
            text-align: right !important;
            direction: rtl !important;
          }

          .markdown-editor-wrapper .prose ul,
          .markdown-editor-wrapper .prose ol {
            text-align: right !important;
            direction: rtl !important;
            padding-right: 1.5rem !important;
            padding-left: 0 !important;
          }

          .markdown-editor-wrapper .prose li {
            text-align: right !important;
            direction: rtl !important;
          }

          .markdown-editor-wrapper .prose blockquote {
            border-right: 4px solid #e5e7eb !important;
            border-left: none !important;
            padding-right: 1rem !important;
            padding-left: 0 !important;
            text-align: right !important;
            direction: rtl !important;
            margin-right: 0 !important;
            margin-left: 1rem !important;
          }

          .dark .markdown-editor-wrapper .prose blockquote {
            border-right-color: #374151 !important;
          }

          /* Links */
          .markdown-editor-wrapper .prose a {
            color: #2563eb !important;
            text-decoration: underline !important;
            direction: rtl !important;
            text-align: right !important;
          }

          .dark .markdown-editor-wrapper .prose a {
            color: #60a5fa !important;
          }

          /* Code blocks - Keep LTR for code */
          .markdown-editor-wrapper .prose code {
            background-color: #f3f4f6 !important;
            color: #111827 !important;
            padding: 0.125rem 0.25rem !important;
            border-radius: 0.25rem !important;
            font-size: 0.875em !important;
            direction: ltr !important;
            display: inline !important;
            text-align: left !important;
          }

          .dark .markdown-editor-wrapper .prose code {
            background-color: #374151 !important;
            color: #f3f4f6 !important;
          }

          .markdown-editor-wrapper .prose pre {
            background-color: #f3f4f6 !important;
            color: #111827 !important;
            padding: 1rem !important;
            border-radius: 0.5rem !important;
            overflow-x: auto !important;
            direction: ltr !important;
            text-align: left !important;
          }

          .dark .markdown-editor-wrapper .prose pre {
            background-color: #1f2937 !important;
            color: #f3f4f6 !important;
          }

          .markdown-editor-wrapper .prose pre code {
            background: transparent !important;
            padding: 0 !important;
            color: inherit !important;
            direction: ltr !important;
            text-align: left !important;
          }

          /* Tables - RTL tables */
          .markdown-editor-wrapper .prose table {
            direction: rtl !important;
            text-align: right !important;
          }

          .markdown-editor-wrapper .prose th,
          .markdown-editor-wrapper .prose td {
            text-align: right !important;
            direction: rtl !important;
            padding: 0.5rem !important;
            border: 1px solid #e5e7eb !important;
          }

          .dark .markdown-editor-wrapper .prose th,
          .dark .markdown-editor-wrapper .prose td {
            border-color: #374151 !important;
          }

          .markdown-editor-wrapper .prose th {
            background-color: #f9fafb !important;
            font-weight: 600 !important;
          }

          .dark .markdown-editor-wrapper .prose th {
            background-color: #1f2937 !important;
          }

          /* Dropdowns and Modals */
          .markdown-editor-wrapper .mdxeditor-select-trigger,
          .markdown-editor-wrapper .mdxeditor-select-content {
            background-color: #ffffff !important;
            color: #111827 !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 0.375rem !important;
          }

          .dark .markdown-editor-wrapper .mdxeditor-select-trigger,
          .dark .markdown-editor-wrapper .mdxeditor-select-content {
            background-color: #1f2937 !important;
            color: #ffffff !important;
            border-color: #374151 !important;
          }

          /* Dialog/Modal styling */
          .markdown-editor-wrapper [data-radix-popper-content-wrapper] {
            direction: rtl !important;
          }

          /* Focus styles */
          .markdown-editor-wrapper .mdxeditor-root-contenteditable:focus,
          .markdown-editor-wrapper [contenteditable="true"]:focus {
            outline: none !important;
          }

          /* Selection styling */
          .markdown-editor-wrapper .mdxeditor-root-contenteditable::selection,
          .markdown-editor-wrapper [contenteditable="true"]::selection {
            background-color: #dbeafe !important;
            color: #1e40af !important;
          }

          .dark .markdown-editor-wrapper .mdxeditor-root-contenteditable::selection,
          .dark .markdown-editor-wrapper [contenteditable="true"]::selection {
            background-color: #1e40af !important;
            color: #dbeafe !important;
          }

          /* Force text cursor on right side */
          .markdown-editor-wrapper [contenteditable="true"] {
            text-align: right !important;
            unicode-bidi: plaintext !important;
          }

          /* List styling for RTL */
          .markdown-editor-wrapper ul li::marker,
          .markdown-editor-wrapper ol li::marker {
            unicode-bidi: isolate !important;
            direction: ltr !important;
          }

          /* Scrollbar styling */
          .markdown-editor-wrapper .mdxeditor-root-contenteditable::-webkit-scrollbar,
          .markdown-editor-wrapper [contenteditable="true"]::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          .markdown-editor-wrapper .mdxeditor-root-contenteditable::-webkit-scrollbar-track,
          .markdown-editor-wrapper [contenteditable="true"]::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }

          .dark .markdown-editor-wrapper .mdxeditor-root-contenteditable::-webkit-scrollbar-track,
          .dark .markdown-editor-wrapper [contenteditable="true"]::-webkit-scrollbar-track {
            background: #1e293b;
          }

          .markdown-editor-wrapper .mdxeditor-root-contenteditable::-webkit-scrollbar-thumb,
          .markdown-editor-wrapper [contenteditable="true"]::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }

          .dark .markdown-editor-wrapper .mdxeditor-root-contenteditable::-webkit-scrollbar-thumb,
          .dark .markdown-editor-wrapper [contenteditable="true"]::-webkit-scrollbar-thumb {
            background: #475569;
          }

          .markdown-editor-wrapper .mdxeditor-root-contenteditable::-webkit-scrollbar-thumb:hover,
          .markdown-editor-wrapper [contenteditable="true"]::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }

          .dark .markdown-editor-wrapper .mdxeditor-root-contenteditable::-webkit-scrollbar-thumb:hover,
          .dark .markdown-editor-wrapper [contenteditable="true"]::-webkit-scrollbar-thumb:hover {
            background: #64748b;
          }
        `}</style>
      </div>
    );
  }
);

MarkdownEditor.displayName = 'MarkdownEditor';

export default MarkdownEditor;
