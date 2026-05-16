import Link from "next/link";
import { CheckCircle2, ReceiptText } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { AuthRequired } from "@/components/auth-required";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export default function BillingSuccessPage() {
  return (
    <AppShell>
      <AuthRequired>
        <section className="app-container grid min-h-[calc(100vh-4rem)] place-items-center pb-24 pt-8">
        <Panel className="w-full max-w-xl p-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-ui bg-success text-success-foreground">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-3xl font-black">Pembayaran berhasil</h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-muted-foreground">
            Kredit akan otomatis bertambah setelah pembayaran dikonfirmasi.
          </p>
          <div className="mt-6 rounded-ui border border-border bg-background p-4 text-left">
            <div className="flex items-center gap-2 font-black">
              <ReceiptText className="h-4 w-4" />
              INV-EDITINS-2401
            </div>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">Status: paid - Growth - 100 kredit</p>
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
