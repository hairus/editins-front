import { apiFetch } from "@/lib/api/client";

export type AdminOverview = {
  success: boolean;
  metrics: {
    total_users: number;
    new_users_today: number;
    paid_revenue_today_idr: number;
    paid_transactions_today: number;
    success_rate_today: number;
    active_users_24h: number;
    cost_today_idr: number;
  };
  funnels: {
    trial_users: number;
    starter_users: number;
    pro_users: number;
    vip_users: number;
  };
  alerts: Array<{
    title: string;
    status: string;
    tone: "success" | "warning" | "neutral" | "danger";
    detail: string;
  }>;
};

export async function adminOverview(): Promise<AdminOverview> {
  const response = await apiFetch("/admin/overview");

  if (!response.ok) {
    throw new Error("Gagal membaca ringkasan internal.");
  }

  return response.json();
}
