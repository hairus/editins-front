"use client";

import { type ReactNode, useMemo, useState } from "react";
import { CheckCircle2, Download, ImageIcon, ImageUp, Loader2, RotateCcw, Sparkles, Wand2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/field";
import { Panel } from "@/components/ui/panel";
import type { Feature } from "@/types/editins";

type StudioMode = {
  background: string;
  ratio: string;
  style: string;
};

const defaults: Record<Feature["slug"], StudioMode> = {
  "foto-produk": { background: "Studio daylight", ratio: "1:1 marketplace", style: "Natural catalog" },
  "hapus-bg": { background: "Transparent PNG", ratio: "Original", style: "Clean edge" },
  "banner-promo": { background: "Promo shelf", ratio: "4:5 social", style: "Bold sale" },
};

export function GenerationStudio({ feature }: { feature: Feature }) {
  const [fileName, setFileName] = useState("belum ada file");
  const [isGenerating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState(defaults[feature.slug]);

  const isBanner = feature.slug === "banner-promo";
  const isRemoveBg = feature.slug === "hapus-bg";

  const previewLabel = useMemo(() => {
    if (isRemoveBg) return "PNG transparan";
    if (isBanner) return mode.ratio;
    return mode.background;
  }, [isBanner, isRemoveBg, mode.background, mode.ratio]);

  function simulateGenerate() {
    setGenerating(true);
    setProgress(14);
    const steps = [34, 57, 78, 100];
    steps.forEach((step, index) => {
      window.setTimeout(() => {
        setProgress(step);
        if (step === 100) {
          window.setTimeout(() => setGenerating(false), 450);
        }
      }, 480 * (index + 1));
    });
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[0.82fr_1.18fr]">
      <Panel className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">{feature.title}</p>
          <Badge tone={feature.credits > 1 ? "warning" : "success"}>{feature.credits} kredit</Badge>
        </div>

        <div className="mt-6 space-y-6">
          <StudioStep number={1} title="Bahan gambar" meta="Max 5">
            <label className="grid min-h-24 cursor-pointer place-items-center rounded-ui border border-dashed border-input/55 bg-background/45 p-4 text-center transition hover:border-primary/40 hover:bg-primary/5">
              <input
                className="sr-only"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "belum ada file")}
              />
              <span className="grid place-items-center gap-2">
                <span className="grid h-11 w-11 place-items-center rounded-ui bg-muted text-muted-foreground">
                  <ImageUp className="h-5 w-5" />
                </span>
                <span className="max-w-full break-words text-xs font-semibold text-muted-foreground">{fileName}</span>
              </span>
            </label>
          </StudioStep>

          {isBanner ? (
            <StudioStep number={2} title="Teks promo">
              <Input id="headline" maxLength={20} placeholder="DISKON 30%" />
            </StudioStep>
          ) : null}

          <StudioStep number={isBanner ? 3 : 2} title="Instruksi visual">
            <div className="relative">
              <Textarea id="notes" placeholder="Contoh: latar cerah, bayangan natural, warna produk tetap akurat." />
              <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-ui border border-primary/20 bg-primary/10 text-primary">
                <Wand2 className="h-4 w-4" />
              </span>
            </div>
          </StudioStep>

          <StudioStep number={isBanner ? 4 : 3} title="Gaya dan rasio">
            <div className="grid gap-3">
              <Select
                id="style"
                value={mode.style}
                onChange={(event) => setMode((current) => ({ ...current, style: event.target.value }))}
              >
                <option>Natural catalog</option>
                <option>Luxury counter</option>
                <option>Warm kitchen</option>
                <option>Bold sale</option>
                <option>Clean edge</option>
              </Select>
              <div className="grid grid-cols-4 gap-2 rounded-ui border border-border/55 bg-background/40 p-1.5">
                {[
                  { label: "1:1", value: "1:1 marketplace" },
                  { label: "4:5", value: "4:5 social" },
                  { label: "16:9", value: "16:9 banner" },
                  { label: "Ori", value: "Original" },
                ].map((ratio) => (
                  <button
                    key={ratio.value}
                    type="button"
                    className={
                      mode.ratio === ratio.value
                        ? "min-h-10 rounded-ui bg-primary px-2 text-xs font-semibold text-primary-foreground shadow-soft"
                        : "min-h-10 rounded-ui bg-card/80 px-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    }
                    onClick={() => setMode((current) => ({ ...current, ratio: ratio.value }))}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>
          </StudioStep>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
          <Button className="min-h-12 w-full" disabled={isGenerating} onClick={simulateGenerate}>
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isGenerating ? "Memproses" : "Mulai Generate"}
          </Button>
          <Button className="min-h-12 w-full sm:w-12" variant="outline" aria-label="Reset">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </Panel>

      <Panel className="overflow-hidden">
        <div className="relative grid min-h-[390px] place-items-center overflow-hidden border-b border-border/45 bg-[linear-gradient(145deg,hsl(var(--card))_0%,hsl(var(--muted)/.42)_100%)] p-8 text-center">
          <div className="absolute inset-x-8 top-8 h-px bg-border/60" />
          <div className="absolute inset-x-8 bottom-8 h-px bg-border/40" />
          <div className="absolute inset-y-8 left-8 w-px bg-border/40" />
          <div className="absolute inset-y-8 right-8 w-px bg-border/40" />

          {isGenerating ? (
            <div className="relative z-10 grid place-items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-ui border border-warning/25 bg-warning/10 text-warning">
                <Loader2 className="h-7 w-7 animate-spin" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Menyusun hasil</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">{progress}% selesai</p>
              </div>
            </div>
          ) : (
            <div className="relative z-10 grid max-w-sm place-items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-ui border border-primary/15 bg-primary/10 text-primary shadow-soft">
                <ImageIcon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Belum ada hasil</p>
                <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
                  Pilih gambar, atur gaya, lalu generate untuk melihat output {feature.output}.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Format", value: previewLabel, tone: "accent" as const },
            { label: "Estimasi", value: feature.eta, tone: "neutral" as const },
            { label: "Validasi", value: "ready", tone: "success" as const },
            { label: "Queue", value: isGenerating ? "running" : "standby", tone: isGenerating ? ("warning" as const) : ("neutral" as const) },
          ].map((item) => (
            <div key={item.label} className="rounded-ui border border-border/45 bg-background/42 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{item.label}</p>
              <Badge className="mt-2" tone={item.tone}>
                {item.value}
              </Badge>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-border/45 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Guardrail refund dan rate-limit siap mengikuti API Laravel.
          </div>
          <Button className="w-full sm:w-auto" variant="secondary">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </Panel>
    </div>
  );
}

function StudioStep({
  number,
  title,
  meta,
  children,
}: {
  number: number;
  title: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {number}
          </span>
          <h2 className="truncate text-sm font-semibold text-foreground">{title}</h2>
        </div>
        {meta ? <span className="rounded-ui bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">{meta}</span> : null}
      </div>
      {children}
    </section>
  );
}
