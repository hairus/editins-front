"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LockKeyhole } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export function AuthRequired({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const loginHref = `/login?next=${encodeURIComponent(pathname)}`;

  if (isLoading) {
    return (
      <section className="app-container grid min-h-[calc(100vh-4rem)] place-items-center pb-24 pt-8">
        <div className="grid place-items-center gap-4" aria-label="Memeriksa akun">
          <div className="relative grid h-20 w-20 place-items-center rounded-ui border border-primary/20 bg-card/86 shadow-panel">
            <span className="absolute inset-0 rounded-ui border border-primary/20 animate-ping" />
            <span className="absolute -inset-3 rounded-ui border border-primary/10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-cropped.png" alt="Editins loading" className="relative h-11 w-14 object-contain animate-pulse" />
          </div>
          <span className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
            <span className="block h-full w-1/2 animate-pulse rounded-full bg-primary" />
          </span>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="app-container grid min-h-[calc(100vh-4rem)] place-items-center pb-24 pt-8">
        <Panel className="w-full max-w-md p-6 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-ui bg-muted text-muted-foreground">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h1 className="mt-5 text-lg font-semibold">Masuk untuk melanjutkan</h1>
          <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
            Akun diperlukan agar hasil foto, kredit, dan riwayat pekerjaan tersimpan dengan aman.
          </p>
          <Link className="mt-5 inline-flex" href={loginHref}>
            <Button>Masuk</Button>
          </Link>
        </Panel>
      </section>
    );
  }

  return <>{children}</>;
}
