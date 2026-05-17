"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Bot, ImageUpscale, MessageSquareText, Server, Sparkles, Stamp, Wand2 } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { AuthRequired } from "@/components/auth-required";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

const addons = [
  {
    icon: Bot,
    name: "Banana 2",
    price: "Mode premium",
    detail: "Gunakan model gambar generasi baru untuk hasil lebih tajam, detail, dan cocok untuk campaign penting.",
    status: "Segera",
  },
  {
    icon: Wand2,
    name: "Hapus Background HD",
    price: "Rp15.000",
    detail: "Cutout lebih bersih untuk produk dengan rambut, kain, transparansi, atau detail kecil.",
    status: "Pilihan ekstra",
  },
  {
    icon: ImageUpscale,
    name: "Upscale 4K",
    price: "Rp25.000",
    detail: "Tingkatkan resolusi hasil agar lebih siap untuk katalog, banner, dan materi promosi.",
    status: "Pilihan ekstra",
  },
  {
    icon: Stamp,
    name: "Watermark Auto",
    price: "Rp15.000",
    detail: "Tambahkan identitas toko ke hasil visual agar konten lebih mudah dikenali.",
    status: "Pilihan ekstra",
  },
  {
    icon: MessageSquareText,
    name: "Caption Marketplace AI",
    price: "Rp20.000",
    detail: "Bantu susun judul, deskripsi, dan caption jualan dari visual produk.",
    status: "Pilihan ekstra",
  },
  {
    icon: Server,
    name: "Boost Mode 100 Generate",
    price: "Rp30.000",
    detail: "Tambahan kredit untuk produksi foto lebih banyak saat campaign atau upload katalog besar.",
    status: "Pilihan ekstra",
  },
];

export default function AddonsPage() {
  return (
    <AppShell>
      <AuthRequired allowGuest>
        <section className="app-container pb-24 pt-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-secondary/20 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--secondary)/.18),transparent_30%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--muted)/.55))] p-6 shadow-panel sm:p-8">
            <Badge tone="warning">Addon</Badge>
            <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.04em] sm:text-5xl">
              Tambahan fitur untuk produksi visual yang lebih kuat.
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-muted-foreground">
              Tambahan fitur untuk seller yang ingin hasil lebih kuat, lebih detail, dan lebih siap dipakai saat campaign penting.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/billing">
                <Button className="min-h-12 w-full sm:w-auto">
                  Lihat Langganan
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/generate">
                <Button className="min-h-12 w-full sm:w-auto" variant="outline">
                  Coba Produk
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {addons.map((addon) => (
              <Panel key={addon.name} className="group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-soft">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/8 transition group-hover:bg-secondary/12" />
                <div className="relative flex items-start justify-between gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary shadow-soft">
                    <addon.icon className="h-6 w-6" />
                  </span>
                  <Badge tone={addon.name === "Banana 2" ? "warning" : "neutral"}>{addon.status}</Badge>
                </div>
                <h2 className="relative mt-6 text-xl font-black">{addon.name}</h2>
                <p className="relative mt-2 text-sm font-black text-secondary">{addon.price}</p>
                <p className="relative mt-3 min-h-20 text-sm font-semibold leading-6 text-muted-foreground">{addon.detail}</p>
                <div className="relative mt-5 flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  Aktif lewat paket/addon setelah checkout tersedia
                </div>
              </Panel>
            ))}
          </div>

          <Panel className="mt-6 p-5">
            <div className="flex gap-3">
              <Sparkles className="mt-1 h-5 w-5 text-secondary" />
              <div>
                <h2 className="font-black">Catatan Banana 2</h2>
                <p className="mt-1 text-sm font-semibold leading-6 text-muted-foreground">
                  Generate utama tetap memakai mesin yang sudah stabil. Banana 2 disiapkan sebagai pilihan premium untuk hasil yang lebih kuat saat kebutuhan produksi meningkat.
                </p>
              </div>
            </div>
          </Panel>
        </section>
      </AuthRequired>
    </AppShell>
  );
}
