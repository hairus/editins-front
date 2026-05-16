"use client";

import Link from "next/link";
import { ChevronLeft, CirclePlay } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { AuthRequired } from "@/components/auth-required";
import { GenerationStudio } from "@/components/generation-studio";
import { useProductCatalog } from "@/components/product-catalog-provider";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import type { FeatureSlug } from "@/types/editins";

type GenerateFeatureClientProps = {
  featureSlug: FeatureSlug;
};

const heroCopy: Partial<Record<FeatureSlug, { title: string; accent: string; description: string }>> = {
  "foto-produk": {
    title: "Bikin Foto Produk",
    accent: "Lebih Siap Jual",
    description: "Upload foto mentah, pilih gaya, lalu siapkan visual katalog dengan cahaya lembut dan hasil yang rapi.",
  },
  "foto-4x6": {
    title: "Buat Pas Foto",
    accent: "4x6 Lebih Rapi",
    description: "Upload foto wajah, pilih latar, lalu buat pas foto portrait 4x6 dengan cahaya lembut dan komposisi formal.",
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

export function GenerateFeatureClient({ featureSlug }: GenerateFeatureClientProps) {
  const { error, isLoading, products } = useProductCatalog();
  const feature = products.find((item) => item.slug === featureSlug);
  const copy = feature
    ? heroCopy[feature.slug] ?? {
        title: feature.title,
        accent: "Siap Dipakai",
        description: feature.description,
      }
    : null;

  return (
    <AppShell>
      <AuthRequired>
        <section className="app-container pb-24 pt-6 sm:pt-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <Link href="/generate">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4" />
                Pilih jenis foto
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="hidden border-primary/20 bg-card/70 text-foreground sm:inline-flex">
              <CirclePlay className="h-4 w-4 text-primary" />
              Lihat tutorial
            </Button>
          </div>

          {isLoading ? (
            <Panel className="grid min-h-72 place-items-center p-6 text-sm font-semibold text-muted-foreground">
              Memuat studio...
            </Panel>
          ) : null}

          {!isLoading && (error || !feature || !copy) ? (
            <Panel className="grid min-h-72 place-items-center p-6 text-center">
              <div>
                <p className="text-sm font-semibold text-foreground">Produk belum tersedia.</p>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{error ?? "Pilih produk lain dari halaman generate."}</p>
                <Link className="mt-4 inline-flex" href="/generate">
                  <Button size="sm">Lihat pilihan produk</Button>
                </Link>
              </div>
            </Panel>
          ) : null}

          {feature && copy ? (
            <>
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Pilih Produk</p>
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
            </>
          ) : null}
        </section>
      </AuthRequired>
    </AppShell>
  );
}
