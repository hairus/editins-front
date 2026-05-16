"use client";

import { useMemo, useState } from "react";
import { Download, ImageUp, Loader2, RotateCcw, Sparkles } from "lucide-react";

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
    <div className="grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
      <Panel className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Badge tone={feature.credits > 1 ? "warning" : "success"}>{feature.credits} kredit</Badge>
            <h2 className="mt-3 text-2xl font-black tracking-normal">{feature.title}</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">{feature.description}</p>
          </div>
        </div>

        <label className="mt-5 grid min-h-44 cursor-pointer place-items-center rounded-ui border border-dashed border-border bg-background/25 p-5 text-center transition hover:border-primary/45 hover:bg-muted/40">
          <input
            className="sr-only"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "belum ada file")}
          />
          <span className="grid place-items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-ui bg-muted text-foreground">
              <ImageUp className="h-5 w-5" />
            </span>
            <span className="text-sm font-black">Upload foto produk</span>
            <span className="max-w-full break-words text-xs font-semibold text-muted-foreground">{fileName}</span>
          </span>
        </label>

        <div className="mt-5 grid gap-4">
          {isBanner ? (
            <div>
              <label className="text-sm font-black" htmlFor="headline">
                Teks promo
              </label>
              <Input id="headline" maxLength={20} placeholder="DISKON 30%" />
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-black" htmlFor="style">
                Gaya
              </label>
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
            </div>
            <div>
              <label className="text-sm font-black" htmlFor="ratio">
                Rasio
              </label>
              <Select
                id="ratio"
                value={mode.ratio}
                onChange={(event) => setMode((current) => ({ ...current, ratio: event.target.value }))}
              >
                <option>1:1 marketplace</option>
                <option>4:5 social</option>
                <option>16:9 banner</option>
                <option>Original</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-black" htmlFor="notes">
              Catatan opsional
            </label>
            <Textarea id="notes" placeholder="Contoh: pertahankan warna asli produk, latar meja kayu terang." />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button className="w-full sm:w-auto" disabled={isGenerating} onClick={simulateGenerate}>
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate
          </Button>
          <Button className="w-full sm:w-auto" variant="outline">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </Panel>

      <Panel className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-black">Preview output</p>
            <p className="text-xs font-semibold text-muted-foreground">{feature.output}</p>
          </div>
          <Badge tone={isGenerating ? "warning" : "accent"}>{isGenerating ? `${progress}%` : previewLabel}</Badge>
        </div>
        <div className="grid gap-4 p-4 lg:grid-cols-[1fr_0.72fr]">
          <div
            className={
              isRemoveBg
                ? "grid aspect-square place-items-center rounded-ui border border-border bg-[linear-gradient(45deg,hsl(var(--muted))_25%,transparent_25%),linear-gradient(-45deg,hsl(var(--muted))_25%,transparent_25%),linear-gradient(45deg,transparent_75%,hsl(var(--muted))_75%),linear-gradient(-45deg,transparent_75%,hsl(var(--muted))_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0]"
                : "grid aspect-square place-items-center rounded-ui border border-border bg-[linear-gradient(145deg,hsl(var(--background))_0%,hsl(var(--muted))_100%)]"
            }
          >
            <div className="relative h-44 w-36 rounded-[28px] border border-foreground/20 bg-foreground/18 shadow-[0_38px_80px_-38px_hsl(var(--primary)/.72)]">
              {isGenerating ? <div className="absolute inset-0 animate-pulse rounded-[28px] bg-white/30" /> : null}
              <div className="absolute left-6 top-7 h-20 w-12 rounded-full bg-white/22 blur-sm" />
              <div className="absolute bottom-6 left-1/2 h-5 w-16 -translate-x-1/2 rounded-full bg-white/75" />
            </div>
          </div>
          <div className="space-y-3">
            {["Client validation", "Laravel API handoff", "Queue progress", "Credit refund path"].map((item, index) => (
              <div key={item} className="rounded-ui border border-border bg-background/55 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-black">{item}</p>
                  <Badge tone={index < 2 ? "success" : "neutral"}>{index < 2 ? "ready" : "stub"}</Badge>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="secondary">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
