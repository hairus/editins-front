"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Camera, Eraser, Expand, ImagePlus, Images, LayoutDashboard, Megaphone, Paintbrush, ScanFace, Shirt, Star, Utensils, UserRound, Wand2 } from "lucide-react";

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
    icon: Camera,
    shell: "border-emerald-300/40 bg-[linear-gradient(135deg,rgba(16,185,129,.20),rgba(14,165,233,.10)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-emerald-500/14 text-emerald-500",
    charm: "bg-emerald-400/24",
  },
  "produk-model": {
    icon: UserRound,
    shell: "border-violet-300/40 bg-[linear-gradient(135deg,rgba(139,92,246,.20),rgba(14,165,233,.10)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-violet-500/14 text-violet-500",
    charm: "bg-violet-400/24",
  },
  "gabung-foto": {
    icon: ImagePlus,
    shell: "border-violet-300/40 bg-[linear-gradient(135deg,rgba(139,92,246,.20),rgba(14,165,233,.10)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-violet-500/14 text-violet-500",
    charm: "bg-violet-400/24",
  },
  "foto-miniatur": {
    icon: Images,
    shell: "border-blue-300/40 bg-[linear-gradient(135deg,rgba(96,165,250,.20),rgba(14,165,233,.10)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-blue-500/14 text-blue-500",
    charm: "bg-blue-400/24",
  },
  "perluas-foto": {
    icon: Expand,
    shell: "border-teal-300/40 bg-[linear-gradient(135deg,rgba(45,212,191,.20),rgba(34,197,94,.08)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-teal-500/14 text-teal-500",
    charm: "bg-teal-400/24",
  },
  "edit-foto": {
    icon: Paintbrush,
    shell: "border-indigo-300/40 bg-[linear-gradient(135deg,rgba(129,140,248,.20),rgba(168,85,247,.08)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-indigo-500/14 text-indigo-500",
    charm: "bg-indigo-400/24",
  },
  "perbaiki-foto": {
    icon: Wand2,
    shell: "border-lime-300/40 bg-[linear-gradient(135deg,rgba(132,204,22,.20),rgba(34,197,94,.08)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-lime-500/14 text-lime-600 dark:text-lime-400",
    charm: "bg-lime-400/24",
  },
  "face-swap": {
    icon: ScanFace,
    shell: "border-purple-300/40 bg-[linear-gradient(135deg,rgba(168,85,247,.20),rgba(236,72,153,.08)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-purple-500/14 text-purple-500",
    charm: "bg-purple-400/24",
  },
  "foto-artis": {
    icon: Star,
    shell: "border-yellow-300/40 bg-[linear-gradient(135deg,rgba(250,204,21,.22),rgba(251,146,60,.09)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-yellow-500/14 text-yellow-600 dark:text-yellow-400",
    charm: "bg-yellow-400/24",
  },
  "foto-fashion": {
    icon: Shirt,
    shell: "border-fuchsia-300/40 bg-[linear-gradient(135deg,rgba(217,70,239,.18),rgba(244,114,182,.09)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-fuchsia-500/14 text-fuchsia-500",
    charm: "bg-fuchsia-400/24",
  },
  "carousel-marketplace": {
    icon: Images,
    shell: "border-cyan-300/40 bg-[linear-gradient(135deg,rgba(34,211,238,.20),rgba(59,130,246,.10)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-cyan-500/14 text-cyan-500",
    charm: "bg-cyan-400/24",
  },
  "foto-makanan": {
    icon: Utensils,
    shell: "border-orange-300/40 bg-[linear-gradient(135deg,rgba(251,146,60,.22),rgba(251,191,36,.10)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-orange-500/14 text-orange-500",
    charm: "bg-orange-400/24",
  },
  "buat-mockup": {
    icon: LayoutDashboard,
    shell: "border-slate-300/40 bg-[linear-gradient(135deg,rgba(148,163,184,.22),rgba(59,130,246,.08)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-slate-500/14 text-slate-500",
    charm: "bg-slate-400/24",
  },
  "pov-tangan": {
    icon: UserRound,
    shell: "border-stone-300/40 bg-[linear-gradient(135deg,rgba(168,162,158,.22),rgba(251,146,60,.08)_48%,rgba(255,255,255,.05))]",
    iconWrap: "bg-stone-500/14 text-stone-500",
    charm: "bg-stone-400/24",
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
      <AuthRequired allowGuest>
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
