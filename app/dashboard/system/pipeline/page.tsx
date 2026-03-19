"use client";

import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type MetricsPayload = {
  requests_total: number;
  logs_ingested_total: number;
  verification_requests_total: number;
  raw: string;
};

type UsagePayload = {
  logs_ingested_today?: number;
  logs_ingested?: number;
  verification_requests?: number;
};

export default function PipelinePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState({
    requests: 0,
    ingestionRate: 0,
    logsToday: 0,
    verificationRequests: 0,
  });
  const [logsSeries, setLogsSeries] = useState<number[]>([]);
  const [apiSeries, setApiSeries] = useState<number[]>([]);

  useEffect(() => {
    async function loadPipeline() {
      setLoading(true);
      setError(null);

      try {
        const [metricsPayload, usagePayload] = await Promise.all([
          blocklogRequest<string>("/metrics"),
          blocklogRequest<UsagePayload | { data?: UsagePayload }>("/usage"),
        ]);

        const metrics = parsePrometheusMetrics(metricsPayload);
        const usage = normalizePayload<UsagePayload>(usagePayload, {}, "data");

        setSummary({
          requests: metrics.requests_total,
          ingestionRate: metrics.logs_ingested_total,
          logsToday: usage.logs_ingested_today ?? usage.logs_ingested ?? 0,
          verificationRequests: usage.verification_requests ?? metrics.verification_requests_total,
        });
        setLogsSeries(extractMetricSeries(metrics.raw, "blocklog_logs_ingested_total"));
        setApiSeries(extractMetricSeries(metrics.raw, "blocklog_http_request_latency_seconds_count"));
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
          <p className="eyebrow" style={{ marginBottom: 10 }}>Logs today</p>
          <h3>{summary.logsToday}</h3>
        </article>
        <article className="card stat glass-card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Verification requests</p>
          <h3>{summary.verificationRequests}</h3>
        </article>
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <article className="card glass-card">
          <p className="eyebrow">Telemetry</p>
          <h2 style={{ marginTop: 8 }}>Ingestion series</h2>
          <div className="code-pane">
            {logsSeries.length > 0 ? JSON.stringify(logsSeries, null, 2) : "No telemetry returned yet."}
          </div>
        </article>
        <article className="card glass-card">
          <p className="eyebrow">API traffic</p>
          <h2 style={{ marginTop: 8 }}>Request series</h2>
          <div className="code-pane">
            {apiSeries.length > 0 ? JSON.stringify(apiSeries, null, 2) : "No API traffic returned yet."}
          </div>
        </article>
      </section>
    </>
  );
}

function parsePrometheusMetrics(payload: string): MetricsPayload {
  return {
    requests_total: sumMetric(payload, "blocklog_http_request_latency_seconds_count"),
    logs_ingested_total: sumMetric(payload, "blocklog_logs_ingested_total"),
    verification_requests_total: sumMetric(payload, "blocklog_verify_requests_total"),
    raw: payload,
  };
}

function sumMetric(payload: string, metricName: string) {
  return payload
    .split("\n")
    .filter((line) => line.startsWith(metricName))
    .reduce((total, line) => total + Number(line.trim().split(/\s+/).pop() ?? 0), 0);
}

function extractMetricSeries(payload: string, metricName: string) {
  return payload
    .split("\n")
    .filter((line) => line.startsWith(metricName))
    .map((line) => Number(line.trim().split(/\s+/).pop() ?? 0))
    .filter((value) => Number.isFinite(value));
}
