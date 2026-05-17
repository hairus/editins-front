"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

import { AdminLoadingState, AdminPageHeader } from "@/components/admin/admin-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatAdminCurrency, formatAdminDate, provenanceTone, statusTone } from "@/components/admin/admin-format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { adminGenerationDetail, adminGenerationProvenance, type AdminGeneration, type ProvenanceResult } from "@/lib/api/admin";

export default function AdminGenerationDetailPage({ params }: { params: { id: string } }) {
  const [generation, setGeneration] = useState<AdminGeneration | null>(null);
  const [provenance, setProvenance] = useState<ProvenanceResult | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isChecking, setChecking] = useState(false);

  useEffect(() => {
    adminGenerationDetail(params.id)
      .then((response) => setGeneration(response.data))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function checkProvenance() {
    setChecking(true);
    const result = await adminGenerationProvenance(params.id);
    setProvenance(result);
    setChecking(false);
  }

  return (
    <AdminShell>
      <AdminPageHeader eyebrow="Detail generate" title={params.id} description="Audit output, prompt, parameter, dan status stegano untuk satu pekerjaan generate." />

      {isLoading ? <AdminLoadingState /> : null}

      {generation ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_0.75fr]">
          <Panel className="overflow-hidden">
            <div className="relative min-h-[22rem] bg-muted">
              {generation.output_image_url ? (
                <Image src={generation.output_image_url} alt={generation.feature} fill className="object-contain p-5" sizes="(min-width: 1280px) 50vw, 100vw" />
              ) : (
                <div className="grid min-h-[22rem] place-items-center text-sm font-bold text-muted-foreground">Output belum tersedia</div>
              )}
            </div>
          </Panel>

          <div className="grid gap-5">
            <Panel className="p-5">
              <div className="flex flex-wrap gap-2">
                <Badge tone={statusTone(generation.status)}>{generation.status}</Badge>
                <Badge tone={provenanceTone(generation.provenance_status)}>stegano {generation.provenance_status}</Badge>
              </div>
              <dl className="mt-5 grid gap-3 text-sm">
                <Detail label="User" value={generation.user ? `${generation.user.name} (${generation.user.email})` : "-"} />
                <Detail label="Feature" value={generation.feature} />
                <Detail label="Cost" value={formatAdminCurrency(generation.cost_idr)} />
                <Detail label="Duration" value={`${generation.duration_ms ?? 0} ms`} />
                <Detail label="Created" value={formatAdminDate(generation.created_at)} />
              </dl>
              <Button className="mt-5 w-full" disabled={isChecking} onClick={checkProvenance}>
                <ShieldCheck className="h-4 w-4" />
                {isChecking ? "Mengecek..." : "Cek Provenance"}
              </Button>
            </Panel>

            {provenance ? (
              <Panel className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-black">Hasil provenance</h3>
                  <Badge tone={provenanceTone(provenance.status)}>{provenance.status}</Badge>
                </div>
                <pre className="mt-4 max-h-72 overflow-auto rounded-ui bg-background/70 p-3 text-xs font-semibold leading-5 text-muted-foreground">
                  {JSON.stringify(provenance, null, 2)}
                </pre>
              </Panel>
            ) : null}
          </div>

          <Panel className="p-5 xl:col-span-2">
            <h3 className="font-black">Prompt & parameters</h3>
            <p className="mt-3 rounded-ui bg-background/70 p-4 text-sm font-semibold leading-6 text-muted-foreground">{generation.prompt_used ?? "-"}</p>
            <pre className="mt-4 overflow-auto rounded-ui bg-background/70 p-4 text-xs font-semibold leading-5 text-muted-foreground">
              {JSON.stringify(generation.parameters ?? {}, null, 2)}
            </pre>
            {generation.error_message ? <p className="mt-4 rounded-ui border border-destructive/25 bg-destructive/10 p-3 text-sm font-semibold text-destructive">{generation.error_message}</p> : null}
          </Panel>
        </div>
      ) : null}
    </AdminShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/35 pb-2">
      <dt className="font-bold text-muted-foreground">{label}</dt>
      <dd className="text-right font-black">{value}</dd>
    </div>
  );
}
