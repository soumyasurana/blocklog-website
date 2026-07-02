"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Footer,
  HeroVideo,
  PageFrame,
  PlayTextButton,
  PrimaryButton,
  Reveal,
  SiteHeader,
  SYSTEM_VIDEO,
  ADOPTION_VIDEO,
} from "@/components/site/Primitives";
import { ArrowUpRightIcon } from "@/components/site/icons";

// Data
const decisionLayers = [
  {
    label: "Inputs",
    code: "risk_score · customer_tier · fraud_signals",
    detail:
      "The exact information available when the decision was made, including freshness and provenance.",
  },
  {
    label: "Retrievals",
    code: "policy-doc-v17.3 · kb_chunk_9af1",
    detail:
      "The documents, knowledge sources, and context the model actually used.",
  },
  {
    label: "Tool Calls",
    code: "GET /credit-api · POST /flag-review",
    detail:
      "Every external action, response, and dependency involved in the workflow.",
  },
  {
    label: "Governance",
    code: "policy-v17.3 · threshold: $2,500",
    detail:
      "The rules, controls, and requirements active at the moment of evaluation.",
  },
  {
    label: "Approvals",
    code: "checkpoint [3] skipped · [1][2][4] passed",
    detail:
      "Human reviews, overrides, escalations, and approval lineage.",
  },
  {
    label: "Decision",
    code: "DENY · confidence: 0.91 · routed: auto",
    detail:
      "The final outcome preserved with its complete evidence trail.",
  },
];


const audienceCards = [
  {
    eyebrow: "For Engineers",
    title: "Replay any failure in 30 seconds.",
    body: "The decision that surfaced at step 12 was caused at step 3. Blocklog shows you the causal chain across the entire workflow — not a stack trace, not a log dump. Which input was stale. Which policy was active. What would have changed the outcome.",
    tags: ["Causal Graph", "Counterfactual Replay", "Input Freshness"],
  },
  {
    eyebrow: "For Compliance",
    title: "Prove what happened. Without asking engineering.",
    body: "The same evidence your engineer used to debug the failure is formatted as a signed forensic report. Decision ID, agent fingerprint, policy version, approval lineage, regulatory mapping. Readable by an auditor without a technical translation layer.",
    tags: ["Audit Trail", "Regulatory Mapping", "Signed Evidence"],
  },
  {
    eyebrow: "For Executives",
    title: "Govern AI systems you cannot currently see into.",
    body: "Every AI decision your company has made is now searchable, explainable, and attributable. Not as a debugging tool. As infrastructure. The permanent evidence layer behind every outcome your AI systems produce.",
    tags: ["AI Governance", "Decision Accountability", "Evidence Layer"],
  },
];

const replaySteps = [
  {
    label: "Inputs",
    code: "customer_profile · risk_score · transaction_history",
    detail:
    "The exact data available when the decision was made.",
  },
  {
    label: "Execution",
    code: "retrievals · tools · model calls",
    detail:
      "Every action taken by the AI system during evaluation.",
  },
  {
    label: "Governance",
    code: "policy-v17.3 · approval-required",
    detail:
      "Policies, thresholds, and human approvals that influenced the outcome.",
  },
  {
    label: "Outcome",
    code: "decision approved",
    detail:
      "The final decision, preserved with its complete evidence trail.",
  },
];


const whyExistingToolsFail = [
  {
    tool: "Observability",
    whatTheyDo:
      "Show how systems execute. Traces, logs, metrics, latency, failures, and performance.",
    whatTheyMiss:
      "They were built for software systems. AI systems make decisions. Observability explains execution. It does not preserve accountability.",
  },
  {
    tool: "AI Tracing",
    whatTheyDo:
      "Capture prompts, completions, tool calls, and agent workflows during development and production.",
    whatTheyMiss:
      "They help teams understand what happened today. They were not designed to prove what happened six months later to an auditor, regulator, or customer.",
  },
  {
    tool: "Logs & Data Lakes",
    whatTheyDo:
      "Store large volumes of operational data and make it searchable.",
    whatTheyMiss:
      "The evidence required to explain an AI decision is fragmented across systems. Reconstructing the decision later becomes a manual investigation.",
  },
];


const expansionSteps = [
  {
    who: "Step 01",
    action: "Capture the decision",
    detail:
      "Blocklog records the complete evidence trail behind every AI decision.",
  },
  {
    who: "Step 02",
    action: "Replay what happened",
    detail:
      "Reconstruct the exact decision, inputs, approvals, and execution path in seconds.",
  },
  {
    who: "Step 03",
    action: "Understand why",
    detail:
      "See the causal chain, policy evaluations, and factors that influenced the outcome.",
  },
  {
    who: "Step 04",
    action: "Prove it later",
    detail:
      "Generate regulator-ready evidence months after the decision occurred.",
  },
  {
    who: "Step 05",
    action: "Govern AI at scale",
    detail:
      "Turn every AI decision into a permanent, auditable system of record.",
  },
];

const regulatoryPills = [
  "EU AI Act · Article 12 · August 2026",
  "SR 11-7 · Federal Reserve · Active",
  "DORA · EU Financial Entities · Active",
  "Colorado AI Act · June 2026",
];

const decisionRecord = [
  "Decision ID · dec_9af1c18",
  "Agent Fingerprint · agt_f84e1a2",
  "Timestamp · 2026-06-17T14:22:11Z",
  "Inputs · 4 captured",
  "Retrievals · 3 documents",
  "Tool Calls · 2 executed",
  "Governance · refund-policy-v17.3",
  "Approvals · 3/4 completed",
  "Decision · DENY",
  "Evidence Status · Complete",
];


// Page
export default function HomePage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <PageFrame>

        {/* ── Hero ── */}
        <section className="relative min-h-screen overflow-hidden">
          <HeroVideo />
          <div className="bg-grid" />
          <div className="content-wrap relative flex min-h-screen items-end pb-16 pt-28">
            <div className="grid w-full gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">

              <Reveal className="space-y-8">
                <div className="space-y-6">
                  <motion.p
                    className="text-xs uppercase tracking-[0.28em] text-white/42"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    // The system of record for AI decisions
                  </motion.p>
                  <motion.h1
                    className="max-w-4xl --font-heading text-6xl italic leading-[0.82] tracking-[-4px] text-white md:text-7xl lg:text-[5.5rem]"
                    initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  >
                    Every AI decision
                    <br />
                    your company makes
                    <br />
                    is evidence.
                  </motion.h1>
                  <motion.p
                    className="max-w-xl text-sm font-light leading-relaxed text-white/78 md:text-base"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Blocklog captures the complete evidence trail behind every AI decision —
                    inputs, retrievals, tool calls, policies, approvals, outputs.
                    Explainable to engineers. Auditable by compliance. Governable by executives.
                  </motion.p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <PrimaryButton href="/get-started" className="inline-flex items-center gap-2">
                    Start Recording Decisions
                    <ArrowUpRightIcon width={16} height={16} />
                  </PrimaryButton>
                  <PlayTextButton href="/#what-blocklog-captures">See what gets captured</PlayTextButton>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["Decisions recorded", "Permanent", "Signed, immutable, replayable"],
                    ["Time to first record", "< 20 min", "Shadow mode, zero production changes"],
                  ].map(([label, value, detail], index) => (
                    <Reveal delay={index * 0.08} key={label}>
                      <div className="liquid-glass rounded-[2rem] p-5">
                        <p className="text-xs uppercase tracking-[0.24em] text-white/42">{label}</p>
                        <div className="mt-3 text-4xl serif-italic text-white">{value}</div>
                        <p className="mt-2 text-sm text-white/56">{detail}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>

                <div className="liquid-glass inline-flex rounded-full px-4 py-3 text-sm text-white/68">
                  Shadow mode — parallel to your agent. No production risk. No code changes.
                </div>
              </Reveal>

              {/* Hero card: decision record */}
              <div className="liquid-glass-strong rounded-[2.4rem] p-6">
                <div className="flex items-center justify-between">
                  <p className="eyebrow">Decision record</p>
                  <span className="text-xs uppercase tracking-[0.24em] text-white/38">dec_9af1c18</span>
                </div>
                <p className="mt-3 text-sm text-white/54 leading-relaxed">
                  Every field that existed when this decision was made.
                  Signed. Permanent. Replayable on demand.
                </p>

                <div className="mt-6 space-y-2">
                  {decisionRecord.map((row, i) => (
                    <div
                      key={row}
                      className={`flex items-center rounded-full border px-4 py-3 text-sm ${
                        i === 7
                          ? "border-white/24 bg-white/[0.06]"
                          : "border-white/8 bg-transparent"
                      }`}
                    >
                      <span className={`mono text-xs ${i === 7 ? "text-white" : "text-white/68"}`}>
                        {row}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-black/30 px-5 py-4 text-xs uppercase tracking-[0.18em] text-white/40">
                  Signed hash 7a8e1b · chain position 2281184 · PDF export with attestation
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── The Problem ── */}
        <section className="section-block" id="how-it-works">
          <div className="content-wrap">
            <Reveal className="max-w-3xl space-y-4">
              <p className="eyebrow">// The Accountability Gap</p>
              <h2 className="section-title">
                Traditional software creates records.
                AI systems create decisions.
                Most companies have no record of those decisions.
              </h2>
              <p className="section-copy">
                Every database write is logged. Every API call has a trace. Every code change has a
                commit. Software infrastructure has spent thirty years building accountability into
                every layer of the stack. Then AI arrived — and the most consequential outputs
                your systems now produce have no permanent evidence layer behind them.
                A customer complains. A regulator asks. An auditor requests documentation.
                Nobody can prove what happened.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {audienceCards.map((card, index) => (
                <Reveal delay={index * 0.08} key={card.eyebrow}>
                  <article className="liquid-glass-strong flex h-full flex-col rounded-[2rem] p-6">
                    <p className="eyebrow">{card.eyebrow}</p>
                    <h3 className="mt-4 text-xl font-bold leading-tight text-white">{card.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-white/72 flex-1">{card.body}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {card.tags.map((tag) => (
                        <span
                          className="rounded-full border border-white/8 px-3 py-2 text-xs uppercase tracking-[0.16em] text-white/44"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── What Blocklog Captures ── */}
        <section className="section-block relative overflow-hidden" id="what-blocklog-captures">
          <div className="video-shell">
            <HeroVideo src={SYSTEM_VIDEO} objectClassName="opacity-90" />
          </div>
          <div className="content-wrap relative">
            <Reveal className="max-w-3xl">
              <p className="eyebrow">// What Gets Captured</p>
              <h2 className="section-title">
                Every layer of a decision.
                Preserved as evidence.
              </h2>
              <p className="section-copy">
                Blocklog runs in shadow mode — parallel to your agent, touching nothing in
                production. It captures every layer of every decision: not just what the agent
                output, but what it was working with, which policies were active, which humans
                approved, and what would have changed the outcome.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-5 lg:grid-cols-2">
              {decisionLayers.map((item, index) => (
                <Reveal delay={index * 0.07} key={item.label}>
                  <div className="liquid-glass rounded-[2rem] p-6">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/38">{item.label}</p>
                      <p className="text-sm text-white/68 leading-relaxed mt-2">{item.detail}</p>
                    </div>
                    <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-black/30 px-4 py-3">
                      <span className="mono text-sm text-white/86">{item.code}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Replay ── */}
        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="max-w-3xl space-y-4">
              <p className="eyebrow">// Forensic Replay</p>
              <h2 className="section-title">
                Any decision. Reconstructed completely. In 30 seconds.
              </h2>
              <p className="section-copy">
                The failure that surfaced at step 12 was caused at step 3. A 22-second input
                staleness difference was the entire causal factor. Blocklog shows you the complete
                causal chain — not a stack trace, not a log grep. The exact reconstruction of what
                the model was working with when it decided.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-5 lg:grid-cols-2">
              {replaySteps.map((item, index) => (
                <Reveal delay={index * 0.07} key={item.label}>
                  <div className="liquid-glass rounded-[2rem] p-6">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/38">{item.label}</p>
                      <p className="text-sm text-white/68 leading-relaxed mt-2">{item.detail}</p>
                    </div>
                    <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-black/30 px-4 py-3">
                      <span className="mono text-sm text-white/86">{item.code}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Prove what happened ── */}
        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
              <div className="space-y-6">
                <p className="eyebrow">// Prove What Happened</p>
                <h2 className="section-title">
                  The same evidence your engineer debugs with is what your regulator needs.
                </h2>
                <p className="section-copy">
                  Blocklog does not generate compliance reports separately from debugging data.
                  They are the same record. The engineer uses it to understand the failure.
                  The compliance officer uses it to respond to the auditor. The executive uses it
                  to demonstrate governance. One system of record. Three audiences. No duplication.
                </p>
                <div className="liquid-glass rounded-[2rem] p-5 text-sm leading-7 text-white/68">
                  EU AI Act enforcement begins August 2, 2026. Article 12 requires tamper-resistant
                  logs of every high-risk AI decision. SR 11-7 requires model governance documentation
                  for every AI system touching credit or risk. DORA requires operational resilience
                  evidence for EU financial entities. Your AI systems are already producing the
                  decisions regulators will ask about. Blocklog makes that evidence permanent.
                </div>
                <div className="flex flex-wrap gap-3">
                  {regulatoryPills.map((pill) => (
                    <div
                      className="liquid-glass rounded-full px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/58"
                      key={pill}
                    >
                      {pill}
                    </div>
                  ))}
                </div>
              </div>

              <Reveal delay={0.1}>
                <div className="liquid-glass-strong rounded-[2.4rem] p-6">
                  <div className="flex items-center justify-between">
                    <p className="eyebrow">Forensic decision report</p>
                    <span className="text-xs uppercase tracking-[0.22em] text-white/36">auto-generated</span>
                  </div>
                  <div className="mt-6 space-y-3 text-sm text-white/72">
                    {decisionRecord.map((item) => (
                      <div className="rounded-full border border-white/8 px-4 py-3" key={item}>
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-[1.4rem] border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-white/40">
                    Signed hash 7a8e1b · chain position 2281184 · PDF export with attestation
                  </div>
                  <p className="mt-4 text-xs text-white/40 leading-relaxed">
                    Generated automatically from production data. No engineer in the room.
                    Readable by compliance without a technical translation layer.
                  </p>
                </div>
              </Reveal>
            </Reveal>
          </div>
        </section>

        {/* ── Why existing tools fail ── */}
        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="max-w-3xl space-y-4">
              <p className="eyebrow">// Why Existing Tools Fall Short</p>
              <h2 className="section-title">
                Observability tools show execution.
                Blocklog preserves accountability.
              </h2>
              <p className="section-copy">
                Traces and logs were designed for debugging distributed systems — not for proving
                what an AI system was working with when it made a consequential decision. They are
                different problems. Blocklog is not a better trace. It is a different category.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {whyExistingToolsFail.map((item, index) => (
                <Reveal delay={index * 0.08} key={item.tool}>
                  <div className="liquid-glass-strong flex h-full flex-col rounded-[2rem] p-6">
                    <p className="eyebrow">{item.tool}</p>
                    <div className="mt-5 space-y-4 flex-1">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/36 mb-2">What they do</p>
                        <p className="text-sm leading-7 text-white/68">{item.whatTheyDo}</p>
                      </div>
                      <div className="border-t border-white/8 pt-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/36 mb-2">What they miss</p>
                        <p className="text-sm leading-7 text-white/68">{item.whatTheyMiss}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it expands ── */}
        <section className="section-block">
          <div className="video-shell">
            <HeroVideo src={ADOPTION_VIDEO} objectClassName="opacity-90" />
          </div>
          <div className="content-wrap">
            <Reveal className="max-w-3xl">
              <p className="eyebrow">// How Adoption Works</p>
              <h2 className="section-title">
                Engineer installs. Compliance reads. Executive governs.
              </h2>
              <p className="section-copy">
                No procurement approval required to start. No sales call required to see value.
                The path from shadow mode to enterprise contract runs through the product itself —
                because the same data that makes engineers faster makes compliance teams defensible
                and executives accountable.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-4">
              {expansionSteps.map((item, index) => (
                <Reveal
                  className="grid gap-4 md:grid-cols-[100px_1px_1fr]"
                  delay={index * 0.07}
                  key={item.action}
                >
                  <div className="space-y-1 pt-1">
                    <p className="text-xs uppercase tracking-[0.26em] text-white/28">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/50">{item.who}</p>
                  </div>
                  <div className="trace-line hidden min-h-20 md:block" />
                  <div className="liquid-glass rounded-[2rem] p-5">
                    <div className="text-xl font-bold text-white">{item.action}</div>
                    <p className="mt-3 text-sm leading-7 text-white/64">{item.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="section-block min-h-[80vh] relative overflow-hidden">
          {(() => {
            const ref = useRef(null);
            const inView = useInView(ref, { once: true, margin: "-100px" });

            return (
              <div ref={ref} className="content-wrap relative z-10 flex min-h-[60vh] flex-col items-center justify-center text-center">

                {/* Scanline */}
                <motion.div
                  className="pointer-events-none absolute inset-0 z-0"
                  style={{
                    background: "linear-gradient(90deg, transparent 48%, rgba(255,255,255,0.06) 50%, transparent 52%)",
                  }}
                  initial={{ x: "-100%" }}
                  animate={inView ? { x: "100%" } : { x: "-100%" }}
                  transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
                />

                <motion.h2
                  className="section-title max-w-4xl"
                  initial={{ opacity: 0, filter: "blur(8px)", y: 18 }}
                  animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                >
                  Your AI systems are making decisions.
                  <br />
                  Start recording them.
                </motion.h2>

                <motion.p
                  className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/68"
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
                >
                  Shadow mode. Zero production impact. No procurement approval.
                  Every decision becomes explainable, replayable, and auditable
                  from the moment you install.
                </motion.p>

                <motion.div
                  className="mt-10 flex flex-col gap-4 sm:flex-row"
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.72 }}
                >
                  <PrimaryButton href="/get-started" className="inline-flex items-center gap-2">
                    Start Recording Decisions
                    <ArrowUpRightIcon width={16} height={16} />
                  </PrimaryButton>
                  <PrimaryButton href="/docs" inverted>
                    Read the Architecture
                  </PrimaryButton>
                </motion.div>

                <motion.p
                  className="mt-8 text-xs uppercase tracking-[0.22em] text-white/30"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  The system of record for AI decisions.
                </motion.p>

              </div>
            );
          })()}
        </section>
        <Footer />
      </PageFrame>
    </div>
  );
}