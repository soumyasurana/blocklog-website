import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const pages = [
  {
    name: "Getting started",
    href: "/docs/getting-started",
    summary: "Bootstrap a tenant, sign in, create credentials, and send the first log.",
  },
  {
    name: "Authentication",
    href: "/docs/authentication",
    summary: "Understand bearer tokens, integration API keys, and when each is appropriate.",
  },
  {
    name: "Log ingestion",
    href: "/docs/log-ingestion",
    summary: "Send canonical events, choose idempotency keys, and understand ingestion behavior.",
  },
  {
    name: "Batch logs",
    href: "/docs/batch-logs",
    summary: "Ingest larger event sets safely and prepare them for later proof generation.",
  },
  {
    name: "Verification",
    href: "/docs/verification",
    summary: "Verify proofs by proof ID, log ID, or batch ID across public and tenant scopes.",
  },
  {
    name: "Operations",
    href: "/docs/operations",
    summary: "Operate the system with health, usage, integrity, webhook, and metrics endpoints.",
  },
  {
    name: "Admin portal",
    href: "/docs/admin-portal",
    summary: "Review company-level controls, API keys, kill switches, and operational posture.",
  },
  {
    name: "Auditor portal",
    href: "/docs/auditor-portal",
    summary: "Understand the verification surfaces intended for reviewers and external auditors.",
  },
  {
    name: "SDKs",
    href: "/docs/sdks",
    summary: "Use the Node and Python reference SDKs for retries, batching, timestamps, and idempotency.",
  },
] as const;

const architecturePoints = [
  "Blocklog accepts canonical JSON events over authenticated HTTP endpoints.",
  "Each event is normalized, timestamped, hashed, and linked into a tamper-evident chain.",
  "Logs can later be sealed into batches, exported as proof bundles, and verified independently.",
  "Operational surfaces expose health, metrics, integrity, usage, and debug signals for production review.",
];

const authModes = [
  {
    title: "Bearer auth for product surfaces",
    detail:
      "Use bearer tokens for console-driven product workflows such as dashboard views, admin actions, and authenticated verification. This is the default mode for signed-in users.",
  },
  {
    title: "API keys for external integrations",
    detail:
      "Use company API keys for server-to-server ingestion and stable integration credentials. This is the right choice for production services sending logs continuously.",
  },
];

const lifecycleSteps = [
  "Authenticate as a user or an integration.",
  "Send a single log or a batch of logs with `event_type`, `source`, `data`, and an `idempotency_key` when retries are possible.",
  "Blocklog normalizes the payload, archives raw ingestion context, links the event into the tenant chain, and records verification metadata.",
  "Batches can later be sealed and anchored for stronger audit portability.",
  "Auditors or operators verify by proof ID, log ID, or batch ID without depending on screenshots or internal assurances.",
];

const operatorChecklist = [
  "Create a company and founder account before onboarding real traffic.",
  "Use bearer auth for interactive product usage and API keys only for long-running integrations.",
  "Prefer explicit `idempotency_key` values whenever clients might retry requests.",
  "Treat `data` as the canonical event body for ingestion requests.",
  "Check `/usage`, `/integrity/status`, `/integrity/report`, and `/metrics` during rollout and incident review.",
  "Export proof bundles early in pilot evaluations so stakeholders can review the full evidence path.",
];

export default function DocsIndexPage() {
  return (
    <>
      <SiteHeader />
      <main className="container section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Documentation</p>
            <h1 style={{ marginTop: 0, marginBottom: 10 }}>Blocklog docs: product model, API contract, and operating guide.</h1>
          </div>
          <p className="section-lead">
            This page is the high-level map of the platform. It explains what Blocklog does, how
            the API is structured, how proof generation fits into the product, which credentials to
            use, which endpoints matter in production, and where to go next for deeper details.
          </p>
        </div>

        <section className="card glass-card" style={{ marginBottom: 20 }}>
          <p className="eyebrow">What Blocklog Is</p>
          <h2 style={{ marginTop: 8, marginBottom: 12 }}>A tamper-evident audit evidence layer for logs and verification workflows.</h2>
          <p className="section-lead" style={{ marginBottom: 16 }}>
            Blocklog is not just a log viewer and not just a verification widget. It is a product
            and API surface for sending canonical events into an integrity-preserving pipeline,
            generating portable proof artifacts, and giving operators or auditors a way to validate
            that records were not silently changed after ingestion.
          </p>
          <div className="grid grid-2">
            {architecturePoints.map((item) => (
              <div className="status-pill" key={item}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-3" style={{ marginBottom: 24 }}>
          {pages.map((page) => (
            <Link key={page.href} href={page.href} className="card glass-card">
              <strong>{page.name}</strong>
              <p className="muted" style={{ marginBottom: 0, marginTop: 10 }}>{page.summary}</p>
            </Link>
          ))}
        </section>

        <section className="grid grid-2" style={{ marginBottom: 24 }}>
          <article className="card glass-card">
            <p className="eyebrow">Mental Model</p>
            <h2 style={{ marginTop: 8, marginBottom: 12 }}>The normal request lifecycle.</h2>
            <ol className="landing-list" style={{ marginTop: 0 }}>
              {lifecycleSteps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>
          <article className="card glass-card">
            <p className="eyebrow">Reference Flow</p>
            <h2 style={{ marginTop: 8, marginBottom: 12 }}>The API flow most teams start with.</h2>
            <pre className="code-pane">{`POST /api/v1/auth/login
POST /api/v1/auth/api_keys
POST /api/v1/logs
POST /api/v1/logs/batch
POST /api/v1/batches/seal
POST /api/v1/batches/{batch_id}/anchor
GET  /api/v1/logs/{log_id}/verify
GET  /api/v1/public/verify/{proof_id}
GET  /api/v1/usage
GET  /api/v1/integrity/status`}</pre>
          </article>
        </section>

        <section className="grid grid-2" style={{ marginBottom: 24 }}>
          {authModes.map((mode) => (
            <article className="card glass-card" key={mode.title}>
              <p className="eyebrow">Authentication mode</p>
              <h2 style={{ marginTop: 8, marginBottom: 12 }}>{mode.title}</h2>
              <p className="muted" style={{ marginBottom: 0 }}>{mode.detail}</p>
            </article>
          ))}
        </section>

        <section className="card glass-card" style={{ marginBottom: 24 }}>
          <p className="eyebrow">Canonical Ingestion Contract</p>
          <h2 style={{ marginTop: 8, marginBottom: 12 }}>What a correct ingestion payload looks like.</h2>
          <p className="section-lead" style={{ marginBottom: 16 }}>
            For current ingestion endpoints, treat `data` as the event body, `event_type` as the
            semantic event label, `source` as the producing system, and `idempotency_key` as the
            replay guard. If the client omits a timestamp, the SDKs or backend can supply one.
          </p>
          <div className="grid grid-2">
            <article>
              <p className="eyebrow">Single log</p>
              <pre className="code-pane">{`POST /api/v1/logs
X-API-Key: <integration_key>

{
  "event_type": "payment.created",
  "source": "payments-api",
  "idempotency_key": "evt_payment_123_created",
  "timestamp": "2026-03-27T10:20:00Z",
  "data": {
    "user_id": "123",
    "amount": 2000,
    "currency": "USD"
  }
}`}</pre>
            </article>
            <article>
              <p className="eyebrow">Batch ingestion</p>
              <pre className="code-pane">{`POST /api/v1/logs/batch
X-API-Key: <integration_key>

{
  "logs": [
    {
      "event_type": "payment.created",
      "source": "payments-api",
      "idempotency_key": "evt_payment_123_created",
      "data": {
        "user_id": "123",
        "amount": 2000
      }
    },
    {
      "event_type": "payment.updated",
      "source": "payments-api",
      "idempotency_key": "evt_payment_123_updated",
      "data": {
        "user_id": "123",
        "status": "captured"
      }
    }
  ]
}`}</pre>
            </article>
          </div>
        </section>

        <section className="grid grid-2" style={{ marginBottom: 24 }}>
          <article className="card glass-card">
            <p className="eyebrow">Verification Surfaces</p>
            <h2 style={{ marginTop: 8, marginBottom: 12 }}>How reviewers validate evidence.</h2>
            <pre className="code-pane">{`GET /api/v1/public/verify/{proof_id}
GET /api/v1/verify/log/{log_id}
GET /api/v1/logs/{log_id}/verify
GET /api/v1/verify/batch/{batch_id}
GET /api/v1/evidence/batch/{batch_id}
POST /api/v1/exports/{batch_id}`}</pre>
            <p className="muted" style={{ marginBottom: 0 }}>
              Use public verification for portable proof checks and tenant-scoped verification when
              operators need richer context tied to the company boundary.
            </p>
          </article>
          <article className="card glass-card">
            <p className="eyebrow">Operational Endpoints</p>
            <h2 style={{ marginTop: 8, marginBottom: 12 }}>What operators should watch in production.</h2>
            <pre className="code-pane">{`GET /api/v1/health
GET /api/v1/health/live
GET /api/v1/health/ready
GET /api/v1/metrics
GET /api/v1/usage
GET /api/v1/integrity/status
GET /api/v1/integrity/report
GET /api/v1/logs/debug/recent
GET /api/v1/webhooks/events`}</pre>
            <p className="muted" style={{ marginBottom: 0 }}>
              These endpoints support rollout verification, system health review, integrity checks,
              usage tracking, and ingestion troubleshooting.
            </p>
          </article>
        </section>

        <section className="card glass-card" style={{ marginBottom: 24 }}>
          <p className="eyebrow">Operator Checklist</p>
          <h2 style={{ marginTop: 8, marginBottom: 12 }}>What to verify before sending production traffic.</h2>
          <div className="grid grid-2">
            {operatorChecklist.map((item) => (
              <div className="status-pill" key={item}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-3">
          <Link className="btn btn-primary" href="/docs/getting-started">
            Start with Getting Started
          </Link>
          <Link className="btn" href="/docs/log-ingestion">
            Go to Log Ingestion
          </Link>
          <Link className="btn" href="/docs/operations">
            Go to Operations
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
