import Image from "next/image";
import Link from "next/link";
import { Clock3, ImagePlus, LayoutGrid, Sparkles, Users } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ProductVisual } from "@/components/product-visual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { features } from "@/data/mock";

export default function Home() {
  return (
    <AppShell>
      <section className="app-container pb-24 pt-8">
        <div className="mx-auto max-w-4xl">
          <section className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
            <Panel className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-14 w-20 place-items-center overflow-hidden rounded-ui bg-white p-2">
                  <Image
                    src="/logo-cropped.png"
                    alt="Editins"
                    width={1364}
                    height={1040}
                    priority
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <Badge>Workspace</Badge>
              </div>
              <h1 className="mt-5 text-2xl font-bold tracking-normal">Editins Workspace</h1>
              <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
                Kelola generate foto produk, banner, billing, dan affiliate dalam satu area kerja yang ringkas.
              </p>
              <div className="mt-5 grid gap-2">
                {[
                  { icon: Clock3, label: "P95 generate target", value: "< 20 detik" },
                  { icon: Users, label: "Beta workspace", value: "50 users" },
                  { icon: LayoutGrid, label: "MVP feature", value: "3 workflows" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3 rounded-ui border border-border bg-background/25 px-3 py-2">
                    <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    <span className="text-sm font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </Panel>
            <ProductVisual />
          </section>

          <section className="mt-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-base font-bold">Most popular templates</h2>
            </div>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Mulai dari workflow paling sering dipakai UMKM.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {features.map((feature) => (
                <Link key={feature.slug} href={`/generate/${feature.slug}`}>
                  <Panel className="overflow-hidden transition hover:border-primary/45">
                    <div className="h-16 bg-muted" />
                    <div className="p-3">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-bold">{feature.shortTitle}</h3>
                        <Badge>{feature.credits} kredit</Badge>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-muted-foreground">{feature.description}</p>
                    </div>
                  </Panel>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <div className="flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-base font-bold">Recently viewed</h2>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link href="/dashboard">
                <Panel className="p-4 transition hover:border-primary/45">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-ui bg-muted">
                      <LayoutGrid className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold">Dashboard</p>
                      <p className="text-xs font-medium text-muted-foreground">History, credit, queue state</p>
                    </div>
                  </div>
                </Panel>
              </Link>
              <Link href="/generate/foto-produk">
                <Panel className="p-4 transition hover:border-primary/45">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-ui bg-muted">
                      <ImagePlus className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold">Foto Produk Studio</p>
                      <p className="text-xs font-medium text-muted-foreground">Upload, style picker, preview</p>
                    </div>
                  </div>
                </Panel>
              </Link>
            </div>
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xs font-bold uppercase text-muted-foreground">Your workspace</h2>
              <Link href="/generate/foto-produk">
                <Button size="sm">Create new board</Button>
              </Link>
            </div>
            <Panel className="mt-4 p-4">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-bold">Editins Workspace</p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">Frontend MVP only, ready for Laravel API connection.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Boards", "Members", "Settings"].map((item) => (
                    <Button key={item} size="sm" variant="outline">{item}</Button>
                  ))}
                </div>
              </div>
            </Panel>
          </section>
        </div>
      </section>
    </AppShell>
  );
}
