"use client";

import { useState } from "react";
import { Footer, PageFrame, Reveal, SiteHeader } from "@/components/site/Primitives";
import { ChevronRightIcon } from "@/components/site/icons";

const tiers = [
  {
    name: "Shadow Mode",
    price: "Free. Forever.",
    badge: "Install Now",
    copy: "Not a trial. The entry motion.",
    points: [
      "Full forensic record capture",
      "Forensic replay engine",
      "Compliance report generation",
      "Zero production impact",
      "Zero procurement required",
    ],
  },
  {
    name: "Governed",
    price: "₹3.5 / $0.15",
    badge: "Start Building",
    copy: "Per governed decision above 500 per month.",
    points: [
      "Authorization gate",
      "Signed tokens",
      "Approval workflows",
      "Policy engine (basic)",
      "Example: 10,000 decisions/month = ₹33,250 / $1,425",
    ],
  },
  {
    name: "Enterprise",
    price: "₹25,000–₹60,000 / $3,500–$8,000",
    badge: "Talk to Us",
    copy: "Annual contracts only.",
    points: [
      "Unlimited governed decisions",
      "All 5 RBAC roles including Auditor",
      "7-year retention and legal hold",
      "Policy testing sandbox",
      "Verification API with SLA",
      "VPC deployment option",
    ],
  },
  {
    name: "Platform / Embedded",
    price: "₹60,000–₹1,10,000 / $8,000–$15,000",
    badge: "Discuss Partnership",
    copy: "For AI-native platforms embedding Blocklog into their product.",
    points: [
      "20 downstream enterprise workspaces included",
      "Per-workspace audit isolation",
      "Platform-level dashboard",
      "Optional white-label deployment",
      "Resale permitted",
      "Overage: ₹3,000 / $400 per workspace beyond 20",
    ],
  },
];

const faqs = [
  ["Why is shadow mode free forever?", "Shadow mode is the product's entry motion. It produces the forensic report that creates your compliance officer as an internal champion before any contract is signed."],
  ["What counts as a governed decision?", "Any AI financial action that Blocklog observes, records, and writes to the governance ledger, including refunds, fraud decisions, chargeback approvals, credit determinations, fee application, or payout authorization."],
  ["Why annual contracts only for Enterprise?", "The governance history you accumulate is the product. Annual contracts align Blocklog's incentives with yours."],
  ["Will you discount Enterprise?", "No. An extended shadow mode period instead. A discount sets the wrong price anchor for every expansion conversation that follows."],
  ["How does the Pilot relate to pricing?", "The 30-day pilot is free. At day 30, the forensic report shows you exactly which decisions would have cost you under the authorization gate."],
];

export default function PricingPage() {
  const [open, setOpen] = useState<string | null>(faqs[0][0]);

  return (
    <div className="page-shell">
      <SiteHeader />
      <PageFrame>
        <section className="section-block pt-32">
          <div className="content-wrap">
            <Reveal className="max-w-4xl">
              <p className="eyebrow">{`// Pricing`}</p>
              <h1 className="section-title">Infrastructure Pricing. Not SaaS Pricing.</h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-white/74">
                Usage-based pricing tied to governed decisions. You grow, Blocklog grows. No seat licenses. No arbitrary feature gates.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section-block">
          <div className="content-wrap grid gap-6 xl:grid-cols-4">
            {tiers.map((tier, index) => (
              <Reveal delay={index * 0.06} key={tier.name}>
                <div className="liquid-glass-strong flex h-full flex-col rounded-[2rem] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-2xl serif-italic">{tier.name}</div>
                    <div className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/44">
                      {tier.badge}
                    </div>
                  </div>
                  <div className="mt-5 text-3xl serif-italic">{tier.price}</div>
                  <p className="mt-3 text-sm text-white/58">{tier.copy}</p>
                  <div className="mt-6 grid gap-3">
                    {tier.points.map((point) => (
                      <div className="rounded-full border border-white/10 px-4 py-3 text-sm text-white/74" key={point}>
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="liquid-glass-strong rounded-[2.5rem] p-6 md:p-8">
              <p className="text-sm leading-7 text-white/72">
                Break-even is preventing one wrong AI financial decision above threshold per month. Shadow mode will show you exactly how many that is.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="max-w-3xl">
              <h2 className="section-title">Pricing FAQ</h2>
            </Reveal>
            <div className="mt-10 grid gap-4">
              {faqs.map(([question, answer], index) => {
                const expanded = open === question;
                return (
                  <Reveal delay={index * 0.04} key={question}>
                    <button
                      className="liquid-glass w-full rounded-[2rem] p-5 text-left"
                      onClick={() => setOpen(expanded ? null : question)}
                      type="button"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xl serif-italic">{question}</div>
                          {expanded ? <p className="mt-4 text-sm leading-7 text-white/72">{answer}</p> : null}
                        </div>
                        <ChevronRightIcon className={`mt-1 transition ${expanded ? "rotate-90" : ""}`} width={16} height={16} />
                      </div>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <Footer />
      </PageFrame>
    </div>
  );
}
