import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const services = [
  ["API status", "Operational", "99.99%"],
  ["Log ingestion", "Operational", "99.95%"],
  ["Verification service", "Operational", "99.97%"],
];

export default function StatusPage() {
  return (
    <>
      <SiteHeader />
      <main className="container section">
        <h1 style={{ marginTop: 0 }}>Status</h1>
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Status</th>
                <th>30-day uptime</th>
              </tr>
            </thead>
            <tbody>
              {services.map(([service, status, uptime]) => (
                <tr key={service}>
                  <td>{service}</td>
                  <td>{status}</td>
                  <td>{uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
