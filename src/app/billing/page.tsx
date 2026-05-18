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
import { tierMarketingBenefits, tierMarketingDescription, tierMarketingLabel } from "@/lib/marketing-copy";
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
      <AuthRequired allowGuest>
        <section className="app-container pb-24 pt-8">
        <SectionHeading
          eyebrow="Langganan Editins"
          title="Pilih paket yang bikin foto jualan makin siap closing"
          description="Mulai dari katalog sederhana sampai produksi konten besar. Kredit aktif otomatis setelah pembayaran berhasil, jadi Anda bisa langsung generate visual untuk jualan."
        />

        {errorMessage ? (
          <div className="mt-5 rounded-ui border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
            {errorMessage}
          </div>
        ) : null}

        {!user ? (
          <Panel className="mt-6 border-primary/25 bg-primary/10 p-5 sm:flex sm:items-center sm:justify-between sm:gap-5">
            <div>
              <p className="text-lg font-black">Masuk diperlukan untuk top up kredit.</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-muted-foreground">
                Login dulu agar paket, kredit, dan riwayat pembayaran tersimpan di akun Anda.
              </p>
            </div>
            <Link className="mt-4 block sm:mt-0" href="/login?next=/billing">
              <Button className="min-h-12 w-full px-8 text-base sm:w-auto">
                Login untuk Top Up
              </Button>
            </Link>
          </Panel>
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
              <p className="mt-4 min-h-24 text-sm font-medium leading-6 text-muted-foreground">
                {tierMarketingDescription(tier.id)}
              </p>
              <ul className="mt-5 space-y-3 text-sm font-semibold">
                {tierMarketingBenefits(tier.id).map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Termasuk: {tier.features.map(featureLabel).join(", ")}
              </p>
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
    priority_queue: "Produksi konten rutin",
    boost_mode: "Mode produksi besar",
    early_access: "Akses fitur lebih awal",
    community: "Komunitas kreator",
    priority_support: "Bantuan kebutuhan brand",
  };

  return labels[value] ?? value.replaceAll("_", " ");
}
