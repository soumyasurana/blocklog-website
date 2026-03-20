import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Blocklog Pilot Program",
  description:
    "Join the 20-day Blocklog pilot with founder-led onboarding, 2M events, and a clear path into Starter, Growth, or Enterprise.",
};

const pilotFacts = [
  ["Duration", "20 days"],
  ["Price", "$149 upfront"],
  ["Refund", "Refundable if you convert"],
  ["Limit", "2M log events"],
  ["Support", "Founder-led onboarding"],
  ["Extension", "One 10-day extension included"],
  ["Payment", "Credited to first month if you convert"],
];

const pilotIncludes = [
  "Cryptographic log sealing from day one",
  "Founder-led onboarding and integration help",
  "Proof verification workflow setup",
  "Pilot-scoped evidence and audit review support",
  "Single extension available if your team needs extra validation time",
];

const pilotFit = [
  "Series A/B startups preparing for their first formal audit",
  "Fintech and SaaS teams selling into compliance-heavy buyers",
  "Teams that need to prove log integrity before SOC 2 Type II",
];

const postPilotSteps = [
  "Continue into Starter at $299/month or $2,868/year",
  "Keep your data and continuity intact",
  "Apply the $149 pilot fee toward the first month if you convert",
];

const pilotHighlights = [
  ["Scope", "Validate ingestion, sealing, anchoring, and verification end to end."],
  ["Hands-on", "Founder-led onboarding keeps setup tight and decisions fast."],
  ["Conversion path", "Move into production without redoing the implementation work."],
];

export default function PilotPage() {
  return (
    <>
      <SiteHeader />
      <main className="container section">
        <section className="section-header">
          <div>
            <p className="eyebrow">Pilot program</p>
            <h1 style={{ fontSize: "clamp(2.7rem, 6vw, 5rem)", margin: 0 }}>
              A 20-day pilot to prove Blocklog fits before you commit.
            </h1>
          </div>
          <p className="section-lead">
            Structured for early teams preparing for SOC 2, buyer security reviews, or first audit
            evidence workflows. Small enough to de-risk fast, serious enough to show real value.
          </p>
        </section>

        <section className="console-hero-grid" style={{ marginTop: 20 }}>
          <article className="card glass-card console-hero-card">
            <p className="eyebrow">Blocklog Pilot Program</p>
            <h2 style={{ marginTop: 8, marginBottom: 10 }}>Founder-led, fixed-scope, and conversion-friendly.</h2>
            <p className="muted" style={{ marginTop: 0 }}>
              You get enough time and volume to validate ingestion, sealing, anchoring, and proof
              verification without turning the pilot into an open-ended consulting engagement.
            </p>
            <div className="button-row" style={{ marginTop: 18, marginBottom: 18 }}>
              <a
                className="btn btn-primary"
                href="https://calendly.com/founder-blocklogsecurity/audit-readiness-call-20-min"
                target="_blank"
                rel="noreferrer"
                style={{
                  minHeight: 58,
                  padding: "16px 28px",
                  fontSize: "1rem",
                  fontWeight: 700,
                  flex: "1 1 100%",
                  justifyContent: "center",
                }}
              >
                Book Pilot Call
              </a>
            </div>
            <div className="grid" style={{ gap: 10 }}>
              {pilotHighlights.map(([label, detail]) => (
                <div className="orbital-card" key={label}>
                  <strong>{label}</strong>
                  <p className="muted" style={{ margin: "6px 0 0" }}>{detail}</p>
                </div>
              ))}
            </div>
            <div className="button-row" style={{ marginTop: 16 }}>
              <Link className="btn" href="/pricing">
                View Pricing
              </Link>
            </div>
          </article>

          <article className="card glass-card console-hero-card">
            <p className="eyebrow">Pilot terms</p>
            <div className="grid" style={{ gap: 10 }}>
              {pilotFacts.map(([label, value]) => (
                <div className="orbital-card" key={label}>
                  <strong>{label}</strong>
                  <p className="muted" style={{ margin: "6px 0 0" }}>{value}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="section">
          <div className="grid grid-2">
            <article className="card glass-card">
              <p className="eyebrow">What’s included</p>
              <h2 style={{ marginTop: 8 }}>What you get during the pilot.</h2>
              <div className="grid" style={{ gap: 10 }}>
                {pilotIncludes.map((item) => (
                  <div className="status-pill" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </article>

            <article className="card glass-card">
              <p className="eyebrow">Best fit</p>
              <h2 style={{ marginTop: 8 }}>Who the pilot is designed for.</h2>
              <div className="grid" style={{ gap: 10 }}>
                {pilotFit.map((item) => (
                  <div className="orbital-card" key={item}>
                    <strong>{item}</strong>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="trust-band">
            <div>
              <p className="eyebrow">After 20 days</p>
              <h2>Clear next step, no pricing cliff.</h2>
            </div>
            <div className="grid" style={{ gap: 10 }}>
              {postPilotSteps.map((item) => (
                <div className="status-pill" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Post-pilot plans</p>
              <h2>Where teams usually land after the pilot.</h2>
            </div>
            <Link className="btn btn-primary" href="/pricing">
              Compare Plans
            </Link>
          </div>
          <div className="grid grid-3">
            <article className="card glass-card">
              <p className="eyebrow">Starter</p>
              <h3 style={{ marginTop: 8 }}>For first real compliance motion</h3>
              <p className="muted">$299/month or $2,868/year</p>
              <p className="muted">Best for Series A/B startups and first SOC 2 Type II audits.</p>
            </article>
            <article className="card glass-card">
              <p className="eyebrow">Growth</p>
              <h3 style={{ marginTop: 8 }}>For multi-team, multi-region growth</h3>
              <p className="muted">$799/month or $7,670/year</p>
              <p className="muted">Best for Series B/C companies with broader compliance scope.</p>
            </article>
            <article className="card glass-card">
              <p className="eyebrow">Enterprise</p>
              <h3 style={{ marginTop: 8 }}>For high-volume regulated environments</h3>
              <p className="muted">Starts at $1,999/month</p>
              <p className="muted">Best for enterprise procurement, custom terms, and multi-cloud scale.</p>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
