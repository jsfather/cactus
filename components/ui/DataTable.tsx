import { Trash2 , Pencil } from 'lucide-react';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  onEdit?: (item: any) => void;
  onDelete?: (id: number | string) => void;
}

export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
}: DataTableProps) {
  return (
    <table className="w-full">
      <thead className="">
        <tr className="bg-primary-400">
          {columns.map((col) => (
            <th key={col.key} className="border px-4 py-2">
              {col.label}
            </th>
          ))}
          {(onEdit || onDelete) && <th className="border px-4 py-2">عملیات</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, row_index) => (
          <tr
            key={row.id}
            className={`- t border ${row_index % 2 === 1 ? 'bg-primary-100' : ''}`}
          >
            {columns.map((col) => (
              <td key={col.key} className="border px-4 py-2">
                {row[col.key]}
              </td>
            ))}
            {(onEdit || onDelete) && (
              <td className="flex gap-2 border px-4 py-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(row)}
                  >
                    <Pencil className="text-blue-400" />
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(row.id)}>
                    <Trash2 className="text-red-500" />
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
