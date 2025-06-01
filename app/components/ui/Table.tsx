'use client';

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
}

export default function Table<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  actions,
  emptyMessage = 'هیچ موردی یافت نشد',
  onEdit,
  onDelete,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0 dark:bg-gray-800/50">
            <div className="animate-pulse">
              <div className="md:hidden">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="mb-2 w-full rounded-md bg-white p-4 dark:bg-gray-800"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
                      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
                      {(actions || onEdit || onDelete) && (
                        <div className="flex gap-2">
                          <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
                          <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full text-gray-900 md:table dark:text-gray-100">
                <thead className="rounded-lg text-right text-sm font-normal">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="px-3 py-5 font-medium"
                      >
                        {column.header}
                      </th>
                    ))}
                    {(actions || onEdit || onDelete) && (
                      <th scope="col" className="relative py-3 pr-3 pl-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                  {[1, 2, 3].map((i) => (
                    <tr
                      key={i}
                      className="w-full border-b border-gray-200 py-3 text-sm dark:border-gray-700"
                    >
                      {columns.map((_, index) => (
                        <td
                          key={index}
                          className="py-3 pr-3 pl-6 whitespace-nowrap"
                        >
                          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                        </td>
                      ))}
                      {(actions || onEdit || onDelete) && (
                        <td className="py-3 pr-3 pl-6 whitespace-nowrap">
                          <div className="flex justify-end gap-3">
                            <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
                            <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0 dark:bg-gray-800/50">
          <div className="md:hidden">
            {data.length === 0 ? (
              <div className="mb-2 w-full rounded-md bg-white p-4 text-center dark:bg-gray-800">
                <p className="text-gray-500 dark:text-gray-400">
                  {emptyMessage}
                </p>
              </div>
            ) : (
              data.map((item) => (
                <div
                  key={item.id}
                  className="mb-2 w-full rounded-md bg-white p-4 dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {columns[0].render
                          ? columns[0].render(item[columns[0].accessor], item)
                          : String(item[columns[0].accessor])}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      {columns.slice(1).map((column, index) => (
                        <p
                          key={index}
                          className={`${
                            index === 0
                              ? 'text-xl font-medium'
                              : 'mt-2 text-sm text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {column.render
                            ? column.render(item[column.accessor], item)
                            : String(item[column.accessor])}
                        </p>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2">
                      {actions?.(item)}
                      {(onEdit || onDelete) && (
                        <div className="flex gap-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-5 w-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-5 w-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table dark:text-gray-100">
            <thead className="rounded-lg text-right text-sm font-normal">
              <tr>
                {columns.map((column, index) => (
                  <th key={index} scope="col" className="px-3 py-5 font-medium">
                    {column.header}
                  </th>
                ))}
                {(actions || onEdit || onDelete) && (
                  <th scope="col" className="relative py-3 pr-3 pl-6">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      actions || onEdit || onDelete
                        ? columns.length + 1
                        : columns.length
                    }
                    className="py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="w-full border-b border-gray-200 py-3 text-sm last-of-type:border-none dark:border-gray-700 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    {columns.map((column, index) => (
                      <td
                        key={index}
                        className="py-3 pr-3 pl-6 whitespace-nowrap"
                      >
                        <div className="flex items-center gap-3">
                          {column.render
                            ? column.render(item[column.accessor], item)
                            : String(item[column.accessor])}
                        </div>
                      </td>
                    ))}
                    {(actions || onEdit || onDelete) && (
                      <td className="py-3 pr-3 pl-6 whitespace-nowrap">
                        <div className="flex justify-end gap-3">
                          {actions?.(item)}
                          {(onEdit || onDelete) && (
                            <div className="flex gap-2">
                              {onEdit && (
                                <button
                                  onClick={() => onEdit(item)}
                                  className="cursor-pointer rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                    />
                                  </svg>
                                </button>
                              )}
                              {onDelete && (
                                <button
                                  onClick={() => onDelete(item)}
                                  className="cursor-pointer rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
