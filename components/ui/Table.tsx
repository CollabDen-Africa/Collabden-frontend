import React, { ReactNode } from "react";

export interface Column<T = any> {
  key: string;
  label?: ReactNode;
  render?: (item: T) => ReactNode;
}

export interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  loadingState?: ReactNode;
  emptyState?: ReactNode;
  onRowClick?: (item: T) => void;
  showHeader?: boolean;
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  loadingState = <div className="py-8 text-center text-white/40">Loading...</div>,
  emptyState = <div className="py-8 text-center text-white/40">No data found</div>,
  onRowClick,
  showHeader = true,
}: TableProps<T>) => {
  return (
    <div className="w-full bg-white/[0.02] border border-white/5 rounded-[20px] overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-full">
          {showHeader && (
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="py-4 px-6 text-[10px] font-semibold text-white/40 uppercase tracking-widest whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length}>{loadingState}</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>{emptyState}</td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr
                  key={item.id || idx}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`hover:bg-white/[0.02] transition-colors group ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="py-4 px-6">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
