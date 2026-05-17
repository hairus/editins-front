"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

import { AdminEmptyState, AdminLoadingState, AdminPageHeader } from "@/components/admin/admin-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatAdminCurrency, formatAdminDate, provenanceTone, statusTone } from "@/components/admin/admin-format";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { adminGenerations, type AdminGeneration } from "@/lib/api/admin";

export default function AdminGenerationsPage() {
  const [search, setSearch] = useState("");
  const [generations, setGenerations] = useState<AdminGeneration[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminGenerations({ search })
      .then((response) => setGenerations(response.data))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Review produksi"
        title="Generate review"
        description="Lihat semua pekerjaan generate, status provenance, biaya, dan durasi sebelum masuk ke detail audit."
      />

      <Panel className="mb-5 p-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="h-11 w-full rounded-ui border border-input/60 bg-background/70 pl-10 pr-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-ring"
            placeholder="Cari generation ID, user, email, atau fitur"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </Panel>

      {isLoading ? <AdminLoadingState /> : null}

      {!isLoading && generations.length === 0 ? <AdminEmptyState title="Belum ada generation" detail="Data akan muncul setelah backend admin generations tersedia." /> : null}

      <div className="grid gap-3">
        {generations.map((generation) => (
          <Link key={generation.id} href={`/admin/generations/${generation.id}`}>
            <Panel className="grid gap-4 p-4 transition hover:border-primary/35 hover:bg-muted/30 md:grid-cols-[5rem_1fr_auto] md:items-center">
              <div className="relative h-20 overflow-hidden rounded-ui border border-border/45 bg-muted">
                {generation.output_image_url ? (
                  <Image src={generation.output_image_url} alt={generation.feature} fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="grid h-full place-items-center text-xs font-bold text-muted-foreground">No image</div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={statusTone(generation.status)}>{generation.status}</Badge>
                  <Badge tone={provenanceTone(generation.provenance_status)}>stegano {generation.provenance_status}</Badge>
                  <span className="text-xs font-bold text-muted-foreground">{formatAdminDate(generation.created_at)}</span>
                </div>
                <h3 className="mt-2 truncate text-base font-black">{generation.feature}</h3>
                <p className="mt-1 truncate text-sm font-semibold text-muted-foreground">
                  {generation.user ? `${generation.user.name} · ${generation.user.email}` : "Guest/unknown user"}
                </p>
              </div>
              <div className="grid gap-1 text-left md:text-right">
                <span className="text-sm font-black">{formatAdminCurrency(generation.cost_idr)}</span>
                <span className="text-xs font-semibold text-muted-foreground">{generation.duration_ms ?? 0} ms · {generation.credits_consumed ?? 0} kredit</span>
              </div>
            </Panel>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
