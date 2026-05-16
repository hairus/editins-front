import { apiFetch } from "@/lib/api/client";

export type AffiliateStats = {
  success: boolean;
  affiliate_code: string | null;
  total_referrals: number;
  pending_commission_idr: number;
  paid_commission_idr: number;
  min_withdrawal_idr: number;
  withdrawals: Array<{
    id: string;
    amount_idr: number;
    method: string;
    account_number: string;
    account_name: string;
    status: string;
    created_at: string;
  }>;
};

type ApiPayload = {
  message?: string;
  error?: string;
};

export async function affiliateStats() {
  const response = await apiFetch("/affiliate/stats");

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiPayload;
    throw new Error(payload.message ?? payload.error ?? "Gagal membaca statistik affiliate.");
  }

  return response.json() as Promise<AffiliateStats>;
}

export async function requestWithdrawal(input: {
  amount_idr: number;
  method: string;
  account_number: string;
  account_name: string;
}) {
  const response = await apiFetch("/affiliate/withdraw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => ({}))) as ApiPayload;

  if (!response.ok) {
    throw new Error(payload.message ?? payload.error ?? "Gagal mengajukan withdrawal.");
  }
}
