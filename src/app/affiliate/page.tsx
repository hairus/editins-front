"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Copy, Loader2, WalletCards } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { AuthRequired } from "@/components/auth-required";
import { useAuth } from "@/components/auth-provider";
import { MetricTile } from "@/components/metric-tile";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Panel } from "@/components/ui/panel";
import { affiliateStats, requestWithdrawal, type AffiliateStats } from "@/lib/api/affiliate";
import { notifyApp } from "@/lib/notify";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export default function AffiliatePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [withdrawal, setWithdrawal] = useState({
    amount_idr: "",
    method: "DANA",
    account_number: "",
    account_name: "",
  });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    affiliateStats()
      .then(setStats)
      .catch((error) => {
        const nextMessage = error instanceof Error ? error.message : "Gagal membaca referral.";
        setMessage(nextMessage);
        notifyApp({
          title: "Referral belum bisa dimuat",
          detail: nextMessage,
          tone: "danger",
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  const referralLink = stats?.affiliate_code ? `https://editins.com?ref=${stats.affiliate_code}` : "";
  const metrics = useMemo(
    () => [
      { label: "Kode", value: stats?.affiliate_code ?? "-", detail: "Siap dibagikan" },
      { label: "Referral", value: String(stats?.total_referrals ?? 0), detail: "Teman yang bergabung" },
      { label: "Pending", value: formatCurrency(stats?.pending_commission_idr ?? 0), detail: "Bisa ditarik setelah valid" },
      { label: "Paid", value: formatCurrency(stats?.paid_commission_idr ?? 0), detail: "Sudah dibayar" },
    ],
    [stats],
  );

  async function copyReferralLink() {
    if (!referralLink) return;

    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  async function submitWithdrawal() {
    setSubmitting(true);
    setMessage(null);

    try {
      await requestWithdrawal({
        amount_idr: Number(withdrawal.amount_idr),
        method: withdrawal.method,
        account_number: withdrawal.account_number,
        account_name: withdrawal.account_name,
      });
      setMessage("Withdrawal berhasil diajukan dan menunggu approval admin.");
      setWithdrawal((current) => ({ ...current, amount_idr: "", account_number: "", account_name: "" }));
      setStats(await affiliateStats());
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "Gagal mengajukan pencairan.";
      setMessage(nextMessage);
      notifyApp({
        title: "Pencairan belum berhasil",
        detail: nextMessage,
        tone: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <AuthRequired>
        <section className="app-container pb-24 pt-8">
        <SectionHeading
          eyebrow="Referral"
          title="Ajak teman, dapat komisi"
          description="Bagikan kode referral dan pantau komisi dari setiap teman yang bergabung."
        />

        {message ? (
          <div className="mt-5 rounded-ui border border-border bg-background px-4 py-3 text-sm font-semibold text-muted-foreground">
            {message}
          </div>
        ) : null}

        {!user ? (
          <Panel className="mt-7 p-5">
            <p className="text-sm font-semibold">Masuk dulu untuk melihat program referral.</p>
            <Link className="mt-4 inline-flex" href="/login?next=/affiliate">
              <Button size="sm">Login</Button>
            </Link>
          </Panel>
        ) : null}

        {user ? (
          <>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <MetricTile key={metric.label} {...metric} />
              ))}
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.82fr]">
              <Panel className="p-5">
                <h2 className="text-xl font-black">Link referral</h2>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Input readOnly value={isLoading ? "Memuat..." : referralLink} />
                  <Button className="sm:w-auto" disabled={!referralLink} variant="secondary" onClick={copyReferralLink}>
                    <Copy className="h-4 w-4" />
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {["Komisi sampai 50%", "Link mudah dibagikan", "Pencairan setelah valid"].map((item) => (
                    <div key={item} className="rounded-ui border border-border bg-background p-3 text-sm font-black">
                      {item}
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel className="p-5">
                <WalletCards className="h-6 w-6 text-muted-foreground" />
                <h2 className="mt-3 text-xl font-black">Ajukan pencairan</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
                  Minimal pencairan {formatCurrency(stats?.min_withdrawal_idr ?? 50000)} setelah saldo dinyatakan valid.
                </p>
                <div className="mt-4 grid gap-3">
                  <Input
                    inputMode="numeric"
                    placeholder="Jumlah withdrawal"
                    value={withdrawal.amount_idr}
                    onChange={(event) => setWithdrawal((current) => ({ ...current, amount_idr: event.target.value }))}
                  />
                  <Input
                    placeholder="DANA / GOPAY / OVO / BANK"
                    value={withdrawal.method}
                    onChange={(event) => setWithdrawal((current) => ({ ...current, method: event.target.value.toUpperCase() }))}
                  />
                  <Input
                    placeholder="Nomor rekening / e-wallet"
                    value={withdrawal.account_number}
                    onChange={(event) => setWithdrawal((current) => ({ ...current, account_number: event.target.value }))}
                  />
                  <Input
                    placeholder="Nama pemilik"
                    value={withdrawal.account_name}
                    onChange={(event) => setWithdrawal((current) => ({ ...current, account_name: event.target.value }))}
                  />
                  <Button disabled={isSubmitting || isLoading} onClick={submitWithdrawal}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Ajukan Withdrawal
                  </Button>
                </div>
              </Panel>
            </div>
          </>
        ) : null}
        </section>
      </AuthRequired>
    </AppShell>
  );
}
