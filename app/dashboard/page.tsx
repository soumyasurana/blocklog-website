import Link from "next/link";
import DashboardTopBar from "@/components/DashboardTopBar";
import { recentLogs } from "@/components/data";

const stats = [
  ["Logs ingested today", "48,291"],
  ["Total logs", "18,044,112"],
  ["Verification failures", "12"],
  ["API requests", "522,902"],
];

export default function DashboardHomePage() {
  return (
    <>
      <DashboardTopBar title="Overview" />
      <section className="stats">
        {stats.map(([label, value]) => (
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
          <div className="chart">Chart placeholder: Logs / hour</div>
        </article>
        <article className="card">
          <h2 style={{ marginTop: 0 }}>API usage</h2>
          <div className="chart">Chart placeholder: Requests / minute</div>
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
            {recentLogs.map((log) => (
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
