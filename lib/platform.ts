const API_BASE_URL =
  process.env.NEXT_PUBLIC_BLOCKLOG_API_BASE_URL ??
  process.env.BLOCKLOG_API_BASE_URL ??
  "http://127.0.0.1:8000/api/v1";

const DASHBOARD_BASE_URL =
  process.env.NEXT_PUBLIC_BLOCKLOG_DASHBOARD_URL ??
  process.env.NEXT_PUBLIC_APP_DASHBOARD_URL ??
  "";

export function buildMarketingApiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedBase = API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export function buildDashboardUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!DASHBOARD_BASE_URL) {
    return normalizedPath;
  }

  return `${DASHBOARD_BASE_URL.replace(/\/$/, "")}${normalizedPath}`;
}
