import { Copy, WalletCards } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { MetricTile } from "@/components/metric-tile";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Panel } from "@/components/ui/panel";

const affiliateMetrics = [
  { label: "Clicks", value: "1.284", detail: "30 hari" },
  { label: "Signups", value: "93", detail: "CVR 7,2%" },
  { label: "Purchases", value: "24", detail: "Komisi aktif" },
  { label: "Earnings", value: "Rp 480rb", detail: "Pending withdrawal" },
];

export default function AffiliatePage() {
  return (
    <AppShell>
      <section className="app-container pb-24 pt-8">
        <SectionHeading
          eyebrow="Affiliate"
          title="Dashboard referral"
          description="Surface frontend untuk tracking clicks, signups, purchases, komisi, copy link, dan request withdrawal."
        />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {affiliateMetrics.map((metric) => (
            <MetricTile key={metric.label} {...metric} />
          ))}
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.82fr]">
          <Panel className="p-5">
            <h2 className="text-xl font-black">Referral link</h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Input readOnly value="https://editins.com?ref=EDITINS24" />
              <Button className="sm:w-auto" variant="secondary">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Cookie tracking", "Commission rule", "Purchase attribution"].map((item) => (
                <div key={item} className="rounded-ui border border-border bg-background p-3 text-sm font-black">
                  {item}
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="p-5">
            <WalletCards className="h-6 w-6 text-muted-foreground" />
            <h2 className="mt-3 text-xl font-black">Request withdrawal</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
              Form ini frontend-only. Approval dan payout tetap masuk admin workflow Laravel.
            </p>
            <div className="mt-4 grid gap-3">
              <Input placeholder="Nama bank / e-wallet" />
              <Input placeholder="Nomor rekening" />
              <Button>Ajukan Withdrawal</Button>
            </div>
          </Panel>
        </div>
      </section>
    </AppShell>
  );
}
