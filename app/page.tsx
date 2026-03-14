import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const steps = [
  {
    title: "Send logs via API",
    detail: "Forward operational events, financial activity, AI actions, or compliance signals to a single ingestion plane.",
  },
  {
    title: "Seal every event",
    detail: "Each record is hashed, chained, and signed to create tamper-evident lineage from the first write.",
  },
  {
    title: "Store securely",
    detail: "Batching, anchoring, and proof export make long-term retention auditable without trusting mutable infrastructure.",
  },
  {
    title: "Verify anytime",
    detail: "Re-run proof checks on demand to validate inclusion, chain continuity, and timestamp anchoring.",
  },
];

const features = [
  "Immutable Logs",
  "Cryptographic Integrity",
  "Anchored Verification",
  "Compliance Ready",
  "API First",
  "Human + AI Audit Trails",
];

const useCases = [
  "Financial ledger evidence",
  "Healthcare access history",
  "Internal security telemetry",
  "Policy and retention controls",
  "AI provenance and HITL actions",
  "Third-party trust attestations",
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="container">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Cryptographic audit infrastructure</p>
            <h1>Tamper-Proof Audit Logs for Modern Systems</h1>
            <p>
              Blocklog gives security, platform, and compliance teams a verifiable system of
              record. Every event is sealed, every proof is exportable, and every critical action
              is backed by cryptographic integrity instead of operational trust alone.
            </p>
            <div className="button-row" style={{ marginTop: 18 }}>
              <Link className="btn btn-primary" href="/signup">
                Start Free
              </Link>
              <Link className="btn btn-link" href="/docs">
                View Docs
              </Link>
              <Link className="btn" href="/dashboard">
                Open Console
              </Link>
            </div>
            <div className="hero-metrics">
              <div className="hero-metric">
                <span className="metric-value">99.99%</span>
                <span className="muted">verification service uptime target</span>
              </div>
              <div className="hero-metric">
                <span className="metric-value">Hash-chained</span>
                <span className="muted">event lineage across every batch</span>
              </div>
              <div className="hero-metric">
                <span className="metric-value">Evidence-ready</span>
                <span className="muted">proof export for audits and disputes</span>
              </div>
            </div>
          </div>
          <div className="hero-panel">
            <div className="code-pane">{`POST /api/v1/logs
{
  "event_type": "payment.created",
  "source": "payments-api",
  "payload": {
    "user_id": "123",
    "amount": 2000,
    "currency": "USD"
  }
}`}</div>
            <div className="hero-orbit">
              <div className="orbital-card">
                <p className="eyebrow">Integrity</p>
                <strong>Hash chains + signatures</strong>
                <p className="muted">Detect silent edits and prove ordering across records.</p>
              </div>
              <div className="orbital-card">
                <p className="eyebrow">Verification</p>
                <strong>Anchored proof checks</strong>
                <p className="muted">Validate inclusion, timestamps, and chain state in seconds.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">How it works</p>
              <h2>From event ingestion to defensible proof.</h2>
            </div>
            <p className="section-lead">
              Blocklog is designed to sit underneath production systems, not beside them. The API
              surface stays simple while the trust machinery stays rigorous.
            </p>
          </div>
          <div className="grid grid-2">
            {steps.map((step, index) => (
              <article className="card glass-card feature-card" key={step.title}>
                <p className="eyebrow">Step {index + 1}</p>
                <h3>{step.title}</h3>
                <p className="muted">{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Core capabilities</p>
              <h2>Built for systems where trust has to be measurable.</h2>
            </div>
          </div>
          <div className="grid grid-3">
            {features.map((feature) => (
              <article className="card glass-card" key={feature}>
                <h3 style={{ marginTop: 0 }}>{feature}</h3>
                <p className="muted">
                  Production-grade controls for ingestion, verification, export, and operational
                  assurance.
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="stack-grid">
            <div className="card glass-card">
              <p className="eyebrow">Security model</p>
              <h2>Hash chains, digital signatures, and verifiable retention.</h2>
              <p className="muted">
                Every log is sealed into a chain, every proof is portable, and every verification
                decision can be reproduced outside the primary application. That gives teams a real
                assurance story for audits, incidents, and external review.
              </p>
              <div className="grid grid-3" style={{ marginTop: 12 }}>
                <div className="orbital-card">
                  <strong>Hash chains</strong>
                  <p className="muted">Preserve sequence integrity and reveal unauthorized mutation.</p>
                </div>
                <div className="orbital-card">
                  <strong>Digital signatures</strong>
                  <p className="muted">Bind ingestion events to trusted signing identities.</p>
                </div>
                <div className="orbital-card">
                  <strong>Integrity verification</strong>
                  <p className="muted">Re-run proofs on demand across logs, batches, and exports.</p>
                </div>
              </div>
            </div>
            <div className="card glass-card">
              <p className="eyebrow">Use cases</p>
              <h2>Where teams use Blocklog.</h2>
              <div className="grid" style={{ gap: 10 }}>
                {useCases.map((item) => (
                  <div className="status-pill" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Architecture</p>
              <h2>Trust infrastructure that stays legible.</h2>
            </div>
          </div>
          <div className="architecture-flow">
            <article className="architecture-node">
              <p className="eyebrow">1</p>
              <h3>Client Systems</h3>
              <p className="muted">Applications, ledgers, security controls, and AI agents emit events.</p>
            </article>
            <article className="architecture-node">
              <p className="eyebrow">2</p>
              <h3>Blocklog API</h3>
              <p className="muted">Authenticated ingestion captures logs, batches, webhooks, and provenance data.</p>
            </article>
            <article className="architecture-node">
              <p className="eyebrow">3</p>
              <h3>Hash Engine</h3>
              <p className="muted">Chain construction, signatures, sealing, and proof generation happen here.</p>
            </article>
            <article className="architecture-node">
              <p className="eyebrow">4</p>
              <h3>Secure Storage</h3>
              <p className="muted">Proof bundles, export artifacts, and retention-aware storage complete the chain.</p>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Documentation</p>
              <h2>Everything needed to integrate quickly.</h2>
            </div>
          </div>
          <div className="grid grid-3">
            <Link className="card glass-card" href="/docs/log-ingestion">
              <h3>API docs</h3>
              <p className="muted">Authentication, ingestion, batch sealing, verification, and export endpoints.</p>
            </Link>
            <Link className="card glass-card" href="/docs/sdks">
              <h3>SDK examples</h3>
              <p className="muted">Implementation patterns for production event pipelines and backend services.</p>
            </Link>
            <Link className="card glass-card" href="/docs/getting-started">
              <h3>Quick start guide</h3>
              <p className="muted">Create keys, register a company, ingest logs, and verify proof artifacts.</p>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
