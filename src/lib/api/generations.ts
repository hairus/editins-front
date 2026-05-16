import { apiFetch } from "@/lib/api/client";

export type BackendGenerationStatus = "queued" | "processing" | "success" | "failed";

export type BackendGeneration = {
  id: string;
  feature: string;
  status: BackendGenerationStatus;
  cost_idr: number | null;
  duration_ms: number | null;
  credits_consumed: number | null;
  created_at: string;
  updated_at: string;
};

export type GenerationHistoryResponse = {
  success: boolean;
  data: BackendGeneration[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
  };
};

export async function generationHistory(perPage = 20, page = 1): Promise<GenerationHistoryResponse> {
  const response = await apiFetch(`/generations?per_page=${perPage}&page=${page}`);

  if (!response.ok) {
    throw new Error("Gagal mengambil riwayat generation.");
  }

  return response.json();
}
