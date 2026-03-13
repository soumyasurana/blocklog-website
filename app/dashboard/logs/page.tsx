"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { blocklogRequest } from "@/lib/blocklog";

type ExportProofLog = {
  log_id: string;
  created_at: string;
  payload_hash: string;
  chain_hash: string;
};

type ExportProofResponse = {
  logs: ExportProofLog[];
};

type LogDetails = {
  log_id: string;
  company_id: string;
  event_type: string;
  source: string;
  payload: Record<string, unknown>;
  chain_hash: string;
  created_at: string;
  is_deleted: boolean;
};

type ExplorerLog = {
  id: string;
  timestamp: string;
  event: string;
  source: string;
  hash: string;
  status: string;
  company: string;
};

function getDateRange(range: string) {
  const now = new Date();
  const from = new Date(now);

  if (range === "last_7_days") {
    from.setDate(now.getDate() - 7);
  } else if (range === "last_30_days") {
    from.setDate(now.getDate() - 30);
  } else {
    from.setDate(now.getDate() - 1);
  }

  return { from: from.toISOString(), to: now.toISOString() };
}

export default function LogsPage() {
  const [dateRange, setDateRange] = useState("last_24_hours");
  const [eventType, setEventType] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [logs, setLogs] = useState<ExplorerLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const initialRange = useMemo(() => getDateRange("last_24_hours"), []);

  async function fetchLogs() {
    setLoading(true);
    setError(null);

    try {
      const { from, to } = getDateRange(dateRange);
      const proof = await blocklogRequest<ExportProofResponse>(
        `/logs/export-proof?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
      );

      const detailedLogs = await Promise.all(
        proof.logs.slice(0, 50).map(async (log) => {
          const details = await blocklogRequest<LogDetails>(`/logs/${log.log_id}`);
          return {
            id: details.log_id,
            timestamp: details.created_at,
            event: details.event_type,
            source: details.source,
            hash: details.chain_hash,
            status: details.is_deleted ? "deleted" : "verified",
            company: details.company_id,
          } satisfies ExplorerLog;
        }),
      );

      const filtered = detailedLogs.filter((log) => {
        const q = query.toLowerCase();
        return (
          (!q ||
            log.timestamp.toLowerCase().includes(q) ||
            log.event.toLowerCase().includes(q) ||
            log.hash.toLowerCase().includes(q)) &&
          (!eventType || log.event.toLowerCase().includes(eventType.toLowerCase())) &&
          (!source || log.source.toLowerCase().includes(source.toLowerCase())) &&
          (!status || log.status.toLowerCase() === status.toLowerCase())
        );
      });

      setLogs(filtered);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load logs");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialLogs() {
      setLoading(true);
      setError(null);
      try {
        const proof = await blocklogRequest<ExportProofResponse>(
          `/logs/export-proof?from=${encodeURIComponent(
            initialRange.from,
          )}&to=${encodeURIComponent(initialRange.to)}`,
        );

        const detailedLogs = await Promise.all(
          proof.logs.slice(0, 50).map(async (log) => {
            const details = await blocklogRequest<LogDetails>(`/logs/${log.log_id}`);
            return {
              id: details.log_id,
              timestamp: details.created_at,
              event: details.event_type,
              source: details.source,
              hash: details.chain_hash,
              status: details.is_deleted ? "deleted" : "verified",
              company: details.company_id,
            } satisfies ExplorerLog;
          }),
        );

        setLogs(detailedLogs);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load logs");
      } finally {
        setLoading(false);
      }
    }

    loadInitialLogs();
  }, [initialRange]);

  async function onFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await fetchLogs();
  }

  return (
    <>
      <DashboardTopBar title="Log Explorer" />
      <form className="card" style={{ display: "grid", gap: 12 }} onSubmit={onFilter}>
        <div className="grid grid-2">
          <div>
            <label>Date range</label>
            <select value={dateRange} onChange={(event) => setDateRange(event.target.value)}>
              <option value="last_24_hours">Last 24 hours</option>
              <option value="last_7_days">Last 7 days</option>
              <option value="last_30_days">Last 30 days</option>
            </select>
          </div>
          <div>
            <label>Search</label>
            <input
              placeholder="Search timestamp, event, hash"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div>
            <label>Event type</label>
            <input
              placeholder="user.login"
              value={eventType}
              onChange={(event) => setEventType(event.target.value)}
            />
          </div>
          <div>
            <label>Source</label>
            <input
              placeholder="api"
              value={source}
              onChange={(event) => setSource(event.target.value)}
            />
          </div>
          <div>
            <label>Status</label>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All statuses</option>
              <option value="verified">verified</option>
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

      {loading && (
        <div className="notice button-row" style={{ alignItems: "center", marginTop: 12 }}>
          <div className="spinner" />
          <span>Loading logs...</span>
        </div>
      )}

      {error && <p className="error-banner">Live API unavailable: {error}</p>}

      <section className="table-shell">
        {logs.length === 0 ? (
          <div className="empty-state">No logs match the current filters.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Event type</th>
                <th>Source</th>
                <th>Hash</th>
                <th>Status</th>
                <th>Company ID</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>
                    <Link href={`/dashboard/logs/${log.id}`}>{log.event}</Link>
                  </td>
                  <td>{log.source}</td>
                  <td>{log.hash}</td>
                  <td>{log.status}</td>
                  <td>{log.company}</td>
                  <td>
                    <Link className="btn" href={`/dashboard/verify?hash=${encodeURIComponent(log.id)}`}>
                      Verify
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
