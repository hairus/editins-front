"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Eraser, Images, Megaphone } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { AuthRequired } from "@/components/auth-required";
import { useProductCatalog } from "@/components/product-catalog-provider";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import type { FeatureSlug } from "@/types/editins";

const featureCardStyles = {
  "foto-produk": {
    icon: Images,
    shell: "border-emerald-300/40 bg-[linear-gradient(135deg,rgba(16,185,129,.20),rgba(14,165,233,.10)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-emerald-500/14 text-emerald-500",
    charm: "bg-emerald-400/24",
  },
  "foto-4x6": {
    icon: BadgeCheck,
    shell: "border-sky-300/40 bg-[linear-gradient(135deg,rgba(56,189,248,.22),rgba(99,102,241,.10)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-sky-500/14 text-sky-500",
    charm: "bg-sky-400/24",
  },
  "hapus-bg": {
    icon: Eraser,
    shell: "border-rose-300/40 bg-[linear-gradient(135deg,rgba(251,113,133,.20),rgba(244,114,182,.09)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-rose-500/14 text-rose-500",
    charm: "bg-rose-400/24",
  },
  "banner-promo": {
    icon: Megaphone,
    shell: "border-amber-300/40 bg-[linear-gradient(135deg,rgba(251,191,36,.24),rgba(249,115,22,.10)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-amber-500/16 text-amber-600 dark:text-amber-400",
    charm: "bg-amber-400/24",
  },
} satisfies Record<FeatureSlug, {
  icon: typeof Images;
  shell: string;
  iconWrap: string;
  charm: string;
}>;

export default function GenerateIndexPage() {
  const { error, isLoading, products } = useProductCatalog();

  return (
    <AppShell>
      <AuthRequired>
        <section className="app-container pb-24 pt-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
          eyebrow="Mulai kreasi"
          title="Pilih kebutuhan visual"
          description="Pilih jenis foto yang ingin dibuat, lalu lanjutkan ke studio dengan pengaturan yang mudah dipakai."
          align="center"
        />
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {isLoading ? (
            <Panel className="grid min-h-56 place-items-center p-5 text-sm font-semibold text-muted-foreground lg:col-span-3">
              Memuat pilihan produk...
            </Panel>
          ) : null}
          {error ? (
            <Panel className="grid min-h-56 place-items-center p-5 text-center text-sm font-semibold text-destructive lg:col-span-3">
              {error}
            </Panel>
          ) : null}
          {products.map((feature) => (
            <Panel
              key={feature.slug}
              className={`relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-soft ${featureCardStyles[feature.slug].shell}`}
            >
              <span className={`absolute -right-6 -top-6 h-24 w-24 rounded-full blur-xl ${featureCardStyles[feature.slug].charm}`} />
              <span className="absolute bottom-4 right-5 h-10 w-10 rounded-full border border-white/20 bg-white/10" />
              <div className="flex items-center justify-between gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-ui ${featureCardStyles[feature.slug].iconWrap}`}>
                  {(() => {
                    const Icon = featureCardStyles[feature.slug].icon;
                    return <Icon className="h-5 w-5" />;
                  })()}
                </span>
                <Badge tone={feature.credits > 1 ? "warning" : "success"}>{feature.credits} kredit</Badge>
              </div>
              <h2 className="mt-8 text-xl font-semibold">{feature.shortTitle}</h2>
              <p className="mt-3 min-h-24 text-sm font-medium leading-6 text-muted-foreground">{feature.description}</p>
              <Link href={`/generate/${feature.slug}`} className="mt-5 block">
                <Button className="w-full" variant="outline">
                  Buka Studio
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Panel>
          ))}
        </div>
        </section>
      </AuthRequired>
    </AppShell>
  );
}
