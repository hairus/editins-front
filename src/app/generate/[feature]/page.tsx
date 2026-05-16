import { notFound } from "next/navigation";
import { ChevronLeft, CirclePlay } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { GenerationStudio } from "@/components/generation-studio";
import { Button } from "@/components/ui/button";
import { features } from "@/data/mock";
import type { FeatureSlug } from "@/types/editins";

type GenerateFeaturePageProps = {
  params: {
    feature: FeatureSlug;
  };
};

const heroCopy: Record<FeatureSlug, { title: string; accent: string; description: string }> = {
  "foto-produk": {
    title: "Buat Foto Produk",
    accent: "Lebih Siap Jual",
    description: "Upload foto mentah, pilih gaya, lalu siapkan visual katalog dengan cahaya lembut dan hasil yang rapi.",
  },
  "hapus-bg": {
    title: "Rapikan Produk",
    accent: "Tanpa Background",
    description: "Pisahkan objek dari latar yang ramai dan siapkan PNG bersih untuk marketplace, katalog, atau banner.",
  },
  "banner-promo": {
    title: "Susun Banner",
    accent: "Lebih Menjual",
    description: "Gabungkan foto, teks promo, dan rasio kampanye menjadi materi visual yang siap dipakai.",
  },
};

export function generateStaticParams() {
  return features.map((feature) => ({ feature: feature.slug }));
}

export function generateMetadata({ params }: GenerateFeaturePageProps) {
  const feature = features.find((item) => item.slug === params.feature);
  return {
    title: feature ? feature.title : "Generate",
  };
}

export default function GenerateFeaturePage({ params }: GenerateFeaturePageProps) {
  const feature = features.find((item) => item.slug === params.feature);

  if (!feature) {
    notFound();
  }

  const copy = heroCopy[feature.slug];

  return (
    <AppShell>
      <section className="app-container pb-24 pt-6 sm:pt-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link href="/generate">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
              Semua workflow
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="hidden border-primary/20 bg-card/70 text-foreground sm:inline-flex">
            <CirclePlay className="h-4 w-4 text-primary" />
            Lihat tutorial
          </Button>
        </div>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">AI Studio</p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-normal text-foreground sm:text-4xl lg:text-5xl">
            {copy.title} <span className="text-primary">{copy.accent}</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base">
            {copy.description}
          </p>
        </div>
        <div className="mt-9">
          <GenerationStudio feature={feature} />
        </div>
      </section>
    </AppShell>
  );
}
