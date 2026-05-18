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

const fallbackProducts: BackendProduct[] = [
  {
    slug: "foto-produk",
    title: "Foto Produk Studio",
    shortTitle: "Foto Produk",
    description: "Ubah foto meja biasa jadi foto katalog dengan cahaya studio, bayangan halus, dan latar jualan yang rapi.",
    credits: 1,
    eta: "10-20 detik",
    output: "JPG 1024px",
  },
  {
    slug: "foto-4x6",
    title: "Pas Foto",
    shortTitle: "Pas Foto",
    description: "Rapikan foto wajah menjadi pas foto portrait 4x6 dengan latar bersih, cahaya lembut, dan komposisi formal.",
    credits: 1,
    eta: "10-20 detik",
    output: "PNG 2x3/3x4/4x6/4x4",
  },
  {
    slug: "hapus-bg",
    title: "Hapus Background",
    shortTitle: "Hapus BG",
    description: "Pisahkan produk dari latar dengan output PNG transparan yang siap dipakai untuk marketplace dan katalog.",
    credits: 1,
    eta: "8-15 detik",
    output: "PNG transparan",
  },
  {
    slug: "banner-promo",
    title: "Banner Promo",
    shortTitle: "Banner Promo",
    description: "Buat banner promo cepat dengan teks singkat, rasio marketplace, dan gaya visual sesuai campaign.",
    credits: 2,
    eta: "12-20 detik",
    output: "JPG/PNG multi rasio",
  },
  {
    slug: "produk-model",
    title: "Produk + Model AI",
    shortTitle: "Produk + Model",
    description: "Gabungkan foto produk dengan foto model atau referensi gaya untuk membuat visual campaign produk yang natural dan siap jual.",
    credits: 2,
    eta: "12-25 detik",
    output: "JPG/PNG 4:5",
  },
  {
    slug: "foto-fashion",
    title: "Foto Fashion",
    shortTitle: "Foto Fashion",
    description: "Rapikan foto pakaian, kain, atau aksesori fashion agar terlihat seperti katalog marketplace dengan warna dan detail tetap akurat.",
    credits: 1,
    eta: "10-20 detik",
    output: "JPG 4:5",
  },
  {
    slug: "carousel-marketplace",
    title: "Carousel Marketplace",
    shortTitle: "Carousel",
    description: "Buat cover carousel atau visual multi-section untuk menonjolkan produk, manfaat, dan poin jual utama secara rapi.",
    credits: 2,
    eta: "12-25 detik",
    output: "JPG 1:1/4:5",
  },
  {
    slug: "foto-makanan",
    title: "Foto Makanan",
    shortTitle: "Foto Makanan",
    description: "Tingkatkan foto makanan agar terlihat lebih menggugah selera untuk menu online, katalog, dan konten sosial media.",
    credits: 1,
    eta: "10-20 detik",
    output: "JPG 4:5",
  },
];

const activeProductSlugs = new Set<FeatureSlug>([
  "foto-produk",
  "foto-4x6",
  "hapus-bg",
]);

export async function productCatalog(): Promise<Feature[]> {
  try {
    const response = await apiFetch("/products");

    if (!response.ok) {
      throw new Error("Gagal membaca daftar produk.");
    }

    const payload = (await response.json()) as ProductResponse;

    return normalizeProducts(mergeProducts(payload.products));
  } catch {
    return normalizeProducts(fallbackProducts);
  }
}

function mergeProducts(products: BackendProduct[]) {
  const bySlug = new Map<FeatureSlug, BackendProduct>();

  fallbackProducts.forEach((product) => bySlug.set(product.slug, product));
  products.forEach((product) => bySlug.set(product.slug, product));

  return Array.from(bySlug.values());
}

function normalizeProducts(products: BackendProduct[]): Feature[] {
  return products
    .filter((product) => activeProductSlugs.has(product.slug))
    .map((product) => ({
      slug: product.slug,
      title: product.title,
      shortTitle: product.shortTitle ?? product.short_title ?? product.title,
      description: product.description,
      credits: product.credits,
      eta: product.eta,
      output: product.output,
    }));
}
