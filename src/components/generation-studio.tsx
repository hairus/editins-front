"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, CreditCard, Download, Eye, ImageIcon, ImageUp, Loader2, RotateCcw, Sparkles, Trash2, Wand2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/field";
import { Panel } from "@/components/ui/panel";
import { useAuth } from "@/components/auth-provider";
import { GenerateApiError, generateImage, type GenerateImageResult } from "@/lib/api/generate";
import { notifyApp } from "@/lib/notify";
import type { Feature } from "@/types/editins";

type StudioMode = {
  angle?: string;
  background: string;
  ratio: string;
  style: string;
};

const defaults: Record<Feature["slug"], StudioMode> = {
  "foto-produk": { angle: "Eye-level hero", background: "Outdoor cafe lifestyle", ratio: "9:16 story", style: "Warm lifestyle" },
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
  "foto-4x6": { background: "Merah", ratio: "4x6", style: "Jas + dasi" },
  "hapus-bg": { background: "Transparent PNG", ratio: "Original", style: "Clean edge" },
  "banner-promo": { background: "Promo shelf", ratio: "4:5 social", style: "Bold sale" },
};

const styleOptions = [
  { label: "Katalog natural", value: "Natural catalog" },
  { label: "Meja premium", value: "Luxury counter" },
  { label: "Lifestyle hangat", value: "Warm lifestyle" },
  { label: "Dapur hangat", value: "Warm kitchen" },
  { label: "Promo tegas", value: "Bold sale" },
  { label: "Tepi bersih", value: "Clean edge" },
];

const productPhotoAngleOptions = [
  {
    label: "Eye-level",
    value: "Eye-level hero",
    prompt: "Eye-level hero angle as a hard camera direction: camera at product midline, natural horizon, straight commercial perspective, product front remains readable, no top-down look.",
  },
  {
    label: "Low angle",
    value: "Low angle dramatic",
    prompt: "Low angle as a hard camera direction: camera below product midline looking slightly upward, product feels taller and premium, visible dramatic side/underside perspective, no flatlay or straight-on catalog fallback, avoid warped packaging.",
  },
  {
    label: "Top view",
    value: "Top view flatlay",
    prompt: "True top-down flatlay as a hard camera direction: camera 80-90 degrees above the table, no horizon line, product and props arranged graphically on the surface, no eye-level perspective.",
  },
  {
    label: "45 derajat",
    value: "45 degree product angle",
    prompt: "Three-quarter 45-degree angle as a hard camera direction: camera sees both front label and side depth, slightly above table level, clear product volume, not a flat front view and not top-down.",
  },
  {
    label: "Close-up",
    value: "Close-up macro",
    prompt: "Close-up macro angle as a hard camera direction: tight crop, product detail dominates frame, shallow depth of field, texture/label sharp, background heavily blurred, no distant full-scene view.",
  },
  {
    label: "Lifestyle POV",
    value: "Lifestyle POV",
    prompt: "Lifestyle POV as a hard camera direction: table-side or handheld observer perspective, slightly imperfect natural framing, product in use or just reached-for, strong depth cues, no generic studio front view.",
  },
];

type ProductPhotoSceneOption = { label: string; value: string; prompt: string };

type ProductPhotoCategoryOption = {
  label: string;
  value: string;
  prompt: string;
  scenes: ProductPhotoSceneOption[];
};

const sceneCafeOutdoor = { label: "Cafe outdoor", value: "Outdoor cafe lifestyle", prompt: "Outdoor cafe terrace or lifestyle table scene, warm daylight, natural wood/stone texture, soft green or urban background blur, premium social media ambience." };
const sceneStudioClean = { label: "Studio clean", value: "Clean studio product set", prompt: "Clean studio product set with controlled softbox lighting, refined pedestal/table surface, premium shadow, uncluttered background, high-end catalog polish." };
const scenePremiumIndoor = { label: "Premium indoor", value: "Premium indoor lifestyle", prompt: "Premium indoor lifestyle setting such as boutique counter, modern kitchen, dressing table, or elegant shelf, warm practical lights, refined commercial styling." };
const sceneCrowdNatural = { label: "Crowd natural", value: "Natural crowd ambience", prompt: "Natural crowd ambience with people or activity only as soft background bokeh, product remains the clear hero, believable busy cafe/marketplace atmosphere." };
const sceneLuxuryMarble = { label: "Luxury marble", value: "Luxury marble counter", prompt: "Luxury marble counter scene with elegant stone texture, soft reflections, premium beauty or lifestyle campaign mood, refined highlights, clean upscale background." };
const sceneDarkPremium = { label: "Dark premium", value: "Dark premium editorial", prompt: "Dark premium editorial photoshoot with dramatic low-key lighting, deep shadows, warm rim light, glossy highlights, masculine or luxury brand feeling." };
const sceneNatureFresh = { label: "Nature fresh", value: "Nature fresh botanical", prompt: "Nature fresh botanical scene with leaves, natural daylight, airy background, clean organic mood, fresh healthy lifestyle styling without clutter." };
const sceneBoutiqueShelf = { label: "Boutique shelf", value: "Boutique retail shelf", prompt: "Boutique retail shelf or display counter scene, curated props, premium store ambience, soft depth of field, product presented like a high-end retail campaign." };
const sceneKitchenArtisan = { label: "Kitchen artisan", value: "Kitchen artisan table", prompt: "Kitchen artisan table scene with handmade/UMKM warmth, wooden surface, warm food styling, authentic ingredients or tools as subtle supporting props." };
const sceneMinimalJapanese = { label: "Minimal Japanese", value: "Minimal Japanese aesthetic", prompt: "Minimal Japanese-inspired aesthetic with calm neutral palette, clean negative space, natural material textures, soft daylight, quiet premium composition." };
const sceneTropicalDaylight = { label: "Tropical daylight", value: "Tropical daylight lifestyle", prompt: "Tropical daylight lifestyle scene with bright natural light, fresh summer mood, subtle outdoor greenery or poolside ambience, vibrant but premium colors." };
const sceneUrbanStreet = { label: "Urban street", value: "Urban street campaign", prompt: "Urban street campaign scene with modern city texture, concrete, storefront, or street cafe bokeh, stylish youthful marketplace/social media energy." };
const sceneWorkspacePremium = { label: "Workspace premium", value: "Premium workspace desk", prompt: "Premium workspace desk scene with laptop, notebook, or office texture as subtle props, clean productivity mood, modern professional lighting." };
const sceneGiftHamper = { label: "Gift hamper", value: "Gift hamper seasonal", prompt: "Gift hamper or seasonal gifting scene with elegant wrapping, ribbon, festive props, warm premium arrangement, suitable for bundling or limited campaign visuals." };

const productPhotoCategoryOptions: ProductPhotoCategoryOption[] = [
  { label: "UMKM umum", value: "general", prompt: "General Indonesian UMKM product: make it versatile, premium, and ready for social media selling.", scenes: [sceneCafeOutdoor, sceneStudioClean, scenePremiumIndoor, sceneCrowdNatural, sceneBoutiqueShelf, sceneGiftHamper] },
  { label: "Makanan", value: "food", prompt: "Food product: emphasize appetizing freshness, warm serving context, believable texture, and natural food styling.", scenes: [sceneKitchenArtisan, sceneCafeOutdoor, sceneDarkPremium, sceneStudioClean, sceneGiftHamper] },
  { label: "Minuman", value: "drink", prompt: "Drink product: emphasize refreshment, condensation or warmth when relevant, cafe lifestyle, glass/cup context, and inviting lighting.", scenes: [sceneCafeOutdoor, sceneTropicalDaylight, sceneNatureFresh, sceneDarkPremium, sceneStudioClean] },
  { label: "Skincare", value: "skincare", prompt: "Skincare product: emphasize clean beauty, hygiene, elegant material surfaces, soft glow, botanical or spa atmosphere.", scenes: [sceneLuxuryMarble, sceneNatureFresh, sceneMinimalJapanese, sceneBoutiqueShelf, sceneStudioClean] },
  { label: "Fashion", value: "fashion", prompt: "Fashion product: emphasize style, editorial composition, fabric/material detail, boutique or urban lifestyle energy.", scenes: [sceneUrbanStreet, sceneBoutiqueShelf, sceneStudioClean, sceneMinimalJapanese, scenePremiumIndoor] },
  { label: "Parfum", value: "perfume", prompt: "Perfume product: emphasize luxury, reflection, mystery, premium lighting, elegant mood, and refined composition.", scenes: [sceneDarkPremium, sceneLuxuryMarble, sceneBoutiqueShelf, sceneMinimalJapanese, scenePremiumIndoor] },
  { label: "Gadget", value: "gadget", prompt: "Gadget product: emphasize modern precision, clean technology surface, premium workspace, sharp silhouette, and futuristic polish.", scenes: [sceneWorkspacePremium, sceneStudioClean, sceneDarkPremium, sceneUrbanStreet, sceneMinimalJapanese] },
  { label: "Aksesoris", value: "accessory", prompt: "Accessory product: emphasize small-object detail, elegant display, premium retail surface, and refined lifestyle styling.", scenes: [sceneBoutiqueShelf, sceneLuxuryMarble, sceneMinimalJapanese, scenePremiumIndoor, sceneDarkPremium] },
  { label: "Home living", value: "home", prompt: "Home living product: emphasize calm interior mood, natural materials, everyday usability, and refined home styling.", scenes: [sceneMinimalJapanese, scenePremiumIndoor, sceneNatureFresh, sceneStudioClean, sceneGiftHamper] },
];

const productPhotoStyleGuidance: Record<string, string> = {
  "Natural catalog": "Natural catalog look: product-first, realistic color, clean lighting, minimal props, clear ecommerce readability.",
  "Luxury counter": "Luxury counter look: premium materials, elegant reflections, warm highlights, refined magazine-ad composition.",
  "Warm lifestyle": "Warm lifestyle look: cozy commercial scene, human-friendly atmosphere, cinematic depth, inviting social media feel.",
  "Warm kitchen": "Warm kitchen look: appetizing tabletop/kitchen ambience, warm light, authentic food or beverage styling when relevant.",
  "Bold sale": "Bold sale look: stronger contrast, punchy composition, energetic promotional hierarchy, but still premium and not cluttered.",
  "Clean edge": "Clean edge look: crisp cutout-like product clarity, tidy background, sharp silhouette, clean marketplace finish.",
};

const productPhotoTypographyGuidance: Record<string, string> = {
  general: "Editorial social-commerce headline, varied scale, stylish line breaks, not stiff centered text.",
  food: "Warm rounded/humanist headline, playful clean breaks, appetizing scale contrast.",
  drink: "Fresh airy bold headline, relaxed spacing, dynamic staggered lines.",
  skincare: "Clean beauty serif/light sans headline, soft premium spacing.",
  fashion: "Fashion editorial headline, oversized/asymmetrical, strong magazine contrast.",
  perfume: "Luxury serif headline, cinematic spacing, elegant scale contrast.",
  gadget: "Sharp geometric sans headline, precise alignment, bold tech contrast.",
  accessory: "Boutique serif or premium sans, refined breaks, delicate contrast.",
  home: "Calm editorial serif/humanist sans, spacious relaxed hierarchy.",
};

const pasFotoBackgroundOptions = ["Merah", "Biru", "Putih", "Kuning", "Abu-abu", "Hitam putih"];

const pasFotoClothingOptions = ["Jas + dasi", "Blazer", "Kemeja", "Sekolah"];

const pasFotoSizeOptions = [
  { label: "2x3", value: "2x3" },
  { label: "3x4", value: "3x4" },
  { label: "4x6", value: "4x6" },
  { label: "4x4", value: "4x4" },
];

export function GenerationStudio({ feature }: { feature: Feature }) {
  const { user, isLoading, refreshUser } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedPreviewUrls, setSelectedPreviewUrls] = useState<string[]>([]);
  const [uploadInputKey, setUploadInputKey] = useState(0);
  const [instruction, setInstruction] = useState("");
  const [copywriting, setCopywriting] = useState("");
  const [callToAction, setCallToAction] = useState("");
  const [productCategory, setProductCategory] = useState(productPhotoCategoryOptions[0].value);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [logoInputKey, setLogoInputKey] = useState(0);
  const [promoText, setPromoText] = useState("");
  const [useMockMode, setUseMockMode] = useState(true);
  const [isGenerating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState(defaults[feature.slug]);
  const [result, setResult] = useState<GenerateImageResult | null>(null);
  const [ctaOverlayUrl, setCtaOverlayUrl] = useState<string | null>(null);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [quotaDialog, setQuotaDialog] = useState<{ message: string; upgradeUrl: string } | null>(null);

  const isBanner = feature.slug === "banner-promo";
  const isProductPhoto = feature.slug === "foto-produk";
  const isPhoto46 = feature.slug === "foto-4x6";
  const isRemoveBg = feature.slug === "hapus-bg";
  const isProductModel = feature.slug === "produk-model" || feature.slug === "gabung-foto" || feature.slug === "face-swap";
  const isCarousel = feature.slug === "carousel-marketplace";
  const isFood = feature.slug === "foto-makanan";
  const isFashion = feature.slug === "foto-fashion";
  const minRequiredFiles = isProductModel ? 2 : 1;
  const maxFiles = 5;
  const maxSelectedFiles = isProductPhoto || isPhoto46 ? 1 : maxFiles;
  const isGenerateDisabled = isGenerating || isLoading || selectedFiles.length < minRequiredFiles;
  const selectedProductCategory = productPhotoCategoryOptions.find((category) => category.value === productCategory) ?? productPhotoCategoryOptions[0];
  const productPhotoSceneOptions = selectedProductCategory.scenes;
  const selectedProductPhotoScene = productPhotoSceneOptions.find((scene) => scene.value === mode.background) ?? productPhotoSceneOptions[0];
  const ratioOptions = isProductPhoto
    ? [
        { label: "1:1", value: "1:1 marketplace" },
        { label: "4:5", value: "4:5 social" },
        { label: "9:16", value: "9:16 story" },
      ]
    : isPhoto46
      ? pasFotoSizeOptions
      : [
          { label: "Kotak", value: "1:1 marketplace" },
          { label: "Sosial", value: "4:5 social" },
          { label: "Banner", value: "16:9 banner" },
          { label: "Asli", value: "Original" },
        ];

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
    if (!logoFile) {
      setLogoPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(logoFile);
    setLogoPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [logoFile]);

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

  useEffect(() => {
    if (selectedFiles.length <= maxSelectedFiles) return;

    setSelectedFiles((current) => current.slice(0, maxSelectedFiles));
    notifyApp({
      title: `Jumlah foto ${maxSelectedFiles}`,
      detail: `Upload disesuaikan dengan jumlah foto yang dipilih di UI.`,
      tone: "warning",
    });
  }, [maxSelectedFiles, selectedFiles.length]);

  const previewLabel = useMemo(() => {
    if (isRemoveBg) return "PNG transparan";
    if (isPhoto46) return mode.ratio;
    if (isBanner) return mode.ratio;
    return mode.background;
  }, [isBanner, isPhoto46, isRemoveBg, mode.background, mode.ratio]);

  useEffect(() => {
    let isCancelled = false;
    let objectUrl: string | null = null;

    setCtaOverlayUrl(null);

    const ctaText = callToAction.trim();

    if (!result || !isProductPhoto || !ctaText) {
      return () => {
        isCancelled = true;
      };
    }

    createProductCtaOverlayUrl(result.download_url ?? result.output_url, ctaText)
      .then((url) => {
        if (isCancelled) {
          URL.revokeObjectURL(url);
          return;
        }

        objectUrl = url;
        setCtaOverlayUrl(url);
      })
      .catch(() => undefined);

    return () => {
      isCancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [callToAction, isProductPhoto, result]);

  async function handleGenerate() {
    if (isLoading) {
      notifyApp({
        title: "Akun sedang disiapkan",
        detail: "Tunggu sebentar, kami sedang memastikan paket dan kredit Anda.",
        tone: "warning",
      });
      return;
    }

    if (!user && !isLoading) {
      setQuotaDialog({
        message: "Pilih paket dulu agar hasil foto, kredit, dan riwayat tersimpan aman di akun Anda.",
        upgradeUrl: "/billing",
      });
      return;
    }

    if (user && user.profile.credits_remaining < feature.credits) {
      setQuotaDialog({
        message: `Kredit aktif belum cukup untuk ${feature.shortTitle}. Pilih paket yang sesuai agar proses foto bisa dilanjutkan.`,
        upgradeUrl: "/billing",
      });
      return;
    }

    if (isProductModel && selectedFiles.length < 2) {
      notifyApp({
        title: "Butuh dua foto",
        detail: "Upload foto produk dan foto model atau referensi agar hasil gabungan terlihat natural.",
        tone: "warning",
      });
      return;
    }

    if (isPhoto46 && selectedFiles.length === 0) {
      notifyApp({
        title: "Upload foto wajah dulu",
        detail: "Pilih foto wajah yang jelas agar hasil pas foto terlihat rapi dan profesional.",
        tone: "warning",
      });
      return;
    }

    const preparedInstruction = buildInstruction();

    setGenerating(true);
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
        mockMode: isPhoto46 || isProductPhoto ? false : useMockMode,
        images: selectedFiles,
        logoImage: feature.slug === "foto-produk" ? logoFile : null,
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
          message: error.message || "Kredit belum cukup. Pilih paket yang sesuai untuk lanjut membuat foto.",
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
    } finally {
      window.clearInterval(timer);
      window.setTimeout(() => setGenerating(false), 350);
    }
  }

  function handleFileChange(fileList: FileList | null) {
    const incomingFiles = Array.from(fileList ?? []);
    const files = incomingFiles.slice(0, maxSelectedFiles);

    if (incomingFiles.length > maxSelectedFiles) {
      notifyApp({
        title: `Maksimal ${maxSelectedFiles} foto`,
        detail: `${feature.shortTitle} mengikuti jumlah foto yang dipilih di UI. Foto tambahan tidak dimasukkan.`,
        tone: "warning",
      });
    }

    setSelectedFiles(files);
    setResult(null);
    setQuotaDialog(null);
  }

  function handleLogoChange(fileList: FileList | null) {
    const file = fileList?.[0] ?? null;

    if (file && !file.type.startsWith("image/")) {
      notifyApp({
        title: "Logo harus gambar",
        detail: "Upload logo dalam format JPG, PNG, atau WebP agar bisa dipakai di visual produk.",
        tone: "warning",
      });
      setLogoInputKey((current) => current + 1);
      return;
    }

    setLogoFile(file);
    setResult(null);
    setQuotaDialog(null);
  }

  function handleRemoveFile() {
    setSelectedFiles([]);
    setUploadInputKey((current) => current + 1);
    setResult(null);
    setPreviewOpen(false);
    setQuotaDialog(null);
  }

  function handleRemoveLogo() {
    setLogoFile(null);
    setLogoInputKey((current) => current + 1);
    setResult(null);
  }

  function updateMode(patch: Partial<StudioMode>) {
    setMode((current) => ({ ...current, ...patch }));
    setResult(null);
    setPreviewOpen(false);
  }

  function buildInstruction() {
    const baseInstruction = instruction.trim() || defaultInstructionFor(feature.slug);

    if (feature.slug === "foto-produk") {
      const sceneGuidance = selectedProductPhotoScene.prompt;
      const styleGuidance = productPhotoStyleGuidance[mode.style] ?? mode.style;
      const typographyGuidance = productPhotoTypographyGuidance[selectedProductCategory.value] ?? productPhotoTypographyGuidance.general;
      const angleGuidance = productPhotoAngleOptions.find((angle) => angle.value === mode.angle)?.prompt ?? productPhotoAngleOptions[0].prompt;
      const productCopyText = copywriting.trim();
      const ctaText = callToAction.trim();
      const textContract = [
        "TEXT:",
        productCopyText ? `PRODUCT_COPY exact: ${JSON.stringify(productCopyText)}` : "PRODUCT_COPY: none",
        ctaText ? `CTA_TEXT app overlay only: ${JSON.stringify(ctaText)}. Do not render it; leave clean lower-right space.` : "CTA_TEXT: none. Do not create CTA text/buttons.",
        `Typography: ${typographyGuidance}`,
        "Render PRODUCT_COPY only, exact spelling, expressive headline hierarchy, varied scale/weight, no extra/random/stale text.",
      ].join("\n");

      return [
        baseInstruction,
        `Product category: ${selectedProductCategory.label}. Category guidance: ${selectedProductCategory.prompt}`,
        textContract,
        logoFile ? "A separate logo image is provided as the final reference. Place it subtly and keep the logo accurate." : "No logo image provided.",
        `Reference image order: images 1-${selectedFiles.length} are product photos.${logoFile ? ` Image ${selectedFiles.length + 1} is the logo.` : ""}`,
        `Use ${selectedFiles.length} product photo reference(s). Ratio: ${mode.ratio}.`,
        `Camera angle HARD REQUIREMENT: ${angleGuidance} The selected angle must be visually obvious; do not fall back to a generic front-facing catalog shot. Keep product geometry realistic and label readable.`,
        `Photoshoot scene direction: ${sceneGuidance}`,
        `Visual style direction: ${styleGuidance}`,
        "Create a premium social-media product photoshoot with cinematic depth of field, realistic foreground product focus, beautiful commercial lighting, believable shadows/reflections, expressive headline placement, and clean space for the app CTA overlay.",
        "Keep the uploaded product packaging, label shape, color identity, and visible brand cues accurate. Do not invent unrelated products, logos, labels, or random words.",
      ].join("\n");
    }

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
        "Create an Indonesian formal ID/pass photo from the uploaded face photo.",
        "Use portrait composition, centered face, clean shoulders, natural skin tone, and professional lighting.",
        "Do not change the person's identity, facial structure, or important facial features.",
        `Background color: ${mode.background}. Clothing mode: ${mode.style}. Output size: ${mode.ratio}.`,
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

  const resultOutputUrl = result ? ctaOverlayUrl ?? result.output_url : null;
  const resultDownloadUrl = result ? ctaOverlayUrl ?? result.download_url ?? result.output_url : null;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[0.82fr_1.18fr]">
      <Panel className={isProductPhoto ? "border-primary/12 bg-[linear-gradient(180deg,hsl(var(--card))_0%,hsl(var(--muted)/.24)_100%)] p-5 shadow-soft sm:p-6" : "border-border/70 bg-card p-5 shadow-soft sm:p-6"}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{feature.title}</p>
              {isProductPhoto ? <p className="mt-1 text-xs font-semibold text-muted-foreground">Photoshoot produk siap sosmed</p> : null}
            </div>
            {!isPhoto46 && !isProductPhoto ? <Badge tone={feature.credits > 1 ? "warning" : "success"}>{feature.credits} kredit</Badge> : null}
          </div>
          {!isPhoto46 && !isProductPhoto ? (
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
          ) : null}
        </div>

        <div className="mt-6 space-y-6">
          <StudioStep number={1} title="Bahan gambar" meta={isProductModel ? `Min 2, max ${maxFiles}` : isProductPhoto || isPhoto46 ? undefined : `Max ${maxFiles}`}>
            <div className="relative">
              {isProductPhoto ? <p className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">Foto produk utama</p> : null}
              <label className={isProductPhoto ? "grid min-h-32 cursor-pointer place-items-center overflow-hidden rounded-ui border border-dashed border-primary/35 bg-background/80 p-3 text-center shadow-soft transition hover:border-primary/60 hover:bg-primary/5" : "grid min-h-24 cursor-pointer place-items-center overflow-hidden rounded-ui border border-dashed border-input/70 bg-background/75 p-3 text-center transition hover:border-primary/45 hover:bg-primary/5"}>
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
                      <span className="grid max-w-full gap-1 break-words text-xs font-semibold text-muted-foreground">
                        <span>{isProductPhoto ? "Upload foto produk" : isProductModel ? "Klik untuk upload produk + model/referensi" : "Klik untuk upload gambar"}</span>
                        {isProductPhoto ? <span className="text-[11px] font-medium text-muted-foreground/75">JPG, PNG, atau WebP</span> : null}
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
            {isProductPhoto ? (
              <div className="mt-4 grid gap-3">
                <div className="relative">
                  <p className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">Logo</p>
                  <label className="grid min-h-28 cursor-pointer place-items-center overflow-hidden rounded-ui border border-dashed border-input/60 bg-background/75 p-3 text-center transition hover:border-primary/45 hover:bg-primary/5">
                    <input
                      key={logoInputKey}
                      className="sr-only"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) => handleLogoChange(event.target.files)}
                    />
                    {logoPreviewUrl ? (
                      <span className="grid w-full place-items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logoPreviewUrl} alt="Preview logo" className="max-h-20 w-auto object-contain" />
                        <span className="text-xs font-semibold text-muted-foreground">Logo brand</span>
                      </span>
                    ) : (
                      <span className="grid place-items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <ImageIcon className="h-5 w-5" />
                        Upload logo opsional
                      </span>
                    )}
                  </label>
                  {logoPreviewUrl ? (
                    <button
                      type="button"
                      className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-ui border border-destructive/20 bg-background/90 text-destructive shadow-soft transition hover:bg-destructive hover:text-destructive-foreground"
                      title="Hapus logo"
                      aria-label="Hapus logo"
                      onClick={handleRemoveLogo}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
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

          {isProductPhoto ? (
            <StudioStep number={2} title="Materi jualan">
              <div className="grid gap-3">
                <label htmlFor="copywriting" className="text-xs font-bold text-muted-foreground">Teks utama produk</label>
                <Input
                  id="copywriting"
                  className="bg-background/85"
                  maxLength={120}
                  placeholder="Contoh: Kulit lembut, nyaman dipakai seharian"
                  value={copywriting}
                  onChange={(event) => {
                    setCopywriting(event.target.value);
                    setResult(null);
                    setPreviewOpen(false);
                  }}
                />
              </div>
            </StudioStep>
          ) : null}

          {isProductPhoto ? (
            <StudioStep number={3} title="CTA">
              <div className="grid gap-3">
                <label htmlFor="call-to-action" className="text-xs font-bold text-muted-foreground">Ajakan aksi</label>
                <Input
                  id="call-to-action"
                  className="bg-background/85"
                  maxLength={100}
                  placeholder="Contoh: Beli Sekarang, stok terbatas dan siap kirim hari ini"
                  value={callToAction}
                  onChange={(event) => {
                    setCallToAction(event.target.value);
                    setResult(null);
                    setPreviewOpen(false);
                  }}
                />
              </div>
            </StudioStep>
          ) : null}

          {!isPhoto46 ? (
            <StudioStep number={isBanner ? 3 : isProductPhoto ? 4 : 2} title="Instruksi visual">
              <div className="relative">
                <Textarea
                  className="min-h-32 pb-11 soft-scrollbar"
                  id="notes"
                  value={instruction}
                  placeholder={
                    isRemoveBg
                      ? "Contoh: hapus background, pertahankan detail rambut/produk, hasil bersih siap PNG."
                      : isProductPhoto
                        ? "Contoh: suasana cafe outdoor, meja kayu, cahaya pagi, jangan ubah label produk."
                      : "Contoh: latar cerah, bayangan natural, warna produk tetap akurat."
                  }
                  onChange={(event) => setInstruction(event.target.value)}
                />
                <span className="pointer-events-none absolute bottom-2 left-2 grid h-8 w-8 place-items-center rounded-ui border border-primary/15 bg-primary/10 text-primary/80">
                  <Wand2 className="h-4 w-4" />
                </span>
              </div>
            </StudioStep>
          ) : null}

          <StudioStep number={isPhoto46 ? 2 : isBanner ? 4 : isProductPhoto ? 5 : 3} title={isPhoto46 ? "Pilihan pas foto" : "Gaya visual dan rasio"}>
            {isPhoto46 ? (
              <div className="grid gap-4">
                <OptionGroup label="Pilih warna background">
                  {pasFotoBackgroundOptions.map((background) => (
                    <OptionButton
                      key={background}
                      isActive={mode.background === background}
                      onClick={() => updateMode({ background })}
                    >
                      {background}
                    </OptionButton>
                  ))}
                </OptionGroup>
                <OptionGroup label="Mode pakaian">
                  {pasFotoClothingOptions.map((style) => (
                    <OptionButton
                      key={style}
                      isActive={mode.style === style}
                      onClick={() => updateMode({ style })}
                    >
                      {style}
                    </OptionButton>
                  ))}
                </OptionGroup>
                <OptionGroup label="Ukuran output">
                  {ratioOptions.map((ratio) => (
                    <OptionButton
                      key={ratio.value}
                      isActive={mode.ratio === ratio.value}
                      onClick={() => updateMode({ ratio: ratio.value })}
                    >
                      {ratio.label}
                    </OptionButton>
                  ))}
                </OptionGroup>
              </div>
            ) : (
              <div className="grid gap-3">
                {isProductPhoto ? (
                  <>
                    <div className="grid gap-2">
                      <label htmlFor="product-category" className="text-xs font-bold text-muted-foreground">Jenis produk</label>
                      <Select
                        id="product-category"
                        className="bg-background/85"
                        value={productCategory}
                        onChange={(event) => {
                          const nextCategory = productPhotoCategoryOptions.find((category) => category.value === event.target.value) ?? productPhotoCategoryOptions[0];
                          setProductCategory(nextCategory.value);
                          updateMode({ background: nextCategory.scenes[0].value });
                        }}
                      >
                        {productPhotoCategoryOptions.map((category) => (
                          <option key={category.value} value={category.value}>{category.label}</option>
                        ))}
                      </Select>
                    </div>
                    <OptionGroup label={`Skenario ${selectedProductCategory.label}`}>
                      {productPhotoSceneOptions.map((scene) => (
                        <OptionButton
                          key={scene.value}
                          isActive={selectedProductPhotoScene.value === scene.value}
                          onClick={() => updateMode({ background: scene.value })}
                        >
                          {scene.label}
                        </OptionButton>
                      ))}
                    </OptionGroup>
                    <OptionGroup label="Angle kamera">
                      {productPhotoAngleOptions.map((angle) => (
                        <OptionButton
                          key={angle.value}
                          isActive={(mode.angle ?? productPhotoAngleOptions[0].value) === angle.value}
                          onClick={() => updateMode({ angle: angle.value })}
                        >
                          {angle.label}
                        </OptionButton>
                      ))}
                    </OptionGroup>
                  </>
                ) : null}
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
                      onClick={() => updateMode({ style: style.value })}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2 rounded-ui border border-border/65 bg-background/75 p-1.5">
                  {ratioOptions.map((ratio) => (
                    <button
                      key={ratio.value}
                      type="button"
                      className={
                        mode.ratio === ratio.value
                          ? "min-h-10 rounded-ui border border-primary/15 bg-[linear-gradient(135deg,hsl(var(--primary)/.92)_0%,hsl(var(--primary)/.82)_48%,hsl(var(--accent)/.62)_100%)] px-2 text-xs font-semibold text-primary-foreground shadow-soft"
                          : "min-h-10 rounded-ui bg-card/80 px-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      }
                      onClick={() => updateMode({ ratio: ratio.value })}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </StudioStep>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
          <Button className="min-h-12 w-full" disabled={isGenerateDisabled} onClick={handleGenerate}>
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isGenerating ? "Memproses" : selectedFiles.length < minRequiredFiles ? "Upload foto dulu" : "Buat foto"}
          </Button>
          <Button
            className="min-h-12 w-full sm:w-12"
            variant="outline"
            aria-label="Reset"
            onClick={() => {
              setSelectedFiles([]);
              setUploadInputKey((current) => current + 1);
              setInstruction("");
              setCopywriting("");
              setCallToAction("");
              setProductCategory(productPhotoCategoryOptions[0].value);
              setLogoFile(null);
              setLogoInputKey((current) => current + 1);
              setPromoText("");
              setMode(defaults[feature.slug]);
              setResult(null);
              setPreviewOpen(false);
              setQuotaDialog(null);
              setProgress(0);
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
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
                <img src={resultOutputUrl ?? result.output_url} alt={`Hasil ${feature.title}`} className="h-auto w-full object-contain" />
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
                    href={resultDownloadUrl ?? result.download_url ?? result.output_url}
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
                {!isPhoto46 && !isProductPhoto ? <p className="mt-1 text-sm font-medium text-muted-foreground">{result.model}</p> : null}
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
            ...(!isPhoto46 && !isProductPhoto ? [{ label: "Mode", value: useMockMode ? "mockup" : "utama", tone: useMockMode ? ("warning" as const) : ("success" as const) }] : []),
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
            src={resultOutputUrl ?? result.output_url}
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

async function createProductCtaOverlayUrl(imageUrl: string, text: string) {
  const response = await fetch(imageUrl, { credentials: "include" });

  if (!response.ok) {
    throw new Error("Gagal menyiapkan overlay CTA.");
  }

  const image = await loadImageFromBlob(await response.blob());
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Browser tidak mendukung overlay CTA.");
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);
  drawProductCtaOverlay(context, text, width, height);

  return canvasToObjectUrl(canvas);
}

function loadImageFromBlob(blob: Blob) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Gambar hasil tidak bisa dibuka."));
    };
    image.src = objectUrl;
  });
}

function canvasToObjectUrl(canvas: HTMLCanvasElement) {
  return new Promise<string>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Gagal membuat file final."));
        return;
      }

      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });
}

function drawProductCtaOverlay(context: CanvasRenderingContext2D, text: string, width: number, height: number) {
  const safeText = text.trim();

  if (!safeText) return;

  const baseFontSize = Math.round(Math.min(Math.max(width * 0.033, 22), 44));
  const maxTextWidth = width * 0.58;
  const layout = fitCtaText(context, safeText, baseFontSize, maxTextWidth);
  const lineHeight = Math.round(layout.fontSize * 1.22);
  const paddingX = Math.round(layout.fontSize * 0.95);
  const paddingY = Math.round(layout.fontSize * 0.58);
  const maxLineWidth = Math.max(...layout.lines.map((line) => context.measureText(line).width));
  const pillWidth = Math.min(Math.max(maxLineWidth + paddingX * 2, width * 0.29), width * 0.78);
  const pillHeight = layout.lines.length * lineHeight + paddingY * 2;
  const x = width - pillWidth - width * 0.075;
  const y = height - pillHeight - height * 0.075;
  const radius = Math.min(pillHeight / 2.2, width * 0.026);

  context.save();
  context.shadowColor = "rgba(0, 0, 0, 0.34)";
  context.shadowBlur = Math.max(18, width * 0.024);
  context.shadowOffsetY = Math.max(8, height * 0.008);
  roundedRectPath(context, x, y, pillWidth, pillHeight, radius);
  const fill = context.createLinearGradient(x, y, x + pillWidth, y + pillHeight);
  fill.addColorStop(0, "rgba(120, 37, 30, 0.94)");
  fill.addColorStop(1, "rgba(72, 20, 29, 0.94)");
  context.fillStyle = fill;
  context.fill();

  context.shadowColor = "transparent";
  context.lineWidth = Math.max(2, width * 0.0025);
  context.strokeStyle = "rgba(255, 241, 214, 0.92)";
  context.stroke();

  context.globalAlpha = 0.26;
  context.strokeStyle = "rgba(255, 255, 255, 0.86)";
  context.lineWidth = Math.max(1, width * 0.0012);
  roundedRectPath(context, x + 4, y + 4, pillWidth - 8, pillHeight - 8, Math.max(4, radius - 4));
  context.stroke();
  context.globalAlpha = 1;

  setCtaFont(context, layout.fontSize);
  context.fillStyle = "#fff8ef";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.shadowColor = "rgba(0, 0, 0, 0.22)";
  context.shadowBlur = 4;
  context.shadowOffsetY = 1;

  const textY = y + pillHeight / 2 - ((layout.lines.length - 1) * lineHeight) / 2;
  layout.lines.forEach((line, index) => {
    context.fillText(line, x + pillWidth / 2, textY + index * lineHeight);
  });

  context.restore();
}

function fitCtaText(context: CanvasRenderingContext2D, text: string, baseFontSize: number, maxTextWidth: number) {
  const minFontSize = Math.max(16, Math.round(baseFontSize * 0.62));

  for (const maxLines of [2, 3]) {
    for (let fontSize = baseFontSize; fontSize >= minFontSize; fontSize -= 1) {
      setCtaFont(context, fontSize);
      const lines = wrapCanvasText(context, text, maxTextWidth);

      if (lines.length <= maxLines) {
        return { fontSize, lines };
      }
    }
  }

  setCtaFont(context, minFontSize);

  return { fontSize: minFontSize, lines: wrapCanvasText(context, text, maxTextWidth) };
}

function wrapCanvasText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (context.measureText(nextLine).width <= maxWidth) {
      currentLine = nextLine;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = "";
    }

    if (context.measureText(word).width <= maxWidth) {
      currentLine = word;
      return;
    }

    splitLongCanvasWord(context, word, maxWidth).forEach((chunk, index, chunks) => {
      if (index === chunks.length - 1) {
        currentLine = chunk;
        return;
      }

      lines.push(chunk);
    });
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [text];
}

function splitLongCanvasWord(context: CanvasRenderingContext2D, word: string, maxWidth: number) {
  const chunks: string[] = [];
  let currentChunk = "";

  Array.from(word).forEach((character) => {
    const nextChunk = `${currentChunk}${character}`;

    if (currentChunk && context.measureText(nextChunk).width > maxWidth) {
      chunks.push(currentChunk);
      currentChunk = character;
      return;
    }

    currentChunk = nextChunk;
  });

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

function setCtaFont(context: CanvasRenderingContext2D, fontSize: number) {
  context.font = `700 ${fontSize}px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
}

function roundedRectPath(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function aspectRatioFor(ratio: string) {
  if (ratio === "2x3" || ratio === "4x6") return "2:3";
  if (ratio === "3x4") return "3:4";
  if (ratio === "4x4") return "1:1";
  if (ratio.startsWith("1:1")) return "1:1";
  if (ratio.startsWith("4:5")) return "4:5";
  if (ratio.startsWith("9:16")) return "9:16";
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
    return "Buat pas foto formal sesuai pilihan background, pakaian, dan ukuran output. Wajah harus tetap natural dan identitas tidak berubah.";
  }

  if (slug === "hapus-bg") {
    return "Pisahkan objek dari background dan buat hasil bersih.";
  }

  if (slug === "banner-promo") {
    return "Buat banner promo yang rapi, mudah dibaca, dan siap untuk marketplace.";
  }

  return "Buat foto produk katalog dengan cahaya lembut, bayangan natural, dan warna produk tetap akurat.";
}

function OptionGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <div className="grid grid-cols-2 gap-2 rounded-ui border border-border/65 bg-background/75 p-1.5 sm:grid-cols-3">
        {children}
      </div>
    </div>
  );
}

function OptionButton({ children, isActive, onClick }: { children: ReactNode; isActive: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      className={
        isActive
          ? "min-h-10 rounded-ui border border-primary/15 bg-[linear-gradient(135deg,hsl(var(--primary)/.92)_0%,hsl(var(--primary)/.82)_48%,hsl(var(--accent)/.62)_100%)] px-2 py-2 text-xs font-semibold leading-4 text-primary-foreground shadow-soft"
          : "min-h-10 rounded-ui bg-card/80 px-2 py-2 text-xs font-semibold leading-4 text-muted-foreground transition hover:bg-muted hover:text-foreground"
      }
      onClick={onClick}
    >
      {children}
    </button>
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
