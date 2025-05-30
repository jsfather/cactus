'use client';

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

export default function Table<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  actions,
  emptyMessage = 'هیچ موردی یافت نشد',
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
                      {actions && (
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
                    {actions && (
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
                      {actions && (
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
                    {actions && (
                      <div className="flex justify-end gap-2">
                        {actions(item)}
                      </div>
                    )}
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
                {actions && (
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
                    colSpan={actions ? columns.length + 1 : columns.length}
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
                    {actions && (
                      <td className="py-3 pr-3 pl-6 whitespace-nowrap">
                        <div className="flex justify-end gap-3">
                          {actions(item)}
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
