import Link from "next/link";

export default function LogIngestionDocsPage() {
  return (
    <>
      <main className="container section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Log ingestion</p>
            <h1 style={{ marginTop: 0, marginBottom: 10 }}>Send canonical events into the sealed audit trail.</h1>
          </div>
          <p className="section-lead">
            The backend accepts single-log and batch ingestion. Console traffic can use bearer auth; external
            integrations can use the manually created company API key.
          </p>
        </div>

        <section className="grid grid-2">
          <article className="card glass-card">
            <p className="eyebrow">Single log</p>
            <pre className="code-pane">{`POST /api/v1/logs
{
  "event_type": "payment.created",
  "source": "payments-api",
  "payload": {
    "user_id": "123",
    "amount": 2000,
    "currency": "USD"
  }
}`}</pre>
          </article>

          <article className="card glass-card">
            <p className="eyebrow">Delete with trail preservation</p>
            <pre className="code-pane">{`POST /api/v1/logs/{log_id}/delete
{
  "reason": "customer erasure request"
}`}</pre>
          </article>
        </section>

        <div className="button-row" style={{ marginTop: 18 }}>
          <Link className="btn btn-primary" href="/docs/batch-logs">
            Batch Logs
          </Link>
          <Link className="btn" href="/docs/verification">
            Verification
          </Link>
        </div>
      </main>
    </>
  );
}
