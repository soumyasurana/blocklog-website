import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const steps = [
  "Send logs via API",
  "Logs are cryptographically sealed",
  "Store securely",
  "Verify anytime",
];

const features = [
  "Immutable Logs",
  "Cryptographic Integrity",
  "Real-time Monitoring",
  "Compliance Ready",
  "API First",
  "Developer Friendly",
];

const useCases = [
  "Financial systems",
  "Healthcare logs",
  "Internal security",
  "Compliance",
  "AI audit trails",
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="container">
        <section className="hero">
          <div>
            <h1>Tamper-Proof Audit Logs for Modern Systems</h1>
            <p>
              Blocklog gives engineering and compliance teams cryptographically
              verifiable event history, so you can prove integrity without
              trusting internal databases.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
              <Link className="btn btn-primary" href="/auth/signup">
                Start Free
              </Link>
              <Link className="btn btn-link" href="/docs">
                View Docs
              </Link>
            </div>
          </div>
          <div className="code-pane">
            {`POST /api/v1/logs\n{\n  "event": "payment.created",\n  "user_id": "123",\n  "metadata": { "amount": 2000, "currency": "USD" }\n}`}
          </div>
        </section>

        <section className="section">
          <h2>How It Works</h2>
          <div className="grid grid-2">
            {steps.map((step, index) => (
              <article className="card" key={step}>
                <strong>Step {index + 1}</strong>
                <p className="muted">{step}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Key Features</h2>
          <div className="grid grid-3">
            {features.map((feature) => (
              <article className="card" key={feature}>
                <strong>{feature}</strong>
                <p className="muted">
                  Enterprise-grade controls built for modern event pipelines.
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Use Cases</h2>
          <div className="grid grid-3">
            {useCases.map((item) => (
              <div className="card" key={item}>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Code Example</h2>
          <div className="code-pane">
            {`POST /api/v1/logs\n\n{\n  "event": "payment.created",\n  "user_id": "123",\n  "metadata": {"invoice_id": "inv_444"}\n}`}
          </div>
        </section>

        <section className="section">
          <h2>Security</h2>
          <div className="grid grid-3">
            <article className="card">
              <strong>Hash Chains</strong>
              <p className="muted">Every log links to previous state to prevent silent edits.</p>
            </article>
            <article className="card">
              <strong>Digital Signatures</strong>
              <p className="muted">Signed ingestion creates non-repudiable event history.</p>
            </article>
            <article className="card">
              <strong>Integrity Verification</strong>
              <p className="muted">One-click proof checks for chain, signature, and payload hash.</p>
            </article>
          </div>
        </section>

        <section className="section">
          <h2>System Architecture Visualization</h2>
          <div className="card" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            Client -&gt; API -&gt; Hash Engine -&gt; Secure Storage
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
