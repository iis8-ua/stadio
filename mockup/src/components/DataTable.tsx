import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  emptyText?: string;
}

export function DataTable<T>({ columns, rows, emptyText = "No hay datos." }: DataTableProps<T>) {
  const mainColumns = columns.filter((c) => c.key !== "actions");
  const actionsColumn = columns.find((c) => c.key === "actions");

  return (
    <>
      {/* Escritorio: tabla */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-stadio-gray dark:text-white/40 ${col.className ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-stadio-gray dark:text-white/50">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 dark:border-white/5 transition-colors hover:bg-stadio-gray-light/60 dark:hover:bg-white/5"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`whitespace-nowrap px-4 py-3 text-sm text-stadio-gray-dark dark:text-white/70 ${col.className ?? ""}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Móvil: tarjetas */}
      <div className="space-y-3 sm:hidden">
        {rows.length === 0 ? (
          <p className="rounded-xl border border-gray-100 dark:border-white/10 p-6 text-center text-sm text-stadio-gray dark:text-white/50">
            {emptyText}
          </p>
        ) : (
          rows.map((row, i) => (
            <div key={i} className="rounded-xl border border-gray-100 dark:border-white/10 p-3">
              <div className="space-y-1.5">
                {mainColumns.map((col) => (
                  <div key={col.key} className="flex items-start justify-between gap-3">
                    <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-stadio-gray">
                      {col.header}
                    </span>
                    <div className="min-w-0 text-right text-sm text-stadio-gray-dark dark:text-white/70">
                      {col.render(row)}
                    </div>
                  </div>
                ))}
              </div>
              {actionsColumn && (
                <div className="mt-3 flex justify-end border-t border-gray-100 pt-2.5 dark:border-white/10">
                  {actionsColumn.render(row)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
