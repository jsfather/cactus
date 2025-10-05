export default function OrdersLoadingPage() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="h-10 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Summary Stats Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Skeleton */}
      <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>

      {/* Orders List Skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="h-8 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="space-y-1">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="space-y-1">
                  <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-4 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
