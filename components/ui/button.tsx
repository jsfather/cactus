import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
}

export function Button({ children, className, loading, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={clsx(
        'bg-primary-600 cursor-pointer hover:bg-primary-400 focus-visible:outline-primary-600 active:bg-primary-600 flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        className
      )}
    >
      {loading ? (
        <div className="relative">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30"></div>
          <div className="absolute left-0 top-0 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
