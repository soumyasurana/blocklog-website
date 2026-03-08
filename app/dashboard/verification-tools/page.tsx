import DashboardTopBar from "@/components/DashboardTopBar";

export default function VerificationToolsPage() {
  return (
    <>
      <DashboardTopBar title="Verification Tools" />
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Verify hash or log payload</h2>
        <div className="form">
          <div>
            <label>Hash</label>
            <input placeholder="0x..." />
          </div>
          <div>
            <label>Raw log payload</label>
            <textarea placeholder='{"event":"user.login","user_id":"123"}' />
          </div>
          <button className="btn btn-primary">Run verification</button>
        </div>
      </section>
      <section className="grid grid-3" style={{ marginTop: 12 }}>
        <article className="card">
          <strong>Integrity</strong>
          <p style={{ color: "var(--success)" }}>VALID</p>
        </article>
        <article className="card">
          <strong>Chain</strong>
          <p style={{ color: "var(--success)" }}>VERIFIED</p>
        </article>
        <article className="card">
          <strong>Signature</strong>
          <p style={{ color: "var(--success)" }}>MATCH</p>
        </article>
      </section>
    </>
  );
}
