"use client";

import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

type ExportProofResponse = {
  logs?: { log_id: string; created_at: string; chain_hash: string }[];
};

type LogDetails = {
  log_id?: string;
  event_type?: string;
};

type VerifyResult = {
  chain_valid?: boolean;
  signature_valid?: boolean | null;
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
        const from = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
        const to = new Date().toISOString();
        const proof = await blocklogRequest<ExportProofResponse>(
          `/logs/export-proof?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
        );

        const recent = (proof.logs ?? []).slice(0, 6);
        if (recent.length === 0) {
          setLines([]);
          return;
        }

        const stream = await Promise.all(
          recent.map(async (log) => {
            const [details, verification] = await Promise.all([
              blocklogRequest<LogDetails>(`/logs/${log.log_id}`),
              blocklogRequest<VerifyResult>(`/logs/${log.log_id}/verify`),
            ]);

            const status =
              verification.chain_valid && verification.signature_valid !== false
                ? "verified"
                : verification.chain_valid === false
                  ? "failed"
                  : "pending";

            return {
              line: `[${new Date(log.created_at).toLocaleTimeString()}] ${details.event_type ?? log.log_id}`,
              status,
            } satisfies StreamLine;
          }),
        );

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
      <DashboardTopBar title="Log Ingestion Monitor" />
      {error && <p className="error-banner">Live API unavailable: {error}</p>}
      <section className="card glass-card">
        <p className="eyebrow">Recent intake</p>
        <h2 style={{ marginTop: 8 }}>Incoming log stream derived from export proofs and per-log verification.</h2>
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
