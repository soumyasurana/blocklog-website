import type { DashboardIncident } from "@/types/dashboard";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";

type RecentIncidentsPanelProps = {
  incidents: DashboardIncident[];
};

export default function RecentIncidentsPanel({ incidents }: RecentIncidentsPanelProps) {
  if (incidents.length === 0) {
    return <EmptyState message="No recent incidents reported." />;
  }

  return (
    <section className="card dashboard-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Recent Activity</p>
          <h2>Recent Incidents</h2>
        </div>
      </div>
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Incident</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.id}>
                <td>{incident.title}</td>
                <td>{incident.severity ?? "unknown"}</td>
                <td><StatusBadge value={incident.status ?? "unknown"} variant={incident.status?.toLowerCase() === "closed" ? "success" : "warning"} /></td>
                <td>{incident.owner ?? "Unassigned"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
