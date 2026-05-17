export type FeatureSlug =
  | "foto-produk"
  | "produk-model"
  | "gabung-foto"
  | "foto-miniatur"
  | "perluas-foto"
  | "edit-foto"
  | "perbaiki-foto"
  | "face-swap"
  | "foto-artis"
  | "foto-fashion"
  | "carousel-marketplace"
  | "foto-makanan"
  | "buat-mockup"
  | "pov-tangan"
  | "foto-4x6"
  | "hapus-bg"
  | "banner-promo";

export type GenerationStatus = "queued" | "processing" | "success" | "failed";

export type Feature = {
  slug: FeatureSlug;
  title: string;
  shortTitle: string;
  description: string;
  credits: number;
  eta: string;
  output: string;
};

export type Generation = {
  id: string;
  feature: string;
  status: GenerationStatus;
  createdAt: string;
  credits: number;
};

export type PricingTier = {
  name: string;
  price: string;
  credits: string;
  badge?: string;
  description: string;
  cta: string;
};
