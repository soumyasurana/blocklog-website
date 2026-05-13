"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

type SeriesPoint = {
  index: string;
  value: number;
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

  const [logsSeries, setLogsSeries] = useState<SeriesPoint[]>([]);
  const [apiSeries, setApiSeries] = useState<SeriesPoint[]>([]);

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

        const usage = normalizePayload<UsagePayload>(
          usagePayload,
          {},
          "data"
        );

        setSummary({
          requests: metrics.requests_total,
          ingestionRate: metrics.logs_ingested_total,
          logsToday:
            usage.logs_ingested_today ??
            usage.logs_ingested ??
            0,
          verificationRequests:
            usage.verification_requests ??
            metrics.verification_requests_total,
        });

        setLogsSeries(
          extractMetricSeries(
            metrics.raw,
            "blocklog_logs_ingested_total"
          )
        );

        setApiSeries(
          extractMetricSeries(
            metrics.raw,
            "blocklog_http_request_latency_seconds_count"
          )
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load pipeline view"
        );
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

      {error && (
        <p className="error-banner">
          Live API unavailable: {error}
        </p>
      )}

      <section className="stats">
        <article className="card stat glass-card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>
            Requests total
          </p>
          <h3>{summary.requests}</h3>
        </article>

        <article className="card stat glass-card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>
            Ingestion rate
          </p>
          <h3>{summary.ingestionRate}</h3>
        </article>

        <article className="card stat glass-card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>
            Logs today
          </p>
          <h3>{summary.logsToday}</h3>
        </article>

        <article className="card stat glass-card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>
            Verification requests
          </p>
          <h3>{summary.verificationRequests}</h3>
        </article>
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <article className="card glass-card">
          <p className="eyebrow">Telemetry</p>

          <h2 style={{ marginTop: 8 }}>
            Ingestion series
          </h2>

          <div
            style={{
              height: 320,
              marginTop: 20,
            }}
          >
            <MetricChart data={logsSeries} />
          </div>
        </article>

        <article className="card glass-card">
          <p className="eyebrow">API traffic</p>

          <h2 style={{ marginTop: 8 }}>
            Request series
          </h2>

          <div
            style={{
              height: 320,
              marginTop: 20,
            }}
          >
            <MetricChart data={apiSeries} />
          </div>
        </article>
      </section>
    </>
  );
}

function MetricChart({
  data,
}: {
  data: SeriesPoint[];
}) {
  if (data.length === 0) {
    return (
      <div className="code-pane">
        No telemetry returned yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient
            id="colorTraffic"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#22d3ee"
              stopOpacity={0.45}
            />
            <stop
              offset="100%"
              stopColor="#22d3ee"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#1e293b"
          vertical={false}
        />

        <XAxis
          dataKey="index"
          stroke="#64748b"
          tickLine={false}
          axisLine={false}
        />

        <YAxis
          stroke="#64748b"
          tickLine={false}
          axisLine={false}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#020617",
            border: "1px solid #0f172a",
            borderRadius: 16,
            color: "#fff",
          }}
        />

        <Area
          type="monotone"
          dataKey="value"
          stroke="#22d3ee"
          fillOpacity={1}
          fill="url(#colorTraffic)"
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function parsePrometheusMetrics(
  payload: string
): MetricsPayload {
  return {
    requests_total: sumMetric(
      payload,
      "blocklog_http_request_latency_seconds_count"
    ),

    logs_ingested_total: sumMetric(
      payload,
      "blocklog_logs_ingested_total"
    ),

    verification_requests_total: sumMetric(
      payload,
      "blocklog_verify_requests_total"
    ),

    raw: payload,
  };
}

function sumMetric(
  payload: string,
  metricName: string
) {
  return payload
    .split("\n")
    .filter((line) => line.startsWith(metricName))
    .reduce(
      (total, line) =>
        total +
        Number(
          line.trim().split(/\s+/).pop() ?? 0
        ),
      0
    );
}

function extractMetricSeries(
  payload: string,
  metricName: string
): SeriesPoint[] {
  return payload
    .split("\n")
    .filter((line) => line.startsWith(metricName))
    .map((line, index) => ({
      index: `${index + 1}`,
      value: Number(
        line.trim().split(/\s+/).pop() ?? 0
      ),
    }))
    .filter((point) => Number.isFinite(point.value));
}
