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
  "produk-model": {
    title: "Gabung Foto Produk",
    accent: "dengan Model",
    description: "Upload minimal 2 foto: produk dan model/referensi. Editins akan menggabungkan keduanya menjadi visual campaign yang natural.",
  },
  "gabung-foto": {
    title: "Gabung Foto",
    accent: "Jadi Satu Visual",
    description: "Upload minimal 2 foto untuk digabung menjadi satu visual jualan yang natural, rapi, dan siap promosi.",
  },
  "foto-miniatur": {
    title: "Buat Foto Miniatur",
    accent: "Lebih Menarik",
    description: "Buat thumbnail atau cover produk yang jelas, kontras, dan mudah menarik perhatian di marketplace atau sosial media.",
  },
  "perluas-foto": {
    title: "Perluas Foto",
    accent: "Tanpa Merusak Produk",
    description: "Perluas kanvas foto untuk banner, sosial media, atau marketplace dengan latar yang tetap natural.",
  },
  "edit-foto": {
    title: "Edit Foto",
    accent: "Sesuai Kebutuhan",
    description: "Beri instruksi edit seperti ganti latar, rapikan objek, bersihkan detail, atau ubah gaya visual jualan.",
  },
  "perbaiki-foto": {
    title: "Perbaiki Foto",
    accent: "Lebih Layak Jual",
    description: "Tingkatkan foto yang gelap, buram, kusam, atau kurang rapi agar siap dipakai untuk katalog produk.",
  },
  "face-swap": {
    title: "Face Swap",
    accent: "Aset Berizin",
    description: "Gunakan hanya foto milik sendiri atau berizin untuk membuat visual model campaign yang aman dan natural.",
  },
  "foto-artis": {
    title: "Foto Artis",
    accent: "Gaya Talent Premium",
    description: "Buat visual talent profesional untuk campaign produk tanpa meniru artis nyata atau public figure tertentu.",
  },
  "foto-fashion": {
    title: "Rapikan Foto Fashion",
    accent: "Siap Katalog",
    description: "Upload foto pakaian atau aksesori, lalu buat hasil katalog marketplace dengan warna dan detail tetap akurat.",
  },
  "carousel-marketplace": {
    title: "Buat Carousel",
    accent: "Marketplace",
    description: "Ubah foto produk menjadi cover carousel atau visual multi-section yang rapi, mudah dibaca, dan siap promosi.",
  },
  "foto-makanan": {
    title: "Bikin Foto Makanan",
    accent: "Lebih Menggoda",
    description: "Upload foto makanan, lalu tingkatkan pencahayaan, warna, dan komposisi agar cocok untuk menu online.",
  },
  "buat-mockup": {
    title: "Buat Mockup",
    accent: "Realistis",
    description: "Tempatkan produk, logo, label, atau desain ke mockup kemasan, kaos, botol, poster, atau display toko.",
  },
  "pov-tangan": {
    title: "POV Tangan",
    accent: "Terlihat Natural",
    description: "Buat visual tangan memegang, menunjuk, membuka, atau menunjukkan produk untuk konten marketplace dan sosial media.",
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
      <AuthRequired allowGuest>
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
