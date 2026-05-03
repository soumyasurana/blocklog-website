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
  fit: string[];
  groups: PlanGroup[];
  highlight?: boolean;
  ctaLabel: string;
  ctaHref: string;
  ctaDisabled?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free - Developer",
    price: "$0/month",
    annual: "Free forever",
    highlight: true,
    subtitle:
      "For individual developers and small projects evaluating Blocklog. Zero-friction first value for verifiable audit trails.",
    groups: [
      {
        title: "Capacity & Access",
        points: [
          "10,000 events/month",
          "7-day retention",
          "1 organization",
          "Self-serve signup and instant API key",
        ],
      },
      {
        title: "Verification",
        points: [
          "Full hash chain verification",
          "Community support",
        ],
      },
    ],
    fit: [
      "Individual developers",
      "Small internal tools",
      "Early AI agent projects",
      "Fast evaluation before rollout",
    ],
    ctaLabel: "View Docs",
    ctaHref: "/docs/getting-started",
  },
  {
    name: "Starter",
    price: "$29/month",
    annual: "Overage: $5 per additional 100,000 events",
    subtitle:
      "For startups and small teams building compliance-sensitive products that need a verifiable audit trail.",
    groups: [
      {
        title: "Capacity & Retention",
        points: [
          "500,000 events/month",
          "12-month retention",
          "Up to 3 organizations",
        ],
      },
      {
        title: "Core Features",
        points: [
          "Hash chain verification",
          "Auditor-friendly PDF verification reports",
          "Basic dashboard to view and export chains",
        ],
      },
      {
        title: "Support",
        points: [
          "Email support (48-hour response)",
        ],
      },
    ],
    fit: [
      "Startups selling into enterprise",
      "First compliance-sensitive product",
      "Teams needing auditor-ready proof",
      "Early production workloads",
    ],
    ctaLabel: "Join Pilot Program",
    ctaHref: "/pilot",
  },
  {
    name: "Pro",
    price: "$99/month",
    annual: "Overage: $3 per additional 100,000 events",
    subtitle:
      "For growing SaaS companies with real compliance requirements and external verification pressure.",
    groups: [
      {
        title: "Capacity & Retention",
        points: [
          "5,000,000 events/month",
          "24-month retention",
          "Unlimited organizations",
        ],
      },
      {
        title: "Core Features",
        points: [
          "Everything in Starter",
          "SIEM streaming for Splunk, Datadog, and Elastic",
          "Third-party auditor verification endpoint",
          "Webhook alerts on chain breaks",
        ],
      },
      {
        title: "Support",
        points: [
          "Priority support (12-hour response)",
        ],
      },
    ],
    fit: [
      "SOC 2 in flight",
      "Fintech and healthtech teams",
      "AI companies proving agent behavior",
      "Growing SaaS with audit scrutiny",
    ],
    ctaLabel: "Join Pilot Program",
    ctaHref: "/pilot",
  },
  {
    name: "Enterprise",
    price: "Custom",
    annual: "Typical deal size: $500-$2,000/month",
    subtitle:
      "For regulated industries and large-scale deployments where legal, compliance, and deployment constraints shape the buying process.",
    groups: [
      {
        title: "Scale & Deployment",
        points: [
          "Unlimited events",
          "Custom retention up to 10 years",
          "Custom organizations",
          "On-premise or private cloud deployment",
        ],
      },
      {
        title: "Compliance & Operations",
        points: [
          "Everything in Pro",
          "99.9% uptime SLA with defined response times",
          "Dedicated verification endpoints for regulators and auditors",
          "Compliance reporting for SOC 2, HIPAA, GDPR, and the EU AI Act",
        ],
      },
      {
        title: "Partnership",
        points: [
          "Custom integration support",
          "Dedicated account manager",
          "Annual billing with volume discounts",
        ],
      },
    ],
    fit: [
      "Fintech and healthtech",
      "Critical infrastructure",
      "Government contractors",
      "Large AI deployments under regulatory scrutiny",
    ],
    ctaLabel: "Talk to Us",
    ctaHref: "/contact",
  },
];

const pilotBridge = [
  "30-day design partnership",
  "Full Pro access during the pilot",
  "Structured check-ins at week 2 and week 4",
  "Move into Starter or Pro if it proves useful",
  "Extended 60-day pilot available for enterprise evaluations",
];

const comparisonRows = [
  ["Events/month", "10,000", "500,000", "5,000,000"],
  ["Retention", "7 days", "12 months", "24 months"],
  ["Cryptographic verification", "Yes", "Yes", "Yes"],
  ["Third-party auditor access", "No", "Yes", "Yes"],
  ["Price", "$0", "$29", "$99"],
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
              Pay for provability, not log storage.
            </h1>
          </div>
          <p className="section-lead">
            Blocklog is a verification layer. Customers are paying for the ability to prove their
            logs are untampered, not for another place to retain them.
          </p>
        </div>

        <section className="trust-band pricing-trust-band" style={{ marginTop: 24 }}>
          <div>
            <p className="eyebrow">Pilot bridge</p>
            <h2>Run the design partnership first, then move into production.</h2>
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
              <p className="eyebrow">{plan.highlight ? "Start here" : "Plan"}</p>
              <h2 className="pricing-plan-title" style={{ margin: "8px 0 6px" }}>{plan.name}</h2>
              <p className="pricing-plan-price" style={{ fontSize: "2.2rem", margin: "0 0 6px", fontWeight: 700 }}>{plan.price}</p>
              <p className="muted" style={{ marginTop: 0 }}>{plan.annual}</p>
              <p className="muted pricing-plan-subtitle">{plan.subtitle}</p>

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

              <div className="grid pricing-fit-section" style={{ gap: 8, marginTop: 18 }}>
                <p className="eyebrow" style={{ marginBottom: 0 }}>Best for</p>
                {plan.fit.map((item) => (
                  <div className="status-pill pricing-fit-pill" key={item}>
                    {item}
                  </div>
                ))}
              </div>

              <div className="button-row pricing-actions" style={{ marginTop: 18 }}>
                {plan.ctaDisabled ? (
                  <button className="btn btn-primary pricing-primary-cta" disabled type="button">
                    {plan.ctaLabel}
                  </button>
                ) : (
                  <Link className="btn btn-primary pricing-primary-cta" href={plan.ctaHref}>
                    {plan.ctaLabel}
                  </Link>
                )}
                <Link className="btn" href="/docs">
                  View Docs
                </Link>
              </div>
            </article>
          ))}
        </div>

        <section className="section">
          <article className="card glass-card">
            <p className="eyebrow">Market comparison</p>
            <h2 style={{ marginTop: 8 }}>The justification is cryptographic verification.</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
                <thead>
                  <tr>
                    <th align="left">Category</th>
                    <th align="left">Blocklog Free</th>
                    <th align="left">Blocklog Starter</th>
                    <th align="left">Blocklog Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, cellIndex) => (
                        <td key={`${row[0]}-${cellIndex}`} style={{ padding: "12px 8px 12px 0", verticalAlign: "top" }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="muted" style={{ marginBottom: 0 }}>
              Logs tell you what happened. Blocklog proves it can't be rewritten..
            </p>
          </article>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
