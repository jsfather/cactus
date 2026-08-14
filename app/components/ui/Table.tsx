'use client';

import { Eye, Inbox, Pencil, Trash2 } from 'lucide-react';

export type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
};

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  getRowId?: (item: T) => string;
}

const actionClass =
  'inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2';

export default function Table<T>({
  data,
  columns,
  loading = false,
  actions,
  emptyMessage = 'هیچ موردی یافت نشد',
  onEdit,
  onDelete,
  onView,
  getRowId = (item) => String((item as { id?: string | number }).id ?? ''),
}: TableProps<T>) {
  const hasActions = Boolean(actions || onEdit || onDelete || onView);
  const renderCell = (item: T, column: Column<T>) =>
    column.render
      ? column.render(item[column.accessor], item)
      : String(item[column.accessor] ?? '—');

  const renderActions = (item: T) => (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      {actions?.(item)}
      {onView && (
        <button
          type="button"
          onClick={() => onView(item)}
          aria-label="مشاهده"
          title="مشاهده"
          className={`${actionClass} border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700`}
        >
          <Eye className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          onClick={() => onEdit(item)}
          aria-label="ویرایش"
          title="ویرایش"
          className={`${actionClass} border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50`}
        >
          <Pencil className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(item)}
          aria-label="حذف"
          title="حذف"
          className={`${actionClass} border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/50`}
        >
          <Trash2 className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div
        className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
        role="status"
        aria-label="در حال بارگذاری جدول"
      >
        <div className="space-y-3 p-4 md:hidden">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse space-y-4 rounded-xl border border-gray-100 p-4 dark:border-gray-700"
            >
              <div className="h-4 w-2/5 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-4/5 rounded bg-gray-100 dark:bg-gray-700/70" />
              <div className="h-3 w-3/5 rounded bg-gray-100 dark:bg-gray-700/70" />
            </div>
          ))}
        </div>
        <div className="hidden animate-pulse md:block">
          <div className="h-14 border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50" />
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex h-16 items-center gap-8 border-b px-5 last:border-0 dark:border-gray-700"
            >
              {columns.slice(0, 5).map((column) => (
                <div
                  key={column.header}
                  className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="mt-6 flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/70 px-6 text-center dark:border-gray-700 dark:bg-gray-800/60">
        <span className="mb-3 rounded-2xl bg-gray-100 p-3 text-gray-400 dark:bg-gray-700 dark:text-gray-400">
          <Inbox className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full min-w-0">
      <div className="space-y-3 md:hidden">
        {data.map((item) => (
          <article
            key={getRowId(item)}
            className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm shadow-gray-950/[0.025] dark:border-gray-700 dark:bg-gray-800"
          >
            <dl className="divide-y divide-gray-100 dark:divide-gray-700/80">
              {columns.map((column, index) => (
                <div
                  key={`${getRowId(item)}-mobile-${String(column.accessor)}`}
                  className={`grid min-w-0 grid-cols-[minmax(5.5rem,0.75fr)_minmax(0,1.5fr)] gap-3 py-3 first:pt-0 ${index === 0 ? 'items-start' : 'items-center'}`}
                >
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {column.header}
                  </dt>
                  <dd
                    className={`min-w-0 text-sm break-words text-gray-800 dark:text-gray-100 ${index === 0 ? 'font-semibold' : ''}`}
                  >
                    {renderCell(item, column)}
                  </dd>
                </div>
              ))}
            </dl>
            {hasActions && (
              <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                {renderActions(item)}
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="hidden w-full min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block dark:border-gray-700 dark:bg-gray-800">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-right text-sm text-gray-800 dark:text-gray-100">
            <thead className="bg-gray-50/90 text-xs font-semibold text-gray-600 dark:bg-gray-900/60 dark:text-gray-300">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.header}
                    scope="col"
                    className="px-5 py-4 whitespace-nowrap"
                  >
                    {column.header}
                  </th>
                ))}
                {hasActions && (
                  <th scope="col" className="px-5 py-4">
                    <span className="sr-only">عملیات</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/80">
              {data.map((item) => (
                <tr
                  key={getRowId(item)}
                  className="transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-700/25"
                >
                  {columns.map((column) => (
                    <td
                      key={`${getRowId(item)}-${String(column.accessor)}`}
                      className="max-w-sm px-5 py-4 align-middle break-words"
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-5 py-3 whitespace-nowrap">
                      {renderActions(item)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
