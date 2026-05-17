"use client";

import { useEffect, useState } from "react";

import { AdminEmptyState, AdminLoadingState, AdminPageHeader } from "@/components/admin/admin-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatAdminCurrency, formatAdminDate, statusTone } from "@/components/admin/admin-format";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { adminAffiliateWithdrawals, type AdminAffiliateWithdrawal } from "@/lib/api/admin";

export default function AdminAffiliatePage() {
  const [withdrawals, setWithdrawals] = useState<AdminAffiliateWithdrawal[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    adminAffiliateWithdrawals()
      .then((response) => setWithdrawals(response.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <AdminPageHeader eyebrow="Referral ops" title="Affiliate withdrawals" description="Pantau permintaan pencairan komisi affiliate. Approve/reject menunggu backend audit log." />
      {isLoading ? <AdminLoadingState /> : null}
      {!isLoading && withdrawals.length === 0 ? <AdminEmptyState title="Tidak ada withdrawal" detail="Withdrawal affiliate akan tampil di sini." /> : null}
      <div className="grid gap-3">
        {withdrawals.map((withdrawal) => (
          <Panel key={withdrawal.id} className="grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={statusTone(withdrawal.status)}>{withdrawal.status}</Badge>
                <Badge>{withdrawal.method}</Badge>
                <span className="text-xs font-bold text-muted-foreground">{formatAdminDate(withdrawal.created_at)}</span>
              </div>
              <h3 className="mt-2 text-base font-black">{withdrawal.account_name}</h3>
              <p className="text-sm font-semibold text-muted-foreground">{withdrawal.account_number_masked}</p>
              <p className="text-sm font-semibold text-muted-foreground">{withdrawal.affiliate ? `${withdrawal.affiliate.name} · ${withdrawal.affiliate.email}` : "Unknown affiliate"}</p>
            </div>
            <p className="text-xl font-black text-primary">{formatAdminCurrency(withdrawal.amount_idr)}</p>
          </Panel>
        ))}
      </div>
    </AdminShell>
  );
}
