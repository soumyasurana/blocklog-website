import DashboardTopBar from "@/components/DashboardTopBar";

export default async function LogDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <DashboardTopBar title={`Log Details: ${id}`} />
      <section className="grid grid-2">
        <article className="card">
          <h2 style={{ marginTop: 0 }}>Event data</h2>
          <pre className="code-pane" style={{ margin: 0 }}>
            {`{\n  "event": "user.login",\n  "user_id": "123"\n}`}
          </pre>
        </article>
        <article className="card">
          <h2 style={{ marginTop: 0 }}>Metadata</h2>
          <p>
            IP: <code>172.2.4.9</code>
          </p>
          <p>
            Device: <code>Chrome 127</code>
          </p>
          <p>
            Trace: <code>tr_784f9</code>
          </p>
        </article>
      </section>
      <section className="grid grid-3" style={{ marginTop: 12 }}>
        <article className="card">
          <strong>Hash</strong>
          <p className="muted">0x2eaf1b1a...</p>
        </article>
        <article className="card">
          <strong>Signature</strong>
          <p className="muted">sig_9f01...ef8</p>
        </article>
        <article className="card">
          <strong>Integrity status</strong>
          <p style={{ color: "var(--success)" }}>VALID</p>
        </article>
        <article className="card">
          <strong>Chain position</strong>
          <p className="muted">Block #6,818</p>
        </article>
        <article className="card">
          <strong>Verification result</strong>
          <p className="muted">Signature MATCH, Chain VERIFIED</p>
        </article>
      </section>
      <button className="btn btn-primary" style={{ marginTop: 14 }}>
        Verify Integrity
      </button>
    </>
  );
}
