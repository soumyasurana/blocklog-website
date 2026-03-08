import Link from "next/link";
import DashboardTopBar from "@/components/DashboardTopBar";
import { recentLogs } from "@/components/data";

export default function LogsPage() {
  return (
    <>
      <DashboardTopBar title="Log Explorer" />
      <section className="card" style={{ display: "grid", gap: 12 }}>
        <div className="grid grid-2">
          <div>
            <label>Date range</label>
            <input placeholder="Last 24 hours" />
          </div>
          <div>
            <label>Search</label>
            <input placeholder="Search hash, user, event" />
          </div>
          <div>
            <label>Event type</label>
            <select>
              <option>All events</option>
              <option>user.login</option>
              <option>payment.created</option>
            </select>
          </div>
          <div>
            <label>Source</label>
            <select>
              <option>All sources</option>
              <option>web-app</option>
              <option>payments-api</option>
            </select>
          </div>
          <div>
            <label>Status</label>
            <select>
              <option>All statuses</option>
              <option>verified</option>
              <option>pending</option>
              <option>failed</option>
            </select>
          </div>
        </div>
      </section>

      <section className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Event type</th>
              <th>Source</th>
              <th>Hash</th>
              <th>Status</th>
              <th>Company ID</th>
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
                <td>{log.hash}</td>
                <td>{log.status}</td>
                <td>{log.company}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
