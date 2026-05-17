"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, CreditCard, Download, Eye, ImageIcon, ImageUp, Loader2, RotateCcw, Sparkles, Trash2, Wand2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { Panel } from "@/components/ui/panel";
import { useAuth } from "@/components/auth-provider";
import { GenerateApiError, generateImage, type GenerateImageResult } from "@/lib/api/generate";
import { notifyApp } from "@/lib/notify";
import type { Feature } from "@/types/editins";

type StudioMode = {
  background: string;
  ratio: string;
  style: string;
};

const defaults: Record<Feature["slug"], StudioMode> = {
  "foto-produk": { background: "Studio daylight", ratio: "1:1 marketplace", style: "Natural catalog" },
  "produk-model": { background: "Lifestyle campaign", ratio: "4:5 social", style: "Natural catalog" },
  "gabung-foto": { background: "Unified campaign scene", ratio: "4:5 social", style: "Natural catalog" },
  "foto-miniatur": { background: "Marketplace thumbnail", ratio: "1:1 marketplace", style: "Bold sale" },
  "perluas-foto": { background: "Extended studio canvas", ratio: "16:9 banner", style: "Natural catalog" },
  "edit-foto": { background: "Custom edit", ratio: "1:1 marketplace", style: "Natural catalog" },
  "perbaiki-foto": { background: "Clean enhancement", ratio: "Original", style: "Natural catalog" },
  "face-swap": { background: "Consented model campaign", ratio: "4:5 social", style: "Natural catalog" },
  "foto-artis": { background: "Premium talent studio", ratio: "4:5 social", style: "Luxury counter" },
  "foto-fashion": { background: "Fashion catalog", ratio: "4:5 social", style: "Natural catalog" },
  "carousel-marketplace": { background: "Marketplace carousel", ratio: "1:1 marketplace", style: "Bold sale" },
  "foto-makanan": { background: "Warm table setup", ratio: "4:5 social", style: "Warm kitchen" },
  "buat-mockup": { background: "Realistic mockup scene", ratio: "1:1 marketplace", style: "Natural catalog" },
  "pov-tangan": { background: "Handheld POV", ratio: "4:5 social", style: "Natural catalog" },
  "foto-4x6": { background: "Soft blue ID background", ratio: "4x6 portrait", style: "Formal ID photo" },
  "hapus-bg": { background: "Transparent PNG", ratio: "Original", style: "Clean edge" },
  "banner-promo": { background: "Promo shelf", ratio: "4:5 social", style: "Bold sale" },
};

const styleOptions = [
  { label: "Katalog natural", value: "Natural catalog" },
  { label: "Meja premium", value: "Luxury counter" },
  { label: "Dapur hangat", value: "Warm kitchen" },
  { label: "Promo tegas", value: "Bold sale" },
  { label: "Tepi bersih", value: "Clean edge" },
];

export function GenerationStudio({ feature }: { feature: Feature }) {
  const { user, isLoading, refreshUser } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedPreviewUrls, setSelectedPreviewUrls] = useState<string[]>([]);
  const [uploadInputKey, setUploadInputKey] = useState(0);
  const [instruction, setInstruction] = useState("");
  const [promoText, setPromoText] = useState("");
  const [useMockMode, setUseMockMode] = useState(true);
  const [isGenerating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState(defaults[feature.slug]);
  const [result, setResult] = useState<GenerateImageResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [quotaDialog, setQuotaDialog] = useState<{ message: string; upgradeUrl: string } | null>(null);

  const isBanner = feature.slug === "banner-promo";
  const isPhoto46 = feature.slug === "foto-4x6";
  const isRemoveBg = feature.slug === "hapus-bg";
  const isProductModel = feature.slug === "produk-model" || feature.slug === "gabung-foto" || feature.slug === "face-swap";
  const isCarousel = feature.slug === "carousel-marketplace";
  const isFood = feature.slug === "foto-makanan";
  const isFashion = feature.slug === "foto-fashion";
  const isGenerateDisabled = isGenerating || isLoading;

  useEffect(() => {
    if (selectedFiles.length === 0) {
      setSelectedPreviewUrls([]);
      return;
    }

    const objectUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setSelectedPreviewUrls(objectUrls);

    return () => objectUrls.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
  }, [selectedFiles]);

  useEffect(() => {
    if (!isPreviewOpen && !quotaDialog) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPreviewOpen(false);
        setQuotaDialog(null);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPreviewOpen, quotaDialog]);

  const previewLabel = useMemo(() => {
    if (isRemoveBg) return "PNG transparan";
    if (isBanner) return mode.ratio;
    return mode.background;
  }, [isBanner, isRemoveBg, mode.background, mode.ratio]);

  async function handleGenerate() {
    if (isLoading) {
      setErrorMessage("Tunggu sebentar, akun sedang diperiksa.");
      return;
    }

    if (!user && !isLoading) {
      const nextUser = await refreshUser().catch(() => null);

      if (!nextUser) {
        setQuotaDialog({
          message: "Pilih paket langganan dulu agar hasil foto, kredit, dan riwayat tersimpan aman di akun Anda.",
          upgradeUrl: "/billing",
        });
        return;
      }
    }

    if (isProductModel && selectedFiles.length < 2) {
      setErrorMessage("Upload minimal 2 foto: foto produk dan foto model/referensi untuk digabung.");
      return;
    }

    if (isPhoto46 && selectedFiles.length === 0) {
      setErrorMessage("Upload foto wajah dulu sebelum generate Foto 4x6.");
      return;
    }

    const preparedInstruction = buildInstruction();

    setGenerating(true);
    setErrorMessage(null);
    setQuotaDialog(null);
    setResult(null);
    setPreviewOpen(false);
    setProgress(14);

    const timer = window.setInterval(() => {
      setProgress((current) => Math.min(current + 9, 88));
    }, 850);

    try {
      const generated = await generateImage({
        feature: feature.slug,
        instruction: preparedInstruction,
        aspectRatio: aspectRatioFor(mode.ratio),
        mockMode: useMockMode,
        images: selectedFiles,
      });

      setProgress(100);
      setResult(generated);
      await refreshUser().catch(() => undefined);
    } catch (error) {
      if (error instanceof GenerateApiError && error.code === "insufficient_credits") {
        notifyApp({
          title: "Kredit belum cukup",
          detail: error.message || "Kuota habis. Tambah kredit untuk lanjut membuat foto.",
          tone: "danger",
        });
        setQuotaDialog({
          message: error.message || "Kuota habis. Upgrade ke Pro untuk lanjut!",
          upgradeUrl: error.upgradeUrl ?? "/billing",
        });
        return;
      }

      const message = error instanceof Error ? error.message : "Pembuatan foto gagal. Coba ulang beberapa saat lagi.";
      notifyApp({
        title: "Pembuatan foto gagal",
        detail: message,
        tone: "danger",
      });
      setErrorMessage(message);
    } finally {
      window.clearInterval(timer);
      window.setTimeout(() => setGenerating(false), 350);
    }
  }

  function handleFileChange(fileList: FileList | null) {
    const files = Array.from(fileList ?? []).slice(0, 5);

    setSelectedFiles(files);
    setResult(null);
    setErrorMessage(null);
    setQuotaDialog(null);
  }

  function handleRemoveFile() {
    setSelectedFiles([]);
    setUploadInputKey((current) => current + 1);
    setResult(null);
    setPreviewOpen(false);
    setErrorMessage(null);
    setQuotaDialog(null);
  }

  function buildInstruction() {
    const baseInstruction = instruction.trim() || defaultInstructionFor(feature.slug);

    if (isProductModel) {
      return [
        feature.slug === "face-swap"
          ? "Create a consented model/face reference edit for an Indonesian UMKM campaign image. Do not impersonate celebrities or public figures."
          : "Combine multiple uploaded references into one ecommerce campaign image.",
        feature.slug === "face-swap"
          ? "Use image 1 as the campaign/model base and image 2 as the consented face/reference only when appropriate. If unsafe, create a generic professional model look."
          : "Use image 1 as the exact product reference and image 2 as model/pose/lifestyle reference.",
        "Keep product details accurate and make the result natural, premium, and ready for Indonesian marketplace selling.",
        `Selected style: ${mode.style}. Background: ${mode.background}. Ratio: ${mode.ratio}.`,
        `User instruction: ${baseInstruction}`,
      ].join("\n");
    }

    if (["foto-miniatur", "perluas-foto", "edit-foto", "perbaiki-foto", "foto-artis", "buat-mockup", "pov-tangan"].includes(feature.slug)) {
      return [
        `Run the ${feature.title} workflow for Indonesian UMKM selling visuals.`,
        "Preserve the product truthfully and follow the user's requested edit style.",
        "For Foto Artis, create a premium talent/brand ambassador style without copying any real celebrity or public figure.",
        `Selected style: ${mode.style}. Background: ${mode.background}. Ratio: ${mode.ratio}.`,
        `User instruction: ${baseInstruction}`,
      ].join("\n");
    }

    if (isCarousel) {
      return [
        "Create a marketplace carousel cover or multi-section visual from the uploaded product photo.",
        "Use clear Indonesian ecommerce layout, benefit blocks, mobile-readable hierarchy, and product-first composition.",
        `Selected style: ${mode.style}. Background: ${mode.background}. Ratio: ${mode.ratio}.`,
        `User instruction: ${baseInstruction}`,
      ].join("\n");
    }

    if (isFood) {
      return [
        "Enhance the uploaded food photo into an appetizing but realistic menu/catalog image.",
        "Keep the dish identity and portion believable while improving lighting, plating, freshness, and background.",
        `Selected style: ${mode.style}. Background: ${mode.background}. Ratio: ${mode.ratio}.`,
        `User instruction: ${baseInstruction}`,
      ].join("\n");
    }

    if (isFashion) {
      return [
        "Edit the uploaded fashion product into a marketplace catalog image.",
        "Keep fabric, color, pattern, cut, logo, and material accurate while improving presentation and lighting.",
        `Selected style: ${mode.style}. Background: ${mode.background}. Ratio: ${mode.ratio}.`,
        `User instruction: ${baseInstruction}`,
      ].join("\n");
    }

    if (isPhoto46) {
      return [
        "Create an Indonesian formal 4x6 ID photo from the uploaded face photo.",
        "Use portrait composition, centered face, clean shoulders, soft neutral blue background, natural skin tone, and professional lighting.",
        "Do not change the person's identity, facial structure, or important facial features.",
        `Selected style: ${mode.style}. Background: ${mode.background}.`,
        `User instruction: ${baseInstruction}`,
      ].join("\n");
    }

    if (isBanner) {
      return [
        "Create an Indonesian ecommerce promotional banner.",
        promoText.trim() ? `Use this exact promo text: ${promoText.trim()}` : "Use minimal generic promo text only if needed.",
        baseInstruction,
        `Selected style: ${mode.style}. Background: ${mode.background}. Ratio: ${mode.ratio}.`,
      ].join("\n");
    }

    return [
      baseInstruction,
      `Selected style: ${mode.style}. Background: ${mode.background}. Ratio: ${mode.ratio}.`,
    ].join("\n");
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[0.82fr_1.18fr]">
      <Panel className="border-border/70 bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-foreground">{feature.title}</p>
            <Badge tone={feature.credits > 1 ? "warning" : "success"}>{feature.credits} kredit</Badge>
          </div>
          <div className="grid grid-cols-2 gap-1 rounded-ui border border-border/55 bg-background/40 p-1">
            <button
              type="button"
              aria-pressed={useMockMode}
              className={
                useMockMode
                  ? "min-h-9 rounded-ui bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-soft"
                  : "min-h-9 rounded-ui px-3 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
              }
              onClick={() => setUseMockMode(true)}
            >
              Mockup
            </button>
            <button
              type="button"
              aria-pressed={!useMockMode}
              className={
                !useMockMode
                  ? "min-h-9 rounded-ui bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-soft"
                  : "min-h-9 rounded-ui px-3 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
              }
              onClick={() => setUseMockMode(false)}
            >
              Mode utama
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <StudioStep number={1} title="Bahan gambar" meta={isProductModel ? "Min 2, max 5" : "Max 5"}>
            <div className="relative">
              <label className="grid min-h-24 cursor-pointer place-items-center overflow-hidden rounded-ui border border-dashed border-input/70 bg-background/75 p-3 text-center transition hover:border-primary/45 hover:bg-primary/5">
                <input
                  key={uploadInputKey}
                  className="sr-only"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={(event) => handleFileChange(event.target.files)}
                />
                <span className="grid w-full place-items-center gap-2">
                  {selectedPreviewUrls.length > 0 ? (
                    <span className={selectedPreviewUrls.length > 1 ? "grid w-full grid-cols-2 gap-2" : "grid w-full gap-2"}>
                      {selectedPreviewUrls.map((previewUrl, index) => (
                        <span key={previewUrl} className="relative block w-full overflow-hidden rounded-ui border border-border/55 bg-card shadow-soft">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewUrl}
                            alt={`Preview bahan gambar ${index + 1}`}
                            className={isPhoto46 ? "mx-auto max-h-52 w-auto object-contain" : "max-h-40 w-full object-contain"}
                          />
                          <span className="absolute left-2 top-2 rounded-full bg-background/86 px-2 py-0.5 text-[10px] font-black text-muted-foreground shadow-soft">
                            {index === 0 && isProductModel ? "Produk" : index === 1 && isProductModel ? "Referensi" : `Foto ${index + 1}`}
                          </span>
                        </span>
                      ))}
                    </span>
                  ) : (
                    <>
                      <span className="grid h-11 w-11 place-items-center rounded-ui bg-muted text-muted-foreground">
                        <ImageUp className="h-5 w-5" />
                      </span>
                      <span className="max-w-full break-words text-xs font-semibold text-muted-foreground">
                        {isProductModel ? "Klik untuk upload produk + model/referensi" : "Klik untuk upload gambar"}
                      </span>
                    </>
                  )}
                </span>
              </label>
              {selectedPreviewUrls.length > 0 ? (
                <button
                  type="button"
                  className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-ui border border-destructive/20 bg-background/90 text-destructive shadow-soft backdrop-blur transition hover:bg-destructive hover:text-destructive-foreground"
                  title="Hapus foto"
                  aria-label="Hapus foto"
                  onClick={handleRemoveFile}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </StudioStep>

          {isBanner ? (
            <StudioStep number={2} title="Teks promo">
              <Input
                id="headline"
                maxLength={20}
                placeholder="DISKON 30%"
                value={promoText}
                onChange={(event) => setPromoText(event.target.value)}
              />
            </StudioStep>
          ) : null}

          <StudioStep number={isBanner ? 3 : 2} title="Instruksi visual">
            <div className="relative">
              <Textarea
                className="min-h-32 pb-11 soft-scrollbar"
                id="notes"
                value={instruction}
                placeholder={
                  isPhoto46
                    ? "Contoh: latar biru muda, wajah tetap natural, kemeja terlihat rapi."
                    : isRemoveBg
                      ? "Contoh: hapus background, pertahankan detail rambut/produk, hasil bersih siap PNG."
                    : "Contoh: latar cerah, bayangan natural, warna produk tetap akurat."
                }
                onChange={(event) => setInstruction(event.target.value)}
              />
              <span className="pointer-events-none absolute bottom-2 left-2 grid h-8 w-8 place-items-center rounded-ui border border-primary/15 bg-primary/10 text-primary/80">
                <Wand2 className="h-4 w-4" />
              </span>
            </div>
          </StudioStep>

          <StudioStep number={isBanner ? 4 : 3} title="Gaya visual dan rasio">
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-2 rounded-ui border border-border/65 bg-background/75 p-1.5 sm:grid-cols-3">
                {styleOptions.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    aria-pressed={mode.style === style.value}
                    className={
                      mode.style === style.value
                        ? "min-h-11 rounded-ui border border-primary/15 bg-[linear-gradient(135deg,hsl(var(--primary)/.92)_0%,hsl(var(--primary)/.82)_48%,hsl(var(--accent)/.62)_100%)] px-2 py-2 text-xs font-semibold leading-4 text-primary-foreground shadow-soft"
                        : "min-h-11 rounded-ui bg-card/80 px-2 py-2 text-xs font-semibold leading-4 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    }
                    onClick={() => setMode((current) => ({ ...current, style: style.value }))}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
              <div
                className={
                  isPhoto46
                    ? "grid grid-cols-5 gap-2 rounded-ui border border-border/55 bg-background/40 p-1.5"
                    : "grid grid-cols-4 gap-2 rounded-ui border border-border/65 bg-background/75 p-1.5"
                }
              >
                {[
                  { label: "Kotak", value: "1:1 marketplace" },
                  ...(isPhoto46 ? [{ label: "4x6", value: "4x6 portrait" }] : []),
                  { label: "Sosial", value: "4:5 social" },
                  { label: "Banner", value: "16:9 banner" },
                  { label: "Asli", value: "Original" },
                ].map((ratio) => (
                  <button
                    key={ratio.value}
                    type="button"
                    className={
                      mode.ratio === ratio.value
                        ? "min-h-10 rounded-ui border border-primary/15 bg-[linear-gradient(135deg,hsl(var(--primary)/.92)_0%,hsl(var(--primary)/.82)_48%,hsl(var(--accent)/.62)_100%)] px-2 text-xs font-semibold text-primary-foreground shadow-soft"
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
          <Button className="min-h-12 w-full" disabled={isGenerateDisabled} onClick={handleGenerate}>
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isGenerating ? "Memproses" : "Buat foto"}
          </Button>
          <Button
            className="min-h-12 w-full sm:w-12"
            variant="outline"
            aria-label="Reset"
            onClick={() => {
              setSelectedFiles([]);
              setUploadInputKey((current) => current + 1);
              setInstruction("");
              setPromoText("");
              setResult(null);
              setPreviewOpen(false);
              setErrorMessage(null);
              setQuotaDialog(null);
              setProgress(0);
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {errorMessage ? (
          <div className="mt-4 rounded-ui border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
            {errorMessage}
          </div>
        ) : null}
      </Panel>

      <Panel className="overflow-hidden border-border/70 bg-card shadow-soft">
        <div className="relative grid min-h-[390px] place-items-center overflow-hidden border-b border-border/55 bg-[linear-gradient(145deg,hsl(var(--background))_0%,hsl(var(--card))_58%,hsl(var(--muted)/.54)_100%)] p-8 text-center">
          <div className="absolute inset-x-8 top-8 h-px bg-border/60" />
          <div className="absolute inset-x-8 bottom-8 h-px bg-border/40" />
          <div className="absolute inset-y-8 left-8 w-px bg-border/40" />
          <div className="absolute inset-y-8 right-8 w-px bg-border/40" />

          {isGenerating ? (
            <div className="relative z-10 grid place-items-center gap-4">
              <div className="relative grid h-20 w-20 place-items-center rounded-ui border border-primary/20 bg-card/86 shadow-panel">
                <span className="absolute inset-0 rounded-ui border border-primary/20 animate-ping" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-cropped.png" alt="Editins loading" className="relative h-11 w-14 object-contain animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Menyusun hasil</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">{progress}% selesai</p>
              </div>
            </div>
          ) : result ? (
            <div className="relative z-10 grid w-full max-w-sm gap-4">
              <div className="relative overflow-hidden rounded-ui border border-border/55 bg-card shadow-panel">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.output_url} alt={`Hasil ${feature.title}`} className="h-auto w-full object-contain" />
                <div className="absolute right-2 top-2 flex gap-2">
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-ui border border-border/55 bg-background/90 text-foreground shadow-soft backdrop-blur transition hover:bg-primary hover:text-primary-foreground"
                    title="Lihat foto"
                    aria-label="Lihat foto"
                    onClick={() => setPreviewOpen(true)}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <a
                    className="grid h-10 w-10 place-items-center rounded-ui border border-border/55 bg-background/90 text-foreground shadow-soft backdrop-blur transition hover:bg-primary hover:text-primary-foreground"
                    href={result.download_url ?? result.output_url}
                    download={`editins-${result.generation_id}.png`}
                    title="Download foto"
                    aria-label="Download foto"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Hasil siap</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">{result.model}</p>
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
                  Pilih gambar, atur gaya, lalu mulai buat foto untuk melihat hasil {feature.output}.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Format", value: previewLabel, tone: "accent" as const },
            { label: "Estimasi", value: feature.eta, tone: "neutral" as const },
            { label: "Mode", value: useMockMode ? "mockup" : "utama", tone: useMockMode ? ("warning" as const) : ("success" as const) },
            { label: "Antrian", value: isGenerating ? "berjalan" : "siap", tone: isGenerating ? ("warning" as const) : ("neutral" as const) },
          ].map((item) => (
            <div key={item.label} className="rounded-ui border border-border/60 bg-background/70 p-3">
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
            Kredit dan riwayat akan otomatis mengikuti akun yang sedang aktif.
          </div>
        </div>
      </Panel>
      {result && isPreviewOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/70 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="result-preview-title"
          onMouseDown={() => setPreviewOpen(false)}
        >
          <h2 id="result-preview-title" className="sr-only">Preview hasil</h2>
          <button
            type="button"
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-background/90 text-foreground shadow-soft backdrop-blur transition hover:bg-secondary hover:text-secondary-foreground"
            title="Tutup preview"
            aria-label="Tutup preview"
            onClick={() => setPreviewOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.output_url}
            alt={`Preview hasil ${feature.title}`}
            className="max-h-[92vh] w-auto max-w-full object-contain"
            onMouseDown={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
      {quotaDialog ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/55 p-4 backdrop-blur-md"
          role="presentation"
          onMouseDown={() => setQuotaDialog(null)}
        >
          <section
            aria-labelledby="quota-dialog-title"
            aria-modal="true"
            className="w-full max-w-md overflow-hidden rounded-ui border border-warning/35 bg-card shadow-panel"
            role="dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="border-b border-border/45 p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-ui bg-warning/14 text-warning">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <button
                  type="button"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-ui text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  title="Tutup dialog"
                  aria-label="Tutup dialog"
                  onClick={() => setQuotaDialog(null)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h2 id="quota-dialog-title" className="mt-5 text-xl font-semibold text-foreground">
                {user ? "Kuota habis" : "Langganan dulu"}
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">{quotaDialog.message}</p>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-[1fr_auto]">
              <Link href={quotaDialog.upgradeUrl} onClick={() => setQuotaDialog(null)}>
                <Button className="w-full">
                  <CreditCard className="h-4 w-4" />
                  Lihat Langganan
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setQuotaDialog(null)}>
                Nanti dulu
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function aspectRatioFor(ratio: string) {
  if (ratio === "4x6 portrait") return "2:3";
  if (ratio.startsWith("1:1")) return "1:1";
  if (ratio.startsWith("4:5")) return "4:5";
  if (ratio.startsWith("16:9")) return "16:9";
  return null;
}

function defaultInstructionFor(slug: Feature["slug"]) {
  if (slug === "gabung-foto") {
    return "Gabungkan beberapa foto menjadi satu visual jualan yang natural. Foto pertama adalah produk utama, foto berikutnya sebagai referensi gaya, model, atau suasana.";
  }

  if (slug === "foto-miniatur") {
    return "Buat thumbnail produk yang kuat, jelas, dan mudah menarik perhatian di marketplace atau sosial media.";
  }

  if (slug === "perluas-foto") {
    return "Perluas kanvas foto agar cocok untuk banner atau rasio sosial media tanpa mengubah produk utama.";
  }

  if (slug === "edit-foto") {
    return "Edit foto sesuai kebutuhan jualan: rapikan latar, komposisi, cahaya, atau detail kecil tanpa mengubah produk.";
  }

  if (slug === "perbaiki-foto") {
    return "Perbaiki foto yang gelap, buram, kusam, atau kurang rapi agar lebih layak untuk katalog jualan.";
  }

  if (slug === "face-swap") {
    return "Gunakan hanya foto milik sendiri atau berizin. Buat hasil model campaign yang natural tanpa meniru artis atau orang publik.";
  }

  if (slug === "foto-artis") {
    return "Buat visual bergaya talent profesional premium tanpa meniru wajah artis nyata atau public figure tertentu.";
  }

  if (slug === "buat-mockup") {
    return "Tempatkan produk, label, logo, atau desain ke mockup realistis seperti kemasan, kaos, botol, poster, atau display toko.";
  }

  if (slug === "pov-tangan") {
    return "Buat gaya POV tangan memegang, menunjuk, membuka, atau menunjukkan produk secara natural dan jelas.";
  }

  if (slug === "produk-model") {
    return "Gabungkan foto produk dengan foto model atau referensi gaya. Produk harus tetap akurat, hasil natural, dan siap untuk visual campaign marketplace.";
  }

  if (slug === "foto-fashion") {
    return "Rapikan foto fashion menjadi katalog marketplace dengan warna, bahan, pola, dan potongan tetap akurat.";
  }

  if (slug === "carousel-marketplace") {
    return "Buat cover carousel marketplace yang rapi, mudah dibaca, dan menonjolkan produk serta manfaat utama.";
  }

  if (slug === "foto-makanan") {
    return "Buat foto makanan terlihat lebih menggugah selera dengan pencahayaan hangat dan komposisi tetap realistis.";
  }

  if (slug === "foto-4x6") {
    return "Buat pas foto 4x6 formal dengan latar biru muda, wajah natural, dan pencahayaan rapi.";
  }

  if (slug === "hapus-bg") {
    return "Pisahkan objek dari background dan buat hasil bersih.";
  }

  if (slug === "banner-promo") {
    return "Buat banner promo yang rapi, mudah dibaca, dan siap untuk marketplace.";
  }

  return "Buat foto produk katalog dengan cahaya lembut, bayangan natural, dan warna produk tetap akurat.";
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
