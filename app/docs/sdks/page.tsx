import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function SdksDocsPage() {
  return (
    <>
      <SiteHeader />
      <main className="container section">
        <div className="section-header">
          <div>
            <p className="eyebrow">SDKs and integration notes</p>
            <h1 style={{ marginTop: 0, marginBottom: 10 }}>Use the HTTP contract directly today.</h1>
          </div>
          <p className="section-lead">
            The product currently ships clear HTTP endpoints and examples through the docs and console.
            These are the practical implementation paths while formal SDK packaging evolves.
          </p>
        </div>

        <div className="grid grid-3">
          <article className="card glass-card">
            <strong>Node.js</strong>
            <p className="muted" style={{ marginBottom: 0 }}>Use `fetch` or Axios against the documented `/api/v1` routes.</p>
          </article>
          <article className="card glass-card">
            <strong>Python</strong>
            <p className="muted" style={{ marginBottom: 0 }}>Use `requests` with bearer auth for console flows or API keys for integrations.</p>
          </article>
          <article className="card glass-card">
            <strong>Go</strong>
            <p className="muted" style={{ marginBottom: 0 }}>Use standard `net/http` clients with the same contract described across the docs pages.</p>
          </article>
        </div>

        <div className="button-row" style={{ marginTop: 18 }}>
          <Link className="btn btn-primary" href="/docs/getting-started">
            Getting Started
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
