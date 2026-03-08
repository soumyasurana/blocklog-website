import DashboardTopBar from "@/components/DashboardTopBar";

const stream = [
  "[12:01:22] user.login",
  "[12:01:23] payment.created",
  "[12:01:25] invoice.generated",
  "[12:01:30] payment.refund_requested",
  "[12:01:32] report.exported",
];

export default function IngestionMonitorPage() {
  return (
    <>
      <DashboardTopBar title="Log Ingestion Monitor" />
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Incoming stream</h2>
        <div className="stream">
          {stream.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>
      <section className="grid grid-3" style={{ marginTop: 12 }}>
        <article className="card">
          <strong>🟢 verified</strong>
          <p className="muted">98.4%</p>
        </article>
        <article className="card">
          <strong>🟡 pending</strong>
          <p className="muted">1.1%</p>
        </article>
        <article className="card">
          <strong>🔴 failed</strong>
          <p className="muted">0.5%</p>
        </article>
      </section>
    </>
  );
}
