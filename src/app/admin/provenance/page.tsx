"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { provenanceTone } from "@/components/admin/admin-format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { verifyProvenanceUpload, type ProvenanceResult } from "@/lib/api/admin";

export default function AdminProvenancePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ProvenanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setChecking] = useState(false);

  async function handleVerify() {
    if (!file) {
      setError("Pilih file gambar terlebih dahulu.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }

    setError(null);
    setChecking(true);
    const nextResult = await verifyProvenanceUpload(file);
    setResult(nextResult);
    setChecking(false);
  }

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Stegano verification"
        title="Provenance checker"
        description="Upload gambar hasil generate untuk membaca metadata tersembunyi dan status signature. Backend akan melakukan verifikasi final."
      />

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1fr]">
        <Panel className="p-5">
          <div className="grid min-h-56 place-items-center rounded-[1.5rem] border border-dashed border-primary/35 bg-primary/5 p-6 text-center">
            <div>
              <UploadCloud className="mx-auto h-10 w-10 text-primary" />
              <h2 className="mt-4 text-lg font-black">Upload gambar</h2>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">Format MVP: JPG, PNG, WebP. File non-image ditolak sebelum submit.</p>
              <input
                className="mt-5 block w-full cursor-pointer rounded-ui border border-border/55 bg-background/70 text-sm font-semibold file:mr-3 file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-bold file:text-primary-foreground"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null);
                  setResult(null);
                  setError(null);
                }}
              />
              {file ? <p className="mt-3 text-xs font-bold text-muted-foreground">Dipilih: {file.name}</p> : null}
              {error ? <p className="mt-3 text-sm font-bold text-destructive">{error}</p> : null}
              <Button className="mt-5 w-full" disabled={isChecking} onClick={handleVerify}>
                {isChecking ? "Mengecek..." : "Verifikasi file"}
              </Button>
            </div>
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Hasil verifikasi</h2>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">Status akan menampilkan valid, missing, invalid, mismatch, atau unsupported.</p>
            </div>
            {result ? <Badge tone={provenanceTone(result.status)}>{result.status}</Badge> : <Badge>belum dicek</Badge>}
          </div>

          {result ? (
            <div className="mt-5 grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Check label="Signature" value={result.checks.signature_valid} />
                <Check label="Database" value={result.checks.matched_database_record} />
                <Check label="User" value={result.checks.matched_user} />
                <Check label="Feature" value={result.checks.matched_feature} />
              </div>
              <pre className="max-h-96 overflow-auto rounded-ui bg-background/70 p-4 text-xs font-semibold leading-5 text-muted-foreground">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="mt-8 rounded-ui border border-border/45 bg-background/45 p-5 text-sm font-semibold text-muted-foreground">
              Belum ada file yang diverifikasi.
            </div>
          )}
        </Panel>
      </div>
    </AdminShell>
  );
}

function Check({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="rounded-ui border border-border/45 bg-background/45 p-3">
      <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
      <p className={value ? "mt-1 font-black text-success" : "mt-1 font-black text-destructive"}>{value ? "OK" : "Belum valid"}</p>
    </div>
  );
}
