"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, ReceiptText } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { AuthRequired } from "@/components/auth-required";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { paymentStatus } from "@/lib/api/payment";

export default function BillingSuccessPage() {
  const searchParams = useSearchParams();
  const merchantRef = searchParams.get("ref") ?? "";
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<string>("checking");
  const [detail, setDetail] = useState("Mengonfirmasi pembayaran ke Xendit...");

  useEffect(() => {
    if (!merchantRef) {
      setStatus("unknown");
      setDetail("Referensi pembayaran tidak ditemukan.");
      return;
    }

    let isCancelled = false;

    paymentStatus(merchantRef)
      .then(async (payment) => {
        if (isCancelled) return;

        setStatus(payment.status ?? "unknown");

        if (payment.status === "paid") {
          setDetail("Paket dan kredit sudah aktif di akun Anda.");
          await refreshUser().catch(() => undefined);
          return;
        }

        setDetail("Pembayaran belum dikonfirmasi. Jika sudah bayar, tunggu sebentar lalu refresh halaman ini.");
      })
      .catch((error) => {
        if (isCancelled) return;
        setStatus("error");
        setDetail(error instanceof Error ? error.message : "Gagal membaca status pembayaran.");
      });

    return () => {
      isCancelled = true;
    };
  }, [merchantRef, refreshUser]);

  const isChecking = status === "checking";
  const isPaid = status === "paid";

  return (
    <AppShell>
      <AuthRequired>
        <section className="app-container grid min-h-[calc(100vh-4rem)] place-items-center pb-24 pt-8">
          <Panel className="w-full max-w-xl p-6 text-center">
            <div className={isPaid ? "mx-auto grid h-14 w-14 place-items-center rounded-ui bg-success text-success-foreground" : "mx-auto grid h-14 w-14 place-items-center rounded-ui bg-primary/10 text-primary"}>
              {isChecking ? <Loader2 className="h-7 w-7 animate-spin" /> : <CheckCircle2 className="h-7 w-7" />}
            </div>
            <h1 className="mt-5 text-3xl font-black">{isPaid ? "Pembayaran berhasil" : "Status pembayaran"}</h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-muted-foreground">{detail}</p>
            <div className="mt-6 rounded-ui border border-border bg-background p-4 text-left">
              <div className="flex items-center gap-2 font-black">
                <ReceiptText className="h-4 w-4" />
                {merchantRef || "Tidak ada referensi"}
              </div>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">Status: {status}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/dashboard">
                <Button className="w-full sm:w-auto">Kembali ke Home</Button>
              </Link>
              <Link href="/generate/foto-produk">
                <Button className="w-full sm:w-auto" variant="outline">Pilih Produk</Button>
              </Link>
            </div>
          </Panel>
        </section>
      </AuthRequired>
    </AppShell>
  );
}
