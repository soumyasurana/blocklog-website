import Link from "next/link";

export default function VerificationDocsPage() {
  return (
    <>
      <main className="container section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Verification</p>
            <h1 style={{ marginTop: 0, marginBottom: 10 }}>Verify by proof ID, log ID, or batch ID.</h1>
          </div>
          <p className="section-lead">
            Verification surfaces exist for public proof checks, log verification, batch verification, and
            auditor review workflows.
          </p>
        </div>

        <section className="grid grid-2">
          <article className="card glass-card">
            <p className="eyebrow">Public proof verification</p>
            <pre className="code-pane">{`GET /api/v1/public/verify/{proof_id}`}</pre>
          </article>
          <article className="card glass-card">
            <p className="eyebrow">Tenant verification</p>
            <pre className="code-pane">{`GET /api/v1/verify/log/{log_id}
GET /api/v1/logs/{log_id}/verify
GET /api/v1/verify/batch/{batch_id}`}</pre>
          </article>
        </section>

        <div className="button-row" style={{ marginTop: 18 }}>
          <Link className="btn btn-primary" href="/auditor">
            Auditor Portal
          </Link>
          <Link className="btn" href="/verify">
            Open Verifier
          </Link>
        </div>
      </main>
    </>
  );
}
