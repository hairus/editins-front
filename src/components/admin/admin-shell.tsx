"use client";

import Link from "next/link";
import { Activity, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const role = (user as { role?: string; is_admin?: boolean } | null)?.role;
  const isAdmin = role === "admin" || (user as { is_admin?: boolean } | null)?.is_admin === true;
  const hasBackendRole = Boolean(role || typeof (user as { is_admin?: boolean } | null)?.is_admin === "boolean");

  return (
    <AppShell>
      <section className="app-container pb-24 pt-6">
        <div className="mb-5 overflow-hidden rounded-[1.75rem] border border-border/40 bg-[linear-gradient(135deg,hsl(var(--card)/.95),hsl(var(--muted)/.55))] p-4 shadow-panel backdrop-blur md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="accent">Admin cockpit</Badge>
                {!hasBackendRole ? <Badge tone="warning">role backend belum aktif</Badge> : null}
                {isAdmin ? <Badge tone="success">verified admin</Badge> : null}
              </div>
              <h1 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">Editins Internal Control</h1>
              <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
                Pantau generate, provenance, user, transaksi, dan status operasional tanpa menampilkan secret.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-ui border border-border/45 bg-background/45 p-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">Session</p>
                <p className="text-sm font-black">{isLoading ? "Memeriksa akses..." : user?.email ?? "Belum login"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0">
            {!user ? (
              <Panel className="p-6 text-center">
                <ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground" />
                <h2 className="mt-4 text-lg font-black">Masuk untuk membuka admin</h2>
                <p className="mt-2 text-sm font-semibold text-muted-foreground">Akses admin membutuhkan session login.</p>
                <Link className="mt-4 inline-flex rounded-ui bg-primary px-4 py-2 text-sm font-black text-primary-foreground" href="/login">
                  Login
                </Link>
              </Panel>
            ) : hasBackendRole && !isAdmin ? (
              <Panel className="p-6 text-center">
                <Activity className="mx-auto h-8 w-8 text-destructive" />
                <h2 className="mt-4 text-lg font-black">Akses admin ditolak</h2>
                <p className="mt-2 text-sm font-semibold text-muted-foreground">Akun ini bukan admin. Proteksi final tetap wajib di backend.</p>
              </Panel>
            ) : (
              <>
                {!hasBackendRole ? (
                  <div className="mb-5 rounded-ui border border-warning/30 bg-warning/10 px-4 py-3 text-sm font-semibold text-warning">
                    Backend role belum tersedia. UI admin ditampilkan untuk development frontend saja.
                  </div>
                ) : null}
                {children}
              </>
            )}
        </div>
      </section>
    </AppShell>
  );
}
