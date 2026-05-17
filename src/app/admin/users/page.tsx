"use client";

import { useEffect, useState } from "react";

import { AdminDataTable, AdminTableToolbar, type AdminTableMeta } from "@/components/admin/admin-data-table";
import { AdminEmptyState, AdminLoadingState, AdminPageHeader } from "@/components/admin/admin-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatAdminDate } from "@/components/admin/admin-format";
import { Badge } from "@/components/ui/badge";
import { adminUsers, type AdminUserSummary } from "@/lib/api/admin";

const tiers = ["all", "free", "starter", "pro", "vip"] as const;

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState<(typeof tiers)[number]>("all");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [meta, setMeta] = useState<AdminTableMeta | undefined>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminUsers({ search, page, per_page: 20, tier: tier === "all" ? undefined : tier })
      .then((response) => {
        setUsers(response.data);
        setMeta(response.meta);
      })
      .finally(() => setLoading(false));
  }, [page, search, tier]);

  return (
    <AdminShell>
      <AdminPageHeader eyebrow="Accounts" title="Users datatable" description="Cari user, filter paket, lihat role, kredit, dan tanggal daftar dari satu tabel admin." />

      <AdminTableToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Cari nama, email, role, atau tier"
      >
        <select
          className="h-11 rounded-ui border border-input/60 bg-background/70 px-3 text-sm font-bold outline-none focus:border-primary focus:ring-1 focus:ring-ring"
          value={tier}
          onChange={(event) => {
            setTier(event.target.value as (typeof tiers)[number]);
            setPage(1);
          }}
        >
          {tiers.map((item) => (
            <option key={item} value={item}>{item === "all" ? "Semua paket" : item}</option>
          ))}
        </select>
      </AdminTableToolbar>

      {isLoading ? <AdminLoadingState /> : null}
      {!isLoading && users.length === 0 ? <AdminEmptyState title="User tidak ditemukan" detail="Coba kata kunci atau filter paket lain." /> : null}
      {!isLoading && users.length > 0 ? (
        <AdminDataTable
          rows={users}
          meta={meta}
          getRowKey={(user) => user.id}
          onPageChange={setPage}
          columns={[
            {
              key: "user",
              label: "User",
              render: (user) => (
                <div className="min-w-56">
                  <p className="font-black">{user.name}</p>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">{user.email}</p>
                </div>
              ),
            },
            {
              key: "role",
              label: "Role",
              render: (user) => <Badge tone={user.role === "admin" ? "accent" : "neutral"}>{user.role ?? "user"}</Badge>,
            },
            {
              key: "tier",
              label: "Paket",
              render: (user) => <Badge tone={user.tier === "vip" ? "accent" : user.tier === "pro" ? "success" : user.tier === "starter" ? "warning" : "neutral"}>{user.tier}</Badge>,
            },
            {
              key: "credits",
              label: "Kredit",
              render: (user) => (
                <div className="whitespace-nowrap font-black text-primary">
                  {user.available_credits}
                  <span className="ml-1 text-xs font-bold text-muted-foreground">tersisa</span>
                </div>
              ),
            },
            {
              key: "usage",
              label: "Pemakaian",
              render: (user) => <span className="whitespace-nowrap font-bold">{user.credits_used_this_month}/{user.trial_credits + user.monthly_credits}</span>,
            },
            {
              key: "created",
              label: "Daftar",
              render: (user) => <span className="whitespace-nowrap text-xs font-bold text-muted-foreground">{formatAdminDate(user.created_at)}</span>,
            },
          ]}
        />
      ) : null}
    </AdminShell>
  );
}
