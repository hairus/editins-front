export function tierMarketingLabel(tier?: string | null) {
  const normalized = tier?.trim().toLowerCase();

  if (!normalized) return "-";

  const labels: Record<string, string> = {
    free: "Paket Coba Gratis",
    starter: "Starter Jualan",
    basic: "Paket Hemat",
    growth: "Paket Growth",
    pro: "Pro Produktif",
    vip: "VIP Scale Up",
    business: "Bisnis Scale Up",
    enterprise: "Paket Enterprise",
  };

  return labels[normalized] ?? normalized.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function tierMarketingDescription(tier?: string | null) {
  const normalized = tier?.trim().toLowerCase();
  const descriptions: Record<string, string> = {
    starter: "Untuk mulai bikin foto produk lebih rapi tanpa biaya besar. Cocok buat toko baru yang ingin katalog terlihat konsisten dan siap upload setiap minggu.",
    pro: "Paket paling worth it untuk produksi konten rutin. Dapat kredit besar dan semua fitur visual untuk jualan yang bergerak tiap hari.",
    vip: "Untuk brand yang butuh produksi visual skala besar tanpa sering mikir kuota. Pas untuk campaign, launch produk, dan eksperimen banyak konsep.",
  };

  return descriptions[normalized ?? ""] ?? "Paket fleksibel untuk membantu produksi visual jualan lebih konsisten.";
}

export function tierMarketingBenefits(tier?: string | null) {
  const normalized = tier?.trim().toLowerCase();
  const benefits: Record<string, string[]> = {
    starter: ["Mulai hemat untuk katalog pertama", "Foto lebih konsisten untuk marketplace", "Download HD siap dipakai jualan"],
    pro: ["Biaya per visual jauh lebih efisien", "Semua gaya visual terbuka", "Ideal untuk konten jualan harian"],
    vip: ["Kuota besar untuk produksi harian", "Akses fitur baru lebih awal", "Bantuan untuk kebutuhan brand"],
  };

  return benefits[normalized ?? ""] ?? ["Harga transparan", "Kredit aktif otomatis", "Cocok untuk produksi rutin"];
}
