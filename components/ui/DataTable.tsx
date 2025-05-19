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
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Plus className="w-5 h-5 mr-2" />
            ایجاد جدید
          </button>
        </div>
      )}
      
      <table className="w-full text-sm text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-4 text-center">
                در حال بارگذاری...
              </td>
            </tr>
          ) : tableData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-4 text-center">
                داده‌ای یافت نشد
              </td>
            </tr>
          ) : (
            tableData.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={`bg-white border-b hover:bg-gray-50 ${
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
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => setDeleteId(row.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4">حذف آیتم</h3>
            <p className="mb-6">آیا از حذف این آیتم اطمینان دارید؟</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                انصراف
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
