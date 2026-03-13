"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import SimpleBars from "@/components/SimpleBars";
import { blocklogRequest } from "@/lib/blocklog";

type UsageResponse = {
  logs_ingested?: number;
  gb_processed?: number;
};

type IntegrityStatusResponse = {
  status?: string;
  logs_verified?: number;
  anchors_created?: number;
};

type IntegrityReportResponse = {
  chain_continuity_status?: string;
  recent_batches?: { batch_id: string; status: string; integrity_status: string | null }[];
};

type ExportProofResponse = {
  logs: { log_id: string; created_at: string; payload_hash: string; chain_hash: string }[];
};

export default function DashboardHomePage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    logsIngested: 0,
    verificationRequests: 0,
    integrityStatus: "unknown",
    ingestionRate: "0 GB",
  });
  const [logsSeries, setLogsSeries] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [verificationSeries, setVerificationSeries] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [recentLogs, setRecentLogs] = useState<
    { log_id: string; created_at: string; chain_hash: string }[]
  >([]);

  useEffect(() => {
    async function loadOverview() {
      setLoading(true);
      try {
        const [usage, integrityStatus, integrityReport, proof] = await Promise.all([
          blocklogRequest<UsageResponse>("/usage"),
          blocklogRequest<IntegrityStatusResponse>("/integrity/status"),
          blocklogRequest<IntegrityReportResponse>("/integrity/report"),
          blocklogRequest<ExportProofResponse>(
            `/logs/export-proof?from=${encodeURIComponent(
              new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            )}&to=${encodeURIComponent(new Date().toISOString())}`,
          ),
        ]);

        const recent = proof.logs.slice(-8);
        setStats({
          logsIngested: usage.logs_ingested ?? 0,
          verificationRequests: integrityStatus.logs_verified ?? 0,
          integrityStatus: integrityReport.chain_continuity_status ?? integrityStatus.status ?? "unknown",
          ingestionRate: `${usage.gb_processed ?? 0} GB`,
        });
        setLogsSeries(recent.map((_, index) => index + 1));
        setVerificationSeries(
          (integrityReport.recent_batches ?? []).slice(0, 8).map((_, index) => index + 1),
        );
        setRecentLogs(recent);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load overview");
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  const cards = [
    ["Logs ingested today", String(stats.logsIngested)],
    ["Verification requests", String(stats.verificationRequests)],
    ["System integrity status", stats.integrityStatus],
    ["Ingestion volume", stats.ingestionRate],
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
          <h2 style={{ marginTop: 0 }}>Verification activity</h2>
          <div className="chart">
            <SimpleBars values={verificationSeries} color="var(--success)" />
          </div>
        </article>
      </section>

      <section className="table-shell" style={{ marginTop: 16 }}>
        {recentLogs.length === 0 ? (
          <div className="empty-state">No recent logs available.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Log ID</th>
                <th>Hash</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map((log) => (
                <tr key={log.log_id}>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                  <td>
                    <Link href={`/dashboard/logs/${log.log_id}`}>{log.log_id}</Link>
                  </td>
                  <td>{log.chain_hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
