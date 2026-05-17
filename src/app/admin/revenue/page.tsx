"use client";

import { useEffect, useState } from "react";
import { Banknote, CreditCard, UserCheck, Users } from "lucide-react";

import { AdminDataTable, AdminTableToolbar } from "@/components/admin/admin-data-table";
import { AdminEmptyState, AdminLoadingState, AdminPageHeader } from "@/components/admin/admin-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatAdminCurrency, formatAdminDate } from "@/components/admin/admin-format";
import { MetricTile } from "@/components/metric-tile";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { adminRevenue, type AdminRevenueReport, type AdminRevenueUser } from "@/lib/api/admin";

export default function AdminRevenuePage() {
  const [search, setSearch] = useState("");
  const [report, setReport] = useState<AdminRevenueReport | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminRevenue({ search })
      .then(setReport)
      .finally(() => setLoading(false));
  }, [search]);

  const rows = report?.data ?? [];

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Revenue"
        title="Pendapatan dari user terdaftar"
        description="Pantau total pembayaran dari user yang sudah daftar, user pembayar, transaksi sukses, dan kontribusi pendapatan per akun."
      />

      {isLoading ? <AdminLoadingState label="Memuat laporan pendapatan..." /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile label="Total pendapatan" value={formatAdminCurrency(report?.metrics.total_paid_revenue_idr)} detail="Semua transaksi paid" tone="credit" />
        <MetricTile label="Pendapatan bulan ini" value={formatAdminCurrency(report?.metrics.paid_revenue_month_idr)} detail="User terdaftar bulan berjalan" tone="success" />
        <MetricTile label="Pendapatan hari ini" value={formatAdminCurrency(report?.metrics.paid_revenue_today_idr)} detail="Transaksi paid hari ini" tone="activity" />
        <MetricTile label="User pembayar" value={String(report?.metrics.paying_users ?? 0)} detail={`${report?.metrics.paid_transactions ?? 0} transaksi sukses`} tone="cost" />
      </div>

      <Panel className="my-5 overflow-hidden p-5">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Revenue source", value: "Paid users", icon: UserCheck },
            { label: "Payment status", value: "Paid only", icon: CreditCard },
            { label: "Grouping", value: "Per user", icon: Users },
            { label: "Currency", value: "IDR", icon: Banknote },
          ].map((item) => (
            <div key={item.label} className="rounded-ui border border-border/45 bg-background/45 p-4">
              <item.icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-xs font-black uppercase text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-sm font-black">{item.value}</p>
            </div>
          ))}
        </div>
      </Panel>

      <AdminTableToolbar search={search} onSearchChange={setSearch} placeholder="Cari nama, email, atau paket user" />

      {!isLoading && rows.length === 0 ? <AdminEmptyState title="Belum ada pendapatan" detail="Pendapatan akan tampil setelah ada transaksi paid dari user terdaftar." /> : null}
      {!isLoading && rows.length > 0 ? (
        <AdminDataTable<AdminRevenueUser>
          rows={rows}
          getRowKey={(row) => row.user?.id ?? row.user?.email ?? "unknown"}
          columns={[
            {
              key: "user",
              label: "User",
              render: (row) => (
                <div className="min-w-56">
                  <p className="font-black">{row.user?.name ?? "Unknown user"}</p>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">{row.user?.email ?? "-"}</p>
                </div>
              ),
            },
            {
              key: "tier",
              label: "Paket",
              render: (row) => <Badge tone={row.tier === "vip" ? "accent" : row.tier === "pro" ? "success" : row.tier === "starter" ? "warning" : "neutral"}>{row.tier ?? "-"}</Badge>,
            },
            {
              key: "revenue",
              label: "Pendapatan",
              render: (row) => <span className="whitespace-nowrap text-base font-black text-primary">{formatAdminCurrency(row.total_paid_idr)}</span>,
            },
            {
              key: "transactions",
              label: "Transaksi",
              render: (row) => <span className="font-black">{row.paid_transactions}</span>,
            },
            {
              key: "first",
              label: "Pertama bayar",
              render: (row) => <span className="whitespace-nowrap text-xs font-bold text-muted-foreground">{formatAdminDate(row.first_paid_at)}</span>,
            },
            {
              key: "last",
              label: "Terakhir bayar",
              render: (row) => <span className="whitespace-nowrap text-xs font-bold text-muted-foreground">{formatAdminDate(row.last_paid_at)}</span>,
            },
          ]}
        />
      ) : null}
    </AdminShell>
  );
}
