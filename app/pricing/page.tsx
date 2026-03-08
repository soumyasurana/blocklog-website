import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const plans = [
  { name: "Starter", price: "Free", detail: "For small teams and prototypes" },
  { name: "Pro", price: "$49/month", detail: "For production workloads" },
  { name: "Enterprise", price: "Contact", detail: "Custom security and scale" },
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="container section">
        <h1 style={{ fontSize: "2.4rem", marginTop: 0 }}>Pricing</h1>
        <p className="muted">Simple pricing while you scale your audit infrastructure.</p>
        <div className="grid grid-3" style={{ marginTop: 20 }}>
          {plans.map((plan) => (
            <article className="card" key={plan.name}>
              <h2 style={{ marginTop: 0 }}>{plan.name}</h2>
              <p style={{ fontSize: "1.9rem", margin: "4px 0" }}>{plan.price}</p>
              <p className="muted">{plan.detail}</p>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
