"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiCatalog, apiCategories } from "@/components/apiCatalog";
import DashboardTopBar from "@/components/DashboardTopBar";
import SimpleBars from "@/components/SimpleBars";
import { blocklogRequest } from "@/lib/blocklog";

type UsageResponse = {
  logs_ingested?: number;
  logs_ingested_today?: number;
  api_calls?: number;
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

function StatusDot({ status }: { status: string }) {
  const lower = status.toLowerCase();
  const ok = lower === "ok" || lower === "valid" || lower === "healthy" || lower === "intact";
  const warn = lower === "degraded" || lower === "warning";
  const cls = ok ? "dot-ok" : warn ? "dot-warn" : "dot-unknown";
  return <span className={`status-dot ${cls}`} />;
}

export default function DashboardHomePage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [stats, setStats] = useState({
    logsIngested: 0,
    verificationRequests: 0,
    integrityStatus: "unknown",
    gbProcessed: 0,
    anchors: 0,
  });
  const [logsSeries, setLogsSeries] = useState([0]);
  const [verificationSeries, setVerificationSeries] = useState([0]);
  const [recentLogs, setRecentLogs] = useState<
    { log_id: string; created_at: string; chain_hash: string }[]
  >([]);

  async function loadOverview() {
    setLoading(true);
    setError(null);

    try {
      const [usageResult, integrityStatusResult, integrityReportResult, proofResult] =
        await Promise.allSettled([
          blocklogRequest<UsageResponse>("/usage"),
          blocklogRequest<IntegrityStatusResponse>("/integrity/status"),
          blocklogRequest<IntegrityReportResponse>("/integrity/report"),
          blocklogRequest<ExportProofResponse>(
            `/logs/export-proof?from=${encodeURIComponent(
              new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            )}&to=${encodeURIComponent(new Date().toISOString())}`,
          ),
        ]);

      const usage = usageResult.status === "fulfilled" ? usageResult.value : null;
      const integrityStatus =
        integrityStatusResult.status === "fulfilled" ? integrityStatusResult.value : null;
      const integrityReport =
        integrityReportResult.status === "fulfilled" ? integrityReportResult.value : null;
      const proof = proofResult.status === "fulfilled" ? proofResult.value : null;

      const recent = (proof?.logs ?? []).slice(-8);

      setStats({
        logsIngested: usage?.logs_ingested_today ?? usage?.logs_ingested ?? 0,
        verificationRequests:
          usage?.api_calls ??
          usage?.verification_requests ??
          integrityStatus?.logs_verified ??
          0,
        integrityStatus:
          integrityReport?.chain_continuity_status ??
          integrityStatus?.integrity_status ??
          integrityStatus?.status ??
          "unknown",
        gbProcessed: usage?.gb_processed ?? 0,
        anchors: integrityStatus?.anchors_created ?? 0,
      });

      setLogsSeries(recent.map((_, i) => (i + 1) * 12));
      setVerificationSeries(
        (integrityReport?.recent_batches ?? []).slice(0, 8).map((_, i) => (i + 1) * 8),
      );
      setRecentLogs(recent.reverse());
      setLastUpdated(new Date());

      const failedSources = [
        usageResult.status === "rejected" ? "usage" : null,
        integrityStatusResult.status === "rejected" ? "integrity status" : null,
        integrityReportResult.status === "rejected" ? "integrity report" : null,
        proofResult.status === "rejected" ? "proof export" : null,
      ].filter(Boolean);

      if (failedSources.length === 4) throw new Error("All data sources failed");
      if (failedSources.length > 0)
        setError(`Partial data — unavailable: ${failedSources.join(", ")}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load overview");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOverview();
  }, []);

  const statCards = [
    {
      label: "Logs ingested today",
      value: stats.logsIngested.toLocaleString(),
      sub: "past 24 hours",
      accent: false,
    },
    {
      label: "API calls",
      value: stats.verificationRequests.toLocaleString(),
      sub: "verification requests",
      accent: false,
    },
    {
      label: "Data processed",
      value: `${stats.gbProcessed} GB`,
      sub: "ingestion volume",
      accent: false,
    },
    {
      label: "Anchors created",
      value: stats.anchors.toLocaleString(),
      sub: "chain commits",
      accent: false,
    },
  ];

  return (
    <>
      <DashboardTopBar title="Overview" />

      {/* ── Inline banners ── */}
      {loading && (
        <div className="notice" style={{ marginBottom: 12 }}>
          <div className="spinner" />
          <span>Loading trust metrics…</span>
        </div>
      )}
      {error && <p className="error-banner">{error}</p>}

      {/* ── Header strip ── */}
      <section className="overview-header card glass-card">
        <div className="overview-header-main">
          <p className="eyebrow">Operational summary</p>
          <h2>Integrity posture across your event plane</h2>
          <p className="muted">
            Ingestion volume, verification demand, and chain health in one surface.
          </p>
        </div>
        <div className="overview-header-meta">
          <div className="integrity-badge">
            <StatusDot status={stats.integrityStatus} />
            <span className="integrity-label">{stats.integrityStatus}</span>
          </div>
          {lastUpdated && (
            <span className="muted" style={{ fontSize: "0.78rem" }}>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button className="btn" onClick={loadOverview} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </section>

      {/* ── Stat cards ── */}
      <section className="stats" style={{ marginTop: 16 }}>
        {statCards.map(({ label, value, sub }) => (
          <article className="card stat glass-card" key={label}>
            <p className="eyebrow" style={{ marginBottom: 6 }}>{label}</p>
            <h3>{value}</h3>
            <p className="muted" style={{ margin: 0, fontSize: "0.78rem" }}>{sub}</p>
          </article>
        ))}
      </section>

      {/* ── Charts ── */}
      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <article className="card glass-card">
          <div className="section-header" style={{ marginBottom: 14 }}>
            <div>
              <p className="eyebrow">Ingestion</p>
              <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Logs over time</h2>
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
              <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Batch assurance activity</h2>
            </div>
          </div>
          <div className="chart">
            <SimpleBars values={verificationSeries} color="var(--accent)" />
          </div>
        </article>
      </section>

      {/* ── Recent logs ── */}
      <section style={{ marginTop: 16 }}>
        <div className="section-header" style={{ marginBottom: 10, padding: "0 2px" }}>
          <div>
            <p className="eyebrow">Chain activity</p>
            <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Recent log entries</h2>
          </div>
          <Link className="btn" href="/dashboard/logs">
            View all logs
          </Link>
        </div>
        <div className="table-shell">
          {recentLogs.length === 0 ? (
            <div className="empty-state">No recent logs available.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Log ID</th>
                  <th>Chain Hash</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.log_id}>
                    <td className="mono muted">{new Date(log.created_at).toISOString()}</td>
                    <td className="mono">{log.log_id}</td>
                    <td className="mono truncate">{log.chain_hash}</td>
                    <td>
                      <Link className="btn btn-sm" href={`/dashboard/logs/${log.log_id}`}>
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ── Quick actions ── */}
      <section className="card glass-card" style={{ marginTop: 16 }}>
        <p className="eyebrow" style={{ marginBottom: 10 }}>Quick actions</p>
        <div className="button-row">
          <Link className="btn btn-primary" href="/dashboard/playground">
            API Playground
          </Link>
          <Link className="btn" href="/dashboard/system/pipeline">
            Pipeline
          </Link>
          <Link className="btn" href="/dashboard/system/anchoring">
            Anchoring
          </Link>
          <Link className="btn" href="/dashboard/monitoring/integrity">
            Integrity monitor
          </Link>
        </div>
      </section>
    </>
  );
}