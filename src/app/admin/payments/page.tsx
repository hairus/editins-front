"use client";

import { useEffect, useState } from "react";

import { AdminDataTable, AdminTableToolbar, type AdminTableMeta } from "@/components/admin/admin-data-table";
import { AdminEmptyState, AdminLoadingState, AdminPageHeader } from "@/components/admin/admin-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatAdminCurrency, formatAdminDate, statusTone } from "@/components/admin/admin-format";
import { Badge } from "@/components/ui/badge";
import { adminPayments, type AdminPayment } from "@/lib/api/admin";

const statuses = ["all", "pending", "paid", "expired", "failed"] as const;

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("all");
  const [page, setPage] = useState(1);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [meta, setMeta] = useState<AdminTableMeta | undefined>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminPayments({ search, page, per_page: 20, status: status === "all" ? undefined : status })
      .then((response) => {
        setPayments(response.data);
        setMeta(response.meta);
      })
      .finally(() => setLoading(false));
  }, [page, search, status]);

  return (
    <AdminShell>
      <AdminPageHeader eyebrow="Billing ledger" title="Payments datatable" description="Cari transaksi, filter status, dan pantau nominal pembayaran user dari tampilan tabel." />
      <AdminTableToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Cari merchant ref, email, produk"
      >
        <select
          className="h-11 rounded-ui border border-input/60 bg-background/70 px-3 text-sm font-bold outline-none focus:border-primary focus:ring-1 focus:ring-ring"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as (typeof statuses)[number]);
            setPage(1);
          }}
        >
          {statuses.map((item) => (
            <option key={item} value={item}>{item === "all" ? "Semua status" : item}</option>
          ))}
        </select>
      </AdminTableToolbar>

      {isLoading ? <AdminLoadingState /> : null}
      {!isLoading && payments.length === 0 ? <AdminEmptyState title="Belum ada transaksi" detail="Data transaksi akan tampil saat ada pembayaran atau kata kunci cocok." /> : null}
      {!isLoading && payments.length > 0 ? (
        <AdminDataTable
          rows={payments}
          meta={meta}
          getRowKey={(payment) => payment.id}
          onPageChange={setPage}
          columns={[
            {
              key: "reference",
              label: "Reference",
              render: (payment) => (
                <div className="min-w-64">
                  <p className="font-black">{payment.tripay_merchant_ref}</p>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">Tripay: {payment.tripay_ref ?? "-"}</p>
                </div>
              ),
            },
            {
              key: "user",
              label: "User",
              render: (payment) => <span className="whitespace-nowrap text-xs font-bold text-muted-foreground">{payment.user ? `${payment.user.name} · ${payment.user.email}` : "Unknown user"}</span>,
            },
            {
              key: "product",
              label: "Produk",
              render: (payment) => (
                <div className="whitespace-nowrap">
                  <Badge>{payment.product_type}</Badge>
                  <p className="mt-1 text-xs font-bold text-muted-foreground">{payment.product_id}</p>
                </div>
              ),
            },
            {
              key: "amount",
              label: "Nominal",
              render: (payment) => <span className="whitespace-nowrap font-black text-primary">{formatAdminCurrency(payment.amount_idr)}</span>,
            },
            {
              key: "status",
              label: "Status",
              render: (payment) => <Badge tone={statusTone(payment.status)}>{payment.status}</Badge>,
            },
            {
              key: "method",
              label: "Metode",
              render: (payment) => <span className="whitespace-nowrap font-bold">{payment.payment_method ?? "-"}</span>,
            },
            {
              key: "paid",
              label: "Paid",
              render: (payment) => <span className="whitespace-nowrap text-xs font-bold text-muted-foreground">{formatAdminDate(payment.paid_at)}</span>,
            },
          ]}
        />
      ) : null}
    </AdminShell>
  );
}
