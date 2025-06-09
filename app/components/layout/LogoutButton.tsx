'use client';

import { Power } from 'lucide-react';

interface LogoutButtonProps {
  loading?: boolean;
}

export default function LogoutButton({ loading = false }: LogoutButtonProps) {
  return (
    <button
      disabled={loading}
      className="flex w-full cursor-pointer items-center gap-2 p-3 text-gray-800 transition-colors hover:bg-gray-50/80 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-200 dark:hover:bg-gray-800/50 dark:active:bg-gray-800"
    >
      {loading ? (
        <div className="relative mr-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 dark:border-gray-700"></div>
          <div className="border-primary-500 dark:border-primary-400 absolute top-0 left-0 h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div>
        </div>
      ) : (
        <Power
          className="text-primary-600 dark:text-primary-400 mr-3 h-5 w-5"
          strokeWidth={1.7}
        />
      )}
      <span>{loading ? 'در حال خروج...' : 'خروج'}</span>
    </button>
  );
}
