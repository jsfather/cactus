import clsx from 'clsx';
import { motion } from 'framer-motion';

interface OptionButtonProps {
  option: {
    id: number | string;
    text: string;
  };
  isSelected: boolean;
  onSelect: (optionId: number | string) => void;
  disabled?: boolean;
  index: number;
}

export default function OptionButton({
  option,
  isSelected,
  onSelect,
  disabled = false,
  index,
}: OptionButtonProps) {
  const optionLabels = ['الف', 'ب', 'ج', 'د', 'ه', 'و'];
  const label = optionLabels[index] || `${index + 1}`;

  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onSelect(option.id)}
      disabled={disabled}
      className={clsx(
        'w-full rounded-lg border-2 p-4 text-right transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'dark:focus:ring-offset-gray-900',
        isSelected
          ? 'border-primary-500 bg-primary-50 text-primary-900 dark:border-primary-400 dark:bg-primary-900/20 dark:text-primary-100'
          : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-700',
        disabled && 'cursor-not-allowed opacity-50'
      )}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
            isSelected
              ? 'bg-primary-500 text-white dark:bg-primary-400'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          )}
        >
          {label}
        </div>
        <span className="flex-1 text-base font-medium">{option.text}</span>
      </div>
    </motion.button>
  );
}
