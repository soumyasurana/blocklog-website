import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function GettingStartedPage() {
  return (
    <>
      <SiteHeader />
      <main className="container section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Getting started</p>
            <h1 style={{ marginTop: 0, marginBottom: 10 }}>Create an account, sign in, and send the first log.</h1>
          </div>
          <p className="section-lead">
            The current product flow is: create an account, let Blocklog provision a personal workspace
            automatically or join an existing company, use bearer auth for the console, and only create
            an API key when you need an external integration credential.
          </p>
        </div>

        <section className="grid grid-2">
          <article className="card glass-card">
            <p className="eyebrow">1. Signup</p>
            <pre className="code-pane">{`POST /api/v1/auth/signup
{
  "username": "founder",
  "email": "founder@company.com",
  "password": "ChangeMe123!",
  "workspace_name": "Founder Workspace"
}`}</pre>
            <p className="muted" style={{ marginBottom: 0 }}>
              Omit `company_id` to start as an individual developer. Add an existing `company_id` only
              when joining a shared company workspace.
            </p>
          </article>

          <article className="card glass-card">
            <p className="eyebrow">2. Ingest a log</p>
            <pre className="code-pane">{`POST /api/v1/logs
Authorization: Bearer <access_token>
X-Company-ID: acme-financial

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
        </section>

        <div className="button-row" style={{ marginTop: 18 }}>
          <Link className="btn btn-primary" href="/docs/authentication">
            Authentication
          </Link>
          <Link className="btn" href="/docs/log-ingestion">
            Log Ingestion
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
