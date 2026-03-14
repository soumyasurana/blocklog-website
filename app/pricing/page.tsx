import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const plans = [
  {
    name: "Starter",
    price: "Free",
    detail: "For pilots, developer teams, and initial trust workflows.",
    points: ["Core ingestion API", "Public verification", "1 active API key"],
  },
  {
    name: "Pro",
    price: "$49/month",
    detail: "For production workloads that need operational visibility and evidence export.",
    points: ["Verification and integrity views", "Batch workflows", "Usage and monitoring"],
  },
  {
    name: "Enterprise",
    price: "Contact",
    detail: "For regulated systems, high-volume pipelines, and formal assurance requirements.",
    points: ["Custom retention policy", "Dedicated support", "Advanced trust architecture review"],
  },
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
              Security-grade logging that scales with the systems behind it.
            </h1>
          </div>
          <p className="section-lead">
            Start with the core control plane, then expand into batch proofs, evidence exports,
            governance workflows, and enterprise trust operations.
          </p>
        </div>
        <div className="grid grid-3" style={{ marginTop: 20 }}>
          {plans.map((plan, index) => (
            <article className="card glass-card" key={plan.name}>
              <p className="eyebrow">{index === 1 ? "Popular" : "Plan"}</p>
              <h2 style={{ margin: "8px 0 6px" }}>{plan.name}</h2>
              <p style={{ fontSize: "2.2rem", margin: "0 0 10px", fontWeight: 700 }}>{plan.price}</p>
              <p className="muted">{plan.detail}</p>
              <div className="grid" style={{ gap: 10, marginTop: 18 }}>
                {plan.points.map((point) => (
                  <div className="status-pill" key={point}>
                    {point}
                  </div>
                ))}
              </div>
              <div className="button-row" style={{ marginTop: 18 }}>
                <Link className="btn btn-primary" href="/signup">
                  Start Free
                </Link>
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
