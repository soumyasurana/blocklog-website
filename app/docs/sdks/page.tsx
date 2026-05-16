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
            <h1 style={{ marginTop: 0, marginBottom: 10 }}>Start with the SDKs, not hand-rolled HTTP clients.</h1>
          </div>
          <p className="section-lead">
            Blocklog now includes first-party Node.js and Python SDK reference clients in-repo with
            automatic timestamps, retries, batching helpers, schema validation, and explicit
            idempotency support.
          </p>
        </div>

        <div className="grid grid-3">
          <article className="card glass-card">
            <strong>Node.js</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              Source lives in `SDKs/node/index.ts` and is designed for typed app integrations.
            </p>
          </article>
          <article className="card glass-card">
            <strong>Python</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              Source lives in `SDKs/python/blocklog_sdk.py` and supports sync service workloads.
            </p>
          </article>
          <article className="card glass-card">
            <strong>Operational posture</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              SDKs default to `idempotency_key`-based writes so retries do not fork the audit trail.
            </p>
          </article>
        </div>

        <section className="card glass-card" style={{ marginTop: 18 }}>
          <p className="eyebrow">Included guardrails</p>
          <h2 style={{ marginTop: 8, marginBottom: 10 }}>These clients encode the ingestion rules the platform now expects.</h2>
          <ul className="muted" style={{ margin: 0, paddingLeft: 18 }}>
            <li>Each log gets a UTC timestamp when the caller omits one.</li>
            <li>Transient failures are retried with bounded backoff.</li>
            <li>Batch helpers chunk payloads safely instead of forcing callers to hand-roll loops.</li>
            <li>Input validation catches malformed event contracts before they hit the API.</li>
            <li>Idempotency keys are first-class so duplicate submissions resolve to the same log.</li>
          </ul>
        </section>

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
