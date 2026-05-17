import type { FeatureSlug } from "@/types/editins";
import { apiFetch } from "@/lib/api/client";

export type GenerateImageInput = {
  feature: FeatureSlug;
  instruction: string;
  aspectRatio?: string | null;
  mockMode?: boolean;
  image?: File | null;
  images?: File[];
  logoImage?: File | null;
  templateImage?: File | null;
};

export type GenerateImageResult = {
  generation_id: string;
  status: "success";
  model: string;
  output_url: string;
  download_url?: string;
  output_mime_type: string;
  credits_remaining: number | null;
};

type ApiErrorPayload = {
  error?: string;
  message?: string;
  upgrade_url?: string;
};

export class GenerateApiError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly upgradeUrl?: string,
  ) {
    super(message);
    this.name = "GenerateApiError";
  }
}

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageResult> {
  const response = await postGenerate(input);

  const payload = (await response.json().catch(() => ({}))) as Partial<GenerateImageResult> & ApiErrorPayload;

  if (!response.ok) {
    throw new GenerateApiError(
      payload.message ?? payload.error ?? "Generate gagal. Coba ulang beberapa saat lagi.",
      payload.error,
      payload.upgrade_url,
    );
  }

  return payload as GenerateImageResult;
}

async function postGenerate(input: GenerateImageInput) {
  const formData = new FormData();

  formData.append("feature", input.feature);
  formData.append("instruction", input.instruction);

  if (input.aspectRatio) {
    formData.append("aspect_ratio", input.aspectRatio);
  }

  if (typeof input.mockMode === "boolean") {
    formData.append("mock_mode", input.mockMode ? "1" : "0");
  }

  if (input.image) {
    formData.append("image", input.image);
  }

  input.images?.forEach((image) => {
    formData.append("images[]", image);
  });

  if (input.logoImage) {
    formData.append("logo_image", input.logoImage);
  }

  if (input.templateImage) {
    formData.append("template_image", input.templateImage);
  }

  const response = await apiFetch("/generate", {
    method: "POST",
    body: formData,
  });

  return response;
}
