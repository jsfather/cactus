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
      <div className={`w-full ${className}`}>
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
          className={`rounded-lg border transition-all ${
            error
              ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200 dark:border-red-500 dark:focus-within:border-red-500 dark:focus-within:ring-red-200/20'
              : 'border-gray-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200 dark:border-gray-700 dark:focus-within:border-primary-500 dark:focus-within:ring-primary-200/20'
          } bg-white dark:bg-gray-900`}
        >
          <MDXEditor
            ref={editorRef}
            markdown={value}
            onChange={(newValue) => onChange?.(newValue)}
            readOnly={readOnly}
            placeholder={placeholder}
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
              codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'Plain Text', tsx: 'TypeScript' } }),
              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <UndoRedo />
                    <BlockTypeSelect />
                    <BoldItalicUnderlineToggles />
                    <CodeToggle />
                    <CreateLink />
                    <InsertImage />
                    <ListsToggle />
                    <InsertTable />
                    <InsertThematicBreak />
                  </>
                )
              })
            ]}
            contentEditableClassName="prose prose-slate dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-none"
          />
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          💡 ویرایشگر پیشرفته با پشتیبانی کامل از Markdown و MDX.
          <span className="mx-1">|</span>
          <button
            type="button"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            onClick={() => window.open('https://www.markdownguide.org/cheat-sheet/', '_blank')}
          >
            راهنمای Markdown
          </button>
        </div>
      </div>
    );
  }
);

MarkdownEditor.displayName = 'MarkdownEditor';

export default MarkdownEditor;
