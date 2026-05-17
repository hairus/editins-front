"use client";

import { useEffect, useState } from "react";

import { AdminLoadingState, AdminPageHeader } from "@/components/admin/admin-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatAdminCurrency } from "@/components/admin/admin-format";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { adminServiceHealth, type AdminServiceHealth } from "@/lib/api/admin";

export default function AdminSettingsPage() {
  const [health, setHealth] = useState<AdminServiceHealth | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    adminServiceHealth()
      .then(setHealth)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <AdminPageHeader eyebrow="Safe config view" title="Settings & service health" description="Tampilkan status konfigurasi non-secret. Jangan pernah render API key, private key, token, atau APP_KEY." />
      {isLoading ? <AdminLoadingState /> : null}
      {health ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Setting label="Environment" value={health.environment} tone={health.environment === "local" ? "warning" : "success"} />
          <Setting label="Debug" value={health.debug ? "true" : "false"} tone={health.debug ? "warning" : "success"} />
          <Setting label="Gemini configured" value={health.gemini_configured ? "true" : "false"} tone={health.gemini_configured ? "success" : "danger"} />
          <Setting label="Gemini fake mode" value={health.gemini_fake_mode ? "true" : "false"} tone={health.gemini_fake_mode ? "warning" : "success"} />
          <Setting label="Tripay configured" value={health.tripay_configured ? "true" : "false"} tone={health.tripay_configured ? "success" : "warning"} />
          <Setting label="Scheduler token" value={health.scheduler_token_configured ? "true" : "false"} tone={health.scheduler_token_configured ? "success" : "warning"} />
          <Setting label="Storage disk" value={health.storage_disk} tone="neutral" />
          <Setting label="Max upload" value={`${health.max_upload_size_kb} KB`} tone="neutral" />
          <Setting label="Daily generate cap" value={formatAdminCurrency(health.daily_generate_cap_idr)} tone="neutral" />
        </div>
      ) : null}
    </AdminShell>
  );
}

function Setting({ label, value, tone }: { label: string; value: string; tone: "neutral" | "success" | "warning" | "danger" }) {
  return (
    <Panel className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
          <p className="mt-2 text-lg font-black">{value}</p>
        </div>
        <Badge tone={tone}>status</Badge>
      </div>
    </Panel>
  );
}
