"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, Banknote, Brush, Loader2, Megaphone, Users } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { AuthRequired } from "@/components/auth-required";
import { MetricTile } from "@/components/metric-tile";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { adminOverview, type AdminOverview } from "@/lib/api/admin";
import { notifyApp } from "@/lib/notify";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    adminOverview()
      .then(setOverview)
      .catch((error) => {
        const nextMessage = error instanceof Error ? error.message : "Ringkasan internal belum bisa dimuat.";
        setMessage(nextMessage);
        notifyApp({
          title: "Dashboard internal belum siap",
          detail: nextMessage,
          tone: "danger",
        });
      })
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
        value: formatCurrency(overview?.metrics.paid_revenue_today_idr ?? 0),
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
        value: formatCurrency(overview?.metrics.cost_today_idr ?? 0),
        detail: `${overview?.metrics.active_users_24h ?? 0} kreator aktif 24 jam`,
        tone: "cost" as const,
      },
    ],
    [overview],
  );

  return (
    <AppShell>
      <AuthRequired>
        <section className="app-container pb-24 pt-8">
          <SectionHeading
            eyebrow="Pusat keputusan"
            title="Dashboard internal"
            description="Pantau pertumbuhan kreator, paket yang aktif, omzet, biaya proses, dan alert penting dari data terbaru."
          />

          {message ? (
            <div className="mt-5 rounded-ui border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
              {message}
            </div>
          ) : null}

          {isLoading ? (
            <Panel className="mt-6 grid min-h-44 place-items-center p-5">
              <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Memuat ringkasan internal...
              </div>
            </Panel>
          ) : null}

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        </section>
      </AuthRequired>
    </AppShell>
  );
}
