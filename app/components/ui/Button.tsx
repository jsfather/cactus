import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'info' | 'white';
}

const variantStyles = {
  primary:
    'bg-primary-600 hover:bg-primary-500 focus-visible:outline-primary-600 active:bg-primary-600 dark:bg-primary-700 dark:hover:bg-primary-600',
  secondary:
    'bg-gray-500 text-white hover:bg-gray-600 focus-visible:outline-gray-500 active:bg-gray-700 dark:bg-white/10 dark:text-white dark:hover:bg-white/20',
  danger:
    'bg-red-600 hover:bg-red-500 focus-visible:outline-red-600 active:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600',
  warning:
    'bg-yellow-600 hover:bg-yellow-500 focus-visible:outline-yellow-600 active:bg-yellow-600 dark:bg-yellow-500 dark:hover:bg-yellow-600',
  info: 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600 active:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600',
  white:
    'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:ring-gray-700 dark:hover:bg-gray-800',
};

export function Button({
  children,
  className,
  loading,
  variant = 'primary',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={clsx(
        'flex h-10 cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        variant === 'white' ? 'text-gray-900 dark:text-white' : variant === 'secondary' ? 'text-white dark:text-white' : 'text-white',
        variantStyles[variant],
        className
      )}
    >
      {loading ? (
        <div className="relative">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30"></div>
          <div className="absolute top-0 left-0 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
