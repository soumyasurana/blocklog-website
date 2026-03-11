"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { recentLogs, type LogItem } from "@/components/data";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type LogsResponse = {
  logs?: LogItem[];
};

export default function LogsPage() {
  const [dateRange, setDateRange] = useState("last_24_hours");
  const [eventType, setEventType] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [logs, setLogs] = useState<LogItem[]>(recentLogs);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (dateRange) params.set("date_range", dateRange);
    if (eventType) params.set("event_type", eventType);
    if (source) params.set("source", source);
    if (status) params.set("status", status);
    if (query) params.set("q", query);

    try {
      const payload = await blocklogRequest<LogsResponse | { data?: LogsResponse }>(
        `/logs?${params.toString()}`,
      );
      const parsed = normalizePayload<LogsResponse>(payload, {}, "data");
      setLogs(parsed.logs?.length ? parsed.logs : recentLogs);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load logs");
      setLogs(recentLogs);
    } finally {
      setLoading(false);
    }
  }, [dateRange, eventType, source, status, query]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

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
              placeholder="web-app"
              value={source}
              onChange={(event) => setSource(event.target.value)}
            />
          </div>
          <div>
            <label>Status</label>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All statuses</option>
              <option value="verified">verified</option>
              <option value="pending">pending</option>
              <option value="failed">failed</option>
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
                  <td>{log.timestamp}</td>
                  <td>
                    <Link href={`/dashboard/logs/${log.id}`}>{log.event}</Link>
                  </td>
                  <td>{log.source}</td>
                  <td>{log.hash}</td>
                  <td>{log.status}</td>
                  <td>{log.company}</td>
                  <td>
                    <Link className="btn" href={`/dashboard/verify?hash=${encodeURIComponent(log.hash)}`}>
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
