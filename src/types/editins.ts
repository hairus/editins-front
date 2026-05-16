export type FeatureSlug = "foto-produk" | "hapus-bg" | "banner-promo";

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

