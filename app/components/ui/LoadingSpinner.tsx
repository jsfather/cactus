export default function LoadingSpinner() {
  return (
    <div
      className="flex min-h-52 w-full flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <span className="border-primary-600 h-9 w-9 animate-spin rounded-full border-3 border-t-transparent" />
      <span className="text-sm text-gray-500 dark:text-gray-400">
        در حال بارگذاری…
      </span>
    </div>
  );
}
