"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Panel } from "@/components/ui/panel";
import { googleLoginUrl } from "@/lib/api/client";
import { homePathForUser, isAdminUser, loginWithPassword, registerWithPassword } from "@/lib/api/auth";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginShell />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const redirectTo = searchParams.get("next");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const user =
        mode === "login"
          ? await loginWithPassword({ email, password, remember: true })
          : await registerWithPassword({
              name,
              email,
              password,
              password_confirmation: passwordConfirmation,
              affiliate_code: window.localStorage.getItem("editins_ref"),
            });

      setUser(user);
      const fallbackPath = homePathForUser(user);
      const nextPath = redirectTo?.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : null;
      const nextIsAdminArea = nextPath === "/admin" || nextPath?.startsWith("/admin/");

      router.push(nextPath && (!nextIsAdminArea || isAdminUser(user)) ? nextPath : fallbackPath);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login gagal.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <LoginShell>
      <a href={googleLoginUrl()} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-ui border border-border/55 bg-background/40 px-4 text-sm font-semibold transition hover:bg-muted">
        <Mail className="h-4 w-4" />
        Lanjut dengan Google
      </a>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-semibold uppercase text-muted-foreground">atau password</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-1 rounded-ui border border-border/55 bg-background/40 p-1">
        {[
          { key: "login", label: "Login" },
          { key: "register", label: "Daftar" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            className={
              mode === item.key
                ? "min-h-9 rounded-ui bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-soft"
                : "min-h-9 rounded-ui px-3 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
            }
            onClick={() => setMode(item.key as "login" | "register")}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form className="grid gap-3" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <Input value={name} placeholder="Nama lengkap" onChange={(event) => setName(event.target.value)} required />
        ) : null}
        <Input value={email} type="email" placeholder="Email" onChange={(event) => setEmail(event.target.value)} required />
        <Input value={password} type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} required />
        {mode === "register" ? (
          <Input
            value={passwordConfirmation}
            type="password"
            placeholder="Konfirmasi password"
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            required
          />
        ) : null}

        {errorMessage ? (
          <div className="rounded-ui border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">
            {errorMessage}
          </div>
        ) : null}

        <Button className="min-h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Memproses" : mode === "login" ? "Login" : "Daftar"}
        </Button>
      </form>
    </LoginShell>
  );
}

function LoginShell({ children }: { children?: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <Panel className="overflow-hidden">
          <div className="border-b border-border/45 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-ui bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-lg font-semibold">Masuk ke Editins</h1>
                <p className="mt-1 text-sm font-medium text-muted-foreground">Masuk untuk menyimpan hasil foto dan kredit Anda.</p>
              </div>
            </div>
          </div>
          <div className="p-5">{children ?? <div className="h-56 animate-pulse rounded-ui bg-muted" />}</div>
        </Panel>
      </div>
    </main>
  );
}
