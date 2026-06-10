import Link from "next/link";

export default function AuthenticationDocsPage() {
  return (
    <>
      <main className="container section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Authentication</p>
            <h1 style={{ marginTop: 0, marginBottom: 10 }}>Console auth uses bearer tokens. API keys are manual integration credentials.</h1>
          </div>
          <p className="section-lead">
            The frontend no longer generates API keys during login. Product surfaces authenticate with the
            bearer token. Create an API key only when an external service needs a stable credential.
          </p>
        </div>

        <section className="grid grid-2">
          <article className="card glass-card">
            <p className="eyebrow">Login</p>
            <pre className="code-pane">{`POST /api/v1/auth/login
{
  "email": "founder@company.com",
  "password": "ChangeMe123!"
}`}</pre>
          </article>

          <article className="card glass-card">
            <p className="eyebrow">Create integration API key</p>
            <pre className="code-pane">{`POST /api/v1/auth/api_keys
Authorization: Bearer <access_token>

{
  "name": "production-ingestion",
  "rate_limit_per_minute": 1000
}`}</pre>
            <p className="muted" style={{ marginBottom: 0 }}>
              Only one active company API key is allowed at a time. Revoke the current one before creating another.
            </p>
          </article>
        </section>

        <div className="button-row" style={{ marginTop: 18 }}>
          <Link className="btn btn-primary" href="/docs/getting-started">
            Getting Started
          </Link>
          <Link className="btn" href="/docs/admin-portal">
            Admin Portal
          </Link>
        </div>
      </main>
    </>
  );
}
