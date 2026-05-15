import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Blocklog Pilot Program",
  description:
    "Join the 30-day Blocklog design partnership with full Pro access, structured feedback, and a clear path into Starter, Pro, or Enterprise.",
};

const pilotFacts = [
  ["Duration", "30 days"],
  ["Price", "$0"],
  ["Access", "Full Pro tier access"],
  ["Format", "Design partnership with structured feedback"],
  ["Support", "Direct line via Slack or email, with response within hours"],
  ["Check-ins", "30 minutes after week 2 and week 4"],
  ["Path", "Continue into Starter or Pro if it proves useful"],
];

const pilotIncludes = [
  "Real production integration, not a sandbox walkthrough",
  "Full Pro features during the pilot window",
  "Direct integration help and roadmap feedback loop",
  "Case study option for teams willing to share results",
  "A clean handoff into paid usage if the workflow sticks",
];

const pilotFit = [
  "Teams willing to run Blocklog in a real production system",
  "Builders who can give structured feedback on friction and missing features",
  "Early design partners shaping audit and verification workflows",
];

const postPilotSteps = [
  "Move into Starter at $29/month for smaller production workloads",
  "Move into Pro at $99/month for SIEM streaming and third-party verification",
  "Keep the implementation work and evidence flow intact",
];

const pilotHighlights = [
  ["What you get", "A real production deployment with enough depth to test whether Blocklog earns its place."],
  ["What we get", "Specific feedback on integration friction, missing features, and where the proof story lands."],
  ["Why it exists", "Right now the information is worth more than the subscription revenue."],
];

const enterprisePilot = [
  "60-day pilot for enterprise-only evaluations",
  "Built for security review, procurement, and internal approval cycles",
  "Ends with a formal evaluation report and recommendation",
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
              A 30-day design partnership for teams willing to run Blocklog for real.
            </h1>
          </div>
          <p className="section-lead">
            This is the most important tier right now. You get full Pro access and direct support.
            We get the production feedback needed to make Blocklog sharper.
          </p>
        </section>

        <section className="console-hero-grid" style={{ marginTop: 20 }}>
          <article className="card glass-card console-hero-card">
            <p className="eyebrow">Design partnership</p>
            <h2 style={{ marginTop: 8, marginBottom: 10 }}>Not a discount. A trade of product access for signal.</h2>
            <p className="muted" style={{ marginTop: 0 }}>
              The goal is to learn from real systems generating real audit trails, then turn that
              feedback into a better verification layer.
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
                Apply for Pilot
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
              <h2 style={{ marginTop: 8 }}>Who this program is designed for.</h2>
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
              <p className="eyebrow">The ask</p>
              <h2>The program only works if both sides get something valuable.</h2>
            </div>
            <div className="grid" style={{ gap: 10 }}>
              <div className="status-pill">Run Blocklog in production for 30 days</div>
              <div className="status-pill">Share structured feedback after week 2 and week 4</div>
              <div className="status-pill">Tell us where the DX, proof flow, or reporting breaks down</div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="trust-band">
            <div>
              <p className="eyebrow">After 30 days</p>
              <h2>Clear next step, no weird transition.</h2>
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
          <div className="grid grid-2">
            <article className="card glass-card">
              <p className="eyebrow">Extended pilot</p>
              <h2 style={{ marginTop: 8 }}>For enterprise evaluations that move slower.</h2>
              <div className="grid" style={{ gap: 10 }}>
                {enterprisePilot.map((item) => (
                  <div className="status-pill" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </article>

            <article className="card glass-card">
              <p className="eyebrow">Post-pilot plans</p>
              <h2 style={{ marginTop: 8 }}>Where teams usually land after the pilot.</h2>
              <div className="grid" style={{ gap: 10 }}>
                <div className="orbital-card">
                  <strong>Starter</strong>
                  <p className="muted" style={{ margin: "6px 0 0" }}>
                    $29/month for smaller compliance-sensitive products.
                  </p>
                </div>
                <div className="orbital-card">
                  <strong>Pro</strong>
                  <p className="muted" style={{ margin: "6px 0 0" }}>
                    $99/month for real compliance requirements and external verification.
                  </p>
                </div>
                <div className="orbital-card">
                  <strong>Enterprise</strong>
                  <p className="muted" style={{ margin: "6px 0 0" }}>
                    Custom pricing for regulated deployments, private cloud, and longer retention.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
