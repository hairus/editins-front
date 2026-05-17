"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  BadgeCheck,
  Banknote,
  BarChart3,
  Bell,
  Camera,
  ChevronDown,
  CheckCircle2,
  CreditCard,
  Eraser,
  Expand,
  ImagePlus,
  Images,
  Fingerprint,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Paintbrush,
  Puzzle,
  ScanFace,
  Search,
  Settings2,
  ShieldCheck,
  Shirt,
  Sparkles,
  Star,
  Utensils,
  Wand2,
  WalletCards,
  X,
  UserRound,
} from "lucide-react";

import { Brand } from "@/components/brand";
import { useAuth } from "@/components/auth-provider";
import { useProductCatalog } from "@/components/product-catalog-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { googleLoginUrl } from "@/lib/api/client";
import { tierMarketingLabel } from "@/lib/marketing-copy";
import packageInfo from "../../package.json";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
];

const guestNavItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
];

const productNavItems = [
  { href: "/generate", label: "Pilih Produk", icon: Sparkles },
  { href: "/addons", label: "Addon", icon: Puzzle },
  { href: "/billing", label: "Langganan", icon: CreditCard },
  { href: "/affiliate", label: "Referral", icon: UserRound },
  { href: "/dashboard/settings", label: "Pengaturan", icon: Settings2 },
];

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/revenue", label: "Pendapatan", icon: BarChart3 },
  { href: "/admin/generations", label: "Generations", icon: Camera },
  { href: "/admin/provenance", label: "Provenance", icon: Fingerprint },
  { href: "/admin/users", label: "Users", icon: UserRound },
  { href: "/admin/payments", label: "Payments", icon: Banknote },
  { href: "/admin/affiliate", label: "Affiliate", icon: WalletCards },
  { href: "/admin/settings", label: "Settings", icon: Settings2 },
] as const;

const studioFeatureSections = [
  {
    title: "EDIT & GABUNG",
    items: [
      { href: "/generate/gabung-foto", label: "Gabung Foto", icon: ImagePlus },
      { href: "/generate/foto-miniatur", label: "Foto Miniatur", icon: Images },
      { href: "/generate/perluas-foto", label: "Perluas Foto", icon: Expand },
      { href: "/generate/edit-foto", label: "Edit Foto", icon: Paintbrush },
      { href: "/generate/perbaiki-foto", label: "Perbaiki Foto", icon: Wand2 },
      { href: "/generate/face-swap", label: "Face Swap", icon: ScanFace },
      { href: "/generate/foto-artis", label: "Foto Artis", icon: Star },
      { href: "/generate/hapus-bg", label: "Hapus BG", icon: Eraser },
      { href: "/generate/foto-4x6", label: "Pas Foto", icon: BadgeCheck },
    ],
  },
  {
    title: "PRODUK & PROMOSI",
    items: [
      { href: "/generate/foto-produk", label: "Foto Produk", icon: Camera },
      { href: "/generate/foto-fashion", label: "Foto Fashion", icon: Shirt },
      { href: "/generate/buat-mockup", label: "Buat Mockup", icon: LayoutDashboard },
      { href: "/generate/banner-promo", label: "Buat Banner", icon: Megaphone },
      { href: "/generate/carousel-marketplace", label: "Buat Carousel", icon: Images },
      { href: "/generate/pov-tangan", label: "POV Tangan", icon: UserRound },
      { href: "/generate/foto-makanan", label: "Foto Makanan", icon: Utensils },
    ],
  },
] as const;

type NotificationTone = "success" | "warning" | "neutral" | "danger";
type NotificationItem = {
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tone: NotificationTone;
  createdAt?: string;
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const { products } = useProductCatalog();
  const sidebarScrollRef = useRef<HTMLDivElement | null>(null);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isAccountOpen, setAccountOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setSearchFocused] = useState(false);
  const [isMobileSearchFocused, setMobileSearchFocused] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false);
  const [liveNotifications, setLiveNotifications] = useState<NotificationItem[]>([]);
  const displayName = user ? titleCaseName(user.name) : "";
  const isAdmin = user?.role === "admin" || user?.is_admin === true;
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");
  const visibleNavItems = user ? navItems : guestNavItems;
  const visibleProductNavItems = user ? productNavItems : productNavItems.filter((item) => item.href === "/generate" || item.href === "/billing");
  const mobileNavItems = isAdmin ? [...navItems, { href: "/admin/dashboard", label: "Admin", icon: ShieldCheck }] : user ? navItems : visibleProductNavItems;
  const searchSuggestions = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return products
      .filter((product) => {
        if (!normalizedTerm) return true;

        return [product.title, product.shortTitle, product.description, product.output]
          .join(" ")
          .toLowerCase()
          .includes(normalizedTerm);
      });
  }, [products, searchTerm]);
  const notifications = useMemo<NotificationItem[]>(
    () => [
      ...liveNotifications,
      {
        icon: user ? CheckCircle2 : AlertTriangle,
        title: user ? "Akun siap digunakan" : "Masuk untuk mulai",
        detail: user
          ? `${displayName} memiliki ${user.profile.credits_remaining} kredit aktif di ${tierMarketingLabel(user.profile.tier)}.`
          : "Masuk agar hasil foto, kredit, dan riwayat pekerjaan tersimpan aman.",
        tone: user ? "success" : "warning",
      },
      {
        icon: CreditCard,
        title: "Top up sesuai akun",
        detail: user ? `Pembelian paket akan masuk ke akun ${user.email}.` : "Top up kredit tersedia setelah masuk.",
        tone: "neutral",
      },
    ],
    [displayName, liveNotifications, user],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNotificationOpen(false);
        setAccountOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    function handleNotification(event: Event) {
      const payload = (event as CustomEvent<Partial<Omit<NotificationItem, "icon">>>).detail;

      setLiveNotifications((current) =>
        [
          {
            icon: payload?.tone === "success" ? CheckCircle2 : AlertTriangle,
            title: payload?.title ?? "Ada kendala",
            detail: payload?.detail ?? "Proses belum berhasil. Cek detailnya sebelum mencoba lagi.",
            tone: payload?.tone ?? "warning",
            createdAt: "Baru saja",
          },
          ...current,
        ].slice(0, 5),
      );
      setHasUnreadNotification(true);
      setNotificationOpen(true);
    }

    window.addEventListener("editins:notify", handleNotification);

    return () => window.removeEventListener("editins:notify", handleNotification);
  }, []);

  useEffect(() => {
    if (!isNotificationOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isNotificationOpen]);

  useEffect(() => {
    const savedScrollTop = window.sessionStorage.getItem("editins-sidebar-scroll-top");

    if (!savedScrollTop) return;

    window.setTimeout(() => {
      if (sidebarScrollRef.current) {
        sidebarScrollRef.current.scrollTop = Number(savedScrollTop);
      }
    }, 0);
  }, [pathname]);

  function handleMenuClick() {
    if (sidebarScrollRef.current) {
      window.sessionStorage.setItem("editins-sidebar-scroll-top", String(sidebarScrollRef.current.scrollTop));
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-28 top-20 h-80 w-80 rounded-full bg-secondary/18 blur-3xl dark:bg-secondary/8" />
        <div className="absolute right-[-9rem] top-28 h-96 w-96 rounded-full bg-primary/16 blur-3xl dark:bg-primary/9" />
        <div className="absolute bottom-24 left-[18%] h-72 w-72 rounded-full bg-accent/20 blur-3xl dark:bg-accent/7" />
        <div className="absolute inset-0 opacity-[0.065] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:22px_22px] text-foreground dark:opacity-[0.045]" />
        <div className="absolute left-[56%] top-24 h-36 w-52 rotate-12 rounded-[2rem] border border-primary/18 bg-card/22 shadow-soft dark:border-white/10 dark:bg-card/10" />
        <div className="absolute bottom-44 right-[10%] h-28 w-44 -rotate-6 rounded-[1.6rem] border border-secondary/28 bg-secondary/10 shadow-soft dark:border-secondary/15 dark:bg-secondary/5" />
      </div>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/35 bg-card/95 backdrop-blur">
        <div className="flex h-12 items-center gap-3 px-3">
          <Brand />
          <div className="hidden flex-1 items-center justify-center md:flex">
            <label className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-8 w-full rounded-ui border border-input/60 bg-background/70 pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-ring"
                placeholder="Cari desain foto, contoh: foto produk atau foto 4x6"
                value={searchTerm}
                onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)}
                onChange={(event) => setSearchTerm(event.target.value)}
                onFocus={() => setSearchFocused(true)}
              />
              {isSearchFocused && searchSuggestions.length > 0 ? (
                <div className="soft-scrollbar absolute left-0 right-0 top-10 z-50 max-h-[70vh] overflow-y-auto rounded-ui border border-border/65 bg-card shadow-panel">
                  {searchSuggestions.map((product) => (
                    <Link
                      key={product.slug}
                      className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm transition hover:bg-muted"
                      href={`/generate/${product.slug}`}
                      onClick={() => {
                        setSearchTerm("");
                        setSearchFocused(false);
                      }}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">{product.shortTitle}</span>
                        <span className="block truncate text-xs font-medium text-muted-foreground">{product.output}</span>
                      </span>
                      <Badge tone={product.credits > 1 ? "warning" : "success"}>{product.credits} kredit</Badge>
                    </Link>
                  ))}
                </div>
              ) : null}
            </label>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle />
            <button
              className="relative grid h-8 w-8 place-items-center rounded-ui text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Notifikasi"
              aria-haspopup="dialog"
              aria-expanded={isNotificationOpen}
              onClick={() => {
                setNotificationOpen(true);
                setHasUnreadNotification(false);
              }}
            >
              <Bell className="h-4 w-4" />
              <span
                className={
                  hasUnreadNotification
                    ? "absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-card"
                    : "absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-warning ring-2 ring-card"
                }
              />
            </button>
            {user ? (
              <div className="relative flex items-center gap-1.5">
                <span className="hidden rounded-ui border border-border/55 bg-background/40 px-2 py-1 text-xs font-semibold text-muted-foreground sm:inline-flex">
                  {user.profile.credits_remaining} kredit
                </span>
                <button
                  className="flex h-8 items-center gap-1.5 rounded-full bg-primary pl-2 pr-2 text-xs font-bold text-primary-foreground transition hover:bg-primary/90"
                  aria-label="Menu akun"
                  aria-haspopup="menu"
                  aria-expanded={isAccountOpen}
                  onClick={() => setAccountOpen((current) => !current)}
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-primary-foreground/18">{initials(displayName)}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {isAccountOpen ? (
                  <div className="absolute right-0 top-10 z-50 w-72 overflow-hidden rounded-ui border border-border/55 bg-card shadow-panel">
                    <div className="border-b border-border/45 p-3">
                      <p className="truncate text-sm font-semibold">{displayName}</p>
                      <p className="mt-1 truncate text-xs font-medium text-muted-foreground">{user.email}</p>
                      <Badge className="mt-2" tone="success">
                        {tierMarketingLabel(user.profile.tier)}
                      </Badge>
                      {isAdmin ? <Badge className="ml-2 mt-2" tone="accent">Admin</Badge> : null}
                    </div>
                    <div className="grid p-1.5">
                      {isAdmin ? <MenuLink href="/admin/dashboard" icon={ShieldCheck} label="Admin panel" onClick={() => setAccountOpen(false)} /> : null}
                      <MenuLink href="/dashboard/settings" icon={Settings2} label="Pengaturan akun" onClick={() => setAccountOpen(false)} />
                      <button
                        className="flex min-h-10 items-center gap-3 rounded-ui px-3 text-left text-sm font-semibold text-destructive transition hover:bg-destructive/10"
                        type="button"
                        onClick={() => {
                          setAccountOpen(false);
                          logout().catch(() => undefined);
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Keluar
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="relative">
                <Button
                  size="sm"
                  variant="outline"
                  aria-haspopup="menu"
                  aria-expanded={isAccountOpen}
                  onClick={() => setAccountOpen((current) => !current)}
                >
                  <UserRound className="h-4 w-4" />
                  {isLoading ? "..." : "Masuk"}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
                {isAccountOpen ? (
                  <div className="absolute right-0 top-10 z-50 w-64 overflow-hidden rounded-ui border border-border/55 bg-card p-1.5 shadow-panel">
                    <a
                      className="flex min-h-10 items-center gap-3 rounded-ui px-3 text-sm font-semibold transition hover:bg-muted"
                      href={googleLoginUrl()}
                    >
                      <UserRound className="h-4 w-4" />
                      Lanjut dengan Google
                    </a>
                    <MenuLink href="/login" icon={UserRound} label="Masuk dengan email" onClick={() => setAccountOpen(false)} />
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="fixed inset-x-0 top-12 z-30 border-b border-border/35 bg-card/95 px-3 py-2 backdrop-blur md:hidden">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="h-10 w-full rounded-ui border border-input/60 bg-background/70 pl-9 pr-3 text-sm font-semibold outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-ring"
            placeholder="Cari studio / foto 4x6"
            value={searchTerm}
            onBlur={() => window.setTimeout(() => setMobileSearchFocused(false), 120)}
            onChange={(event) => setSearchTerm(event.target.value)}
            onFocus={() => setMobileSearchFocused(true)}
          />
          {isMobileSearchFocused && searchSuggestions.length > 0 ? (
            <div className="soft-scrollbar absolute left-0 right-0 top-12 z-50 max-h-[62vh] overflow-y-auto rounded-ui border border-border/65 bg-card shadow-panel">
              {searchSuggestions.map((product) => (
                <Link
                  key={product.slug}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm transition hover:bg-muted"
                  href={`/generate/${product.slug}`}
                  onClick={() => {
                    setSearchTerm("");
                    setMobileSearchFocused(false);
                    handleMenuClick();
                  }}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{product.shortTitle}</span>
                    <span className="block truncate text-xs font-medium text-muted-foreground">{product.output}</span>
                  </span>
                  <Badge tone={product.credits > 1 ? "warning" : "success"}>{product.credits} kredit</Badge>
                </Link>
              ))}
            </div>
          ) : null}
        </label>
      </div>

      <aside className="fixed bottom-0 left-0 top-12 z-30 hidden w-64 overflow-hidden border-r border-border/45 bg-[linear-gradient(180deg,hsl(var(--card)/.98),hsl(var(--background)/.94))] px-3 py-4 shadow-panel backdrop-blur-xl lg:block">
        <div className="relative z-10 h-full">
        <div ref={sidebarScrollRef} className="soft-scrollbar h-full overflow-y-auto pb-4 pr-1">
        {isAdminArea ? (
          <nav className="space-y-1">
            <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground/90">Admin</p>
            <div className="mb-3 rounded-[1rem] border border-primary/25 bg-primary/10 px-3 py-2 text-sm font-black text-primary">
              Editins Internal Control
            </div>
            {adminNavItems.map((item) => {
              const isActive = isActiveHref(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkClass(isActive, "px-3")}
                  onClick={handleMenuClick}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-4 border-t border-border/35 pt-4">
              <Link href="/dashboard" className={navLinkClass(false, "px-3")} onClick={handleMenuClick}>
                <LayoutDashboard className="h-4 w-4" />
                Kembali ke aplikasi
              </Link>
            </div>
          </nav>
        ) : (
          <>
        {visibleNavItems.length > 0 ? (
          <nav className="space-y-1">
            <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground/90">Dashboard</p>
            {visibleNavItems.map((item) => {
              const isActive = isActiveHref(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkClass(isActive, "px-3")}
                  onClick={handleMenuClick}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        ) : null}

        <div className={visibleNavItems.length > 0 ? "mt-4 border-t border-border/35 pt-4" : "mt-0"}>
          <p className="px-3 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground/90">Menu</p>
          {user ? (
            <div className="mt-2 flex items-center gap-3 rounded-[1rem] border border-border/45 bg-background/32 px-3 py-2 text-muted-foreground shadow-soft">
              <span className="grid h-8 w-8 place-items-center rounded-[0.8rem] bg-[linear-gradient(135deg,hsl(var(--primary)/.18),hsl(var(--secondary)/.14))] text-xs font-black text-secondary">E</span>
              <span className="text-sm font-black text-foreground/85">Editins Studio</span>
            </div>
          ) : null}
          <nav className="mt-2 space-y-1">
            {visibleProductNavItems.map((item) => {
              const isActive = isActiveHref(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkClass(isActive, "px-6")}
                  onClick={handleMenuClick}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {user ? (
          <div className="mt-4 border-t border-border/35 pt-4">
            <div className="space-y-4">
              {studioFeatureSections.map((section) => (
                <div key={section.title}>
                  <p className="px-3 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/85">{section.title}</p>
                  <nav className="mt-1.5 space-y-0.5">
                    {section.items.map((item) => {
                      const isActive = isActiveHref(pathname, item.href);
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={featureNavLinkClass(isActive)}
                          onClick={handleMenuClick}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </div>
        ) : null}
          </>
        )}
        </div>

        </div>
      </aside>

      <main className="relative z-10 pt-[6.5rem] md:pt-12 lg:pl-64">
        {children}
        <footer className="hidden border-t border-border/45 px-4 py-5 text-center text-xs font-semibold text-muted-foreground md:block lg:px-8">
          v{packageInfo.version} - Powered by Editins
        </footer>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/35 bg-card/95 px-2 py-2 shadow-soft backdrop-blur lg:hidden">
        <div className="grid grid-cols-1 gap-1">
          {mobileNavItems.map((item) => {
            const isActive = isActiveHref(pathname, item.href);

            return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={mobileNavLinkClass(isActive)}
                  onClick={handleMenuClick}
                >
                <item.icon className="h-4 w-4" />
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {isNotificationOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/45 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={() => setNotificationOpen(false)}
        >
          <section
            aria-labelledby="notification-dialog-title"
            aria-modal="true"
            className="w-full max-w-lg overflow-hidden rounded-ui border border-border/65 bg-card shadow-panel"
            role="dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-border/45 px-4 py-3">
              <div>
                <h2 id="notification-dialog-title" className="text-sm font-semibold text-foreground">
                  Notifikasi
                </h2>
                <p className="mt-1 text-xs font-medium text-muted-foreground">Kabar terbaru tentang akun dan proses foto.</p>
              </div>
              <button
                type="button"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-ui text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Tutup notifikasi"
                onClick={() => setNotificationOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="divide-y divide-border/55">
              {notifications.map((item) => (
                <article key={item.title} className="flex gap-3 px-4 py-3">
                  <span
                    className={
                      item.tone === "success"
                        ? "grid h-9 w-9 shrink-0 place-items-center rounded-ui bg-success/12 text-success"
                        : item.tone === "danger"
                          ? "grid h-9 w-9 shrink-0 place-items-center rounded-ui bg-destructive/12 text-destructive"
                        : item.tone === "warning"
                          ? "grid h-9 w-9 shrink-0 place-items-center rounded-ui bg-warning/14 text-warning"
                          : "grid h-9 w-9 shrink-0 place-items-center rounded-ui bg-muted text-muted-foreground"
                    }
                  >
                    <item.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">{item.detail}</p>
                    {item.createdAt ? <p className="mt-1 text-[11px] font-semibold text-muted-foreground">{item.createdAt}</p> : null}
                  </div>
                </article>
              ))}
            </div>
            <div className="flex justify-end border-t border-border/45 px-4 py-3">
              <Button size="sm" variant="outline" onClick={() => setNotificationOpen(false)}>
                Tutup
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      className="flex min-h-10 items-center gap-3 rounded-ui px-3 text-sm font-semibold transition hover:bg-muted"
      href={href}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "E";
}

function isActiveHref(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClass(isActive: boolean, paddingClass: string) {
  return [
    "flex min-h-9 items-center gap-3 rounded-[0.9rem] text-sm font-bold transition",
    paddingClass,
    isActive
      ? "border border-secondary/30 bg-[linear-gradient(135deg,hsl(var(--secondary)/.16),hsl(var(--secondary)/.07))] text-secondary shadow-[0_14px_28px_-22px_hsl(var(--secondary))]"
      : "text-muted-foreground hover:bg-secondary/8 hover:text-secondary",
  ].join(" ");
}

function featureNavLinkClass(isActive: boolean) {
  return [
    "flex min-h-9 items-center gap-3 rounded-[0.9rem] px-3 text-[13px] font-bold transition",
    isActive
      ? "border border-secondary/30 bg-[linear-gradient(135deg,hsl(var(--secondary)/.16),hsl(var(--secondary)/.07))] text-secondary shadow-[0_14px_28px_-22px_hsl(var(--secondary))]"
      : "text-muted-foreground hover:bg-secondary/8 hover:text-secondary",
  ].join(" ");
}

function mobileNavLinkClass(isActive: boolean) {
  return [
    "flex min-h-12 flex-col items-center justify-center gap-1 rounded-ui text-[11px] font-bold transition",
    isActive
      ? "border border-secondary/25 bg-secondary/12 text-secondary shadow-[0_10px_22px_-18px_hsl(var(--secondary))]"
      : "text-muted-foreground hover:bg-secondary/10 hover:text-secondary",
  ].join(" ");
}

function titleCaseName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
