export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type BlocklogSession = {
  accessToken?: string;
  companyId?: string;
  expiresAt?: number;
  role?: string;
};

const EMPTY_SESSION: BlocklogSession = {};
let cachedSessionRaw: string | null = null;
let cachedSessionValue: BlocklogSession = EMPTY_SESSION;
const SESSION_KEY = "blocklog-session";
const SESSION_COOKIE = "blocklog_session";
const DEFAULT_SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const SESSION_EVENT = "blocklog:session-change";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BLOCKLOG_API_BASE_URL ??
  process.env.BLOCKLOG_API_BASE_URL ??
  "http://127.0.0.1:8000/api/v1";

function hasWindow() {
  return typeof window !== "undefined";
}

function syncSessionCookie(session?: BlocklogSession) {
  if (!hasWindow()) {
    return;
  }

  if (!session?.accessToken || !session.expiresAt) {
    document.cookie = `${SESSION_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    return;
  }

  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(session.accessToken)}; path=/; expires=${new Date(session.expiresAt).toUTCString()}; SameSite=Lax`;
}

function emitSessionChange() {
  if (!hasWindow()) {
    return;
  }

  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function isSessionValid(session: BlocklogSession) {
  return Boolean(session.accessToken && session.expiresAt && session.expiresAt > Date.now());
}

export function readSession(): BlocklogSession {
  if (!hasWindow()) {
    return EMPTY_SESSION;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) {
      cachedSessionRaw = null;
      cachedSessionValue = EMPTY_SESSION;
      return EMPTY_SESSION;
    }

    if (raw === cachedSessionRaw) {
      return cachedSessionValue;
    }

    const parsed = JSON.parse(raw) as BlocklogSession & { token?: string };
    const session: BlocklogSession = {
      accessToken: parsed.accessToken ?? parsed.token,
      companyId: parsed.companyId,
      expiresAt: parsed.expiresAt,
      role: typeof parsed.role === "string" ? parsed.role : undefined,
    };
    if (!isSessionValid(session)) {
      clearSession();
      return EMPTY_SESSION;
    }

    cachedSessionRaw = raw;
    cachedSessionValue = session;
    return session;
  } catch {
    cachedSessionRaw = null;
    cachedSessionValue = EMPTY_SESSION;
    return EMPTY_SESSION;
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
  emitSessionChange();
}

export function clearSession() {
  if (!hasWindow()) {
    return;
  }

  cachedSessionRaw = null;
  cachedSessionValue = EMPTY_SESSION;
  window.localStorage.removeItem(SESSION_KEY);
  syncSessionCookie();
  emitSessionChange();
}

export function subscribeSession(listener: () => void) {
  if (!hasWindow()) {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === SESSION_KEY) {
      listener();
    }
  };

  window.addEventListener(SESSION_EVENT, listener);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(SESSION_EVENT, listener);
    window.removeEventListener("storage", handleStorage);
  };
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

  if (session.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  if (session.companyId) {
    headers["X-Company-ID"] = session.companyId;
  }

  const maxAttempts = method === "GET" ? 3 : 2;
  let attempt = 0;
  let response: Response | null = null;
  let text = "";

  while (attempt < maxAttempts) {
    try {
      response = await fetch(buildApiUrl(path), {
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
  const contentType = response.headers.get("content-type") ?? "";
  if (text && contentType.includes("json")) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = { message: text };
    }
  } else if (text) {
    data = text;
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
    }
    const detail =
      (typeof data === "string" ? data : undefined) ||
      (data as { detail?: string; message?: string })?.detail ||
      (data as { detail?: string; message?: string })?.message ||
      `Request failed (${response.status})`;
    throw new Error(detail);
  }

  return data as T;
}

export function buildApiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedBase = API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
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
