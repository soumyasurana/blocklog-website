"use client";

import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type MetricsPayload = {
  requests_total?: number;
  ingestion_rate?: number;
};

type StreamPayload = {
  lines?: string[];
  verified_pct?: number;
  pending_pct?: number;
  failed_pct?: number;
};

export default function PipelinePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState({
    requests: 0,
    ingestionRate: 0,
    verifiedPct: 0,
    pendingPct: 0,
    failedPct: 0,
  });
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    async function loadPipeline() {
      setLoading(true);
      setError(null);

      try {
        const [metricsPayload, streamPayload] = await Promise.all([
          blocklogRequest<MetricsPayload | { data?: MetricsPayload }>("/metrics"),
          blocklogRequest<StreamPayload | { data?: StreamPayload }>("/logs/stream"),
        ]);

        const metrics = normalizePayload<MetricsPayload>(metricsPayload, {}, "data");
        const stream = normalizePayload<StreamPayload>(streamPayload, {}, "data");

        setSummary({
          requests: metrics.requests_total ?? 0,
          ingestionRate: metrics.ingestion_rate ?? 0,
          verifiedPct: stream.verified_pct ?? 0,
          pendingPct: stream.pending_pct ?? 0,
          failedPct: stream.failed_pct ?? 0,
        });
        setLines(stream.lines ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load pipeline view");
      } finally {
        setLoading(false);
      }
    }

    loadPipeline();
  }, []);

  return (
    <>
      <DashboardTopBar title="System / Pipeline" />
      {loading && (
        <div className="notice" style={{ marginBottom: 12 }}>
          <div className="spinner" />
          <span>Loading pipeline telemetry...</span>
        </div>
      )}
      {error && <p className="error-banner">Live API unavailable: {error}</p>}

      <section className="stats">
        <article className="card stat glass-card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Requests total</p>
          <h3>{summary.requests}</h3>
        </article>
        <article className="card stat glass-card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Ingestion rate</p>
          <h3>{summary.ingestionRate}</h3>
        </article>
        <article className="card stat glass-card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Verified</p>
          <h3>{summary.verifiedPct}%</h3>
        </article>
        <article className="card stat glass-card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Pending / Failed</p>
          <h3>{summary.pendingPct}% / {summary.failedPct}%</h3>
        </article>
      </section>

      <section className="card glass-card" style={{ marginTop: 16 }}>
        <p className="eyebrow">Batching and queue flow</p>
        <h2 style={{ marginTop: 8 }}>Pipeline visibility for intake, buffering, and throughput.</h2>
        <div className="stream">
          {lines.length === 0 ? (
            <div className="empty-state">No pipeline activity returned by the backend.</div>
          ) : (
            lines.map((line) => <p key={line}>{line}</p>)
          )}
        </div>
      </section>
    </>
  );
}
