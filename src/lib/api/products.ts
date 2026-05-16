import { apiFetch } from "@/lib/api/client";
import type { Feature, FeatureSlug } from "@/types/editins";

type BackendProduct = {
  slug: FeatureSlug;
  title: string;
  shortTitle?: string;
  short_title?: string;
  description: string;
  credits: number;
  eta: string;
  output: string;
};

type ProductResponse = {
  success: boolean;
  products: BackendProduct[];
};

export async function productCatalog(): Promise<Feature[]> {
  const response = await apiFetch("/products");

  if (!response.ok) {
    throw new Error("Gagal membaca daftar produk.");
  }

  const payload = (await response.json()) as ProductResponse;

  return payload.products.map((product) => ({
    slug: product.slug,
    title: product.title,
    shortTitle: product.shortTitle ?? product.short_title ?? product.title,
    description: product.description,
    credits: product.credits,
    eta: product.eta,
    output: product.output,
  }));
}
