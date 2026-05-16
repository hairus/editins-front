import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { GenerationStudio } from "@/components/generation-studio";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { features } from "@/data/mock";
import type { FeatureSlug } from "@/types/editins";

type GenerateFeaturePageProps = {
  params: {
    feature: FeatureSlug;
  };
};

export function generateStaticParams() {
  return features.map((feature) => ({ feature: feature.slug }));
}

export function generateMetadata({ params }: GenerateFeaturePageProps) {
  const feature = features.find((item) => item.slug === params.feature);
  return {
    title: feature ? feature.title : "Generate",
  };
}

export default function GenerateFeaturePage({ params }: GenerateFeaturePageProps) {
  const feature = features.find((item) => item.slug === params.feature);

  if (!feature) {
    notFound();
  }

  return (
    <AppShell>
      <section className="app-container pb-24 pt-8">
        <div className="mb-5">
          <Link href="/generate">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
              Semua workflow
            </Button>
          </Link>
        </div>
        <SectionHeading eyebrow="AI studio" title={feature.title} description={feature.description} />
        <div className="mt-7">
          <GenerationStudio feature={feature} />
        </div>
      </section>
    </AppShell>
  );
}

