"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import SimpleBars from "@/components/SimpleBars";
import { blocklogRequest } from "@/lib/blocklog";

type UsageResponse = {
  logs_ingested?: number;
  logs_ingested_today?: number;
  verification_requests?: number;
  gb_processed?: number;
};

type IntegrityStatusResponse = {
  status?: string;
  integrity_status?: string;
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
    anchors: 0,
  });
  const [logsSeries, setLogsSeries] = useState([0]);
  const [verificationSeries, setVerificationSeries] = useState([0]);
  const [recentLogs, setRecentLogs] = useState<
    { log_id: string; created_at: string; chain_hash: string }[]
  >([]);

  useEffect(() => {
    async function loadOverview() {
      setLoading(true);
      setError(null);

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
          logsIngested: usage.logs_ingested_today ?? usage.logs_ingested ?? 0,
          verificationRequests:
            usage.verification_requests ?? integrityStatus.logs_verified ?? 0,
          integrityStatus:
            integrityReport.chain_continuity_status ??
            integrityStatus.integrity_status ??
            integrityStatus.status ??
            "unknown",
          ingestionRate: `${usage.gb_processed ?? 0} GB processed`,
          anchors: integrityStatus.anchors_created ?? 0,
        });
        setLogsSeries(recent.map((_, index) => (index + 1) * 12));
        setVerificationSeries(
          (integrityReport.recent_batches ?? []).slice(0, 8).map((_, index) => (index + 1) * 8),
        );
        setRecentLogs(recent.reverse());
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
    ["Integrity status", stats.integrityStatus],
    ["Anchors created", String(stats.anchors)],
  ];

  return (
    <>
      <DashboardTopBar title="Overview" />
      {loading && (
        <div className="notice" style={{ marginBottom: 12 }}>
          <div className="spinner" />
          <span>Loading trust metrics...</span>
        </div>
      )}
      {error && <p className="error-banner">Live API unavailable: {error}</p>}

      <section className="card glass-card" style={{ marginBottom: 16 }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <div>
            <p className="eyebrow">Operational summary</p>
            <h2 style={{ marginBottom: 8 }}>Integrity posture across your event plane.</h2>
            <p className="muted" style={{ maxWidth: 760, margin: 0 }}>
              This workspace combines usage, integrity, and proof-export signals so operators can
              see ingestion volume, verification demand, and chain health in one surface.
            </p>
          </div>
          <div className="status-pill status-valid">{stats.ingestionRate}</div>
        </div>
      </section>

      <section className="stats">
        {cards.map(([label, value]) => (
          <article className="card stat glass-card" key={label}>
            <p className="eyebrow" style={{ marginBottom: 10 }}>{label}</p>
            <h3>{value}</h3>
          </article>
        ))}
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <article className="card glass-card">
          <div className="section-header" style={{ marginBottom: 14 }}>
            <div>
              <p className="eyebrow">Ingestion</p>
              <h2 style={{ margin: 0, fontSize: "1.6rem" }}>Logs over time</h2>
            </div>
          </div>
          <div className="chart">
            <SimpleBars values={logsSeries} />
          </div>
        </article>
        <article className="card glass-card">
          <div className="section-header" style={{ marginBottom: 14 }}>
            <div>
              <p className="eyebrow">Verification</p>
              <h2 style={{ margin: 0, fontSize: "1.6rem" }}>Batch assurance activity</h2>
            </div>
          </div>
          <div className="chart">
            <SimpleBars values={verificationSeries} color="var(--accent)" />
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
                <th>Chain Hash</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map((log) => (
                <tr key={log.log_id}>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                  <td>{log.log_id}</td>
                  <td>{log.chain_hash}</td>
                  <td>
                    <Link className="btn" href={`/dashboard/logs/${log.log_id}`}>
                      Inspect proof
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
