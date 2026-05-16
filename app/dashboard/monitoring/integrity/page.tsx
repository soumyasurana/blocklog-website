"use client";

import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type HealthPayload = { status?: string };
type IntegrityStatusPayload = {
  status?: string;
  integrity_status?: string;
  logs_verified?: number;
  verification_failures?: number;
};
type IntegrityReportPayload = {
  chain_continuity_status?: string;
  recent_batches?: { batch_id?: string; status?: string; integrity_status?: string | null }[];
};

export default function IntegrityMonitoringPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState({
    health: "unknown",
    integrity: "unknown",
    verified: 0,
    failures: 0,
    continuity: "unknown",
  });
  const [batches, setBatches] = useState<
    { batchId: string; status: string; integrity: string }[]
  >([]);

  useEffect(() => {
    async function loadIntegrity() {
      setLoading(true);
      setError(null);

      try {
        const [healthPayload, integrityPayload, reportPayload] = await Promise.all([
          blocklogRequest<HealthPayload | { data?: HealthPayload }>("/health"),
          blocklogRequest<IntegrityStatusPayload | { data?: IntegrityStatusPayload }>(
            "/integrity/status",
          ),
          blocklogRequest<IntegrityReportPayload | { data?: IntegrityReportPayload }>(
            "/integrity/report",
          ),
        ]);

        const health = normalizePayload<HealthPayload>(healthPayload, {}, "data");
        const integrity = normalizePayload<IntegrityStatusPayload>(integrityPayload, {}, "data");
        const report = normalizePayload<IntegrityReportPayload>(reportPayload, {}, "data");

        setStatus({
          health: health.status ?? "unknown",
          integrity: integrity.integrity_status ?? integrity.status ?? "unknown",
          verified: integrity.logs_verified ?? 0,
          failures: integrity.verification_failures ?? 0,
          continuity: report.chain_continuity_status ?? "unknown",
        });
        setBatches(
          (report.recent_batches ?? []).map((entry, index) => ({
            batchId: entry.batch_id ?? `batch_${index + 1}`,
            status: entry.status ?? "unknown",
            integrity: entry.integrity_status ?? "unknown",
          })),
        );
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load integrity view");
      } finally {
        setLoading(false);
      }
    }

    loadIntegrity();
  }, []);

  return (
    <>
      <DashboardTopBar title="Monitoring / Integrity" />
      {loading && (
        <div className="notice" style={{ marginBottom: 12 }}>
          <div className="spinner" />
          <span>Loading integrity telemetry...</span>
        </div>
      )}
      {error && <p className="error-banner">Live API unavailable: {error}</p>}

      <section className="stats">
        <article className="card stat glass-card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>API health</p>
          <h3>{status.health}</h3>
        </article>
        <article className="card stat glass-card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Integrity state</p>
          <h3>{status.integrity}</h3>
        </article>
        <article className="card stat glass-card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Verified checks</p>
          <h3>{status.verified}</h3>
        </article>
        <article className="card stat glass-card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Continuity</p>
          <h3>{status.continuity}</h3>
        </article>
      </section>

      <section className="card glass-card" style={{ marginTop: 16 }}>
        <div className="section-header">
          <div>
            <p className="eyebrow">Read-only integrity view</p>
            <h2 style={{ marginBottom: 8 }}>Current batch health and verification posture.</h2>
            <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
              This surface is observability-only. It exposes chain continuity and batch health
              without mixing in write actions from the control plane.
            </p>
          </div>
          <div className={`status-pill ${status.failures > 0 ? "status-failed" : "status-valid"}`}>
            {status.failures > 0 ? `${status.failures} failures` : "No active failures"}
          </div>
        </div>

        {batches.length === 0 ? (
          <div className="empty-state">No recent batch diagnostics available.</div>
        ) : (
          <div className="grid grid-3">
            {batches.map((batch) => (
              <article className="orbital-card" key={batch.batchId}>
                <strong>{batch.batchId}</strong>
                <p className="muted" style={{ margin: "8px 0 0" }}>
                  Status: {batch.status}
                </p>
                <p className="muted" style={{ margin: "4px 0 0" }}>
                  Integrity: {batch.integrity}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
