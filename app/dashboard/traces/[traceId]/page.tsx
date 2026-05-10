"use client";

import { use, useEffect, useState } from "react";

import DashboardTopBar from "@/components/DashboardTopBar";
import Timeline from "@/components/forensics/Timeline";
import { blocklogRequest } from "@/lib/blocklog";

type TraceDetail = {
  trace_id: string;
  session_id: string | null;
  workflow_id: string | null;
  integrity_status: string;
  event_count: number;
  started_at: string;
  ended_at: string;
  missing_links: string[];
  events: {
    log_id: string;
    event_type: string;
    source: string;
    timestamp: string;
    attempt_no: number;
    integrity_status: string;
    is_human_authorized: boolean;
    payload: Record<string, unknown>;
  }[];
};

export default function TraceDetailPage({ params }: { params: Promise<{ traceId: string }> }) {
  const [trace, setTrace] = useState<TraceDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resolvedParams = use(params);

  useEffect(() => {
    async function load() {
      try {
        const response = await blocklogRequest<TraceDetail>(`/traces/${resolvedParams.traceId}`);
        setTrace(response);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load trace");
      }
    }

    void load();
  }, [resolvedParams.traceId]);

  return (
    <>
      <DashboardTopBar title="Forensic Timeline" />
      {error && <p className="error-banner">{error}</p>}
      {trace && (
        <>
          <section className="card glass-card" style={{ marginBottom: 16 }}>
            <p className="eyebrow">Trace Summary</p>
            <h2 style={{ marginBottom: 8 }}>{trace.trace_id}</h2>
            <p className="muted" style={{ margin: 0 }}>
              {trace.event_count} events from {new Date(trace.started_at).toLocaleString()} to{" "}
              {new Date(trace.ended_at).toLocaleString()}.
            </p>
            {trace.missing_links.length > 0 && (
              <div className="notice" style={{ marginTop: 12 }}>
                Partial chain detected: {trace.missing_links.length} parent link(s) could not be reconstructed.
              </div>
            )}
          </section>
          <Timeline items={trace.events} />
        </>
      )}
    </>
  );
}
