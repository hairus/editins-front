"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Camera, CheckCircle2, Clock3, Eraser, ImagePlus, Megaphone, ShieldCheck, Sparkles, Store, Users } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { useProductCatalog } from "@/components/product-catalog-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import type { FeatureSlug } from "@/types/editins";

const featureVisuals = {
  "foto-produk": {
    icon: Camera,
    label: "Foto Produk Studio",
    tone: "from-emerald-400/24 via-sky-400/10 to-transparent",
  },
  "hapus-bg": {
    icon: Eraser,
    label: "Hapus Background",
    tone: "from-rose-400/24 via-orange-300/10 to-transparent",
  },
  "banner-promo": {
    icon: Megaphone,
    label: "Banner Promo",
    tone: "from-amber-400/26 via-secondary/12 to-transparent",
  },
  "foto-4x6": {
    icon: BadgeCheck,
    label: "Foto 4x6",
    tone: "from-sky-400/22 via-primary/10 to-transparent",
  },
} satisfies Record<FeatureSlug, { icon: typeof Camera; label: string; tone: string }>;

const pricing = [
  { name: "Starter", price: "Rp29.000", credits: "30 kredit / 30 hari", detail: "Cocok untuk seller baru yang ingin mulai merapikan foto jualan." },
  { name: "Pro", price: "Rp59.000", credits: "200 kredit / 30 hari", detail: "Pilihan utama untuk produksi foto produk rutin dan banner promo." },
  { name: "VIP", price: "Rp129.000", credits: "Kredit besar + prioritas", detail: "Untuk UMKM yang butuh produksi konten lebih sering dan cepat." },
];

const faq = [
  {
    question: "Apakah harus bisa desain?",
    answer: "Tidak. Upload foto, pilih kebutuhan visual, lalu Editins membantu menyiapkan hasil yang siap dipakai untuk jualan.",
  },
  {
    question: "Untuk siapa Editins dibuat?",
    answer: "Untuk UMKM, reseller, dropshipper, dan seller marketplace yang butuh foto produk lebih rapi tanpa fotografer atau software desain rumit.",
  },
  {
    question: "Apa yang bisa dibuat di MVP ini?",
    answer: "Fokus awal sesuai PRD adalah Foto Produk Studio, Hapus Background, dan Banner Promo Marketplace.",
  },
];

export default function Home() {
  const { error, isLoading, products } = useProductCatalog();
  const mvpProducts = products.filter((product) => product.slug !== "foto-4x6").slice(0, 3);

  return (
    <AppShell>
      <main className="overflow-hidden pb-24">
        <section className="app-container pt-8 sm:pt-12">
          <div className="relative overflow-hidden rounded-[2rem] border border-secondary/20 bg-[radial-gradient(circle_at_18%_18%,hsl(var(--secondary)/.24),transparent_30%),radial-gradient(circle_at_82%_12%,hsl(var(--primary)/.20),transparent_34%),linear-gradient(135deg,hsl(var(--card)/.98),hsl(var(--muted)/.72)_56%,hsl(var(--card)/.92))] p-5 shadow-panel sm:p-7 lg:p-9">
            <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full border border-white/30 bg-white/15 blur-2xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />

            <div className="relative grid gap-8 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid h-14 w-20 place-items-center rounded-2xl border border-border/35 bg-card/80 px-2 shadow-soft">
                    <Image
                      src="/logo-cropped.png"
                      alt="Editins"
                      width={1364}
                      height={1040}
                      priority
                      className="h-11 w-auto object-contain"
                    />
                  </span>
                  <Badge tone="warning">Untuk UMKM Indonesia</Badge>
                  <span className="rounded-full border border-border/45 bg-card/65 px-3 py-1 text-xs font-bold text-muted-foreground">
                    Edit digital instan tanpa ke studio
                  </span>
                </div>

                <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-secondary">Asisten foto AI untuk jualan online</p>
                <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.05em] text-foreground sm:text-6xl">
                  Foto produk rapi dalam hitungan detik.
                </h1>
                <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-muted-foreground">
                  Editins membantu seller UMKM membuat foto produk, hapus background, dan banner promo tanpa fotografer, tanpa studio, dan tanpa software desain rumit.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/generate">
                    <Button className="min-h-12 w-full sm:w-auto">
                      <Sparkles className="h-4 w-4" />
                      Coba pilih produk
                    </Button>
                  </Link>
                  <Link href="/billing">
                    <Button className="min-h-12 w-full sm:w-auto" variant="secondary">
                      Lihat langganan
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: Clock3, label: "Target cepat", value: "5-20 detik" },
                    { icon: Store, label: "Fokus", value: "Seller UMKM" },
                    { icon: ShieldCheck, label: "Sistem", value: "Kredit aman" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-border/45 bg-card/60 p-3 shadow-soft backdrop-blur">
                      <item.icon className="h-4 w-4 text-primary" />
                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-sm font-black">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-secondary/18 via-primary/10 to-transparent blur-2xl" />
                <Panel className="relative overflow-hidden rounded-[1.8rem] border-border/55 bg-card/82 p-4 shadow-panel">
                  <div className="grid min-h-[380px] place-items-center rounded-[1.35rem] border border-border/45 bg-[linear-gradient(145deg,hsl(var(--background)),hsl(var(--muted)/.55))] p-5">
                    <div className="w-full max-w-sm">
                      <div className="overflow-hidden rounded-[1.35rem] border border-border/45 bg-card shadow-panel">
                        <div className="h-56 bg-[radial-gradient(circle_at_50%_32%,hsl(var(--secondary)/.34),transparent_24%),linear-gradient(135deg,hsl(var(--primary)/.16),hsl(var(--muted)))] p-5">
                          <div className="grid h-full place-items-center rounded-[1rem] border border-white/30 bg-white/28 backdrop-blur">
                            <ImagePlus className="h-16 w-16 text-primary" />
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-black">Preview hasil jualan</p>
                            <Badge tone="success">Siap pakai</Badge>
                          </div>
                          <p className="mt-2 text-xs font-semibold leading-5 text-muted-foreground">
                            Upload foto produk, pilih gaya, lalu hasilnya tersimpan di riwayat akun.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>
              </div>
            </div>
          </div>
        </section>

        <section className="app-container mt-10">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: CheckCircle2, title: "Foto lebih siap jual", detail: "Bantu listing marketplace terlihat lebih rapi dan dipercaya calon pembeli." },
              { icon: Users, title: "Dibuat untuk UMKM", detail: "Copy, alur, dan fitur fokus ke kebutuhan seller Indonesia." },
              { icon: Clock3, title: "Hemat waktu produksi", detail: "Tidak perlu sesi foto studio untuk kebutuhan visual dasar jualan." },
            ].map((item) => (
              <Panel key={item.title} className="group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:border-primary/35">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/8 transition group-hover:bg-secondary/12" />
                <item.icon className="relative h-6 w-6 text-primary" />
                <h2 className="relative mt-5 text-lg font-black">{item.title}</h2>
                <p className="relative mt-2 text-sm font-semibold leading-6 text-muted-foreground">{item.detail}</p>
              </Panel>
            ))}
          </div>
        </section>

        <section className="app-container mt-14">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">Fitur MVP</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Mulai dari 3 kebutuhan visual utama.</h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-muted-foreground">
                Sesuai PRD, fase awal fokus ke foto produk, hapus background, dan banner promo marketplace.
              </p>
            </div>
            <Link href="/generate">
              <Button variant="outline">Lihat semua produk</Button>
            </Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {isLoading ? (
              <Panel className="grid min-h-48 place-items-center p-5 text-sm font-semibold text-muted-foreground lg:col-span-3">
                Memuat pilihan produk...
              </Panel>
            ) : null}
            {error ? (
              <Panel className="grid min-h-48 place-items-center p-5 text-center text-sm font-semibold text-destructive lg:col-span-3">
                {error}
              </Panel>
            ) : null}
            {mvpProducts.map((feature) => {
              const visual = featureVisuals[feature.slug];
              const Icon = visual.icon;

              return (
                <Link key={feature.slug} href={`/generate/${feature.slug}`}>
                  <Panel className="group relative min-h-full overflow-hidden p-5 transition hover:-translate-y-0.5 hover:border-secondary/45 hover:shadow-soft">
                    <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${visual.tone}`} />
                    <div className="relative flex items-center justify-between gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-card/80 text-primary shadow-soft">
                        <Icon className="h-6 w-6" />
                      </span>
                      <Badge tone={feature.credits > 1 ? "warning" : "success"}>{feature.credits} kredit</Badge>
                    </div>
                    <h3 className="relative mt-8 text-xl font-black">{visual.label}</h3>
                    <p className="relative mt-3 min-h-24 text-sm font-semibold leading-6 text-muted-foreground">{feature.description}</p>
                    <span className="relative mt-5 inline-flex items-center gap-2 text-sm font-black text-secondary">
                      Buka studio <ArrowRight className="h-4 w-4" />
                    </span>
                  </Panel>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="app-container mt-14">
          <Panel className="overflow-hidden rounded-[2rem] border-secondary/20 bg-[linear-gradient(135deg,hsl(var(--card)),hsl(var(--secondary)/.08)_52%,hsl(var(--primary)/.08))] p-5 shadow-panel sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">Cara kerja</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">Dari foto mentah ke visual siap jual.</h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-muted-foreground">
                  Alur dibuat sederhana agar seller bisa langsung mencoba tanpa belajar software desain.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { step: "01", title: "Upload foto", detail: "Pakai foto produk dari HP." },
                  { step: "02", title: "Pilih kebutuhan", detail: "Foto produk, hapus background, atau banner." },
                  { step: "03", title: "Download hasil", detail: "Simpan dan pakai untuk listing jualan." },
                ].map((item) => (
                  <div key={item.step} className="rounded-[1.35rem] border border-border/45 bg-card/62 p-4 shadow-soft">
                    <p className="text-4xl font-black tracking-[-0.06em] text-secondary/55">{item.step}</p>
                    <h3 className="mt-5 text-base font-black">{item.title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </section>

        <section className="app-container mt-14">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">Langganan</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Pilih paket sesuai ritme jualan.</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-muted-foreground">
              Harga dan kredit mengikuti PRD MVP agar tetap terjangkau untuk UMKM.
            </p>
          </div>
          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {pricing.map((tier, index) => (
              <Panel key={tier.name} className={index === 1 ? "relative overflow-hidden border-secondary/35 bg-secondary/10 p-5 shadow-panel" : "relative overflow-hidden p-5"}>
                {index === 1 ? <Badge tone="warning">Rekomendasi</Badge> : <Badge>Launch price</Badge>}
                <h3 className="mt-5 text-2xl font-black">{tier.name}</h3>
                <p className="mt-3 text-4xl font-black tracking-[-0.05em]">{tier.price}</p>
                <p className="mt-2 text-sm font-black text-muted-foreground">{tier.credits}</p>
                <p className="mt-4 min-h-16 text-sm font-semibold leading-6 text-muted-foreground">{tier.detail}</p>
                <Link className="mt-5 block" href="/billing">
                  <Button className="w-full" variant={index === 1 ? "primary" : "outline"}>Pilih paket</Button>
                </Link>
              </Panel>
            ))}
          </div>
        </section>

        <section className="app-container mt-14">
          <div className="grid gap-4 lg:grid-cols-[.85fr_1.15fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">FAQ</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">Pertanyaan sebelum mulai.</h2>
            </div>
            <div className="grid gap-3">
              {faq.map((item) => (
                <Panel key={item.question} className="p-5">
                  <h3 className="text-base font-black">{item.question}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">{item.answer}</p>
                </Panel>
              ))}
            </div>
          </div>
        </section>

        <section className="app-container mt-14">
          <Panel className="overflow-hidden rounded-[2rem] border-secondary/25 bg-[linear-gradient(135deg,hsl(var(--secondary)/.16),hsl(var(--card))_52%,hsl(var(--primary)/.12))] p-6 text-center shadow-panel sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">Mulai sekarang</p>
            <h2 className="mx-auto mt-2 max-w-2xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Siapkan foto jualan tanpa harus ke studio.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-6 text-muted-foreground">
              Lihat pilihan produk dulu. Saat ingin membuat hasil, Editins akan mengarahkan ke langganan agar kredit dan riwayat tersimpan aman.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/generate">
                <Button className="min-h-12 w-full sm:w-auto">Pilih Produk</Button>
              </Link>
              <Link href="/billing">
                <Button className="min-h-12 w-full sm:w-auto" variant="secondary">Lihat Langganan</Button>
              </Link>
            </div>
          </Panel>
        </section>
      </main>
    </AppShell>
  );
}
