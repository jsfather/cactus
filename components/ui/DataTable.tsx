import { Trash2, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import moment from 'jalali-moment';

interface Column {
  key: string;
  label: string;
  format?: (value: any) => string;
}

interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (id: number | string) => Promise<void>;
  onCreate?: () => void;
  isLoading?: boolean;
}

export default function DataTable<T extends { id: number | string }>({
  columns,
  data = [],
  onEdit,
  onDelete,
  onCreate,
  isLoading = false,
}: DataTableProps<T>) {
  const [deleteId, setDeleteId] = useState<number | string | null>(null);

  const handleDelete = async (id: number | string) => {
    if (onDelete) {
      await onDelete(id);
      setDeleteId(null);
    }
  };

  const formatValue = (value: any, format?: (value: any) => string) => {
    if (format) {
      return format(value);
    }
    return String(value);
  };

  // Ensure data is an array
  const tableData = Array.isArray(data) ? data : [];

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {onCreate && (
        <div className="p-4">
          <button
            onClick={onCreate}
            className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 inline-flex items-center rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            <Plus className="mr-2 h-5 w-5" />
            ایجاد جدید
          </button>
        </div>
      )}

      <table className="w-full text-right text-sm text-gray-500">
        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="px-6 py-3">عملیات</th>}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                className="px-6 py-4 text-center"
              >
                در حال بارگذاری...
              </td>
            </tr>
          ) : tableData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                className="px-6 py-4 text-center"
              >
                داده‌ای یافت نشد
              </td>
            </tr>
          ) : (
            tableData.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={`border-b bg-white hover:bg-gray-50 ${
                  rowIndex % 2 === 0 ? 'bg-gray-50' : ''
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4">
                    {formatValue(row[col.key as keyof T], col.format)}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-100"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => setDeleteId(row.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
          <div className="rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">حذف آیتم</h3>
            <p className="mb-6">آیا از حذف این آیتم اطمینان دارید؟</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                انصراف
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
