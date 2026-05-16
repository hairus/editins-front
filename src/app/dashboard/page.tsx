import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3 } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { MetricTile } from "@/components/metric-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { dashboardMetrics, features, generations } from "@/data/mock";

const statusTone = {
  success: "success",
  processing: "warning",
  queued: "neutral",
  failed: "danger",
} as const;

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="app-container pb-24 pt-8">
        <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase text-muted-foreground">Creator console</p>
            <h1 className="mt-2 text-xl font-semibold tracking-normal">Dashboard</h1>
            <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
              Ringkasan kredit, generation history, dan entry point fitur MVP sesuai PRD.
            </p>
          </div>
          <Link href="/generate/foto-produk">
            <Button className="w-full sm:w-auto" size="sm">
              Generate Foto
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardMetrics.map((metric) => (
            <MetricTile key={metric.label} {...metric} />
          ))}
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
          <Panel className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <h2 className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">History</h2>
              <Badge tone="accent">Live queue stub</Badge>
            </div>
            <div className="divide-y divide-border">
              {generations.map((generation) => (
                <div key={generation.id} className="grid gap-3 px-4 py-2.5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div>
                    <p className="text-[13px] font-semibold">{generation.feature}</p>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">{generation.id} - {generation.createdAt}</p>
                  </div>
                  <Badge tone={statusTone[generation.status]}>{generation.status}</Badge>
                  <span className="text-xs font-semibold">{generation.credits} kredit</span>
                </div>
              ))}
            </div>
          </Panel>

          <div className="grid gap-3">
            {features.map((feature) => (
              <Link key={feature.slug} href={`/generate/${feature.slug}`}>
                <Panel className="p-3.5 transition hover:border-primary/40">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{feature.shortTitle}</p>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">{feature.eta} - {feature.output}</p>
                    </div>
                    <Badge tone={feature.credits > 1 ? "warning" : "success"}>{feature.credits} kredit</Badge>
                  </div>
                </Panel>
              </Link>
            ))}
            <Panel className="border-warning/25 bg-warning/10 p-3.5">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
                <div>
                  <p className="text-sm font-semibold">PRD guardrail</p>
                  <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">
                    Frontend menampilkan path refund dan rate-limit state, tetapi mutasi kredit tetap harus di Laravel.
                  </p>
                </div>
              </div>
            </Panel>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { icon: CheckCircle2, label: "Loading states", detail: "Skeleton-ready components" },
            { icon: Clock3, label: "Queue visibility", detail: "Progress state stub" },
            { icon: AlertTriangle, label: "Error states", detail: "Friendly fail/refund path" },
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
    </AppShell>
  );
}
