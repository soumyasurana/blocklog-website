"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";

import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

type ExplorerLog = {
  log_id: string;
  trace_id: string | null;
  session_id: string | null;
  workflow_id: string | null;
  event_type: string;
  source: string;
  timestamp: string;
  created_at: string;
  integrity_status: string;
  chain_hash: string;
  company_id: string;
  is_deleted: boolean;
};

type ExplorerResponse = {
  items: ExplorerLog[];
  next_cursor: string | null;
};

export default function LogsPage() {
  const [logs, setLogs] = useState<ExplorerLog[]>([]);
  const [query, setQuery] = useState("");
  const [eventType, setEventType] = useState("");
  const [source, setSource] = useState("");
  const [integrity, setIntegrity] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (reset = false, next?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (!reset && next) params.set("cursor", next);
      if (query) params.set("q", query);
      if (eventType) params.set("event_type", eventType);
      if (source) params.set("source", source);
      if (integrity) params.set("integrity", integrity);
      params.set("limit", "50");

      const response = await blocklogRequest<ExplorerResponse>(`/logs?${params.toString()}`);
      setLogs((current) => (reset ? response.items : [...current, ...response.items]));
      setNextCursor(response.next_cursor);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load logs");
    } finally {
      setLoading(false);
    }
  }, [eventType, integrity, query, source]);

  useEffect(() => {
    async function loadInitial() {
      await load(true, null);
    }

    void loadInitial();
  }, [load]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
      await load(true, null);
  }

  return (
    <>
      <DashboardTopBar title="Log Explorer" />
      <section className="card glass-card" style={{ marginBottom: 16 }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <div>
            <p className="eyebrow">Queryable evidence</p>
            <h2 style={{ marginBottom: 8 }}>Search tamper-evident events directly.</h2>
            <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
              Filter by event type, source, trace, and integrity state without reconstructing the index from proof exports.
            </p>
          </div>
        </div>
      </section>

      <form className="card glass-card" style={{ display: "grid", gap: 12 }} onSubmit={onSubmit}>
        <div className="grid grid-2">
          <div>
            <label>Search</label>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="event, hash, idempotency key" />
          </div>
          <div>
            <label>Event type</label>
            <input value={eventType} onChange={(event) => setEventType(event.target.value)} placeholder="agent.run.completed" />
          </div>
          <div>
            <label>Source</label>
            <input value={source} onChange={(event) => setSource(event.target.value)} placeholder="openai-agents" />
          </div>
          <div>
            <label>Integrity</label>
            <select value={integrity} onChange={(event) => setIntegrity(event.target.value)}>
              <option value="">All</option>
              <option value="valid">valid</option>
              <option value="deleted">deleted</option>
            </select>
          </div>
        </div>
        <div>
          <button className="btn btn-primary" disabled={loading} type="submit">
            {loading ? "Loading..." : "Apply filters"}
          </button>
        </div>
      </form>

      {error && <p className="error-banner">{error}</p>}

      <section className="table-shell">
        {logs.length === 0 ? (
          <div className="empty-state">No logs found for the current filters.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Event</th>
                <th>Source</th>
                <th>Trace</th>
                <th>Integrity</th>
                <th>Hash</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.log_id}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>
                    <Link href={`/dashboard/logs/${log.log_id}`}>{log.event_type}</Link>
                  </td>
                  <td>{log.source}</td>
                  <td>
                    {log.trace_id ? <Link href={`/dashboard/traces/${log.trace_id}`}>{log.trace_id.slice(0, 8)}...</Link> : "none"}
                  </td>
                  <td>
                    <span className={`status-pill status-${log.integrity_status}`}>{log.integrity_status}</span>
                  </td>
                  <td>{log.chain_hash.slice(0, 16)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {nextCursor && (
        <div style={{ marginTop: 16 }}>
          <button
            className="btn"
            disabled={loading}
            onClick={async () => {
              await load(false, nextCursor);
            }}
            type="button"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}
