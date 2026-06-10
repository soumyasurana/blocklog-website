import Link from "next/link";

export default function GettingStartedPage() {
  return (
    <main className="container section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Getting started</p>
          <h1 style={{ marginTop: 0, marginBottom: 10 }}>
            Record and verify your first immutable event.
          </h1>
        </div>

        <p className="section-lead">
          Blocklog creates tamper-evident audit trails for AI agents,
          financial workflows, and critical business systems. In this guide
          you'll create an account, generate an API key, send your first
          event, and verify its integrity.
        </p>
      </div>

      <section className="grid grid-2">
        <article className="card glass-card">
          <p className="eyebrow">1. Create an account</p>

          <pre className="code-pane">{`POST /api/v1/auth/signup

{
  "username": "founder",
  "email": "founder@company.com",
  "password": "ChangeMe123!",
  "workspace_name": "Founder Workspace"
}`}</pre>

          <p className="muted" style={{ marginBottom: 0 }}>
            Blocklog automatically provisions a personal workspace. Specify a
            <code>company_id</code> only when joining an existing organization.
          </p>
        </article>

        <article className="card glass-card">
          <p className="eyebrow">2. Create an API key</p>

          <pre className="code-pane">{`POST /api/v1/auth/api_keys
Authorization: Bearer <access_token>

{
  "name": "production-agent"
}`}</pre>

          <p className="muted" style={{ marginBottom: 0 }}>
            API keys are used by applications, agents, SDKs, and backend
            services. Store them securely—you will only see the full key once.
          </p>
        </article>

        <article className="card glass-card">
          <p className="eyebrow">3. Send your first event</p>

          <pre className="code-pane">{`POST /api/v1/logs
X-API-Key: blk_live_xxxxxxxxx

{
  "event_type": "payment.created",
  "source": "payments-api",
  "data": {
    "user_id": "123",
    "amount": 2000,
    "currency": "USD"
  }
}`}</pre>

          <p className="muted" style={{ marginBottom: 0 }}>
            Every audit trail, replay session, investigation, and compliance
            report begins with an event.
          </p>
        </article>

        <article className="card glass-card">
          <p className="eyebrow">4. Verify integrity</p>

          <pre className="code-pane">{`GET /api/v1/verify/log/log_abc123
X-API-Key: blk_live_xxxxxxxxx`}</pre>

          <p className="muted" style={{ marginBottom: 0 }}>
            Verify that the event exists in Blocklog's cryptographic integrity
            chain and has not been modified.
          </p>
        </article>
      </section>

      <section
        className="card glass-card"
        style={{ marginTop: 24 }}
      >
        <p className="eyebrow">Using the Python SDK</p>

        <pre className="code-pane">{`pip install blocklog

import blocklog

client = blocklog.init(
    api_key="blk_live_xxxxxxxxx"
)

client.event(
    "payment.created",
    {
        "user_id": "123",
        "amount": 2000,
        "currency": "USD"
    }
)`}</pre>

        <p className="muted" style={{ marginBottom: 0 }}>
          Most applications use the SDK rather than interacting with the REST
          API directly.
        </p>
      </section>

      <div className="button-row" style={{ marginTop: 24 }}>
        <Link className="btn btn-primary" href="/docs/authentication">
          Authentication
        </Link>

        <Link className="btn" href="/docs/api-keys">
          API Keys
        </Link>

        <Link className="btn" href="/docs/log-ingestion">
          Log Ingestion
        </Link>

        <Link className="btn" href="/docs/verification">
          Verification
        </Link>
      </div>
    </main>
  );
}