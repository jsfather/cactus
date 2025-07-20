import clsx from 'clsx';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  showText?: boolean;
}

export default function ProgressBar({
  current,
  total,
  className,
  showText = true,
}: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={clsx('w-full', className)}>
      {showText && (
        <div className="mb-2 flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
          <span>پیشرفت آزمون</span>
          <span>
            {current} از {total}
          </span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-2 rounded-full bg-primary-600 transition-all duration-300 ease-out dark:bg-primary-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {percentage}% تکمیل شده
        </div>
      )}
    </div>
  );
}
