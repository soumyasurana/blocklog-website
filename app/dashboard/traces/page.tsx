"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

type TraceItem = {
  trace_id: string;
  session_id: string | null;
  workflow_id: string | null;
  started_at: string;
  ended_at: string;
  event_count: number;
  sources: string[];
  event_types: string[];
  integrity_status: string;
};

export default function TracesPage() {
  const [items, setItems] = useState<TraceItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await blocklogRequest<{ items: TraceItem[] }>("/traces");
        setItems(response.items);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load traces");
      }
    }

    void load();
  }, []);

  return (
    <>
      <DashboardTopBar title="Traces" />
      {error && <p className="error-banner">{error}</p>}
      <section className="table-shell">
        {items.length === 0 ? (
          <div className="empty-state">No traces available yet. Send a trace-aware SDK event to populate this view.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Trace</th>
                <th>Started</th>
                <th>Events</th>
                <th>Sources</th>
                <th>Integrity</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.trace_id}>
                  <td>
                    <Link href={`/dashboard/traces/${item.trace_id}`}>{item.trace_id}</Link>
                  </td>
                  <td>{new Date(item.started_at).toLocaleString()}</td>
                  <td>{item.event_count}</td>
                  <td>{item.sources.join(", ")}</td>
                  <td>
                    <span className={`status-pill status-${item.integrity_status}`}>{item.integrity_status}</span>
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
