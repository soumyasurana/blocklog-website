export function formatAmount(payload: Record<string, unknown>): string {
  const data = (payload.data as Record<string, unknown> | undefined) ?? payload;
  const amount = data.amount ?? data.amount_minor ?? data.value;
  const currency = String(data.currency ?? "USD").toUpperCase();
  if (typeof amount === "number") {
    const normalized = amount > 999 ? amount / 100 : amount;
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(normalized);
    } catch {
      return `${normalized}`;
    }
  }
  return "n/a";
}

export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleString("en-US", {
      timeZone: "UTC",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function truncateId(id: string, len = 12): string {
  return id.length > len ? id.slice(0, len) : id;
}

export function truncateHash(hash: string, len = 18): string {
  return hash.length > len ? `${hash.slice(0, len)}…` : hash;
}
