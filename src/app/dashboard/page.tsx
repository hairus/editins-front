"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, ArrowRight, Camera, CheckCircle2, Clock3, Crown, ImagePlus, RefreshCw, Sparkles, TrendingUp } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { AuthRequired } from "@/components/auth-required";
import { useAuth } from "@/components/auth-provider";
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
  const featuredProducts = useMemo(() => products.slice(0, 3), [products]);

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
      <AuthRequired allowGuest>
        <section className="app-container pb-24 pt-8">
        <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-secondary/20 bg-[radial-gradient(circle_at_16%_18%,hsl(var(--secondary)/.22),transparent_28%),radial-gradient(circle_at_82%_12%,hsl(var(--primary)/.18),transparent_32%),linear-gradient(135deg,hsl(var(--card)/.98),hsl(var(--muted)/.72)_58%,hsl(var(--card)/.9))] p-4 shadow-panel sm:p-6">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/30 bg-white/15 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-secondary/55 to-transparent" />
          <div className="relative grid gap-5 lg:grid-cols-[1.1fr_.9fr] lg:items-stretch">
            <div className="flex min-h-[260px] flex-col justify-between rounded-[1.5rem] border border-border/45 bg-background/38 p-5 shadow-soft backdrop-blur sm:p-6">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid h-14 w-20 shrink-0 place-items-center rounded-2xl border border-border/35 bg-card/80 px-2 shadow-soft">
                    <Image
                      src="/logo-cropped.png"
                      alt="Editins"
                      width={1364}
                      height={1040}
                      priority
                      className="h-11 w-auto object-contain"
                    />
                  </span>
                  <Badge tone="warning">Siap bikin foto jualan</Badge>
                  <span className="rounded-full border border-border/45 bg-card/65 px-3 py-1 text-xs font-bold text-muted-foreground">
                    {user ? tierMarketingLabel(user.profile.tier) : "Akses kreator"}
                  </span>
                </div>
                <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">Edit digital instan tanpa ke studio</p>
                <h1 className="mt-2 max-w-2xl text-3xl font-black tracking-[-0.04em] text-foreground sm:text-5xl">
                  Kelola produksi foto jualan dari satu layar.
                </h1>
                <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-muted-foreground sm:text-base sm:leading-7">
                  Pantau kredit, lanjutkan pembuatan foto, dan temukan hasil terbaru tanpa pindah-pindah halaman.
                </p>
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/generate/foto-produk">
                  <Button className="min-h-12 w-full sm:w-auto">
                    <ImagePlus className="h-4 w-4" />
                    Buat foto baru
                  </Button>
                </Link>
                <Link href="/billing">
                  <Button className="min-h-12 w-full sm:w-auto" variant="secondary">
                    <Crown className="h-4 w-4" />
                    Lihat paket
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {metrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="group relative overflow-hidden rounded-[1.35rem] border border-border/45 bg-card/72 p-4 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/35"
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 transition group-hover:bg-secondary/15" />
                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{metric.label}</p>
                      <p className="mt-2 text-3xl font-black tracking-[-0.03em] text-foreground">{metric.value}</p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">{metric.detail}</p>
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                      {index === 0 ? <Sparkles className="h-5 w-5" /> : index === 1 ? <Camera className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[.92fr_1.08fr]">
          <Panel className="overflow-hidden border-border/50 bg-card/88 shadow-panel">
            <div className="border-b border-border/45 bg-[linear-gradient(135deg,hsl(var(--card)),hsl(var(--muted)/.55))] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Mulai cepat</p>
                  <h2 className="mt-1 text-xl font-black tracking-[-0.02em]">Pilih kebutuhan foto</h2>
                </div>
                <Link href="/generate">
                  <Button size="sm" variant="outline">Lihat semua</Button>
                </Link>
              </div>
            </div>
            <div className="grid gap-3 p-4">
              {featuredProducts.map((feature, index) => (
                <Link key={feature.slug} href={`/generate/${feature.slug}`}>
                  <div className="group relative overflow-hidden rounded-[1.2rem] border border-border/45 bg-background/55 p-4 transition hover:border-secondary/45 hover:bg-secondary/5">
                    <div className="absolute right-4 top-4 text-5xl font-black leading-none text-muted/60 transition group-hover:text-secondary/15">
                      0{index + 1}
                    </div>
                    <div className="relative flex items-start justify-between gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary shadow-soft">
                        <Sparkles className="h-5 w-5" />
                      </span>
                      <Badge tone={feature.credits > 1 ? "warning" : "success"}>{feature.credits} kredit</Badge>
                    </div>
                    <p className="relative mt-4 text-base font-black">{feature.shortTitle}</p>
                    <p className="relative mt-1 line-clamp-2 text-sm font-semibold leading-6 text-muted-foreground">{feature.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel className="overflow-hidden border-border/50 bg-card/88 shadow-panel">
            <div className="flex items-center justify-between border-b border-border/45 bg-[linear-gradient(135deg,hsl(var(--card)),hsl(var(--primary)/.06))] px-5 py-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Riwayat hasil</h2>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  Halaman {historyPage} dari {totalHistoryPages}
                </p>
              </div>
              <Badge tone={user ? "success" : "neutral"}>{totalHistory} item</Badge>
            </div>
            <div className="min-h-[424px] divide-y divide-border/55">
              {(authLoading || isLoadingHistory) && (
                <div className="flex items-center gap-3 px-5 py-6 text-sm font-semibold text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Memuat riwayat foto...
                </div>
              )}

              {!authLoading && !user && (
                <div className="px-5 py-6">
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
                <div className="px-5 py-4 text-sm font-semibold text-destructive">{historyError}</div>
              )}

              {!isLoadingHistory && user && history.length === 0 && !historyError && (
                <div className="grid min-h-[320px] place-items-center px-5 py-10 text-center">
                  <div className="max-w-sm">
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-secondary/12 text-secondary shadow-soft">
                      <Camera className="h-7 w-7" />
                    </span>
                    <p className="mt-5 text-lg font-black">Belum ada hasil foto.</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
                      Buat foto pertama, lalu semua hasil yang siap dipakai akan tampil rapi di sini.
                    </p>
                    <Link className="mt-5 inline-flex" href="/generate/foto-produk">
                      <Button size="sm">Buat foto pertama</Button>
                    </Link>
                  </div>
                </div>
              )}

              {history.map((generation) => (
                <div key={generation.id} className="group grid gap-3 px-5 py-4 transition hover:bg-muted/42 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-border/55 bg-background/70 text-primary shadow-soft">
                      <Camera className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black">
                        {featureLabel.get(generation.feature) ?? generation.feature}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
                        ID {generation.id.slice(0, 8)} - {formatDate(generation.created_at)}
                      </p>
                    </div>
                  </div>
                  <Badge tone={statusTone[generation.status]}>{statusLabel(generation.status)}</Badge>
                  <span className="rounded-full border border-border/55 bg-background/70 px-3 py-1 text-xs font-bold text-muted-foreground">
                    {generation.credits_consumed ?? 0} kredit
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 border-t border-border/45 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
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
            { icon: CheckCircle2, label: "Hasil tersimpan", detail: "Semua foto tersusun otomatis di akun." },
            { icon: Clock3, label: "Proses transparan", detail: "Status pembuatan foto mudah dipantau." },
            { icon: AlertTriangle, label: "Kendala jelas", detail: "Pesan bantuan tampil saat ada proses gagal." },
          ].map((item) => (
            <Panel key={item.label} className="group relative overflow-hidden p-4 transition hover:-translate-y-0.5 hover:border-primary/35">
              <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-primary/8 transition group-hover:bg-secondary/12" />
              <item.icon className="relative h-5 w-5 text-primary" />
              <p className="relative mt-4 text-sm font-black">{item.label}</p>
              <p className="relative mt-1 text-xs font-semibold leading-5 text-muted-foreground">{item.detail}</p>
            </Panel>
          ))}
        </div>
        </div>
        </section>
      </AuthRequired>
    </AppShell>
  );
}

function statusLabel(status: BackendGeneration["status"]) {
  const labels: Record<BackendGeneration["status"], string> = {
    queued: "Menunggu",
    processing: "Diproses",
    success: "Selesai",
    failed: "Gagal",
  };

  return labels[status];
}
