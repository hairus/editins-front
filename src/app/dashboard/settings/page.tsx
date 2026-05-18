"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  BellRing,
  Copy,
  CreditCard,
  KeyRound,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { AuthRequired } from "@/components/auth-required";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Panel } from "@/components/ui/panel";
import { updatePassword } from "@/lib/api/auth";
import { tierMarketingLabel } from "@/lib/marketing-copy";
import { notifyApp } from "@/lib/notify";

export default function SettingsPage() {
  const router = useRouter();
  const { user, refreshUser, logout } = useAuth();
  const displayName = user ? titleCaseName(user.name) : "";
  const [isRefreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [compactHistory, setCompactHistory] = useState(true);
  const [creditAlerts, setCreditAlerts] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [isSavingPassword, setSavingPassword] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    await refreshUser().catch((error) => {
      notifyApp({
        title: "Akun belum bisa diperbarui",
        detail: error instanceof Error ? error.message : "Gagal memperbarui data akun.",
        tone: "danger",
      });
    });
    setRefreshing(false);
  }

  async function handleCopyAffiliate() {
    if (!user?.profile.affiliate_code) return;

    await navigator.clipboard.writeText(user.profile.affiliate_code).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function handleLogout() {
    await logout().catch(() => undefined);
    router.push("/login");
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPassword(true);

    try {
      await updatePassword({
        current_password: currentPassword || undefined,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      });
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirmation("");
      notifyApp({
        title: "Password tersimpan",
        detail: "Akun ini sekarang bisa login memakai email dan password.",
        tone: "success",
      });
    } catch (error) {
      notifyApp({
        title: "Password gagal diperbarui",
        detail: error instanceof Error ? error.message : "Coba gunakan password yang lebih kuat.",
        tone: "danger",
      });
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <AppShell>
      <AuthRequired>
        <section className="app-container pb-24 pt-8">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase text-muted-foreground">Akun Saya</p>
                <h1 className="mt-2 text-xl font-semibold tracking-normal">Pengaturan</h1>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
                  Atur profil, kredit, referral, dan kenyamanan tampilan di satu tempat.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" disabled={isRefreshing} onClick={handleRefresh}>
                  <RefreshCw className={isRefreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                  Refresh
                </Button>
                <Link href="/billing">
                  <Button size="sm">
                    <CreditCard className="h-4 w-4" />
                    Top up
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-ui border border-border/45 bg-[linear-gradient(135deg,rgba(52,119,207,.20),rgba(244,159,67,.16)_52%,rgba(255,255,255,.05))] p-4 shadow-soft">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-ui bg-background/65 text-sm font-black shadow-soft">
                    {initials(displayName || "Editins")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold">{displayName}</p>
                    <p className="truncate text-sm font-medium text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <AccountChip label="Paket" value={tierMarketingLabel(user?.profile.tier)} />
                  <AccountChip label="Kredit" value={String(user?.profile.credits_remaining ?? "-")} />
                  <AccountChip label="User ID" value={String(user?.id ?? "-")} />
                </div>
              </div>
            </div>

            <div className="mt-4 grid items-start gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="grid gap-4">
                <Panel className="overflow-hidden">
                  <SectionHeader icon={UserRound} title="Profil Akun" badge="Akun aktif" />
                  <div className="grid gap-3 p-4 sm:grid-cols-2">
                    <ReadOnlyField label="Nama" value={displayName || "-"} />
                    <ReadOnlyField disabled label="Email dari Google" value={user?.email ?? "-"} />
                    <ReadOnlyField label="Paket" value={tierMarketingLabel(user?.profile.tier)} />
                    <ReadOnlyField label="Kredit aktif" value={`${user?.profile.credits_remaining ?? 0} kredit`} />
                  </div>
                </Panel>

                <Panel className="overflow-hidden">
                  <SectionHeader icon={Sparkles} title="Preferensi Tampilan" badge="Browser ini" />
                  <div className="divide-y divide-border/55">
                    <ToggleRow
                      checked={compactHistory}
                      description="Riwayat pekerjaan tampil lebih ringkas agar halaman tetap mudah dibaca."
                      icon={BadgeCheck}
                      label="Riwayat ringkas"
                      onChange={setCompactHistory}
                    />
                    <ToggleRow
                      checked={creditAlerts}
                      description="Lonceng memberi kabar saat kredit menipis atau proses foto belum berhasil."
                      icon={BellRing}
                      label="Alert kredit"
                      onChange={setCreditAlerts}
                    />
                    <div className="flex items-center justify-between gap-4 px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-ui bg-muted text-muted-foreground">
                          <ShieldCheck className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">Mode tampilan</p>
                          <p className="mt-0.5 text-xs font-medium leading-5 text-muted-foreground">
                            Ikuti pilihan warna yang tersimpan di browser ini.
                          </p>
                        </div>
                      </div>
                      <ThemeToggle />
                    </div>
                  </div>
                </Panel>

                <Panel className="overflow-hidden">
                  <SectionHeader icon={KeyRound} title="Password" badge="Login email" />
                  <form className="grid gap-3 p-4" onSubmit={handlePasswordSubmit}>
                    <p className="text-sm font-medium leading-6 text-muted-foreground">
                      Jika akun dibuat dari Google, kosongkan password lama dan isi password baru untuk mengaktifkan login email/password.
                    </p>
                    <Input
                      autoComplete="current-password"
                      placeholder="Password lama (kosongkan jika akun Google)"
                      type="password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                    />
                    <Input
                      autoComplete="new-password"
                      minLength={8}
                      placeholder="Password baru"
                      required
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                    />
                    <Input
                      autoComplete="new-password"
                      minLength={8}
                      placeholder="Konfirmasi password baru"
                      required
                      type="password"
                      value={newPasswordConfirmation}
                      onChange={(event) => setNewPasswordConfirmation(event.target.value)}
                    />
                    <Button className="w-full sm:w-fit" disabled={isSavingPassword}>
                      {isSavingPassword ? <RefreshCw className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                      Simpan Password
                    </Button>
                  </form>
                </Panel>
              </div>

              <div className="grid gap-4">
                <Panel className="overflow-hidden">
                  <SectionHeader icon={CreditCard} title="Paket & Kredit" badge="Aktif" />
                  <div className="p-4">
                    <div className="rounded-ui border border-warning/25 bg-warning/10 p-3">
                      <p className="text-sm font-semibold">Kredit aktif: {user?.profile.credits_remaining ?? 0}</p>
                      <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">
                        Semua pembuatan foto, termasuk mockup, memakai kredit akun yang sedang aktif.
                      </p>
                    </div>
                    <Link className="mt-3 block" href="/billing">
                      <Button className="w-full" variant="outline">
                        <CreditCard className="h-4 w-4" />
                        Beli atau Kelola Paket
                      </Button>
                    </Link>
                  </div>
                </Panel>

                <Panel className="overflow-hidden">
                  <SectionHeader icon={KeyRound} title="Referral" badge="Kode" />
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3 rounded-ui border border-border/55 bg-background/45 p-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">Kode referral</p>
                        <p className="mt-1 truncate text-sm font-bold">{user?.profile.affiliate_code ?? "-"}</p>
                      </div>
                      <Button size="icon" variant="outline" aria-label="Copy kode affiliate" onClick={handleCopyAffiliate}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-2 min-h-5 text-xs font-semibold text-success">{copied ? "Kode affiliate disalin." : ""}</p>
                  </div>
                </Panel>

                <Panel className="overflow-hidden border-destructive/25">
                  <SectionHeader icon={LogOut} title="Akses Akun" badge="Aman" tone="danger" />
                  <div className="p-4">
                    <p className="text-sm font-medium leading-6 text-muted-foreground">
                      Keluar akan mengakhiri akses akun di browser ini dan mengarahkan kembali ke halaman masuk.
                    </p>
                    <Button className="mt-3 w-full" variant="danger" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                      Keluar
                    </Button>
                  </div>
                </Panel>
              </div>
            </div>
          </div>
        </section>
      </AuthRequired>
    </AppShell>
  );
}

function SectionHeader({
  badge,
  icon: Icon,
  title,
  tone = "neutral",
}: {
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tone?: "neutral" | "danger";
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/55 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-ui bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <Badge tone={tone === "danger" ? "danger" : "neutral"}>{badge}</Badge>
    </div>
  );
}

function AccountChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[96px] rounded-ui border border-border/45 bg-background/55 px-3 py-2">
      <p className="text-[10px] font-bold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm font-black">{value}</p>
    </div>
  );
}

function ReadOnlyField({ disabled = false, label, value }: { disabled?: boolean; label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <input
        className="mt-1 h-10 w-full rounded-ui border border-input/50 bg-background/45 px-3 text-sm font-semibold outline-none disabled:cursor-not-allowed disabled:bg-muted/45 disabled:text-muted-foreground"
        disabled={disabled}
        readOnly
        value={value}
      />
    </label>
  );
}

function ToggleRow({
  checked,
  description,
  icon: Icon,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-ui bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{label}</p>
          <p className="mt-0.5 text-xs font-medium leading-5 text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        aria-checked={checked}
        aria-label={label}
        className={checked ? "relative h-7 w-12 rounded-full bg-primary" : "relative h-7 w-12 rounded-full bg-muted"}
        role="switch"
        type="button"
        onClick={() => onChange(!checked)}
      >
        <span
          className={
            checked
              ? "absolute right-1 top-1 h-5 w-5 rounded-full bg-primary-foreground shadow-soft transition"
              : "absolute left-1 top-1 h-5 w-5 rounded-full bg-background shadow-soft transition"
          }
        />
      </button>
    </div>
  );
}

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "E"
  );
}

function titleCaseName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
