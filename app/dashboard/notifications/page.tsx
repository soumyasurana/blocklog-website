import DashboardTopBar from "@/components/DashboardTopBar";

const alerts = [
  ["verification failure", "2 minutes ago"],
  ["ingestion failure", "10 minutes ago"],
  ["API misuse", "17 minutes ago"],
];

export default function NotificationsPage() {
  return (
    <>
      <DashboardTopBar title="Notifications" />
      <section className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Alert</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(([name, time]) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
