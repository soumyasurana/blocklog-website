export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type BlocklogSession = {
  token?: string;
  companyId?: string;
  apiKey?: string;
  expiresAt?: number;
};

const SESSION_KEY = "blocklog-session";
const SESSION_COOKIE = "blocklog_session";
const DEFAULT_SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function hasWindow() {
  return typeof window !== "undefined";
}

function syncSessionCookie(session?: BlocklogSession) {
  if (!hasWindow()) {
    return;
  }

  if (!session?.token || !session.expiresAt) {
    document.cookie = `${SESSION_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    return;
  }

  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(session.token)}; path=/; expires=${new Date(
    session.expiresAt,
  ).toUTCString()}; SameSite=Lax`;
}

export function isSessionValid(session: BlocklogSession) {
  return Boolean(session.token && session.expiresAt && session.expiresAt > Date.now());
}

export function readSession(): BlocklogSession {
  if (!hasWindow()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return {};
    const session = JSON.parse(raw) as BlocklogSession;
    if (!isSessionValid(session)) {
      clearSession();
      return {};
    }
    return session;
  } catch {
    return {};
  }
}

export function writeSession(
  session: BlocklogSession,
  ttlMs: number = DEFAULT_SESSION_TTL_MS,
) {
  if (!hasWindow()) {
    return;
  }

  const expiresAt = session.expiresAt ?? Date.now() + ttlMs;
  const nextSession = { ...session, expiresAt };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
  syncSessionCookie(nextSession);
}

export function clearSession() {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
  syncSessionCookie();
}

export function requireValidSession() {
  const session = readSession();
  if (!isSessionValid(session)) {
    clearSession();
    throw new Error("Session expired. Please log in again.");
  }
  return session;
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

  const maxAttempts = method === "GET" ? 3 : 2;
  let attempt = 0;
  let response: Response | null = null;
  let text = "";

  while (attempt < maxAttempts) {
    try {
      response = await fetch(`/api/blocklog${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      text = await response.text();

      if (response.status < 500 || attempt === maxAttempts - 1) {
        break;
      }
    } catch (error) {
      if (attempt === maxAttempts - 1) {
        throw error;
      }
    }

    attempt += 1;
    await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
  }

  if (!response) {
    throw new Error("Network request failed");
  }

  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
    }
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
