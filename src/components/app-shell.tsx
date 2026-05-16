import Link from "next/link";
import {
  BarChart3,
  Bell,
  Boxes,
  CreditCard,
  HelpCircle,
  ImagePlus,
  LayoutDashboard,
  Link2,
  Search,
  Settings2,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generate", label: "Generate", icon: ImagePlus },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/affiliate", label: "Affiliate", icon: Link2 },
  { href: "/admin/dashboard", label: "Admin", icon: BarChart3 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/35 bg-card/95 backdrop-blur">
        <div className="flex h-12 items-center gap-3 px-3">
          <Brand />
          <div className="hidden flex-1 items-center justify-center md:flex">
            <label className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-8 w-full rounded-ui border border-input/45 bg-background/45 pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-ring"
                placeholder="Search"
              />
            </label>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Link href="/generate/foto-produk" className="hidden sm:block">
              <Button size="sm">Create</Button>
            </Link>
            <ThemeToggle />
            <button className="grid h-8 w-8 place-items-center rounded-ui text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Notifikasi">
              <Bell className="h-4 w-4" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-ui text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Bantuan">
              <HelpCircle className="h-4 w-4" />
            </button>
            <Link
              href="/dashboard/settings"
              className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground transition hover:bg-primary/90"
              aria-label="Pengaturan"
            >
              <UserRound className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-12 z-30 hidden w-64 border-r border-border/35 bg-background px-3 py-5 lg:block">
        <nav className="space-y-1">
          {navItems.slice(0, 3).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-9 items-center gap-3 rounded-ui px-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-5 border-t border-border/35 pt-5">
          <p className="px-3 text-xs font-bold text-muted-foreground">Workspace</p>
          <div className="mt-3 flex items-center gap-3 rounded-ui px-3 py-2">
            <span className="grid h-7 w-7 place-items-center rounded-ui bg-muted text-xs font-black">E</span>
            <span className="text-sm font-bold">Editins Workspace</span>
          </div>
          <nav className="mt-2 space-y-1">
            {[
              { href: "/generate", label: "AI Studio", icon: Sparkles },
              { href: "/affiliate", label: "Affiliate", icon: Link2 },
              { href: "/admin/dashboard", label: "Internal Admin", icon: Boxes },
              { href: "/billing", label: "Billing", icon: CreditCard },
              { href: "/dashboard/settings", label: "Settings", icon: Settings2 },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-9 items-center gap-3 rounded-ui px-6 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-5 left-3 right-3 rounded-ui border border-border/35 bg-card p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold">VIP Access</p>
            <Badge tone="neutral">82 kredit</Badge>
          </div>
          <p className="mt-2 text-xs font-medium leading-5 text-muted-foreground">Workspace frontend siap dihubungkan ke Laravel API.</p>
        </div>
      </aside>

      <main className="pt-12 lg:pl-64">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/35 bg-card/95 px-2 py-2 shadow-soft backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-ui text-[11px] font-bold text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
