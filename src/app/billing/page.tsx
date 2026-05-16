import Link from "next/link";
import { CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { pricing } from "@/data/mock";

export default function BillingPage() {
  return (
    <AppShell>
      <section className="app-container pb-24 pt-8">
        <SectionHeading
          eyebrow="Billing"
          title="Top up kredit"
          description="Frontend pricing dan state pembayaran disiapkan untuk Tripay create-transaction dan success redirect."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {pricing.map((tier) => (
            <Panel key={tier.name} className="p-5">
              <div className="flex min-h-8 items-center justify-between gap-3">
                <h2 className="text-xl font-black">{tier.name}</h2>
                {tier.badge ? <Badge tone="warning">{tier.badge}</Badge> : null}
              </div>
              <p className="mt-5 text-4xl font-black tracking-normal">{tier.price}</p>
              <p className="mt-1 text-sm font-black text-muted-foreground">{tier.credits}</p>
              <p className="mt-4 min-h-12 text-sm font-medium leading-6 text-muted-foreground">{tier.description}</p>
              <ul className="mt-5 space-y-3 text-sm font-semibold">
                {["Tripay redirect", "Auto-upgrade after webhook", "Invoice success state"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/billing/success" className="mt-5 block">
                <Button className="w-full" variant={tier.badge ? "primary" : "outline"}>
                  <CreditCard className="h-4 w-4" />
                  {tier.cta}
                </Button>
              </Link>
            </Panel>
          ))}
        </div>
        <Panel className="mt-5 p-4">
          <div className="flex gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-black">Payment boundary</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-muted-foreground">
                Frontend hanya memulai transaksi dan membaca status. Signature verification, idempotency, dan credit mutation tetap dikerjakan backend Laravel.
              </p>
            </div>
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
