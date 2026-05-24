export type BrokerType = "cfd" | "bond" | "stock" | "crypto";

export type Broker = {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  logo_url?: string;
  website: string;
  brokerType: BrokerType;
  broker_type?: BrokerType;
  createdAt?: string;
  updatedAt?: string;
};

export type User = {
  id: number;
  fullName: string;
  email: string;
};

type ApiErrorBody = {
  error?: string;
  code?: string;
};

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const data = (await res.json().catch(() => ({}))) as T & ApiErrorBody;
  if (!res.ok) {
    throw new ApiError(data.error || "Request failed", res.status, data.code);
  }
  return data as T;
}

function normalizeBroker(broker: Broker): Broker {
  return {
    ...broker,
    logoUrl: broker.logoUrl ?? broker.logo_url ?? "",
    brokerType: broker.brokerType ?? broker.broker_type ?? "cfd",
    logo_url: broker.logo_url ?? broker.logoUrl,
    broker_type: broker.broker_type ?? broker.brokerType,
  };
}

export async function getCurrentUser() {
  const data = await requestJson<{ user: User }>("/api/me");
  return data.user;
}

export async function loginUser(email: string, password: string) {
  const data = await requestJson<{ user: User; token: string; message: string }>("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return data.user;
}

export async function registerUser(payload: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const data = await requestJson<{ user: User; message: string }>("/api/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.user;
}

export async function logoutUser() {
  await requestJson<{ message: string }>("/api/logout", { method: "POST" });
}

export async function listBrokers(filters: { search?: string; type?: string } = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.type && filters.type !== "all") params.set("type", filters.type);

  const query = params.toString();
  const data = await requestJson<{ brokers: Broker[] }>(`/api/brokers${query ? `?${query}` : ""}`);
  return data.brokers.map(normalizeBroker);
}

export async function createBroker(payload: {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  website: string;
  brokerType: BrokerType;
}) {
  const data = await requestJson<{ broker: Broker; message: string }>("/api/brokers", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      logo_url: payload.logoUrl,
      website: payload.website,
      broker_type: payload.brokerType,
    }),
  });
  return normalizeBroker(data.broker);
}

export function formatApiError(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.message;
  return fallback;
}
