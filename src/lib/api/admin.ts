import { apiFetch } from "@/lib/api/client";

export type AdminTone = "success" | "warning" | "neutral" | "danger" | "accent";
export type ProvenanceStatus = "valid" | "missing" | "invalid" | "mismatch" | "unsupported";
export type AdminGenerationProvenanceStatus = ProvenanceStatus | "unknown";

export type AdminOverview = {
  success: boolean;
  metrics: {
    total_users: number;
    new_users_today: number;
    paid_revenue_today_idr: number;
    paid_transactions_today: number;
    success_rate_today: number;
    active_users_24h: number;
    cost_today_idr: number;
  };
  funnels: {
    trial_users: number;
    starter_users: number;
    pro_users: number;
    vip_users: number;
  };
  alerts: Array<{
    title: string;
    status: string;
    tone: Exclude<AdminTone, "accent">;
    detail: string;
  }>;
};

export type AdminUserSummary = {
  id: number;
  name: string;
  email: string;
  role?: string;
  tier: string;
  trial_credits: number;
  monthly_credits: number;
  credits_used_this_month: number;
  available_credits: number;
  created_at: string;
};

export type AdminGeneration = {
  id: string;
  user: { id: number; name: string; email: string } | null;
  feature: string;
  status: "queued" | "processing" | "success" | "failed";
  output_image_url: string | null;
  input_image_url?: string | null;
  prompt_used?: string | null;
  parameters?: Record<string, unknown> | null;
  error_message?: string | null;
  cost_idr: number | null;
  duration_ms: number | null;
  credits_consumed: number | null;
  provenance_status: AdminGenerationProvenanceStatus;
  created_at: string;
};

export type AdminPayment = {
  id: string;
  user: { id: number; name: string; email: string } | null;
  tripay_merchant_ref: string;
  tripay_ref: string | null;
  product_type: string;
  product_id: string;
  amount_idr: number;
  payment_method: string | null;
  status: "pending" | "paid" | "expired" | "failed";
  paid_at: string | null;
  created_at: string;
};

export type AdminRevenueUser = {
  user: { id: number; name: string; email: string } | null;
  tier: string | null;
  total_paid_idr: number;
  paid_transactions: number;
  first_paid_at: string | null;
  last_paid_at: string | null;
};

export type AdminRevenueReport = {
  success: boolean;
  metrics: {
    total_paid_revenue_idr: number;
    paid_revenue_today_idr: number;
    paid_revenue_month_idr: number;
    paying_users: number;
    paid_transactions: number;
  };
  data: AdminRevenueUser[];
};

export type AdminAffiliateWithdrawal = {
  id: string;
  affiliate: { id: number; name: string; email: string } | null;
  amount_idr: number;
  method: "DANA" | "GOPAY" | "OVO" | "BANK";
  account_number_masked: string;
  account_name: string;
  status: "pending" | "approved" | "rejected" | "paid";
  created_at: string;
};

export type AdminServiceHealth = {
  success: boolean;
  environment: string;
  debug: boolean;
  gemini_configured: boolean;
  gemini_fake_mode: boolean;
  tripay_configured: boolean;
  scheduler_token_configured: boolean;
  storage_disk: string;
  max_upload_size_kb: number;
  daily_generate_cap_idr: number;
};

export type ProvenanceResult = {
  success: boolean;
  status: ProvenanceStatus;
  payload: {
    issuer: string;
    claims: {
      generation_id: string;
      user_id: number | null;
      feature: string;
      created_at: string;
    };
  } | null;
  checks: {
    signature_valid: boolean;
    matched_database_record: boolean;
    matched_user: boolean;
    matched_feature: boolean;
    content_hash_status: "matched" | "mismatch" | "not_checked";
  };
  reason: string | null;
};

export type PaginatedResponse<T> = {
  success: boolean;
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
  };
};

type QueryValue = string | number | boolean | null | undefined;

const mockUsers: AdminUserSummary[] = [
  {
    id: 1,
    name: "Editins Admin",
    email: "admin@editins.local",
    tier: "vip",
    role: "admin",
    trial_credits: 0,
    monthly_credits: 9999,
    credits_used_this_month: 128,
    available_credits: 9871,
    created_at: "2026-05-17T02:12:00Z",
  },
  {
    id: 2,
    name: "Nadia Studio",
    email: "nadia@example.com",
    tier: "pro",
    role: "user",
    trial_credits: 0,
    monthly_credits: 200,
    credits_used_this_month: 47,
    available_credits: 153,
    created_at: "2026-05-17T04:28:00Z",
  },
  {
    id: 3,
    name: "Rafi Food Lab",
    email: "rafi@example.com",
    tier: "starter",
    role: "user",
    trial_credits: 0,
    monthly_credits: 30,
    credits_used_this_month: 12,
    available_credits: 18,
    created_at: "2026-05-16T10:44:00Z",
  },
];

const mockGenerations: AdminGeneration[] = [
  {
    id: "gen_foto_produk_01",
    user: { id: 2, name: "Nadia Studio", email: "nadia@example.com" },
    feature: "foto-produk",
    status: "success",
    output_image_url: "/logo.png",
    input_image_url: "/logo.png",
    prompt_used: "Buat foto produk katalog dengan cahaya lembut, background bersih, dan komposisi marketplace.",
    parameters: { aspect_ratio: "1:1", mock_mode: true, output_mime_type: "image/png" },
    cost_idr: 0,
    duration_ms: 842,
    credits_consumed: 1,
    provenance_status: "valid",
    created_at: "2026-05-17T05:10:00Z",
  },
  {
    id: "gen_mockup_02",
    user: { id: 3, name: "Rafi Food Lab", email: "rafi@example.com" },
    feature: "buat-mockup",
    status: "success",
    output_image_url: "/logo.png",
    input_image_url: null,
    prompt_used: "Tempatkan desain label ke mockup kemasan pouch makanan dengan bayangan realistis.",
    parameters: { aspect_ratio: "1:1", mock_mode: true, output_mime_type: "image/png" },
    cost_idr: 0,
    duration_ms: 1130,
    credits_consumed: 2,
    provenance_status: "valid",
    created_at: "2026-05-17T03:55:00Z",
  },
  {
    id: "gen_failed_03",
    user: { id: 2, name: "Nadia Studio", email: "nadia@example.com" },
    feature: "foto-fashion",
    status: "failed",
    output_image_url: null,
    input_image_url: null,
    prompt_used: "Foto katalog fashion dengan model dan lighting editorial.",
    parameters: { aspect_ratio: "4:5" },
    error_message: "AI provider belum tersedia di mode development.",
    cost_idr: 0,
    duration_ms: 391,
    credits_consumed: 1,
    provenance_status: "missing",
    created_at: "2026-05-16T19:20:00Z",
  },
];

const mockPayments: AdminPayment[] = [
  {
    id: "trx_001",
    user: { id: 2, name: "Nadia Studio", email: "nadia@example.com" },
    tripay_merchant_ref: "EDITINS-20260517-AB12CD",
    tripay_ref: "T123456789",
    product_type: "tier_upgrade",
    product_id: "pro",
    amount_idr: 59000,
    payment_method: "QRIS",
    status: "paid",
    paid_at: "2026-05-17T05:01:00Z",
    created_at: "2026-05-17T04:58:00Z",
  },
  {
    id: "trx_002",
    user: { id: 3, name: "Rafi Food Lab", email: "rafi@example.com" },
    tripay_merchant_ref: "EDITINS-20260517-CD34EF",
    tripay_ref: null,
    product_type: "boost_credit",
    product_id: "boost_100",
    amount_idr: 30000,
    payment_method: "VA",
    status: "pending",
    paid_at: null,
    created_at: "2026-05-17T06:12:00Z",
  },
];

const mockWithdrawals: AdminAffiliateWithdrawal[] = [
  {
    id: "wd_001",
    affiliate: { id: 2, name: "Nadia Studio", email: "nadia@example.com" },
    amount_idr: 75000,
    method: "BANK",
    account_number_masked: "**** **** 1842",
    account_name: "Nadia Putri",
    status: "pending",
    created_at: "2026-05-17T01:15:00Z",
  },
  {
    id: "wd_002",
    affiliate: { id: 3, name: "Rafi Food Lab", email: "rafi@example.com" },
    amount_idr: 50000,
    method: "DANA",
    account_number_masked: "**** **** 7751",
    account_name: "Rafi Ananda",
    status: "paid",
    created_at: "2026-05-15T08:22:00Z",
  },
];

export async function adminOverview(): Promise<AdminOverview> {
  return adminGet("/admin/overview", mockOverview());
}

export async function adminGenerations(params: Record<string, QueryValue> = {}): Promise<PaginatedResponse<AdminGeneration>> {
  const filtered = filterRows(mockGenerations, params.search, (generation) => [generation.id, generation.user?.email, generation.user?.name, generation.feature]);
  return adminGet(`/admin/generations${queryString(params)}`, paginate(filtered));
}

export async function adminGenerationDetail(id: string): Promise<{ success: boolean; data: AdminGeneration }> {
  const generation = mockGenerations.find((item) => item.id === id) ?? mockGenerations[0];
  return adminGet(`/admin/generations/${id}`, { success: true, data: generation });
}

export async function adminGenerationProvenance(id: string): Promise<ProvenanceResult> {
  const generation = mockGenerations.find((item) => item.id === id) ?? mockGenerations[0];
  return adminGet(`/admin/generations/${id}/provenance`, mockProvenance(generation));
}

export async function verifyProvenanceUpload(file: File): Promise<ProvenanceResult> {
  const formData = new FormData();
  formData.append("image", file);

  return adminPost("/admin/provenance/verify", formData, mockProvenance(mockGenerations[0]));
}

export async function adminUsers(params: Record<string, QueryValue> = {}): Promise<PaginatedResponse<AdminUserSummary>> {
  const filtered = filterRows(mockUsers, params.search, (user) => [user.name, user.email, user.role, user.tier]).filter((user) => !params.tier || user.tier === params.tier);
  return adminGet(`/admin/users${queryString(params)}`, paginate(filtered));
}

export async function adminPayments(params: Record<string, QueryValue> = {}): Promise<PaginatedResponse<AdminPayment>> {
  const filtered = filterRows(mockPayments, params.search, (payment) => [payment.id, payment.tripay_merchant_ref, payment.user?.email, payment.product_id]).filter((payment) => !params.status || payment.status === params.status);
  return adminGet(`/admin/payments${queryString(params)}`, paginate(filtered));
}

export async function adminRevenue(params: Record<string, QueryValue> = {}): Promise<AdminRevenueReport> {
  const paidPayments = filterRows(mockPayments.filter((payment) => payment.status === "paid"), params.search, (payment) => [payment.user?.email, payment.user?.name, payment.product_id]);
  const rows = paidPayments.map((payment) => {
    const mockUser = mockUsers.find((user) => user.id === payment.user?.id);

    return {
      user: payment.user,
      tier: mockUser?.tier ?? null,
      total_paid_idr: payment.amount_idr,
      paid_transactions: 1,
      first_paid_at: payment.paid_at,
      last_paid_at: payment.paid_at,
    };
  });
  const totalPaid = rows.reduce((total, row) => total + row.total_paid_idr, 0);

  return adminGet(`/admin/revenue${queryString(params)}`, {
    success: true,
    metrics: {
      total_paid_revenue_idr: totalPaid,
      paid_revenue_today_idr: totalPaid,
      paid_revenue_month_idr: totalPaid,
      paying_users: rows.length,
      paid_transactions: rows.reduce((total, row) => total + row.paid_transactions, 0),
    },
    data: rows,
  });
}

export async function adminAffiliateWithdrawals(params: Record<string, QueryValue> = {}): Promise<PaginatedResponse<AdminAffiliateWithdrawal>> {
  const filtered = filterRows(mockWithdrawals, params.search, (withdrawal) => [withdrawal.id, withdrawal.affiliate?.email, withdrawal.account_name, withdrawal.method]);
  return adminGet(`/admin/affiliate/withdrawals${queryString(params)}`, paginate(filtered));
}

export async function adminServiceHealth(): Promise<AdminServiceHealth> {
  return adminGet("/admin/service-health", {
    success: true,
    environment: "local",
    debug: true,
    gemini_configured: true,
    gemini_fake_mode: true,
    tripay_configured: false,
    scheduler_token_configured: false,
    storage_disk: "local/public",
    max_upload_size_kb: 10240,
    daily_generate_cap_idr: 200000,
  });
}

async function adminGet<T>(path: string, fallback: T): Promise<T> {
  const response = await apiFetch(path);

  if (!response.ok) {
    return fallback;
  }

  return response.json().catch(() => fallback) as Promise<T>;
}

async function adminPost<T>(path: string, body: BodyInit, fallback: T): Promise<T> {
  const response = await apiFetch(path, { method: "POST", body });

  if (!response.ok) {
    return fallback;
  }

  return response.json().catch(() => fallback) as Promise<T>;
}

function mockOverview(): AdminOverview {
  return {
    success: true,
    metrics: {
      total_users: mockUsers.length,
      new_users_today: 2,
      paid_revenue_today_idr: mockPayments.filter((item) => item.status === "paid").reduce((total, item) => total + item.amount_idr, 0),
      paid_transactions_today: mockPayments.filter((item) => item.status === "paid").length,
      success_rate_today: 67,
      active_users_24h: 2,
      cost_today_idr: mockGenerations.reduce((total, item) => total + (item.cost_idr ?? 0), 0),
    },
    funnels: {
      trial_users: 0,
      starter_users: 1,
      pro_users: 1,
      vip_users: 1,
    },
    alerts: [
      { title: "Mode development", status: "mock aktif", tone: "warning", detail: "Gemini fake mode aktif. Cocok untuk frontend dan QA lokal." },
      { title: "Provenance", status: "siap dicek", tone: "success", detail: "Output baru akan membawa metadata bertanda tangan." },
    ],
  };
}

function mockProvenance(generation: AdminGeneration): ProvenanceResult {
  const isValid = generation.provenance_status === "valid";
  const status: ProvenanceStatus = generation.provenance_status === "unknown" ? "missing" : generation.provenance_status;

  return {
    success: true,
    status,
    payload: isValid
      ? {
          issuer: "Editins",
          claims: {
            generation_id: generation.id,
            user_id: generation.user?.id ?? null,
            feature: generation.feature,
            created_at: generation.created_at,
          },
        }
      : null,
    checks: {
      signature_valid: isValid,
      matched_database_record: isValid,
      matched_user: isValid,
      matched_feature: isValid,
      content_hash_status: "not_checked",
    },
    reason: isValid ? null : "Metadata provenance belum ditemukan pada file ini.",
  };
}

function paginate<T>(data: T[]): PaginatedResponse<T> {
  return {
    success: true,
    data,
    meta: {
      current_page: 1,
      per_page: data.length || 20,
      total: data.length,
    },
  };
}

function filterRows<T>(rows: T[], search: QueryValue, fields: (row: T) => Array<string | number | null | undefined>) {
  const term = String(search ?? "").trim().toLowerCase();

  if (!term) return rows;

  return rows.filter((row) => fields(row).join(" ").toLowerCase().includes(term));
}

function queryString(params: Record<string, QueryValue>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const serialized = query.toString();

  return serialized ? `?${serialized}` : "";
}
