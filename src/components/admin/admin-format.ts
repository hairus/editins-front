import type { AdminTone, ProvenanceStatus } from "@/lib/api/admin";

export function formatAdminCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value ?? 0);
}

export function formatAdminDate(value: string | null | undefined) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function provenanceTone(status: ProvenanceStatus | "unknown" | null | undefined): AdminTone {
  const tones: Record<ProvenanceStatus, AdminTone> = {
    valid: "success",
    missing: "warning",
    invalid: "danger",
    mismatch: "danger",
    unsupported: "neutral",
  };

  return status && status in tones ? tones[status as ProvenanceStatus] : "neutral";
}

export function statusTone(status: string): AdminTone {
  if (["success", "paid", "valid", "approved"].includes(status)) return "success";
  if (["failed", "invalid", "mismatch", "rejected"].includes(status)) return "danger";
  if (["pending", "processing", "missing"].includes(status)) return "warning";
  return "neutral";
}
