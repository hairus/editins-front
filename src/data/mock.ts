import type { Feature, Generation, PricingTier } from "@/types/editins";

export const features: Feature[] = [
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
];

export const generations: Generation[] = [
  { id: "GEN-2401", feature: "Foto Produk", status: "success", createdAt: "16 Mei, 14:05", credits: 1 },
  { id: "GEN-2400", feature: "Banner Promo", status: "processing", createdAt: "16 Mei, 13:58", credits: 2 },
  { id: "GEN-2399", feature: "Hapus BG", status: "success", createdAt: "16 Mei, 13:21", credits: 1 },
  { id: "GEN-2398", feature: "Foto Produk", status: "failed", createdAt: "16 Mei, 12:44", credits: 0 },
];

export const pricing: PricingTier[] = [
  {
    name: "Starter",
    price: "Rp 29rb",
    credits: "30 kredit",
    description: "Untuk coba workflow harian dan validasi kebutuhan toko kecil.",
    cta: "Pilih Starter",
  },
  {
    name: "Growth",
    price: "Rp 79rb",
    credits: "100 kredit",
    badge: "Rekomendasi",
    description: "Paket paling efisien untuk UMKM yang upload produk rutin.",
    cta: "Pilih Growth",
  },
  {
    name: "Studio",
    price: "Rp 149rb",
    credits: "220 kredit",
    description: "Untuk tim kecil, reseller, atau katalog produk volume tinggi.",
    cta: "Pilih Studio",
  },
];

export const dashboardMetrics = [
  { label: "Kredit aktif", value: "82", detail: "Reset VIP: 14 hari" },
  { label: "Generate hari ini", value: "18", detail: "P95: 16 detik" },
  { label: "Success rate", value: "94%", detail: "7 hari terakhir" },
  { label: "Biaya AI hari ini", value: "Rp 10.800", detail: "Cap: Rp 200rb" },
];

