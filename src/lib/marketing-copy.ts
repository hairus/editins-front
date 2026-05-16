export function tierMarketingLabel(tier?: string | null) {
  const normalized = tier?.trim().toLowerCase();

  if (!normalized) return "-";

  const labels: Record<string, string> = {
    free: "Paket Coba Gratis",
    starter: "Paket Hemat",
    basic: "Paket Hemat",
    growth: "Paket Growth",
    pro: "Paket Pro",
    business: "Paket Bisnis",
    enterprise: "Paket Enterprise",
  };

  return labels[normalized] ?? normalized.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
