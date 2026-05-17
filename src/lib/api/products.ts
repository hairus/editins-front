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
    slug: "gabung-foto",
    title: "Gabung Foto",
    shortTitle: "Gabung Foto",
    description: "Gabungkan minimal 2 foto menjadi satu visual jualan yang natural, rapi, dan siap dipakai untuk campaign produk.",
    credits: 2,
    eta: "12-25 detik",
    output: "JPG/PNG 4:5",
  },
  {
    slug: "foto-miniatur",
    title: "Foto Miniatur",
    shortTitle: "Foto Miniatur",
    description: "Buat thumbnail atau cover produk yang kuat, jelas, dan mudah menarik perhatian di marketplace atau sosial media.",
    credits: 1,
    eta: "10-20 detik",
    output: "JPG 1:1/16:9",
  },
  {
    slug: "perluas-foto",
    title: "Perluas Foto",
    shortTitle: "Perluas Foto",
    description: "Perluas kanvas foto produk untuk rasio banner, sosial media, atau marketplace tanpa merusak objek utama.",
    credits: 1,
    eta: "10-20 detik",
    output: "JPG multi rasio",
  },
  {
    slug: "edit-foto",
    title: "Edit Foto",
    shortTitle: "Edit Foto",
    description: "Edit foto produk sesuai instruksi: ganti latar, bersihkan detail, rapikan komposisi, atau sesuaikan gaya visual.",
    credits: 1,
    eta: "10-20 detik",
    output: "JPG/PNG",
  },
  {
    slug: "perbaiki-foto",
    title: "Perbaiki Foto",
    shortTitle: "Perbaiki Foto",
    description: "Tingkatkan foto yang gelap, buram, kusam, atau kurang rapi agar lebih layak dipakai untuk jualan.",
    credits: 1,
    eta: "10-20 detik",
    output: "JPG/PNG",
  },
  {
    slug: "face-swap",
    title: "Face Swap",
    shortTitle: "Face Swap",
    description: "Ganti wajah/model hanya untuk aset milik sendiri atau berizin agar visual campaign tetap aman dan natural.",
    credits: 2,
    eta: "12-25 detik",
    output: "JPG/PNG 4:5",
  },
  {
    slug: "foto-artis",
    title: "Foto Artis",
    shortTitle: "Foto Artis",
    description: "Buat visual talent profesional bergaya premium tanpa meniru artis nyata atau identitas publik tertentu.",
    credits: 2,
    eta: "12-25 detik",
    output: "JPG/PNG 4:5",
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
    slug: "foto-4x6",
    title: "Foto 4x6",
    shortTitle: "Foto 4x6",
    description: "Rapikan foto wajah menjadi pas foto portrait 4x6 dengan latar bersih, cahaya lembut, dan komposisi formal.",
    credits: 1,
    eta: "10-20 detik",
    output: "PNG 2:3",
  },
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
    slug: "foto-fashion",
    title: "Foto Fashion",
    shortTitle: "Foto Fashion",
    description: "Rapikan foto pakaian, kain, atau aksesori fashion agar terlihat seperti katalog marketplace dengan warna dan detail tetap akurat.",
    credits: 1,
    eta: "10-20 detik",
    output: "JPG 4:5",
  },
  {
    slug: "buat-mockup",
    title: "Buat Mockup",
    shortTitle: "Buat Mockup",
    description: "Tempatkan produk, logo, label, atau desain ke mockup realistis seperti kemasan, kaos, botol, poster, atau display.",
    credits: 2,
    eta: "12-25 detik",
    output: "JPG/PNG 1:1",
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
    slug: "carousel-marketplace",
    title: "Carousel Marketplace",
    shortTitle: "Carousel",
    description: "Buat cover carousel atau visual multi-section untuk menonjolkan produk, manfaat, dan poin jual utama secara rapi.",
    credits: 2,
    eta: "12-25 detik",
    output: "JPG 1:1/4:5",
  },
  {
    slug: "pov-tangan",
    title: "POV Tangan",
    shortTitle: "POV Tangan",
    description: "Buat foto produk dengan gaya tangan memegang, menunjuk, membuka, atau menunjukkan produk secara natural.",
    credits: 2,
    eta: "12-25 detik",
    output: "JPG/PNG 4:5",
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
  return products.map((product) => ({
    slug: product.slug,
    title: product.title,
    shortTitle: product.shortTitle ?? product.short_title ?? product.title,
    description: product.description,
    credits: product.credits,
    eta: product.eta,
    output: product.output,
  }));
}
