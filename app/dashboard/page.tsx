"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import SimpleBars from "@/components/SimpleBars";
import { defaultStats, recentLogs, type LogItem } from "@/components/data";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type OverviewResponse = {
  logs_ingested_today?: number;
  total_logs?: number;
  verification_failures?: number;
  verification_requests?: number;
  ingestion_rate?: number;
  integrity_status?: string;
  logs_series?: number[];
  api_series?: number[];
  recent_logs?: LogItem[];
};

const fallbackLogsSeries = [32, 48, 41, 56, 62, 74, 69, 82];
const fallbackVerificationSeries = [12, 18, 16, 24, 29, 34, 31, 37];

function formatNum(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function DashboardHomePage() {
  const [stats, setStats] = useState(defaultStats);
  const [logs, setLogs] = useState<LogItem[]>(recentLogs);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [integrityStatus, setIntegrityStatus] = useState("Healthy");
  const [ingestionRate, setIngestionRate] = useState(128);
  const [logsSeries, setLogsSeries] = useState(fallbackLogsSeries);
  const [verificationSeries, setVerificationSeries] = useState(
    fallbackVerificationSeries,
  );

  useEffect(() => {
    async function loadOverview() {
      setLoading(true);
      try {
        const payload = await blocklogRequest<OverviewResponse | { data?: OverviewResponse }>(
          "/metrics/overview",
        );
        const overview = normalizePayload<OverviewResponse>(payload, {}, "data");
        setStats({
          logsIngestedToday: overview.logs_ingested_today ?? defaultStats.logsIngestedToday,
          totalLogs: overview.total_logs ?? defaultStats.totalLogs,
          verificationFailures:
            overview.verification_failures ?? defaultStats.verificationFailures,
          apiRequests: overview.verification_requests ?? defaultStats.apiRequests,
        });
        setIntegrityStatus(overview.integrity_status ?? "Healthy");
        setIngestionRate(overview.ingestion_rate ?? 128);
        setLogsSeries(
          overview.logs_series?.length ? overview.logs_series : fallbackLogsSeries,
        );
        setVerificationSeries(
          overview.api_series?.length ? overview.api_series : fallbackVerificationSeries,
        );
        if (overview.recent_logs?.length) {
          setLogs(overview.recent_logs);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load overview");
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  const cards = [
    ["Logs ingested today", formatNum(stats.logsIngestedToday)],
    ["Total logs", formatNum(stats.totalLogs)],
    ["Verification requests", formatNum(stats.apiRequests)],
    ["Integrity status", integrityStatus],
    ["Verification failures", formatNum(stats.verificationFailures)],
    ["Ingestion rate", `${ingestionRate}/min`],
  ];

  return (
    <>
      <DashboardTopBar title="Overview" />
      {loading && (
        <div className="notice button-row" style={{ alignItems: "center", marginBottom: 12 }}>
          <div className="spinner" />
          <span>Loading dashboard metrics...</span>
        </div>
      )}
      {error && <p className="error-banner">Live API unavailable: {error}</p>}
      <section className="stats">
        {cards.map(([label, value]) => (
          <article className="card stat" key={label}>
            <p className="muted" style={{ margin: "0 0 8px" }}>
              {label}
            </p>
            <h3>{value}</h3>
          </article>
        ))}
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <article className="card">
          <h2 style={{ marginTop: 0 }}>Logs over time</h2>
          <div className="chart">
            <SimpleBars values={logsSeries} />
          </div>
        </article>
        <article className="card">
          <h2 style={{ marginTop: 0 }}>Verification requests</h2>
          <div className="chart">
            <SimpleBars values={verificationSeries} color="var(--success)" />
          </div>
        </article>
      </section>

      <section className="table-shell" style={{ marginTop: 16 }}>
        {logs.length === 0 ? (
          <div className="empty-state">No logs found for this account.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Event</th>
                <th>Source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.timestamp}</td>
                  <td>
                    <Link href={`/dashboard/logs/${log.id}`}>{log.event}</Link>
                  </td>
                  <td>{log.source}</td>
                  <td>{log.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
