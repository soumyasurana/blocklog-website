import Link from "next/link";

export default function OperationsDocsPage() {
  return (
    <>
      <main className="container section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Operations</p>
            <h1 style={{ marginTop: 0, marginBottom: 10 }}>Health, metrics, integrity, and export operations.</h1>
          </div>
          <p className="section-lead">
            These are the backend endpoints and product surfaces used for observability, rollout checks,
            and production debugging.
          </p>
        </div>

        <pre className="code-pane">{`GET /api/v1/health
GET /api/v1/health/live
GET /api/v1/health/ready
GET /api/v1/metrics
GET /api/v1/usage
GET /api/v1/integrity/status
GET /api/v1/integrity/report
GET /api/v1/webhooks/events`}</pre>

        <div className="button-row" style={{ marginTop: 18 }}>
          <Link className="btn btn-primary" href="/dashboard/system/pipeline">
            Pipeline Console
          </Link>
          <Link className="btn" href="/dashboard/monitoring/integrity">
            Integrity Monitor
          </Link>
        </div>
      </main>
    </>
  );
}
