import clsx from 'clsx';
import { cloneElement, isValidElement, type ReactElement } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  asChild?: boolean;
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'warning'
    | 'info'
    | 'white'
    | 'outline';
}

const variantStyles = {
  primary:
    'bg-primary-600 shadow-sm shadow-primary-950/10 hover:bg-primary-700 active:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-500',
  secondary:
    'bg-gray-800 text-white shadow-sm hover:bg-gray-700 active:bg-gray-950 dark:bg-white/10 dark:text-white dark:hover:bg-white/15',
  danger:
    'bg-red-600 shadow-sm hover:bg-red-700 active:bg-red-800 dark:bg-red-600 dark:hover:bg-red-500',
  warning:
    'bg-amber-600 shadow-sm hover:bg-amber-700 active:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500',
  info: 'bg-blue-600 shadow-sm hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500',
  white:
    'border border-gray-300 bg-white text-gray-800 shadow-sm hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800',
  outline:
    'border border-gray-300 bg-transparent text-gray-700 hover:border-gray-400 hover:bg-gray-100/70 active:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800',
};

export function Button({
  children,
  className,
  loading,
  asChild = false,
  variant = 'primary',
  ...rest
}: ButtonProps) {
  const classes = clsx(
    'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    variant === 'white' || variant === 'outline'
      ? 'text-gray-900 dark:text-white'
      : variant === 'secondary'
        ? 'text-white dark:text-white'
        : 'text-white',
    variantStyles[variant],
    className
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: clsx(classes, child.props.className),
    });
  }

  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      aria-busy={loading || undefined}
      className={classes}
    >
      {loading ? (
        <span
          className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        children
      )}
    </button>
  );
}
