"use client";

import {
  Footer,
  PageFrame,
  PrimaryButton,
  Reveal,
  SiteHeader,
} from "@/components/site/Primitives";
import { ArrowUpRightIcon } from "@/components/site/icons";

// ─── Data ────────────────────────────────────────────────────────────────────

const timelineSteps = [
  {
    step: "01",
    title: "Connect your AI system",
    detail:
      "Deploy Blocklog alongside your agents — hosted by us or within your own VPC. No changes to production behavior. Decision capture begins immediately.",
    code: "blocklog deploy --vpc",
  },
  {
    step: "02",
    title: "Capture real decisions",
    detail:
      "Every decision receives a permanent record containing inputs, retrievals, tool calls, approvals, and outcomes.",
    code: "847 decisions captured",
  },
  {
    step: "03",
    title: "Replay critical events",
    detail:
      "Investigate failures, customer disputes, and unexpected outcomes using complete decision reconstruction.",
    code: "replay(dec_9af1c18)",
  },
  {
    step: "04",
    title: "Generate evidence",
    detail:
      "Produce auditor-ready evidence packages directly from production decision records.",
    code: "evidence_package.pdf",
  },
  {
    step: "05",
    title: "Evaluate the results",
    detail:
      "At the end of the pilot, you'll know exactly what your AI systems decided, why they decided it, and whether you can prove it later.",
    code: "30-day pilot complete",
  },
];

const qualifications = [
  {
    label: "AI agent in production",
    detail: "Making autonomous financial decisions — refunds, fraud, credit, chargebacks, fee application, or payouts.",
  },
  {
    label: "LangChain, OpenAI Agents SDK, or CrewAI",
    detail: "TypeScript SDK supports all three. Python SDK available for CrewAI and Celery-based stacks.",
  },
  {
    label: "At least one engineer with 3–4 hours",
    detail: "For integration and feedback. The deployment itself takes under 20 minutes.",
  },
  {
    label: "A compliance stakeholder who will read the report",
    detail: "Not required for deployment — but the pilot produces its most useful output when a compliance officer reviews the 30-day report.",
  },
];

const disqualifications = [
  {
    label: "AI making recommendations only",
    detail: "No autonomous execution. If a human approves every action, the forensic record adds less value at this stage.",
  },
  {
    label: "No financial decisions in scope",
    detail: "Blocklog is built for financial AI specifically. General-purpose agents are out of scope.",
  },
  {
    label: "Test environment only",
    detail: "Blocklog produces meaningful output only from production traffic. Synthetic or test data produces a synthetic report.",
  },
];

const whatYouGet = [
  {
    heading: "Every AI decision, preserved",
    body:
      "A permanent system of record containing the evidence behind every AI decision your organization made during the pilot.",
  },
  {
    heading: "Every decision, explainable",
    body:
      "Replay and investigate decisions using the exact context, actions, approvals, and governance controls that existed at the time.",
  },
  {
    heading: "Every decision, provable",
    body:
      "Generate evidence packages suitable for auditors, regulators, customers, and internal investigations.",
  },
  {
    heading: "A decision infrastructure strategy",
    body:
      "Know whether your organization can explain, verify, and govern AI decisions at production scale before broader deployment.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PilotPage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <PageFrame>

        {/* ── Hero ── */}
        <section className="section-block pt-32">
          <div className="content-wrap">
            <Reveal className="max-w-4xl space-y-6">
              <p className="eyebrow">// 30-Day Pilot</p>
              <h1 className="section-title">
                Deploy in 20 minutes.
                <br />
                Understand your agent in 30 days.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/72">
                Blocklog runs alongside your LangChain agent without touching production behavior — deployed hosted or within your own VPC. After 30 days, you have a forensic record of every AI financial decision your system made: what it decided, which inputs it used, how stale they were, and what would have changed the outcome.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <PrimaryButton href="/get-started" className="inline-flex items-center gap-2">
                  Apply for the pilot
                  <ArrowUpRightIcon width={14} height={14} />
                </PrimaryButton>
                <PrimaryButton href="/docs" inverted>
                  Read the docs first
                </PrimaryButton>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── What you get ── */}
        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="max-w-2xl space-y-3">
              <p className="eyebrow">// What you get</p>
              <h2 className="section-title">Four outputs. All from your own production data.</h2>
            </Reveal>
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {whatYouGet.map((item, index) => (
                <Reveal delay={index * 0.07} key={item.heading}>
                  <div className="liquid-glass-strong rounded-[2rem] p-6 h-full flex flex-col gap-4">
                    <h3 className="text-xl serif-italic text-white leading-tight">
                      {item.heading}
                    </h3>
                    <p className="text-sm leading-7 text-white/66 flex-1">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="max-w-2xl space-y-3">
              <p className="eyebrow">// Day by day</p>
              <h2 className="section-title">What happens in 30 days.</h2>
            </Reveal>
            <div className="mt-12 grid gap-4">
              {timelineSteps.map((step, index) => (
                <Reveal
                  key={step.step}
                  delay={index * 0.06}
                  className="grid gap-4 md:grid-cols-[110px_1px_1fr]"
                >
                  {/* Day label */}
                  <div className="pt-5 space-y-1">
                    <p className="text-xs uppercase tracking-[0.26em] text-white/30">
                    </p>
                  </div>

                  {/* Trace line */}
                  <div className="relative hidden md:block">
                    <div className="mx-auto mt-5 h-3 w-3 rounded-full bg-white/50" />
                    {index !== timelineSteps.length - 1 && (
                      <div className="trace-line mx-auto mt-2 h-full min-h-16" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="liquid-glass rounded-[2rem] p-5 grid gap-4 md:grid-cols-[1fr_auto] items-start">
                    <div>
                      <p className="text-lg serif-italic text-white">{step.title}</p>
                      <p className="mt-2 text-sm leading-7 text-white/62">{step.detail}</p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/10 bg-black/30 px-4 py-3 shrink-0 md:max-w-[260px]">
                      <span className="mono text-xs text-white/60 leading-relaxed">{step.code}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Fit / Disqualifications ── */}
        <section className="section-block">
          <div className="content-wrap grid gap-6 lg:grid-cols-2">
            {/* Good fit */}
            <Reveal>
              <div className="liquid-glass rounded-[2rem] p-6 h-full">
                <p className="eyebrow">// Good fit</p>
                <p className="mt-3 text-sm text-white/50 leading-relaxed">
                  The pilot works best when all four of these are true.
                </p>
                <div className="mt-6 space-y-4">
                  {qualifications.map((item) => (
                    <div key={item.label} className="flex gap-4 items-start">
                      <span className="mt-1 text-white/36 shrink-0">·</span>
                      <div>
                        <p className="text-sm text-white/84">{item.label}</p>
                        <p className="mt-1 text-xs text-white/44 leading-relaxed">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Hard disqualifications */}
            <Reveal delay={0.08}>
              <div className="liquid-glass rounded-[2rem] p-6 h-full">
                <p className="eyebrow">// Not a fit right now</p>
                <p className="mt-3 text-sm text-white/50 leading-relaxed">
                  Honest disqualifications. Don't waste your 30 days on a wrong-fit pilot.
                </p>
                <div className="mt-6 space-y-4">
                  {disqualifications.map((item) => (
                    <div key={item.label} className="flex gap-4 items-start">
                      <span className="mt-1 text-white/24 shrink-0">×</span>
                      <div>
                        <p className="text-sm text-white/58">{item.label}</p>
                        <p className="mt-1 text-xs text-white/34 leading-relaxed">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── The deal ── */}
        <section className="section-block">
          <div className="content-wrap">
            <Reveal>
              <div className="liquid-glass-strong rounded-[2.4rem] p-6 md:p-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
                <div className="space-y-4">
                  <p className="eyebrow">// The deal</p>
                  <h2 className="text-3xl serif-italic text-white leading-tight">
                    You run Blocklog for 30 days and give candid feedback.
                    We give you a complete forensic report of your own agent's decisions — free, no obligation.
                  </h2>
                </div>
                <div className="space-y-4 text-sm leading-7 text-white/62">
                  <p>
                    No sales follow-up during the 30 days. No pressure to convert. No pitch deck at the end.
                  </p>
                  <p>
                    At day 30, you get the forensic report regardless of what you decide next.
                    The report is yours — generated from your production data, covering your actual decisions,
                    formatted for your regulator.
                  </p>
                  <p>
                    The only thing we ask: give candid feedback on the replay engine and, if possible, have your compliance officer read the report and tell us whether it answers the questions their regulator is asking.
                  </p>
                  <div className="mt-2 rounded-[1.4rem] border border-white/10 px-5 py-4 text-white/48">
                    Three non-negotiables: AI in production making real financial decisions, an engineer with 3–4 hours, and at least one compliance-adjacent person who will read the report.
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="mx-auto max-w-2xl text-center space-y-6">
              <p className="eyebrow">// Get started</p>
              <h2 className="text-3xl serif-italic text-white leading-tight">
                Ready to see what your agent actually decided?
              </h2>
              <p className="text-sm text-white/50 leading-relaxed max-w-lg mx-auto">
                We review every application personally and reply within 48 hours.
                If you're a fit, you can be live the same day — hosted or in your own VPC.
              </p>
              <PrimaryButton href="/get-started" className="inline-flex items-center gap-2 mx-auto">
                Apply for the pilot
                <ArrowUpRightIcon width={14} height={14} />
              </PrimaryButton>
              <p className="text-xs text-white/32 leading-relaxed">
                No sales follow-up during the 30 days. No obligation at the end.
                The forensic report is yours regardless of what you decide next.
              </p>
            </Reveal>
          </div>
        </section>

        <Footer />
      </PageFrame>
    </div>
  );
}