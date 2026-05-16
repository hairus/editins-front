import { AlertTriangle, Activity, Banknote, Cpu, Users } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { MetricTile } from "@/components/metric-tile";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";

const adminMetrics = [
  { label: "Total users", value: "1.842", detail: "+43 hari ini" },
  { label: "Revenue today", value: "Rp 2,4jt", detail: "Tripay paid" },
  { label: "AI success rate", value: "94,8%", detail: "Per feature" },
  { label: "Active 24h", value: "318", detail: "PostHog source" },
];

const alerts = [
  { icon: Activity, title: "Queue healthy", status: "normal", tone: "success" },
  { icon: Cpu, title: "Generate P95 18s", status: "watch", tone: "warning" },
  { icon: Banknote, title: "Cost cap 5,4%", status: "normal", tone: "success" },
  { icon: Users, title: "5 complaints today", status: "review", tone: "warning" },
] as const;

export default function AdminDashboardPage() {
  return (
    <AppShell>
      <section className="app-container pb-24 pt-8">
        <SectionHeading
          eyebrow="Founder admin"
          title="Internal dashboard"
          description="Frontend shell untuk metrik founder-only: user, generation, cost, revenue, affiliate, dan alert operasional."
        />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {adminMetrics.map((metric) => (
            <MetricTile key={metric.label} {...metric} />
          ))}
        </div>
        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.85fr]">
          <Panel className="p-5">
            <h2 className="text-xl font-black">Operational alerts</h2>
            <div className="mt-4 grid gap-3">
              {alerts.map((alert) => (
                <div key={alert.title} className="flex items-center justify-between gap-3 rounded-ui border border-border bg-background p-3">
                  <div className="flex items-center gap-3">
                    <alert.icon className="h-5 w-5 text-muted-foreground" />
                    <p className="font-black">{alert.title}</p>
                  </div>
                  <Badge tone={alert.tone}>{alert.status}</Badge>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="border-destructive/30 bg-destructive/10 p-5">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <h2 className="mt-3 text-xl font-black">Admin protection note</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
              Page ini hanya frontend shell. Founder-only policy, Laravel auth guard, and admin API authorization must be enforced server-side before production.
            </p>
          </Panel>
        </div>
      </section>
    </AppShell>
  );
}
