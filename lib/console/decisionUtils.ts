import { formatDate } from "@/lib/console/formatters";
import type { DecisionRow, LogItem } from "@/types/console";

export function computeFreshness(
  createdAt: string,
  payload: Record<string, unknown>,
): string {
  const ts = typeof payload.timestamp === "string" ? payload.timestamp : null;

  if (!ts) return "n/a";

  const created = new Date(createdAt).getTime();
  const event = new Date(ts).getTime();

  if (Number.isNaN(created) || Number.isNaN(event)) return "n/a";

  const seconds = Math.max(0, (created - event) / 1000);

  return seconds < 1
    ? `${Math.round(seconds * 1000)}ms`
    : `${seconds.toFixed(1)}s`;
}

export function formatStatus(
  eventType: string,
  integrityStatus: string,
  status?: string | null,
): string {
  if (status && status !== "PENDING") return status;
  if (eventType.includes("denied")) return "Denied";
  if (eventType.includes("shadow")) return "Shadow";
  if (integrityStatus !== "valid") return integrityStatus;

  return "Approved";
}

export function getFreshnessLevel(
  freshness: string,
): "fresh" | "borderline" | "stale" | "unknown" {
  if (freshness === "n/a") return "unknown";

  const value = Number.parseFloat(freshness);

  if (Number.isNaN(value)) return "unknown";
  if (freshness.endsWith("ms")) return "fresh";
  if (value <= 5) return "fresh";
  if (value <= 15) return "borderline";

  return "stale";
}

export function getFreshnessDotClass(freshness: string): string {
  const level = getFreshnessLevel(freshness);

  if (level === "fresh") return "bg-emerald-400";
  if (level === "borderline") return "bg-amber-400";
  if (level === "stale") return "bg-red-400";

  return "bg-white/25";
}

export function mapLogToDecision(item: LogItem): DecisionRow {
  const payload = item.payload ?? {};

  return {
    id: item.log_id,
    traceId: item.trace_id,
    sessionId: item.session_id,
    workflowId: item.workflow_id,
    agent: item.source,
    operation: item.event_type,
    amount: formatDecisionAmount(payload),
    timestamp: formatDate(item.created_at),
    freshness: computeFreshness(item.created_at, payload),
    status: formatStatus(
      item.event_type,
      item.integrity_status,
      item.status,
    ),
    integrityStatus: item.integrity_status,
    chainHash: item.chain_hash,
    createdAt: item.created_at,
  };
}

function formatDecisionAmount(payload: Record<string, unknown>): string {
  const data =
    (payload.data as Record<string, unknown> | undefined) ?? payload;

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
      return String(normalized);
    }
  }

  return "n/a";
}