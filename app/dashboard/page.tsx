"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardTopBar from "@/components/DashboardTopBar";
import { defaultStats, recentLogs, type LogItem } from "@/components/data";
import { blocklogRequest, normalizePayload } from "@/lib/blocklog";

type OverviewResponse = {
  logs_ingested_today?: number;
  total_logs?: number;
  verification_failures?: number;
  api_requests?: number;
  recent_logs?: LogItem[];
};

function formatNum(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function DashboardHomePage() {
  const [stats, setStats] = useState(defaultStats);
  const [logs, setLogs] = useState<LogItem[]>(recentLogs);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOverview() {
      try {
        const payload = await blocklogRequest<OverviewResponse | { data?: OverviewResponse }>(
          "/metrics/overview",
        );
        const overview = normalizePayload<OverviewResponse>(payload, {}, "data");
        setStats({
          logsIngestedToday: overview.logs_ingested_today ?? defaultStats.logsIngestedToday,
          totalLogs: overview.total_logs ?? defaultStats.totalLogs,
          verificationFailures:
            overview.verification_failures ?? defaultStats.verificationFailures,
          apiRequests: overview.api_requests ?? defaultStats.apiRequests,
        });
        if (overview.recent_logs?.length) {
          setLogs(overview.recent_logs);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load overview");
      }
    }

    loadOverview();
  }, []);

  const cards = [
    ["Logs ingested today", formatNum(stats.logsIngestedToday)],
    ["Total logs", formatNum(stats.totalLogs)],
    ["Verification failures", formatNum(stats.verificationFailures)],
    ["API requests", formatNum(stats.apiRequests)],
  ];

  return (
    <>
      <DashboardTopBar title="Overview" />
      {error && <p className="muted">Live API unavailable: {error}</p>}
      <section className="stats">
        {cards.map(([label, value]) => (
          <article className="card stat" key={label}>
            <p className="muted" style={{ margin: "0 0 8px" }}>
              {label}
            </p>
            <h3>{value}</h3>
          </article>
        ))}
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <article className="card">
          <h2 style={{ marginTop: 0 }}>Logs over time</h2>
          <div className="chart">Connected to `/metrics/overview`</div>
        </article>
        <article className="card">
          <h2 style={{ marginTop: 0 }}>API usage</h2>
          <div className="chart">Connected to `/metrics/overview`</div>
        </article>
      </section>

      <section className="table-shell" style={{ marginTop: 16 }}>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Event</th>
              <th>Source</th>
              <th>Status</th>
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
                <td>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
