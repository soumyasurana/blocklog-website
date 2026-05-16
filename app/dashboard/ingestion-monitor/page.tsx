"use client";

import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

type DebugEvent = {
  event?: "raw_request" | "processed_log" | "error";
  recorded_at?: string;
  payload?: {
    event_type?: string;
    source?: string;
    log_id?: string;
    idempotency_key?: string | null;
    reason?: string;
    message?: string;
  };
};

type StreamLine = {
  line: string;
  status: "verified" | "pending" | "failed";
};

const fallback: StreamLine[] = [
  { line: "[12:01:22] user.login", status: "verified" },
  { line: "[12:01:23] payment.created", status: "pending" },
  { line: "[12:01:25] invoice.generated", status: "failed" },
];

export default function IngestionMonitorPage() {
  const [lines, setLines] = useState<StreamLine[]>(fallback);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStream() {
      try {
        const debug = await blocklogRequest<{ events?: DebugEvent[] }>(
          "/logs/debug/recent?limit=12",
        );
        const recent = (debug.events ?? []).slice(0, 12);
        if (recent.length === 0) {
          setLines([]);
          return;
        }

        const stream = recent.map((event) => {
          const status =
            event.event === "processed_log"
              ? "verified"
              : event.event === "error"
                ? "failed"
                : "pending";
          const label =
            event.payload?.event_type ??
            event.payload?.reason ??
            event.payload?.log_id ??
            "ingestion.event";
          const source = event.payload?.source ? ` via ${event.payload.source}` : "";
          const suffix = event.payload?.idempotency_key
            ? ` [${event.payload.idempotency_key}]`
            : "";

          return {
            line: `[${new Date(event.recorded_at ?? Date.now()).toLocaleTimeString()}] ${label}${source}${suffix}`,
            status,
          } satisfies StreamLine;
        });

        setLines(stream);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load stream");
      }
    }

    loadStream();
    const timer = setInterval(loadStream, 15000);
    return () => clearInterval(timer);
  }, []);

  const totals = {
    verified: lines.filter((entry) => entry.status === "verified").length,
    pending: lines.filter((entry) => entry.status === "pending").length,
    failed: lines.filter((entry) => entry.status === "failed").length,
  };
  const total = lines.length || 1;

  return (
    <>
      <DashboardTopBar title="Monitoring / Ingestion" />
      {error && <p className="error-banner">Live API unavailable: {error}</p>}
      <section className="card glass-card">
        <p className="eyebrow">Golden debug layer</p>
        <h2 style={{ marginTop: 8 }}>Raw requests, processed logs, and ingestion errors in one tenant-scoped stream.</h2>
        <div className="stream">
          {lines.length === 0 ? (
            <div className="empty-state">No recent logs found for the selected window.</div>
          ) : (
            lines.map((entry) => (
              <p key={entry.line}>
                <span className={`status-pill status-${entry.status}`} style={{ marginRight: 10 }}>
                  {entry.status}
                </span>
                {entry.line}
              </p>
            ))
          )}
        </div>
      </section>
      <section className="grid grid-3" style={{ marginTop: 12 }}>
        <article className="card glass-card">
          <strong>Verified</strong>
          <p className="muted">{Math.round((totals.verified / total) * 100)}%</p>
        </article>
        <article className="card glass-card">
          <strong>Pending</strong>
          <p className="muted">{Math.round((totals.pending / total) * 100)}%</p>
        </article>
        <article className="card glass-card">
          <strong>Failed</strong>
          <p className="muted">{Math.round((totals.failed / total) * 100)}%</p>
        </article>
      </section>
    </>
  );
}
