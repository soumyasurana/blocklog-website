"use client";

import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

type IntegrityReport = {
  chain_continuity_status?: string;
  issues?: unknown[];
  recent_batches?: { batch_id?: string; status?: string; integrity_status?: string | null }[];
};

function deriveErrors(report: IntegrityReport) {
  const explicitIssues = Array.isArray(report.issues)
    ? report.issues
        .map((entry) => (typeof entry === "string" ? entry : JSON.stringify(entry)))
        .filter(Boolean)
    : [];

  const batchIssues =
    report.recent_batches
      ?.filter(
        (batch) =>
          (batch.integrity_status && batch.integrity_status.toLowerCase() !== "verified") ||
          (batch.status && batch.status.toLowerCase() !== "sealed"),
      )
      .map(
        (batch) =>
          `Batch ${batch.batch_id ?? "unknown"}: status=${batch.status ?? "unknown"}, integrity=${batch.integrity_status ?? "unknown"}`,
      ) ?? [];

  if (explicitIssues.length > 0 || batchIssues.length > 0) {
    return [...explicitIssues, ...batchIssues];
  }

  if (report.chain_continuity_status && report.chain_continuity_status.toLowerCase() !== "healthy") {
    return [`Chain continuity status: ${report.chain_continuity_status}`];
  }

  return [];
}

export default function ErrorsPage() {
  const [errors, setErrors] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadErrors() {
      try {
        const report = await blocklogRequest<IntegrityReport>("/integrity/report");
        setErrors(deriveErrors(report));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load errors");
      }
    }

    loadErrors();
  }, []);

  return (
    <>
      <DashboardTopBar title="Error Monitoring" />
      {error && <p className="error-banner">Live API unavailable: {error}</p>}
      <section className="card glass-card">
        <p className="eyebrow">Integrity diagnostics</p>
        <h2 style={{ marginTop: 8 }}>Current operational issues derived from the integrity report.</h2>
        {errors.length === 0 ? (
          <div className="empty-state">
            No active integrity issues were returned by the backend. The current API surface does
            not expose a dedicated failed-ingestion feed.
          </div>
        ) : (
          errors.map((entry) => (
            <p key={entry}>
              <code>{entry}</code>
            </p>
          ))
        )}
      </section>
    </>
  );
}
