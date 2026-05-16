"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Clock3, RefreshCw } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { AuthRequired } from "@/components/auth-required";
import { useAuth } from "@/components/auth-provider";
import { MetricTile } from "@/components/metric-tile";
import { useProductCatalog } from "@/components/product-catalog-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { generationHistory, type BackendGeneration } from "@/lib/api/generations";
import { tierMarketingLabel } from "@/lib/marketing-copy";
import { notifyApp } from "@/lib/notify";

const statusTone = {
  success: "success",
  processing: "warning",
  queued: "neutral",
  failed: "danger",
} as const;

const historyPerPage = 6;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function DashboardPage() {
  const { isLoading: authLoading, user, refreshUser } = useAuth();
  const { products } = useProductCatalog();
  const [history, setHistory] = useState<BackendGeneration[]>([]);
  const [totalHistory, setTotalHistory] = useState(0);
  const [historyPage, setHistoryPage] = useState(1);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    refreshUser().catch(() => undefined);
  }, [refreshUser]);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      setTotalHistory(0);
      setHistoryPage(1);
      return;
    }

    setIsLoadingHistory(true);
    setHistoryError(null);

    generationHistory(historyPerPage, historyPage)
      .then((response) => {
        setHistory(response.data);
        setTotalHistory(response.meta.total);
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Gagal mengambil riwayat pekerjaan.";
        setHistoryError(message);
        notifyApp({
          title: "Riwayat belum terbaca",
          detail: message,
          tone: "danger",
        });
      })
      .finally(() => setIsLoadingHistory(false));
  }, [historyPage, user]);

  const totalHistoryPages = Math.max(1, Math.ceil(totalHistory / historyPerPage));
  const featureLabel = useMemo(() => new Map<string, string>(products.map((feature) => [feature.slug, feature.shortTitle])), [products]);

  const metrics = useMemo(() => {
    return [
      {
        label: "Kredit aktif",
        value: user ? String(user.profile.credits_remaining) : "-",
        detail: user ? tierMarketingLabel(user.profile.tier) : "Masuk untuk melihat kredit",
        tone: "credit" as const,
      },
      {
        label: "Total foto",
        value: user ? String(totalHistory) : "-",
        detail: "Semua hasil generate tersimpan",
        tone: "activity" as const,
      },
      {
        label: "Paket akun",
        value: user ? tierMarketingLabel(user.profile.tier) : "-",
        detail: user ? "Mengikuti kredit aktif" : "Masuk untuk melihat paket",
        tone: "success" as const,
      },
    ];
  }, [totalHistory, user]);

  return (
    <AppShell>
      <AuthRequired>
        <section className="app-container pb-24 pt-8">
        <div className="mx-auto max-w-5xl">
        <div className="mb-5 overflow-hidden rounded-ui border border-secondary/20 bg-[linear-gradient(135deg,hsl(var(--secondary)/.14),hsl(var(--card)/.92)_48%,hsl(var(--primary)/.10))] px-4 py-4 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-20 shrink-0 place-items-center rounded-ui border border-border/35 bg-card/75 px-2 shadow-soft">
                <Image
                  src="/logo-cropped.png"
                  alt="Editins"
                  width={1364}
                  height={1040}
                  priority
                  className="h-11 w-auto object-contain"
                />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">Editins Studio</p>
                <p className="mt-1 text-lg font-bold tracking-tight text-foreground">Foto produk praktis untuk UMKM.</p>
              </div>
            </div>
            <Badge tone="warning">Workspace aktif</Badge>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase text-muted-foreground">Ringkasan akun</p>
            <h1 className="mt-2 text-xl font-semibold tracking-normal">Home</h1>
            <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
              Pantau kredit dan riwayat pembuatan foto yang tersimpan di akun.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {metrics.map((metric) => (
            <MetricTile key={metric.label} {...metric} />
          ))}
        </div>

        <div className="mt-4">
          <Panel className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Riwayat</h2>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                  Halaman {historyPage} dari {totalHistoryPages}
                </p>
              </div>
              <Badge tone={user ? "success" : "neutral"}>{totalHistory} item</Badge>
            </div>
            <div className="min-h-[352px] divide-y divide-border">
              {(authLoading || isLoadingHistory) && (
                <div className="flex items-center gap-3 px-4 py-6 text-sm font-semibold text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Memuat riwayat pekerjaan...
                </div>
              )}

              {!authLoading && !user && (
                <div className="px-4 py-6">
                  <p className="text-sm font-semibold">Masuk untuk melihat home pribadi.</p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    Setelah masuk, kredit dan riwayat foto akan tersimpan di akun Anda.
                  </p>
                  <Link className="mt-4 inline-flex" href="/login?next=/dashboard">
                    <Button size="sm">Login</Button>
                  </Link>
                </div>
              )}

              {historyError && (
                <div className="px-4 py-4 text-sm font-semibold text-destructive">{historyError}</div>
              )}

              {!isLoadingHistory && user && history.length === 0 && !historyError && (
                <div className="px-4 py-6">
                  <p className="text-sm font-semibold">Belum ada generation.</p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    Hasil pertama akan langsung muncul di riwayat ini.
                  </p>
                </div>
              )}

              {history.map((generation) => (
                <div key={generation.id} className="grid gap-3 px-4 py-2.5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div>
                    <p className="text-[13px] font-semibold">
                      {featureLabel.get(generation.feature) ?? generation.feature}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                      {generation.id.slice(0, 8)} - {formatDate(generation.created_at)}
                    </p>
                  </div>
                  <Badge tone={statusTone[generation.status]}>{generation.status}</Badge>
                  <span className="text-xs font-semibold">{generation.credits_consumed ?? 0} kredit</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-semibold text-muted-foreground">
                Menampilkan {history.length} dari {totalHistory} riwayat
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isLoadingHistory || historyPage <= 1}
                  onClick={() => setHistoryPage((page) => Math.max(1, page - 1))}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Prev
                </Button>
                <span className="grid h-9 min-w-9 place-items-center rounded-ui border border-border bg-background px-3 text-xs font-semibold">
                  {historyPage}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isLoadingHistory || historyPage >= totalHistoryPages}
                  onClick={() => setHistoryPage((page) => Math.min(totalHistoryPages, page + 1))}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Panel>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { icon: CheckCircle2, label: "Hasil tersimpan", detail: "Riwayat mudah dilacak" },
            { icon: Clock3, label: "Proses transparan", detail: "Status pekerjaan terlihat" },
            { icon: AlertTriangle, label: "Kendala jelas", detail: "Notifikasi tampil informatif" },
          ].map((item) => (
            <Panel key={item.label} className="p-3">
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <p className="mt-3 text-sm font-semibold">{item.label}</p>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">{item.detail}</p>
            </Panel>
          ))}
        </div>
        </div>
        </section>
      </AuthRequired>
    </AppShell>
  );
}
