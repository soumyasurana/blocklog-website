import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

type PlanGroup = {
  title: string;
  points: string[];
};

type Plan = {
  name: string;
  price: string;
  annual: string;
  subtitle: string;
  points: string[];
  fit: string[];
  highlight?: boolean;
  comingSoon?: boolean;
  groups?: PlanGroup[];
};

const plans: Plan[] = [
  {
    name: "Starter Plan",
    price: "$299/month",
    annual: "$2,868/year (20% off)",
    highlight: true,
    subtitle:
      'Your auditor asks: "Prove your logs weren\'t tampered with." Blocklog gives you cryptographic proof they can verify independently.',
    groups: [
      {
        title: "Capacity & Limits",
        points: [
          "5M log events/month",
          "$12 per additional 1M events",
          "Dashboard access (5 users)",
        ],
      },
      {
        title: "Core Features",
        points: [
          "Unlimited batches",
          "Blockchain anchoring (Polygon)",
          "Verification reports (PDF export)",
          "Auditor portal (read-only access)",
          "Single company account",
          "Standard API access",
        ],
      },
      {
        title: "Support & Retention",
        points: [
          "Email support (24-hour response)",
          "90-day proof retention",
        ],
      },
    ],
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
      "Series A/B startups",
      "First SOC 2 Type II audit",
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
    groups: [
      {
        title: "Capacity & Limits",
        points: [
          "25M log events/month",
          "$10 per additional 1M events",
          "Multi-team access (unlimited users)",
        ],
      },
      {
        title: "Core Features",
        points: [
          "Multi-region support",
          "Custom retention policies",
          "Advanced analytics dashboard",
          "Webhook integrations",
          "SSO/SAML authentication",
        ],
      },
      {
        title: "Support & Success",
        points: [
          "Priority support (4-hour response)",
          "Slack channel access",
          "Dedicated onboarding (CSM-led)",
          "Monthly review calls",
          "365-day proof retention",
        ],
      },
    ],
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
      "Scaling compliance programs",
      "50-200 employees",
      "SOC 2 + ISO 27001",
      "~30-50 microservices",
    ],
    comingSoon: true,
  },
  {
    name: "Enterprise Plan",
    price: "Custom pricing",
    annual: "Starts at $1,999/month, annual contracts only",
    subtitle: "Everything in Growth, plus enterprise procurement, residency, support, and legal readiness.",
    groups: [
      {
        title: "Capacity & Limits",
        points: [
          "100M+ log events/month",
          "Custom overage rates",
          "Multi-year pricing lock",
          "Invoice payment (NET 30/60)",
        ],
      },
      {
        title: "Core Features",
        points: [
          "99.9% SLA guarantee",
          "Custom integrations (API extensions)",
          "Custom data residency",
          "HIPAA compliance package",
          "SOC 2 Type II report access",
          "Custom legal terms (BAA, DPA, etc.)",
        ],
      },
      {
        title: "Support & Partnership",
        points: [
          "Dedicated Customer Success Manager",
          "Priority feature requests",
          "Quarterly business reviews",
          "Premium support (1-hour response)",
          "24/7 on-call support optional add-on",
          "Dedicated Slack channel with engineering",
        ],
      },
    ],
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
      "Highly regulated environments",
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
      <main className="container section pricing-page">
        <div className="section-header pricing-header">
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

        <section className="trust-band pricing-trust-band" style={{ marginTop: 24 }}>
          <div>
            <p className="eyebrow">Pilot bridge</p>
            <h2>How the pilot rolls into production.</h2>
          </div>
          <div className="grid pricing-pilot-grid" style={{ gap: 10 }}>
            {pilotBridge.map((item, index) => (
              <div className="status-pill pricing-pilot-pill" key={item} style={{ animationDelay: `${index * 90}ms` }}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-3 pricing-plan-grid" style={{ marginTop: 24 }}>
          {plans.map((plan, planIndex) => (
            <article
              className={`card glass-card capability-card pricing-plan-card${plan.highlight ? " pricing-plan-card--highlight" : ""}`}
              key={plan.name}
              style={{ animationDelay: `${planIndex * 120}ms` }}
            >
              <p className="eyebrow">
                {plan.comingSoon ? "Coming soon" : plan.highlight ? "Recommended" : "Plan"}
              </p>
              <h2 className="pricing-plan-title" style={{ margin: "8px 0 6px" }}>{plan.name}</h2>
              <p className="pricing-plan-price" style={{ fontSize: "2.2rem", margin: "0 0 6px", fontWeight: 700 }}>{plan.price}</p>
              <p className="muted" style={{ marginTop: 0 }}>{plan.annual}</p>
              <p className="muted pricing-plan-subtitle">{plan.subtitle}</p>

              {plan.groups ? (
                <div className="grid" style={{ gap: 14, marginTop: 18 }}>
                  {plan.groups.map((group, groupIndex) => (
                    <div className="pricing-group" key={group.title} style={{ animationDelay: `${groupIndex * 120}ms` }}>
                      <p className="eyebrow" style={{ marginBottom: 8 }}>{group.title}</p>
                      <div className="grid pricing-group-list" style={{ gap: 10 }}>
                        {group.points.map((point) => (
                          <div className="status-pill pricing-feature-pill" key={point}>
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid" style={{ gap: 10, marginTop: 18 }}>
                  {plan.points.map((point) => (
                    <div className="status-pill pricing-feature-pill" key={point}>
                      {point}
                    </div>
                  ))}
                </div>
              )}

              <div className="grid pricing-fit-section" style={{ gap: 8, marginTop: 18 }}>
                <p className="eyebrow" style={{ marginBottom: 0 }}>Best for</p>
                {plan.fit.map((item) => (
                  <div className="status-pill pricing-fit-pill" key={item}>
                    {item}
                  </div>
                ))}
              </div>

              <div className="button-row pricing-actions" style={{ marginTop: 18 }}>
                {!plan.comingSoon ? (
                  <Link className="btn btn-primary pricing-primary-cta" href="/pilot">
                    Start 20-Day Pilot
                  </Link>
                ) : (
                  <button className="btn btn-primary pricing-primary-cta" disabled type="button">
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
