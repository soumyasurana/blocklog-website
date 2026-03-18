import Link from "next/link";
import LandingHeroActions from "@/components/LandingHeroActions";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import VerifyProofWidget from "@/components/VerifyProofWidget";

const howItWorks = [
  {
    step: "1. Ingest logs",
    detail: "Send application, financial, AI, and operator events through one audit API.",
  },
  {
    step: "2. Seal and anchor",
    detail: "Blocklog hash-chains records, generates proofs, and anchors batch integrity.",
  },
  {
    step: "3. Verify anytime",
    detail: "Auditors, customers, and internal teams can verify integrity independently.",
  },
];

const beforeAfter = [
  {
    before: "Logs can be modified silently.",
    after: "Logs are tamper-evident by design.",
  },
  {
    before: "Evidence is exported as screenshots and manual notes.",
    after: "Proof bundles are generated with verifiable integrity data.",
  },
  {
    before: "Auditor trust depends on your word and process.",
    after: "Auditors can verify the record independently.",
  },
];

const securityGuarantees = [
  "Append-only architecture",
  "Cryptographic proofs",
  "Public anchoring",
  "No silent log mutation",
];

const auditorPoints = [
  "Independent verification",
  "Proof bundles for evidence requests",
  "Public verification links",
  "No need to trust Blocklog itself",
];

const useCases = [
  "SOC 2 evidence workflows",
  "Fintech transaction trails",
  "Internal security telemetry",
  "AI provenance and HITL approvals",
  "Retention and policy controls",
  "Third-party trust attestations",
];

const trustSignals = [
  { value: "Sub-second", label: "proof checks for recent records" },
  { value: "Portable", label: "evidence bundles for auditors and customers" },
  { value: "Independent", label: "verification without trusting the app" },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="container">
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-copy-inner">
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                Built for security teams, compliance leads, and auditors
              </div>
              <p className="eyebrow">Cryptographic audit infrastructure</p>
              <h1>Audit logs you can verify, not just trust.</h1>
              <p className="hero-value-prop">
                Prove your audit logs have not been tampered with, cryptographically. Blocklog turns
                every critical event into evidence an auditor can verify independently.
              </p>
              <LandingHeroActions />
              <div className="hero-metrics">
                <div className="hero-metric">
                  <span className="metric-value">SOC 2 ready</span>
                  <span className="muted">log integrity evidence without manual scramble</span>
                </div>
                <div className="hero-metric">
                  <span className="metric-value">Proof-first</span>
                  <span className="muted">evidence bundles generated from real chain state</span>
                </div>
                <div className="hero-metric">
                  <span className="metric-value">Auditor-friendly</span>
                  <span className="muted">verification without needing to trust Blocklog</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel-glow" />
            <div className="hero-status-strip">
              {trustSignals.map((signal) => (
                <div className="hero-status-card" key={signal.label}>
                  <strong>{signal.value}</strong>
                  <span>{signal.label}</span>
                </div>
              ))}
            </div>
            <div className="code-pane">{`POST /api/v1/logs
{
  "event_type": "payment.created",
  "source": "payments-api",
  "payload": {
    "user_id": "123",
    "amount": 2000,
    "currency": "USD"
  }
}

POST /api/v1/batches/seal
POST /api/v1/batches/{batch_id}/anchor
GET  /api/v1/public/verify/{proof_id}`}</div>
            <div className="hero-orbit">
              <div className="orbital-card">
                <p className="eyebrow">Design partners</p>
                <strong>Used by early fintech and SaaS teams preparing for SOC 2.</strong>
                <p className="muted">Built by engineers for compliance-heavy workflows.</p>
              </div>
              <div className="orbital-card">
                <p className="eyebrow">Pilot structure</p>
                <strong>Start a 20-day pilot</strong>
                <p className="muted">Continue at $299/month. No data loss. Pilot cost credited forward.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <VerifyProofWidget />
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">How it works</p>
              <h2>Three steps from event ingestion to defensible proof.</h2>
            </div>
          </div>
          <div className="grid grid-3">
            {howItWorks.map((item) => (
              <article className="card glass-card capability-card" key={item.step}>
                <div className="capability-icon" />
                <h3 style={{ marginTop: 0 }}>{item.step}</h3>
                <p className="muted">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Before vs after</p>
              <h2>People buy contrast, not feature lists.</h2>
            </div>
          </div>
          <div className="comparison-grid">
            {beforeAfter.map((row) => (
              <div className="comparison-row" key={row.before}>
                <div className="comparison-card comparison-card-muted">
                  <span className="comparison-label">Without Blocklog</span>
                  <p>{row.before}</p>
                </div>
                <div className="comparison-card comparison-card-strong">
                  <span className="comparison-label">With Blocklog</span>
                  <p>{row.after}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="stack-grid">
            <div className="card glass-card">
              <p className="eyebrow">Built for auditors</p>
              <h2>Built for auditors, not just engineers.</h2>
              <p className="muted">
                Independent verification, public proof links, and evidence bundles make audit review
                faster because the reviewer does not need to trust your application or Blocklog.
              </p>
              <div className="grid grid-2" style={{ marginTop: 12 }}>
                {auditorPoints.map((item) => (
                  <div className="orbital-card" key={item}>
                    <strong>{item}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="card glass-card">
              <p className="eyebrow">SOC 2 use case</p>
              <h2>How Blocklog helps you pass SOC 2 faster.</h2>
              <div className="grid" style={{ gap: 10 }}>
                <div className="status-pill">Supports log integrity requirements</div>
                <div className="status-pill">Exports evidence when auditors ask</div>
                <div className="status-pill">Reduces audit friction during review</div>
              </div>
              <div className="button-row" style={{ marginTop: 18 }}>
                <Link className="btn btn-primary" href="/pilot">
                  Start 20-Day Pilot
                </Link>
                <Link className="btn" href="/docs/getting-started">
                  View integration path
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Security guarantees</p>
              <h2>What security buyers scan for, right away.</h2>
            </div>
          </div>
          <div className="grid grid-2">
            <article className="card glass-card">
              <div className="grid" style={{ gap: 10 }}>
                {securityGuarantees.map((item) => (
                  <div className="status-pill" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </article>
            <article className="card glass-card">
              <p className="eyebrow">Developer hook</p>
              <h2 style={{ marginTop: 8 }}>A short API flow your team can picture using.</h2>
              <div className="code-pane">{`POST /logs
POST /batches/seal
POST /batches/{batch_id}/anchor
GET /public/verify/{proof_id}

# evidence anyone can verify`}</div>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Who it fits</p>
              <h2>Designed for real trust-heavy workflows.</h2>
            </div>
          </div>
          <div className="grid" style={{ gap: 10 }}>
            {useCases.map((item) => (
              <div className="status-pill" key={item}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="trust-band">
            <div>
              <p className="eyebrow">Pilot clarity</p>
              <h2>What happens after 20 days?</h2>
            </div>
            <p className="section-lead" style={{ marginBottom: 0 }}>
              Continue at <strong>$299/month</strong>, keep your data, and apply the pilot toward
              the first paid term. The point of the pilot is to reduce risk, not create a cliff.
            </p>
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
            <Link className="card glass-card" href="/pilot">
              <h3>Start 20-day pilot</h3>
              <p className="muted">Run a scoped pilot for SOC 2 prep, trust evidence, and buyer validation.</p>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
