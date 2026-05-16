import { GenerateFeatureClient } from "@/app/generate/[feature]/generate-feature-client";
import type { FeatureSlug } from "@/types/editins";

type GenerateFeaturePageProps = {
  params: {
    feature: FeatureSlug;
  };
};

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return {
    title: "Bikin Foto",
  };
}

export default function GenerateFeaturePage({ params }: GenerateFeaturePageProps) {
  return <GenerateFeatureClient featureSlug={params.feature} />;
}
