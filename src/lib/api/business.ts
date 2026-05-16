import { apiFetch } from "@/lib/api/client";

export type BusinessTier = {
  id: string;
  name: string;
  price_idr: number;
  normal_price_idr: number;
  monthly_credits: number;
  trial_credits: number;
  features: string[];
};

export type BusinessConfig = {
  success: boolean;
  tiers: BusinessTier[];
  affiliate: {
    commission_rate: number;
    min_withdrawal_idr: number;
  };
};

export async function businessConfig(): Promise<BusinessConfig> {
  const response = await apiFetch("/config");

  if (!response.ok) {
    throw new Error("Gagal membaca konfigurasi bisnis.");
  }

  return response.json();
}
