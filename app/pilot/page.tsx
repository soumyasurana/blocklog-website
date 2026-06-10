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

// ─── Data ────────────────────────────────────────────────────────────────────

const timelineSteps = [
  {
    day: "Day 0",
    title: "Install shadow mode",
    detail:
      "npm install @blocklog/sdk. One decorator on your LangChain agent. Shadow mode activates. Nothing in your execution path changes — not a single production call is affected.",
    code: "npm install @blocklog/sdk",
  },
  {
    day: "Days 1–7",
    title: "First replays appear",
    detail:
      "Blocklog captures every AI financial decision: which inputs the model used, how stale they were at inference time, which tools were called, which checkpoints fired or were skipped.",
    code: "dec_9af1c18 · risk_score: 22,018ms stale",
  },
  {
    day: "Days 7–14",
    title: "Patterns become visible",
    detail:
      "Staleness patterns emerge across your agent's runs. You start to see which input fields are chronically late, which decision types are closest to flipping, which workflows have no approval checkpoint.",
    code: "4 decisions near threshold this week",
  },
  {
    day: "Days 14–21",
    title: "Root causes identified",
    detail:
      "The counterfactual engine shows you what specific input change would have produced a different outcome on each flagged decision. You can explain the causal chain of any failure in 30 seconds.",
    code: "counterfactual: freshness < 5s → human review",
  },
  {
    day: "Days 21–30",
    title: "Compliance report generated",
    detail:
      "The 30-day forensic report is produced automatically from your production data. Every decision, every input, every staleness measurement, every approval gap. Formatted for EU AI Act Article 12.",
    code: "report.pdf · 847 decisions · attestation signed",
  },
  {
    day: "Day 30",
    title: "You decide what comes next",
    detail:
      "You have a complete forensic record of your AI financial system. Show it to your compliance officer. Use it to tune your agent. Or just keep it running — the history is yours either way.",
    code: "no obligation · no sales call · yours to keep",
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
    detail: "For integration and feedback. The install itself takes under 20 minutes.",
  },
  {
    label: "A compliance stakeholder who will read the report",
    detail: "Not required for the install — but the pilot produces its most useful output when a compliance officer reviews the 30-day report.",
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
    detail: "Shadow mode produces meaningful output only from production traffic. Synthetic or test data produces a synthetic report.",
  },
];

const whatYouGet = [
  {
    heading: "A forensic replay of every decision",
    body: "Every AI financial decision your system made in 30 days, reconstructed with inputs, staleness measurements, tool calls, policy version, and approval chain status. Replayable in 30 seconds per decision.",
  },
  {
    heading: "Counterfactual analysis on flagged decisions",
    body: "For every decision that was close to flipping, the specific input change that would have changed the outcome. Not a dashboard. A causal explanation.",
  },
  {
    heading: "A compliance report your regulator can read",
    body: "PDF export with attestation, formatted for EU AI Act Article 12. Generated from your own production data. No engineer required in the room when your compliance officer presents it.",
  },
  {
    heading: "The data to make the next decision",
    body: "After 30 days you will know exactly how many decisions would have required human review under any threshold you choose. No estimate. Your own production numbers.",
  },
];

// ─── Form ─────────────────────────────────────────────────────────────────────

type FormState = {
  company: string;
  role: string;
  framework: string;
  decisions: string;
  urgency: string;
  email: string;
};

const initialForm: FormState = {
  company: "",
  role: "",
  framework: "LangChain",
  decisions: "",
  urgency: "",
  email: "",
};

const urgencyOptions = [
  "Production failure I cannot explain",
  "EU AI Act deadline in August",
  "Upcoming compliance audit",
  "New agent about to deploy",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PilotPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.company.trim()) e.company = "Required";
    if (!form.role.trim()) e.role = "Required";
    if (!form.decisions.trim()) e.decisions = "Required";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (validate()) setSubmitted(true);
  }

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
                Install in 20 minutes.
                <br />
                Understand your agent in 30 days.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/72">
                Shadow mode runs alongside your LangChain agent without touching production. After 30 days, you have a forensic record of every AI financial decision your system made — what it decided, which inputs it used, how stale they were, and what would have changed the outcome.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <PrimaryButton href="#apply" className="inline-flex items-center gap-2">
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
                  key={step.day}
                  delay={index * 0.06}
                  className="grid gap-4 md:grid-cols-[110px_1px_1fr]"
                >
                  {/* Day label */}
                  <div className="pt-5 space-y-1">
                    <p className="text-xs uppercase tracking-[0.26em] text-white/30">
                      {step.day}
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
                    You run shadow mode for 30 days and give candid feedback.
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

        {/* ── Application form ── */}
        <section className="section-block" id="apply">
          <div className="content-wrap">
            <Reveal className="mx-auto max-w-2xl">
              <div className="liquid-glass-strong rounded-[2.5rem] p-6 md:p-10">
                <p className="eyebrow">// Application</p>
                <h2 className="mt-3 text-3xl serif-italic text-white">
                  Apply for the 30-day pilot
                </h2>
                <p className="mt-3 text-sm text-white/50 leading-relaxed">
                  We review every application personally. Reply within 48 hours.
                  Not a form that routes to a SDR — the founder reads these.
                </p>

                {submitted ? (
                  <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 text-center space-y-4">
                    <div className="text-3xl serif-italic text-white">Application received.</div>
                    <p className="text-sm leading-7 text-white/60">
                      We'll reply within 48 hours. If you're clearly a fit, we'll send the SDK and a short onboarding doc. You can be in shadow mode the same day.
                    </p>
                  </div>
                ) : (
                  <div className="mt-8 space-y-4">

                    {/* Company + role */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <input
                          className={`liquid-glass w-full rounded-full px-5 py-4 bg-transparent text-white placeholder:text-white/28 outline-none focus:ring-1 focus:ring-white/20 ${errors.company ? "ring-1 ring-red-400/40" : ""}`}
                          placeholder="Company name"
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                        />
                        {errors.company && <p className="px-4 text-xs text-red-400/70">{errors.company}</p>}
                      </div>
                      <div className="space-y-2">
                        <input
                          className={`liquid-glass w-full rounded-full px-5 py-4 bg-transparent text-white placeholder:text-white/28 outline-none focus:ring-1 focus:ring-white/20 ${errors.role ? "ring-1 ring-red-400/40" : ""}`}
                          placeholder="Your role (e.g. Staff Engineer, VP Eng)"
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                        />
                        {errors.role && <p className="px-4 text-xs text-red-400/70">{errors.role}</p>}
                      </div>
                    </div>

                    {/* Framework */}
                    <div>
                      <p className="mb-3 px-1 text-xs uppercase tracking-[0.22em] text-white/34">
                        AI framework
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {["LangChain", "OpenAI Agents SDK", "CrewAI", "Temporal", "Custom / Other"].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setForm({ ...form, framework: value })}
                            className={`rounded-full border px-4 py-2 text-sm transition-all ${
                              form.framework === value
                                ? "border-white/30 text-white bg-white/8"
                                : "border-white/10 text-white/46 hover:border-white/20 hover:text-white/60"
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Decisions */}
                    <div className="space-y-2">
                      <textarea
                        className={`liquid-glass w-full min-h-28 rounded-[1.8rem] px-5 py-4 bg-transparent text-white placeholder:text-white/28 outline-none focus:ring-1 focus:ring-white/20 resize-none ${errors.decisions ? "ring-1 ring-red-400/40" : ""}`}
                        placeholder="What financial decisions does your AI agent make autonomously? Be specific — refunds above $X, fraud adjudications, chargeback approvals, etc."
                        value={form.decisions}
                        onChange={(e) => setForm({ ...form, decisions: e.target.value })}
                      />
                      {errors.decisions && <p className="px-4 text-xs text-red-400/70">{errors.decisions}</p>}
                    </div>

                    {/* Urgency */}
                    <div>
                      <p className="mb-3 px-1 text-xs uppercase tracking-[0.22em] text-white/34">
                        What's driving this now? (optional)
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {urgencyOptions.map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                urgency: form.urgency === value ? "" : value,
                              })
                            }
                            className={`rounded-[1.4rem] border px-4 py-3 text-sm text-left transition-all ${
                              form.urgency === value
                                ? "border-white/30 text-white bg-white/8"
                                : "border-white/10 text-white/46 hover:border-white/18 hover:text-white/60"
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <input
                        className={`liquid-glass w-full rounded-full px-5 py-4 bg-transparent text-white placeholder:text-white/28 outline-none focus:ring-1 focus:ring-white/20 ${errors.email ? "ring-1 ring-red-400/40" : ""}`}
                        placeholder="Work email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                      {errors.email && <p className="px-4 text-xs text-red-400/70">{errors.email}</p>}
                    </div>

                    {/* Submit */}
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="w-full rounded-full bg-white px-5 py-4 text-sm font-medium text-black hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-2"
                    >
                      Apply for the pilot
                      <ArrowUpRightIcon width={14} height={14} />
                    </button>

                    <p className="text-center text-xs text-white/32 leading-relaxed">
                      No sales follow-up during the 30 days. No obligation at the end.
                      The forensic report is yours regardless of what you decide next.
                    </p>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        <Footer />
      </PageFrame>
    </div>
  );
}