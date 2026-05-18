import { apiFetch } from "@/lib/api/client";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role?: "user" | "admin" | string;
  is_admin?: boolean;
  avatar_url: string | null;
  profile: {
    tier: string;
    credits_remaining: number;
    affiliate_code: string;
  };
};

export function isAdminUser(user: AuthUser | null | undefined) {
  return user?.role === "admin" || user?.is_admin === true;
}

export function homePathForUser(user: AuthUser) {
  return isAdminUser(user) ? "/admin/dashboard" : "/dashboard";
}

type AuthPayload = {
  success?: boolean;
  user?: AuthUser;
  message?: string;
  error?: string;
};

export async function currentUser() {
  const response = await apiFetch("/auth/me");

  if (response.status === 401) {
    return null;
  }

  const payload = (await response.json().catch(() => ({}))) as AuthPayload;

  if (!response.ok || !payload.user) {
    throw new Error(payload.message ?? payload.error ?? "Gagal membaca akun.");
  }

  return payload.user;
}

export async function loginWithPassword(input: { email: string; password: string; remember?: boolean }) {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return authResponse(response);
}

export async function registerWithPassword(input: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  affiliate_code?: string | null;
}) {
  const response = await apiFetch("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return authResponse(response);
}

export async function logout() {
  const response = await apiFetch("/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as AuthPayload;
    throw new Error(payload.message ?? payload.error ?? "Logout gagal.");
  }
}

export async function updatePassword(input: {
  current_password?: string;
  password: string;
  password_confirmation: string;
}) {
  const response = await apiFetch("/auth/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as AuthPayload;
    throw new Error(payload.message ?? payload.error ?? "Password gagal diperbarui.");
  }
}

async function authResponse(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as AuthPayload;

  if (!response.ok || !payload.user) {
    throw new Error(payload.message ?? payload.error ?? "Autentikasi gagal.");
  }

  return payload.user;
}
