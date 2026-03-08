export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type BlocklogSession = {
  token?: string;
  companyId?: string;
  apiKey?: string;
};

const SESSION_KEY = "blocklog-session";

export function readSession(): BlocklogSession {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as BlocklogSession;
  } catch {
    return {};
  }
}

export function writeSession(session: BlocklogSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}

export async function blocklogRequest<T>(
  path: string,
  method: HttpMethod = "GET",
  body?: unknown,
  overrides: Record<string, string> = {},
): Promise<T> {
  const session = readSession();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...overrides,
  };

  if (session.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  if (session.companyId) {
    headers["X-Company-ID"] = session.companyId;
  }

  if (session.apiKey) {
    headers["X-API-Key"] = session.apiKey;
  }

  const response = await fetch(`/api/blocklog${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const detail =
      (data as { detail?: string; message?: string })?.detail ||
      (data as { detail?: string; message?: string })?.message ||
      `Request failed (${response.status})`;
    throw new Error(detail);
  }

  return data as T;
}

export function normalizePayload<T>(
  payload: unknown,
  fallback: T,
  key?: string,
): T {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  if (key && key in payload) {
    return (payload as Record<string, T>)[key] ?? fallback;
  }

  if ("data" in payload) {
    const value = (payload as { data?: T }).data;
    return value ?? fallback;
  }

  return payload as T;
}
