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
    name: "Shadow Mode",
    price: "Free",
    period: "14-day trial",
    badge: "Start here",
    highlight: false,
    cta: "Install free",
    ctaHref: "/signup",
    ctaInverted: false,
    description:
      "Install alongside your LangChain agent. Zero production impact. No credit card. See your first forensic replay in under 20 minutes.",
    features: [
      "Forensic replay engine",
      "Stale input tracking",
      "Counterfactual analysis",
      "LangChain integration",
      "14-day decision history",
      "Community support",
    ],
    ceiling: "History stops persisting at day 14. Upgrade to keep it.",
  },
  {
    name: "Solo",
    price: "$49",
    period: "per month",
    badge: "",
    highlight: false,
    cta: "Start Solo",
    ctaHref: "/signup?plan=solo",
    ctaInverted: false,
    description:
      "For individual engineers who want persistent replay history and never want to lose a forensic record again.",
    features: [
      "Everything in Shadow Mode",
      "30-day decision history",
      "1 engineer seat",
      "Unlimited replays",
      "No usage limits",
      "Community support",
    ],
    ceiling: "Hit the ceiling when you need to share a replay with a teammate.",
  },
  {
    name: "Team",
    price: "$99",
    period: "per month",
    badge: "Recommended",
    highlight: true,
    cta: "Start Team",
    ctaHref: "/signup?plan=team",
    ctaInverted: true,
    description:
      "For engineering teams debugging production failures together. One upgrade covers the whole team.",
    features: [
      "Everything in Solo",
      "90-day decision history",
      "Up to 5 engineer seats",
      "Shareable replay links",
      "Inline replay comments",
      "48h email support",
    ],
    ceiling:
      "Hit the ceiling when a compliance stakeholder asks to see a report.",
  },
  {
    name: "Professional",
    price: "$1,500",
    period: "per month",
    badge: "Coming Soon",
    highlight: false,
    cta: "Talk to us",
    ctaHref: "/contact",
    ctaInverted: true,
    description:
      "For teams whose compliance officer has read the forensic report and needs to make it formal. Budget comes from compliance, not engineering.",
    features: [
      "Everything in Team",
      "Unlimited engineer seats",
      "12-month tamper-resistant retention",
      "PDF compliance report with attestation",
      "Auditor access role — read-only, no engineer needed",
      "Quarterly report scheduling",
      "Priority 24h support with named contact",
      "Sentinel gate add-on available",
    ],
    ceiling: null,
  },
];

const sentinelAddon = {
  name: "Sentinel-(Coming Soon)",
  price: "$500",
  period: "per month add-on",
  description:
    "The human-in-the-loop authorization gate. Blocks any AI financial decision above a configurable threshold until a human approves it. Available on Professional only.",
  note: "Sentinel is never pitched. Compliance officers who have read 30+ days of forensic reports request it themselves after seeing the decisions-near-threshold section.",
};

const faqs = [
  [
    "Why does the trial end at 14 days instead of being free forever?",
    "The 14-day window is long enough to see your first real production failure replayed. The moment history stops persisting is the moment the value is clearest. We deliberately chose a natural ceiling over an artificial feature gate.",
  ],
  [
    "Is the $49/$99 pricing per seat or per workspace?",
    "Per workspace. One upgrade covers your whole team at that tier. You hit the seat limit at 1 (Solo) or 5 (Team) — the ceiling is seats, not features.",
  ],
  [
    "Why does compliance live at $1,500 and not lower?",
    "Because the compliance report budget lives in the compliance officer's department, not the engineering team's. $1,500/month clears procurement at most Series B-D fintechs without a committee. Pricing it lower would put it in the wrong budget line and make it harder to sign, not easier.",
  ],
  [
    "What is Sentinel and why is it an add-on?",
    "Sentinel is the human-in-the-loop authorization gate — it sits in the execution path and blocks AI financial decisions above a threshold until a human approves. It's an add-on because it's a fundamentally different risk conversation from observability. It's also never sold: compliance officers who have been reading forensic reports for 30+ days request it themselves.",
  ],
  [
    "What does Enterprise include that Professional doesn't?",
    "Unlimited workspaces, custom retention beyond 12 months, Traceflow for multi-agent execution chain visibility, SSO, RBAC, private cloud or on-premise deployment, SLA with uptime guarantees, dedicated TAM, and custom compliance report templates for FCA, MAS, and RBI frameworks.",
  ],
  [
    "Is there a discount for annual billing?",
    "Solo and Team are month-to-month. Professional is available annually with two months free. Enterprise is annual only.",
  ],
  [
    "What happens to my forensic history if I downgrade?",
    "Your history is retained for 90 days after a downgrade. After that it is permanently deleted. We will email you at 30, 14, and 7 days before deletion.",
  ],
];

const comparisonRows = [
  { feature: "Forensic replay engine", shadow: true, solo: true, team: true, pro: true },
  { feature: "Stale input tracking", shadow: true, solo: true, team: true, pro: true },
  { feature: "Counterfactual analysis", shadow: true, solo: true, team: true, pro: true },
  { feature: "LangChain integration", shadow: true, solo: true, team: true, pro: true },
  { feature: "Decision history retention", shadow: "14 days", solo: "30 days", team: "90 days", pro: "12 months" },
  { feature: "Engineer seats", shadow: "1", solo: "1", team: "Up to 5", pro: "Unlimited" },
  { feature: "Shareable replay links", shadow: false, solo: false, team: true, pro: true },
  { feature: "Inline replay comments", shadow: false, solo: false, team: true, pro: true },
  { feature: "PDF compliance report", shadow: false, solo: false, team: false, pro: true },
  { feature: "Attestation footer", shadow: false, solo: false, team: false, pro: true },
  { feature: "Auditor access role", shadow: false, solo: false, team: false, pro: true },
  { feature: "Quarterly report scheduling", shadow: false, solo: false, team: false, pro: true },
  { feature: "Sentinel gate (add-on)", shadow: false, solo: false, team: false, pro: true },
  { feature: "Support", shadow: "Community", solo: "Community", team: "48h email", pro: "24h named" },
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
                Install free.
                <br />
                Pay when it saves you time.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/72">
                Shadow mode is free. You pay at the exact moment the product has proven its value — when you want to keep more history, bring in a teammate, or make your compliance report formal.
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
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/36 whitespace-nowrap">
                      {tier.badge}
                    </span>
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
                        ["Blocks decisions above threshold", "until a human approves"],
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
                  trigger: "Free → Solo",
                  moment: "Day 14. History stops persisting.",
                  detail:
                    "You replayed a production failure three times this week. The 14-day window expires. The upgrade prompt appears. You upgrade in 30 seconds without asking anyone.",
                },
                {
                  trigger: "Solo → Team",
                  moment: "You try to share a replay with a teammate.",
                  detail:
                    "A production incident happened. You found the causal chain. Your team lead needs to see it. You hit the seat limit. You upgrade the workspace. The whole team is in.",
                },
                {
                  trigger: "Team → Professional",
                  moment: "Your compliance officer reads the 30-day report.",
                  detail:
                    "After 30 days of shadow mode, the forensic report is generated and forwarded. The compliance officer reads it and says: this answers what our regulator has been asking. They drive the $1,500/month conversation with your CTO.",
                },
                {
                  trigger: "Professional → Sentinel",
                  moment: "The compliance officer asks the question.",
                  detail:
                    "After reading two or three forensic reports, they ask: can we prevent the high-risk decisions rather than just document them? That question is the Sentinel conversation. You never pitch it.",
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
                      {["Shadow", "Solo", "Team", "Pro"].map((h) => (
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
                          <CellValue value={row.shadow} />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <CellValue value={row.solo} />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <CellValue value={row.team} />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <CellValue value={row.pro} />
                        </td>
                      </tr>
                    ))}
                    {/* Price row */}
                    <tr className="border-t border-white/12 bg-white/[0.02]">
                      <td className="px-5 py-5 text-xs uppercase tracking-[0.22em] text-white/36">
                        Monthly price
                      </td>
                      {["Free", "$49", "$99", "$1,500"].map((p, i) => (
                        <td
                          key={p}
                          className={`px-5 py-5 text-center serif-italic text-lg ${
                            i === 2 ? "text-white" : "text-white/60"
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
                  Install shadow mode. See your first forensic replay. Then decide.
                </h2>
                <p className="max-w-xl text-base leading-7 text-white/62">
                  Free. No credit card. No production impact. No procurement approval.
                  Under 20 minutes from install to first replay.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <PrimaryButton
                    href="/signup"
                    className="inline-flex items-center gap-2"
                  >
                    Install Shadow Mode Free
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