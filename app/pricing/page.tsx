"use client";

import { useState } from "react";
import {
  Footer,
  PageFrame,
  PrimaryButton,
  Reveal,
  SiteHeader,
} from "@/components/site/Primitives";
import { ArrowUpRightIcon } from "@/components/site/icons";
import { ChevronRightIcon } from "@/components/site/icons";

// ─── Data ────────────────────────────────────────────────────────────────────

const tiers = [
  {
    name: "Developer",
    price: "Free",
    period: "forever",
    badge: "Start here",
    highlight: false,
    cta: "Start Free",
    ctaHref: "/get-started",
    ctaInverted: false,
    description:
      "Install alongside your agent. Zero production impact. No credit card. See your first forensic replay in under 20 minutes.",
    features: [
      "Forensic replay engine",
      "Stale input tracking",
      "Counterfactual analysis",
      "Python SDK",
      "5,000 traces / month",
      "14-day decision history",
      "Community support",
    ],
    ceiling:
      "History stops persisting at day 14. Trace limit exhausted in days at production volume.",
  },
  {
    name: "Team",
    price: "$149",
    period: "per month",
    badge: "Most popular",
    highlight: true,
    cta: "Start Team",
    ctaHref: "/get-started",
    ctaInverted: true,
    description:
      "For small teams shipping agents to production. Governance and audit trails without enterprise overhead.",
    features: [
      "Everything in Developer",
      "100,000 traces / month",
      "90-day decision history",
      "Up to 5 agents",
      "Approval workflows",
      "Audit export (PDF + JSON)",
      "3 seats",
      "48h email support",
    ],
    ceiling:
      "Hit the ceiling when a compliance stakeholder asks to see a formal report.",
  },
  {
    name: "Scale",
    price: "$399",
    period: "per month",
    badge: "",
    highlight: false,
    cta: "Start Scale",
    ctaHref: "/get-started",
    ctaInverted: false,
    description:
      "For Series A teams running multiple agents in production with real compliance requirements.",
    features: [
      "Everything in Team",
      "1,000,000 traces / month",
      "1-year tamper-resistant retention",
      "Unlimited agents",
      "Human-in-loop controls",
      "Ed25519 cryptographic signing",
      "10 seats + SSO",
      "Priority support",
    ],
    ceiling:
      "Hit the ceiling when data residency or a security review requires your infrastructure.",
  },
  {
    name: "Enterprise",
    price: "$1,500",
    period: "per month",
    badge: "VPC",
    highlight: false,
    cta: "Talk to us",
    ctaHref: "/contact",
    ctaInverted: true,
    description:
      "For teams whose security review requires agent traces to never leave their own infrastructure. Budget comes from compliance, not engineering.",
    features: [
      "Everything in Scale",
      "Unlimited traces",
      "Custom retention policy",
      "VPC deployment (AWS / GCP)",
      "Unlimited seats",
      "Sentinel gate add-on available",
      "Dedicated deployment support",
      "24h named support contact",
    ],
    ceiling: null,
  },
];

const sentinelAddon = {
  name: "Sentinel — Coming Soon",
  price: "$500",
  period: "per month add-on",
  description:
    "The human-in-the-loop authorization gate. Blocks any AI agent action above a configurable risk threshold until a human approves it. Available on Enterprise only.",
  note: "Sentinel is never pitched. Compliance officers who have read 30+ days of forensic reports request it themselves after seeing the decisions-near-threshold section.",
};

const faqs = [
  [
    "Why is Developer free forever instead of a 14-day trial?",
    "Because a perpetual free tier earns trust. You can instrument your agent, see real replays in dev and staging, and evaluate whether Blocklog is worth paying for — with no clock running. The ceiling is trace volume and retention, not time.",
  ],
  [
    "Is pricing per seat or per workspace?",
    "Per workspace. Team covers up to 3 seats, Scale covers up to 10. The upgrade ceiling is seats and trace volume, not features — every tier gets the full feature set for that tier.",
  ],
  [
    "What counts as a trace?",
    "One trace is one complete agent execution — a single run from start to finish, regardless of how many internal LLM calls or tool calls it makes. It is the most predictable unit to price on: you always know how many times your agent ran.",
  ],
  [
    "Why does Enterprise start at $1,500?",
    "Because VPC deployment requires real engineering time on our side — initial deployment, environment-specific debugging, upgrade support. Below $1,500 the economics do not work for a design-partnership quality deployment. LangSmith Enterprise starts at $2,000–5,000/month. We are intentionally below their floor.",
  ],
  [
    "What is Sentinel and why is it an add-on?",
    "Sentinel is the human-in-the-loop authorization gate — it sits in the execution path and blocks agent actions above a risk threshold until a human approves. It is an add-on because it is a fundamentally different risk conversation from observability. It is also never sold: compliance officers who have been reading forensic reports for 30+ days request it themselves.",
  ],
  [
    "What does Enterprise include that Scale does not?",
    "VPC deployment so traces never leave your infrastructure, custom retention beyond 1 year, unlimited seats, Sentinel gate access, dedicated deployment support, and a signed pilot agreement with DPA included.",
  ],
  [
    "Is there a discount for annual billing?",
    "Team and Scale are available annually with two months free — a 17% discount. Enterprise is annual only with a 3-month minimum pilot.",
  ],
  [
    "What happens to my forensic history if I downgrade?",
    "Your history is retained for 90 days after a downgrade. After that it is permanently deleted. We will email you at 30, 14, and 7 days before deletion.",
  ],
];

const comparisonRows = [
  { feature: "Forensic replay engine",       dev: true,          team: true,           scale: true,        ent: true },
  { feature: "Stale input tracking",         dev: true,          team: true,           scale: true,        ent: true },
  { feature: "Counterfactual analysis",      dev: true,          team: true,           scale: true,        ent: true },
  { feature: "Traces / month",               dev: "5,000",       team: "100,000",      scale: "1,000,000", ent: "Unlimited" },
  { feature: "Decision history retention",   dev: "14 days",     team: "90 days",      scale: "1 year",    ent: "Custom" },
  { feature: "Agents monitored",             dev: "1",           team: "Up to 5",      scale: "Unlimited", ent: "Unlimited" },
  { feature: "Team seats",                   dev: "1",           team: "3",            scale: "10",        ent: "Unlimited" },
  { feature: "Approval workflows",           dev: false,         team: true,           scale: true,        ent: true },
  { feature: "Audit export (PDF + JSON)",    dev: false,         team: true,           scale: true,        ent: true },
  { feature: "Human-in-loop controls",       dev: false,         team: false,          scale: true,        ent: true },
  { feature: "Ed25519 cryptographic signing", dev: false,         team: false,          scale: true,        ent: true },
  { feature: "SSO",                          dev: false,         team: false,          scale: true,        ent: true },
  { feature: "VPC deployment",               dev: false,         team: false,          scale: false,       ent: true },
  { feature: "Sentinel gate (add-on)",       dev: false,         team: false,          scale: false,       ent: true },
  { feature: "Support",                      dev: "Community",   team: "48h email",    scale: "Priority",  ent: "24h named" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Check() {
  return <span className="text-white/80">✓</span>;
}

function Cross() {
  return <span className="text-white/18">—</span>;
}

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <Check />;
  if (value === false) return <Cross />;
  return <span className="text-sm text-white/68">{value}</span>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [open, setOpen] = useState<string | null>(faqs[0][0]);

  return (
    <div className="page-shell">
      <SiteHeader />
      <PageFrame>

        {/* ── Hero ── */}
        <section className="section-block pt-32">
          <div className="content-wrap">
            <Reveal className="max-w-4xl space-y-6">
              <p className="eyebrow">// Pricing</p>
              <h1 className="section-title">
                Start Free.
                <br />
                Pay when it saves you.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/72">
                Developer tier is free forever. You pay at the exact moment the product has proven its value — when you need more traces, longer history, approval workflows, or your own infrastructure.
                Every upgrade is pulled by a felt need. None require a sales call below $1,500/month.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Tier cards ── */}
        <section className="section-block">
          <div className="content-wrap grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {tiers.map((tier, index) => (
              <Reveal delay={index * 0.07} key={tier.name}>
                <div
                  className={`flex h-full flex-col rounded-[2rem] p-6 ${
                    tier.highlight
                      ? "liquid-glass-strong border border-white/20"
                      : "liquid-glass"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                      {tier.name}
                    </p>
                    {tier.badge && (
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/36 whitespace-nowrap">
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-4">
                    <div className="text-4xl serif-italic text-white">{tier.price}</div>
                    <p className="mt-1 text-sm text-white/40">{tier.period}</p>
                  </div>

                  {/* Description */}
                  <p className="mt-5 text-sm leading-relaxed text-white/62 flex-1">
                    {tier.description}
                  </p>

                  {/* Features */}
                  <ul className="mt-6 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-white/72">
                        <span className="mt-0.5 text-white/30 shrink-0">·</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Ceiling note */}
                  {tier.ceiling && (
                    <p className="mt-5 text-xs leading-relaxed text-white/34 border-t border-white/8 pt-4">
                      {tier.ceiling}
                    </p>
                  )}

                  {/* CTA */}
                  <PrimaryButton
                    href={tier.ctaHref}
                    className="mt-6 w-full justify-center inline-flex items-center gap-2"
                    inverted={tier.ctaInverted}
                  >
                    {tier.cta}
                    <ArrowUpRightIcon width={14} height={14} />
                  </PrimaryButton>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Overage note ── */}
        <section className="section-block !pt-0">
          <div className="content-wrap">
            <Reveal>
              <p className="text-sm text-white/36 text-center">
                Trace overages: Team at $1.50 / 1k traces · Scale at $0.80 / 1k traces · Annual billing saves 17% on Team and Scale.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Sentinel add-on ── */}
        <section className="section-block">
          <div className="content-wrap">
            <Reveal>
              <div className="liquid-glass-strong rounded-[2.4rem] p-6 md:p-8">
                <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
                  <div className="space-y-3">
                    <p className="eyebrow">Add-on</p>
                    <div className="text-3xl serif-italic text-white">{sentinelAddon.name}</div>
                    <div className="text-2xl serif-italic text-white/70">{sentinelAddon.price}</div>
                    <p className="text-sm text-white/40">{sentinelAddon.period}</p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-base leading-7 text-white/72">
                      {sentinelAddon.description}
                    </p>
                    <div className="rounded-[1.5rem] border border-white/10 bg-black/20 px-5 py-4 text-sm leading-7 text-white/52">
                      {sentinelAddon.note}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        ["Blocks actions above threshold", "until a human approves"],
                        ["Tamper-resistant gate log", "feeds into compliance report"],
                        ["Threshold configured by you", "not hardcoded by Blocklog"],
                      ].map(([title, detail]) => (
                        <div
                          key={title}
                          className="rounded-[1.4rem] border border-white/8 px-4 py-3"
                        >
                          <p className="text-sm text-white/74">{title}</p>
                          <p className="mt-1 text-xs text-white/38">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Upgrade path narrative ── */}
        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="max-w-3xl space-y-4">
              <p className="eyebrow">// How upgrades happen</p>
              <h2 className="section-title">Every upgrade is a product moment, not a sales moment.</h2>
            </Reveal>
            <div className="mt-12 grid gap-4 lg:grid-cols-2">
              {[
                {
                  trigger: "Developer → Team",
                  moment: "You hit 5,000 traces or day 14.",
                  detail:
                    "Your agent is live in staging. You've replayed three failures this week. Trace volume runs out or history stops persisting. The upgrade prompt appears. You upgrade in 30 seconds without asking anyone.",
                },
                {
                  trigger: "Team → Scale",
                  moment: "Your compliance officer reads the 90-day report.",
                  detail:
                    "After 90 days of Team, a forensic report is generated and forwarded internally. The compliance officer reads it and says: this answers what our regulator has been asking. They ask for a year of history. That question is the Scale conversation.",
                },
                {
                  trigger: "Scale → Enterprise",
                  moment: "Security asks where the traces live.",
                  detail:
                    "Your CISO or a prospective enterprise customer asks: where does this data go? The answer — our cloud — triggers a data residency requirement. That question is the Enterprise VPC conversation.",
                },
                {
                  trigger: "Enterprise → Sentinel",
                  moment: "The compliance officer asks the next question.",
                  detail:
                    "After reading two or three forensic reports, they ask: can we prevent the high-risk actions rather than just document them? That question is the Sentinel conversation. You never pitch it.",
                },
              ].map((item, index) => (
                <Reveal delay={index * 0.07} key={item.trigger}>
                  <div className="liquid-glass rounded-[2rem] p-6 h-full">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-white/12 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/44">
                        {item.trigger}
                      </span>
                    </div>
                    <p className="mt-4 text-lg serif-italic text-white">{item.moment}</p>
                    <p className="mt-3 text-sm leading-7 text-white/62">{item.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison table ── */}
        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="max-w-2xl space-y-4">
              <p className="eyebrow">// Full comparison</p>
              <h2 className="section-title">What's in each tier.</h2>
            </Reveal>
            <Reveal delay={0.08} className="mt-10 overflow-x-auto">
              <div className="liquid-glass-strong rounded-[2rem] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      <th className="p-5 text-left text-xs uppercase tracking-[0.22em] text-white/36 font-normal w-[36%]">
                        Feature
                      </th>
                      {["Developer", "Team", "Scale", "Enterprise"].map((h) => (
                        <th
                          key={h}
                          className={`p-5 text-center text-xs uppercase tracking-[0.22em] font-normal ${
                            h === "Team" ? "text-white/80" : "text-white/36"
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, index) => (
                      <tr
                        key={row.feature}
                        className={`border-b border-white/6 ${
                          index % 2 === 0 ? "bg-white/[0.01]" : ""
                        }`}
                      >
                        <td className="px-5 py-4 text-white/64">{row.feature}</td>
                        <td className="px-5 py-4 text-center">
                          <CellValue value={row.dev} />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <CellValue value={row.team} />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <CellValue value={row.scale} />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <CellValue value={row.ent} />
                        </td>
                      </tr>
                    ))}
                    {/* Price row */}
                    <tr className="border-t border-white/12 bg-white/[0.02]">
                      <td className="px-5 py-5 text-xs uppercase tracking-[0.22em] text-white/36">
                        Monthly price
                      </td>
                      {["Free", "$149", "$399", "$1,500"].map((p, i) => (
                        <td
                          key={p}
                          className={`px-5 py-5 text-center serif-italic text-lg ${
                            i === 1 ? "text-white" : "text-white/60"
                          }`}
                        >
                          {p}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="max-w-2xl">
              <p className="eyebrow">// FAQ</p>
              <h2 className="section-title">Pricing questions.</h2>
            </Reveal>
            <div className="mt-10 grid gap-3 max-w-3xl">
              {faqs.map(([question, answer], index) => {
                const expanded = open === question;
                return (
                  <Reveal delay={index * 0.04} key={question}>
                    <button
                      className="liquid-glass w-full rounded-[2rem] p-5 text-left transition-all"
                      onClick={() => setOpen(expanded ? null : question)}
                      type="button"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="text-base serif-italic text-white leading-snug">
                            {question}
                          </div>
                          {expanded && (
                            <p className="mt-4 text-sm leading-7 text-white/62">
                              {answer}
                            </p>
                          )}
                        </div>
                        <ChevronRightIcon
                          className={`mt-1 shrink-0 transition-transform duration-200 text-white/36 ${
                            expanded ? "rotate-90" : ""
                          }`}
                          width={16}
                          height={16}
                        />
                      </div>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="section-block">
          <div className="content-wrap">
            <Reveal>
              <div className="liquid-glass-strong rounded-[2.6rem] p-8 md:p-12 flex flex-col items-center text-center gap-6">
                <p className="eyebrow">// Start here</p>
                <h2 className="section-title max-w-2xl">
                  Install the SDK. See your first forensic replay. Then decide.
                </h2>
                <p className="max-w-xl text-base leading-7 text-white/62">
                  Free forever. No credit card. No production impact. No procurement approval.
                  Under 20 minutes from install to first replay.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <PrimaryButton
                    href="/get-started"
                    className="inline-flex items-center gap-2"
                  >
                    Get started free
                    <ArrowUpRightIcon width={14} height={14} />
                  </PrimaryButton>
                  <PrimaryButton href="/contact" inverted>
                    Talk to us about Enterprise
                  </PrimaryButton>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <Footer />
      </PageFrame>
    </div>
  );
}
