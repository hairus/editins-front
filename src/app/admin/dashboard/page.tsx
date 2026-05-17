"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, Banknote, Brush, Megaphone, Users } from "lucide-react";

import { AdminPageHeader, AdminLoadingState } from "@/components/admin/admin-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatAdminCurrency } from "@/components/admin/admin-format";
import { MetricTile } from "@/components/metric-tile";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { adminOverview, type AdminOverview } from "@/lib/api/admin";

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    adminOverview()
      .then(setOverview)
      .finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(
    () => [
      {
        label: "Total kreator",
        value: String(overview?.metrics.total_users ?? 0),
        detail: `+${overview?.metrics.new_users_today ?? 0} hari ini`,
        tone: "activity" as const,
      },
      {
        label: "Omzet hari ini",
        value: formatAdminCurrency(overview?.metrics.paid_revenue_today_idr),
        detail: `${overview?.metrics.paid_transactions_today ?? 0} transaksi sukses`,
        tone: "credit" as const,
      },
      {
        label: "Hasil sukses",
        value: `${overview?.metrics.success_rate_today ?? 0}%`,
        detail: "Berdasarkan pekerjaan hari ini",
        tone: "success" as const,
      },
      {
        label: "Biaya proses",
        value: formatAdminCurrency(overview?.metrics.cost_today_idr),
        detail: `${overview?.metrics.active_users_24h ?? 0} kreator aktif 24 jam`,
        tone: "cost" as const,
      },
    ],
    [overview],
  );

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Pusat keputusan"
        title="Dashboard internal"
        description="Pantau pertumbuhan kreator, paket yang aktif, omzet, biaya proses, dan sinyal operasional dari satu layar."
      />

      {isLoading ? <AdminLoadingState label="Memuat ringkasan internal..." /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricTile key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.85fr]">
        <Panel className="overflow-hidden">
          <div className="border-b border-border/45 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-ui bg-primary/10 text-primary">
                <Megaphone className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-black">Peta paket pengguna</h2>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">Lihat paket mana yang paling banyak dipakai.</p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            {[
              { label: "Coba Gratis", value: overview?.funnels.trial_users ?? 0, tone: "neutral" as const, icon: Brush },
              { label: "Starter", value: overview?.funnels.starter_users ?? 0, tone: "success" as const, icon: Activity },
              { label: "Pro", value: overview?.funnels.pro_users ?? 0, tone: "warning" as const, icon: Banknote },
              { label: "VIP", value: overview?.funnels.vip_users ?? 0, tone: "accent" as const, icon: Users },
            ].map((item) => (
              <div key={item.label} className="rounded-ui border border-border/45 bg-background/42 p-4">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <p className="mt-3 text-sm font-semibold">{item.label}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-2xl font-black">{item.value}</span>
                  <Badge tone={item.tone}>akun</Badge>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="overflow-hidden">
          <div className="border-b border-border/45 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-ui bg-warning/12 text-warning">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-black">Sinyal yang perlu dilihat</h2>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">Alert operasional dari data terbaru.</p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 p-5">
            {(overview?.alerts ?? []).map((alert) => (
              <div key={alert.title} className="rounded-ui border border-border/45 bg-background/42 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black">{alert.title}</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">{alert.detail}</p>
                  </div>
                  <Badge tone={alert.tone}>{alert.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AdminShell>
  );
}
