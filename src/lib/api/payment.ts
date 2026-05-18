import { apiFetch } from "@/lib/api/client";

type PaymentPayload = {
  success?: boolean;
  transaction_id?: string;
  merchant_ref?: string;
  amount_idr?: number;
  checkout_url?: string;
  developer_mode?: boolean;
  status?: string;
  message?: string;
  error?: string;
};

type PaymentStatusPayload = PaymentPayload & {
  product_type?: string;
  product_id?: string;
  paid_at?: string | null;
};

export async function createTierPayment(productId: string) {
  const response = await apiFetch("/payment/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_type: "tier_upgrade",
      product_id: productId,
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as PaymentPayload;

  if (!response.ok || !payload.checkout_url) {
    throw new Error(payload.message ?? payload.error ?? "Gagal membuat transaksi.");
  }

  return payload;
}

export async function paymentStatus(merchantRef: string) {
  const response = await apiFetch(`/payment/status/${encodeURIComponent(merchantRef)}`);
  const payload = (await response.json().catch(() => ({}))) as PaymentStatusPayload;

  if (!response.ok) {
    throw new Error(payload.message ?? payload.error ?? "Gagal membaca status pembayaran.");
  }

  return payload;
}
