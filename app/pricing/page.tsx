import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const plans = [
  {
    name: "Starter Plan",
    price: "$299/month",
    annual: "$2,868/year (20% off)",
    subtitle: "Production-ready for early teams with real audit pressure.",
    points: [
      "5M log events/month",
      "$12 per additional 1M events",
      "Unlimited batches",
      "Blockchain anchoring (Polygon)",
      "Verification reports (PDF export)",
      "Auditor portal (read-only access)",
      "Email support (24-hour response)",
      "90-day proof retention",
      "Single company account",
      "Standard API access",
      "Dashboard access (5 users)",
    ],
    fit: [
      "10-50 employees",
      "AWS/GCP single region",
      "~10-20 microservices",
    ],
  },
  {
    name: "Growth Plan",
    price: "$799/month",
    annual: "$7,670/year (20% off)",
    subtitle: "Everything in Starter, plus scale, retention, support, and team expansion.",
    points: [
      "25M log events/month",
      "$10 per additional 1M events",
      "Priority support (4-hour response)",
      "Slack channel access",
      "365-day proof retention",
      "Multi-region support",
      "Custom retention policies",
      "Advanced analytics dashboard",
      "Multi-team access (unlimited users)",
      "Webhook integrations",
      "SSO/SAML authentication",
      "Dedicated onboarding (CSM-led)",
      "Monthly review calls",
    ],
    fit: [
      "Series B/C companies",
      "50-200 employees",
      "SOC 2 + ISO 27001",
      "~30-50 microservices",
    ],
    highlight: true,
    comingSoon: true,
  },
  {
    name: "Enterprise Plan",
    price: "Custom pricing",
    annual: "Starts at $1,999/month, annual contracts only",
    subtitle: "Everything in Growth, plus enterprise procurement, residency, support, and legal readiness.",
    points: [
      "100M+ log events/month",
      "Custom overage rates",
      "99.9% SLA guarantee",
      "Dedicated Customer Success Manager",
      "Priority feature requests",
      "Custom integrations (API extensions)",
      "Multi-year pricing lock",
      "Quarterly business reviews",
      "Premium support (1-hour response)",
      "24/7 on-call support optional add-on",
      "Custom data residency",
      "HIPAA compliance package",
      "SOC 2 Type II report access",
      "Custom legal terms (BAA, DPA, etc.)",
      "Invoice payment (NET 30/60)",
      "Dedicated Slack channel with engineering",
    ],
    fit: [
      "Series C+ or public companies",
      "200+ employees",
      "Healthcare, finance, and regulated sectors",
      "100+ microservices",
    ],
    comingSoon: true,
  },
];

const pilotBridge = [
  "20-day pilot",
  "$149 refundable if you convert",
  "2M log events",
  "Founder-led onboarding",
  "Pilot fee credited to first month",
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="container section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Pricing</p>
            <h1 style={{ fontSize: "clamp(2.6rem, 5vw, 4.5rem)", margin: 0 }}>
              Start with a 20-day pilot, then scale into the right plan.
            </h1>
          </div>
          <p className="section-lead">
            Pilot first to prove fit. Then move into the plan sized for your event volume,
            retention, audit pressure, and support requirements.
          </p>
        </div>

        <section className="trust-band" style={{ marginTop: 24 }}>
          <div>
            <p className="eyebrow">Pilot bridge</p>
            <h2>How the pilot rolls into production.</h2>
          </div>
          <div className="grid" style={{ gap: 10 }}>
            {pilotBridge.map((item) => (
              <div className="status-pill" key={item}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-3" style={{ marginTop: 24 }}>
          {plans.map((plan) => (
            <article className="card glass-card capability-card" key={plan.name}>
              <p className="eyebrow">
                {plan.comingSoon ? "Coming soon" : plan.highlight ? "Recommended" : "Plan"}
              </p>
              <h2 style={{ margin: "8px 0 6px" }}>{plan.name}</h2>
              <p style={{ fontSize: "2.2rem", margin: "0 0 6px", fontWeight: 700 }}>{plan.price}</p>
              <p className="muted" style={{ marginTop: 0 }}>{plan.annual}</p>
              <p className="muted">{plan.subtitle}</p>

              <div className="grid" style={{ gap: 10, marginTop: 18 }}>
                {plan.points.map((point) => (
                  <div className="status-pill" key={point}>
                    {point}
                  </div>
                ))}
              </div>

              <div className="grid" style={{ gap: 10, marginTop: 18 }}>
                <p className="eyebrow" style={{ marginBottom: 0 }}>Best for</p>
                {plan.fit.map((item) => (
                  <div className="orbital-card" key={item}>
                    <strong>{item}</strong>
                  </div>
                ))}
              </div>

              <div className="button-row" style={{ marginTop: 18 }}>
                {!plan.comingSoon ? (
                  <Link className="btn btn-primary" href="/pilot">
                    Start 20-Day Pilot
                  </Link>
                ) : (
                  <button className="btn btn-primary" disabled type="button">
                    Coming Soon
                  </button>
                )}
                <Link className="btn" href="/docs">
                  View Docs
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
