"use client";

import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type StreamPayload = {
  lines?: string[];
  verified_pct?: number;
  pending_pct?: number;
  failed_pct?: number;
};

const fallback = {
  lines: [
    "[12:01:22] user.login",
    "[12:01:23] payment.created",
    "[12:01:25] invoice.generated",
  ],
  verified_pct: 98.4,
  pending_pct: 1.1,
  failed_pct: 0.5,
};

export default function IngestionMonitorPage() {
  const [data, setData] = useState(fallback);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStream() {
      try {
        const payload = await blocklogRequest<StreamPayload | { data?: StreamPayload }>(
          "/logs/stream",
        );
        const parsed = normalizePayload<StreamPayload>(payload, {}, "data");
        setData({
          lines: parsed.lines?.length ? parsed.lines : fallback.lines,
          verified_pct: parsed.verified_pct ?? fallback.verified_pct,
          pending_pct: parsed.pending_pct ?? fallback.pending_pct,
          failed_pct: parsed.failed_pct ?? fallback.failed_pct,
        });
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load stream");
      }
    }

    loadStream();
    const timer = setInterval(loadStream, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <DashboardTopBar title="Log Ingestion Monitor" />
      {error && <p className="muted">Live API unavailable: {error}</p>}
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Incoming stream</h2>
        <div className="stream">
          {data.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>
      <section className="grid grid-3" style={{ marginTop: 12 }}>
        <article className="card">
          <strong>🟢 verified</strong>
          <p className="muted">{data.verified_pct}%</p>
        </article>
        <article className="card">
          <strong>🟡 pending</strong>
          <p className="muted">{data.pending_pct}%</p>
        </article>
        <article className="card">
          <strong>🔴 failed</strong>
          <p className="muted">{data.failed_pct}%</p>
        </article>
      </section>
    </>
  );
}
