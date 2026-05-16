import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { features } from "@/data/mock";

export default function GenerateIndexPage() {
  return (
    <AppShell>
      <section className="app-container pb-24 pt-8">
        <SectionHeading
          eyebrow="Generate"
          title="Pilih workflow"
          description="Tiga feature MVP dipisah jelas agar validasi, kredit, dan parameter bisa mengikuti kontrak Laravel API nanti."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {features.map((feature) => (
            <Panel key={feature.slug} className="p-5">
              <div className="flex items-center justify-between gap-3">
                    <Sparkles className="h-5 w-5 text-muted-foreground" />
                <Badge tone={feature.credits > 1 ? "warning" : "success"}>{feature.credits} kredit</Badge>
              </div>
              <h2 className="mt-8 text-2xl font-black">{feature.shortTitle}</h2>
              <p className="mt-3 min-h-24 text-sm font-medium leading-6 text-muted-foreground">{feature.description}</p>
              <Link href={`/generate/${feature.slug}`} className="mt-5 block">
                <Button className="w-full">
                  Buka Studio
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Panel>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
