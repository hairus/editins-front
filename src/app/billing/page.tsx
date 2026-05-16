"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, CreditCard, Loader2, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { AuthRequired } from "@/components/auth-required";
import { useAuth } from "@/components/auth-provider";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { businessConfig, type BusinessTier } from "@/lib/api/business";
import { createTierPayment } from "@/lib/api/payment";
import { tierMarketingLabel } from "@/lib/marketing-copy";
import { notifyApp } from "@/lib/notify";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export default function BillingPage() {
  const { user, refreshUser } = useAuth();
  const [tiers, setTiers] = useState<BusinessTier[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [activeTier, setActiveTier] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    businessConfig()
      .then((config) => setTiers(config.tiers.filter((tier) => tier.id !== "free")))
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Gagal membaca paket.";
        setErrorMessage(message);
        notifyApp({
          title: "Paket belum bisa dimuat",
          detail: message,
          tone: "danger",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const recommendedTier = useMemo(() => tiers.find((tier) => tier.id === "pro")?.id ?? tiers[1]?.id, [tiers]);

  async function handleChooseTier(tier: BusinessTier) {
    if (!user) {
      window.location.href = "/login?next=/billing";
      return;
    }

    setActiveTier(tier.id);
    setErrorMessage(null);

    try {
      const payment = await createTierPayment(tier.id);
      await refreshUser().catch(() => undefined);
      window.location.href = payment.checkout_url ?? "/billing/success";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal membuat transaksi.";
      setErrorMessage(message);
      notifyApp({
        title: "Transaksi belum berhasil",
        detail: message,
        tone: "danger",
      });
      setActiveTier(null);
    }
  }

  return (
    <AppShell>
      <AuthRequired>
        <section className="app-container pb-24 pt-8">
        <SectionHeading
          eyebrow="Kredit"
          title="Top up kredit"
          description="Pilih paket sesuai kebutuhan. Di mode develop, paket langsung aktif tanpa pembayaran."
        />

        {errorMessage ? (
          <div className="mt-5 rounded-ui border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {isLoading ? (
            <Panel className="grid min-h-56 place-items-center p-5 lg:col-span-3">
              <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Memuat pilihan paket...
              </div>
            </Panel>
          ) : null}

          {tiers.map((tier) => {
            const isCurrentTier = user?.profile.tier === tier.id;

            return (
            <Panel key={tier.id} className={isCurrentTier ? "border-success/35 bg-success/10 p-5" : "p-5"}>
              <div className="flex min-h-8 items-center justify-between gap-3">
                <h2 className="text-xl font-black">{tierMarketingLabel(tier.id)}</h2>
                {isCurrentTier ? <Badge tone="success">Paket aktif</Badge> : tier.id === recommendedTier ? <Badge tone="warning">Rekomendasi</Badge> : null}
              </div>
              <p className="mt-5 text-4xl font-black tracking-normal">{formatCurrency(tier.price_idr)}</p>
              <p className="mt-1 text-sm font-black text-muted-foreground">{tier.monthly_credits} kredit / 30 hari</p>
              <p className="mt-4 min-h-12 text-sm font-medium leading-6 text-muted-foreground">
                {tier.features.map(featureLabel).join(", ")}
              </p>
              <ul className="mt-5 space-y-3 text-sm font-semibold">
                {["Harga transparan", "Kredit aktif otomatis", "Cocok untuk produksi rutin"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-5 w-full"
                disabled={activeTier !== null || isCurrentTier}
                variant={tier.id === recommendedTier ? "primary" : "outline"}
                onClick={() => handleChooseTier(tier)}
              >
                {activeTier === tier.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                {isCurrentTier ? "Sedang aktif" : activeTier === tier.id ? "Mengaktifkan paket" : `Aktifkan ${tierMarketingLabel(tier.id)}`}
              </Button>
            </Panel>
            );
          })}
        </div>

        {!user ? (
          <Panel className="mt-5 p-4">
            <p className="text-sm font-semibold">Masuk diperlukan untuk top up kredit.</p>
            <Link className="mt-3 inline-flex" href="/login?next=/billing">
              <Button size="sm">Login</Button>
            </Link>
          </Panel>
        ) : null}

        <Panel className="mt-5 p-4">
          <div className="flex gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-muted-foreground" />
            <div>
            <p className="font-black">Pembayaran aman</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-muted-foreground">
                Setiap pembayaran dikaitkan ke akun yang sedang aktif agar kredit masuk ke tempat yang tepat.
            </p>
            </div>
          </div>
        </Panel>
        </section>
      </AuthRequired>
    </AppShell>
  );
}

function featureLabel(value: string) {
  const labels: Record<string, string> = {
    "7_features": "7 pilihan visual",
    all_features: "Semua pilihan visual",
    history: "Riwayat tersimpan",
    download_hd: "Download kualitas tinggi",
    priority_queue: "Antrian lebih cepat",
    boost_mode: "Mode produksi besar",
    early_access: "Akses fitur lebih awal",
    community: "Komunitas kreator",
    priority_support: "Bantuan prioritas",
  };

  return labels[value] ?? value.replaceAll("_", " ");
}
