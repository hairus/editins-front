import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export type AdminDataColumn<T> = {
  key: string;
  label: string;
  className?: string;
  render: (row: T) => React.ReactNode;
};

export type AdminTableMeta = {
  current_page: number;
  per_page: number;
  total: number;
};

export function AdminTableToolbar({
  search,
  onSearchChange,
  placeholder,
  children,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
  children?: React.ReactNode;
}) {
  return (
    <Panel className="mb-5 p-3">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="h-11 w-full rounded-ui border border-input/60 bg-background/70 pl-10 pr-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-ring"
            placeholder={placeholder}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
        {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
      </div>
    </Panel>
  );
}

export function AdminDataTable<T>({
  columns,
  rows,
  getRowKey,
  meta,
  onPageChange,
}: {
  columns: AdminDataColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string | number;
  meta?: AdminTableMeta;
  onPageChange?: (page: number) => void;
}) {
  const page = meta?.current_page ?? 1;
  const perPage = meta?.per_page ?? rows.length;
  const total = meta?.total ?? rows.length;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(perPage, 1)));
  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(total, page * perPage);

  return (
    <Panel className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border/45 text-left text-sm">
          <thead className="bg-muted/40">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`whitespace-nowrap px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground ${column.className ?? ""}`}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/35">
            {rows.map((row) => (
              <tr key={getRowKey(row)} className="bg-card/20 transition hover:bg-muted/35">
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-4 align-middle ${column.className ?? ""}`}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-border/45 bg-background/35 px-4 py-3 text-xs font-bold text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          Menampilkan {start}-{end} dari {total} data
        </span>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="h-9 px-3" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-20 text-center">Hal {page}/{totalPages}</span>
          <Button variant="secondary" className="h-9 px-3" disabled={page >= totalPages} onClick={() => onPageChange?.(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Panel>
  );
}
