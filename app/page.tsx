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

// ─── Data ────────────────────────────────────────────────────────────────────

const stalenessRows = [
  { field: "risk_score", value: "22,018 ms", state: "stale", highlight: true },
  { field: "fraud_signal_count", value: "0 ms", state: "fresh", highlight: false },
  { field: "customer_tier", value: "391 ms", state: "fresh", highlight: false },
  { field: "prior_disputes", value: "5,220 ms", state: "warning", highlight: false },
];

const replaySteps = [
  {
    label: "Input snapshot",
    code: "risk_score: 22018ms stale",
    detail: "Exact inputs at inference time, not fetch time",
  },
  {
    label: "Policy version",
    code: "refund-policy-v17.3",
    detail: "Which rules were active when the agent decided",
  },
  {
    label: "Causal delta",
    code: "counterfactual: +$180k",
    detail: "What one input change would have flipped the outcome",
  },
  {
    label: "Approval lineage",
    code: "checkpoint [3] skipped",
    detail: "Every human gate — completed or skipped",
  },
];

const debuggingCards = [
  {
    eyebrow: "Stale Input Detection",
    title: "Know which inputs were actually in context.",
    body: "LangSmith shows what happened. Blocklog shows which inputs the model was working with at the exact millisecond it decided — and how old each one was. A 22-second staleness difference can be the entire causal factor.",
    tags: ["Input Freshness", "Inference Snapshot", "Staleness Delta"],
  },
  {
    eyebrow: "Counterfactual Replay",
    title: "Find the exact change that flips the decision.",
    body: "Not just what the agent did — but what it would have done if one input had been fresher, one signal had arrived, one checkpoint had fired. Replay in 30 seconds. Not two hours.",
    tags: ["Counterfactual", "Decision Boundary", "Root Cause"],
  },
  {
    eyebrow: "Multi-Step Causation",
    title: "Trace failures across a 15-step workflow.",
    body: "The failure that surfaces at step 12 was caused at step 3. Standard traces show you the stack. Blocklog shows you the causal chain — which upstream decision produced which downstream failure.",
    tags: ["Causal Graph", "Workflow Tracing", "Cross-Step Lineage"],
  },
];

const expansionSteps = [
  {
    step: "01",
    who: "Engineer",
    action: "Installs shadow mode",
    detail: "npm install @blocklog/sdk — zero production impact, free trial, 14 days.",
  },
  {
    step: "02",
    who: "Engineer",
    action: "Replays the first failure",
    detail: "Stale inputs, causal chain, counterfactual — all visible in 30 seconds.",
  },
  {
    step: "03",
    who: "Blocklog",
    action: "Generates 30-day forensic report",
    detail: "Every AI financial decision, inputs, staleness, approval status. Automatically.",
  },
  {
    step: "04",
    who: "Compliance officer",
    action: "Reads the report",
    detail: "The same data the engineer used for debugging, formatted for a regulator.",
  },
  {
    step: "05",
    who: "CTO",
    action: "Signs the contract",
    detail: "The compliance officer asks to make it formal. The engineer confirms it works.",
  },
];

const regulatoryPills = [
  "EU AI Act · Article 12 · August 2026",
  "SR 11-7 · Federal Reserve · Active",
  "DORA · EU Financial Entities · Active",
  "Colorado AI Act · June 2026",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <PageFrame>

        {/* ── Hero: Engineer-first ── */}
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
                    // Forensic debugging for AI financial agents
                  </motion.p>
                  <motion.h1
                    className="max-w-4xl --font-heading text-6xl italic leading-[0.82] tracking-[-4px] text-white md:text-7xl lg:text-[5.5rem]"
                    initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  >
                    Finally understand
                    <br />
                    why your AI agent
                    <br />
                    did that.
                  </motion.h1>
                  <motion.p
                    className="max-w-xl text-sm font-light leading-relaxed text-white/78 md:text-base"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Replay any AI financial decision. See which inputs were stale at inference time.
                    Understand the causal chain. Install in 5 minutes — free, zero production impact.
                  </motion.p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <PrimaryButton href="/get-started" className="inline-flex items-center gap-2">
                    Get Started For Free
                    <ArrowUpRightIcon width={16} height={16} />
                  </PrimaryButton>
                  <PlayTextButton href="/#how-it-works">See how it works</PlayTextButton>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["Reconstruction time", "30 sec", "vs. 2–4 hours in logs"],
                    ["Install time", "< 20 min", "LangChain, zero config"],
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
                  Works alongside LangChain — no changes to your agent, no production risk.
                </div>
              </Reveal>

              {/* Hero card: staleness table as the opening visual */}
              <div className="liquid-glass-strong rounded-[2.4rem] p-6">
                  <div className="flex items-center justify-between">
                    <p className="eyebrow">Input staleness at inference time</p>
                    <span className="text-xs uppercase tracking-[0.24em] text-white/38">dec_9af1c18</span>
                  </div>
                  <p className="mt-3 text-sm text-white/54 leading-relaxed">
                    These are the inputs your model was actually using when it decided.
                    Not when they were fetched — when they were in context.
                  </p>

                  <div className="mt-6 space-y-3">
                    {stalenessRows.map((row) => (
                      <div
                        key={row.field}
                        className={`flex items-center justify-between rounded-full border px-4 py-3 text-sm ${
                          row.highlight
                            ? "border-white/24 bg-white/[0.06]"
                            : "border-white/8 bg-transparent"
                        }`}
                      >
                        <span className={`mono ${row.highlight ? "text-white" : "text-white/78"}`}>
                          {row.field}
                        </span>
                        <span className="mono text-white/54">{row.value}</span>
                        <span
                          className={`text-xs uppercase tracking-[0.18em] ${
                            row.state === "stale"
                              ? "text-white/90"
                              : row.state === "warning"
                              ? "text-white/58"
                              : "text-white/34"
                          }`}
                        >
                          {row.state}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 px-5 py-4 text-sm text-white/68 leading-relaxed">
                    <span className="mono text-white/42">counterfactual → </span>
                    Decision would have routed to human review if{" "}
                    <span className="mono text-white">risk_score</span> freshness were below 5s.
                  </div>

                  <div className="mt-4 rounded-[1.2rem] border border-white/8 px-4 py-3 text-xs uppercase tracking-[0.18em] text-white/38">
                    Blocklog · shadow mode · zero production impact
                  </div>
                </div>

            </div>
          </div>
        </section>

        {/* ── The debugging problem ── */}
        <section className="section-block" id="how-it-works">
          <div className="content-wrap">
            <Reveal className="max-w-3xl space-y-4">
              <p className="eyebrow">// The Problem</p>
              <h2 className="section-title">
                You can see what your agent did. You cannot see why.
              </h2>
              <p className="section-copy">
                LangSmith shows you the trace. It does not show you which inputs the model was
                actually using at inference time, how stale they were, or what would have changed the
                outcome. When something breaks in production, you spend hours reconstructing a
                30-second execution from fragmented logs. That cost is real and it is happening today.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {debuggingCards.map((card, index) => (
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

        {/* ── Replay engine walkthrough ── */}
        <section className="section-block relative overflow-hidden">
          <div className="video-shell">
            <HeroVideo src={SYSTEM_VIDEO} objectClassName="opacity-90" />
          </div>
          <div className="content-wrap relative">
            <Reveal className="max-w-3xl">
              <p className="eyebrow">// Forensic Replay</p>
              <h2 className="section-title">
                Every decision. Reconstructed. In 30 seconds.
              </h2>
              <p className="section-copy">
                Blocklog runs in shadow mode — parallel to your agent, touching nothing in production.
                It captures the complete causal record of every decision so you never have to
                reconstruct one manually again.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-5 lg:grid-cols-2">
              {replaySteps.map((item, index) => (
                <Reveal delay={index * 0.07} key={item.label}>
                  <div className="liquid-glass rounded-[2rem] p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.24em] text-white/38">{item.label}</p>
                        <p className="text-sm text-white/68 leading-relaxed mt-2">{item.detail}</p>
                      </div>
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

        {/* ── Compliance bridge — surfaced naturally, not led with ── */}
        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
              <div className="space-y-6">
                <p className="eyebrow">// What Engineers Discover</p>
                <h2 className="section-title">
                  The same data your engineer debugs with is the evidence your regulator needs.
                </h2>
                <p className="section-copy">
                  After 30 days of shadow mode, Blocklog generates a forensic report from your
                  production data. The engineer uses it to understand decisions. The compliance
                  officer uses the same report to satisfy their auditor. No second tool. No
                  second integration. No second data collection.
                </p>
                <div className="liquid-glass rounded-[2rem] p-5 text-sm leading-7 text-white/68">
                  EU AI Act enforcement begins August 2, 2026 — approximately 54 days from now.
                  Article 12 requires tamper-resistant logs of every AI financial decision.
                  Your production data already contains what auditors will ask for.
                  Blocklog makes it readable.
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

              {/* Compliance report preview */}
              <Reveal delay={0.1}>
                <div className="liquid-glass-strong rounded-[2.4rem] p-6">
                  <div className="flex items-center justify-between">
                    <p className="eyebrow">Forensic compliance report</p>
                    <span className="text-xs uppercase tracking-[0.22em] text-white/36">30-day output</span>
                  </div>
                  <div className="mt-6 space-y-3 text-sm text-white/72">
                    {[
                      "Decision ID · dec_9af1c18",
                      "Agent fingerprint · agt_f84e1a2",
                      "Policy version · refund-policy-v17.3",
                      "Input staleness · 4 fields analyzed · 1 stale",
                      "Approval lineage · 3/4 checkpoints completed",
                      "Counterfactual · stale risk_score flipped review path",
                      "Regulatory mapping · EU AI Act Art. 12 ✓ · SR 11-7 ✓ · CFPB ✓",
                    ].map((item) => (
                      <div className="rounded-full border border-white/8 px-4 py-3" key={item}>
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-[1.4rem] border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-white/40">
                    Signed hash 7a8e1b... · chain position 2281184 · PDF export with attestation
                  </div>
                  <p className="mt-4 text-xs text-white/40 leading-relaxed">
                    Generated automatically. No engineer in the room. Readable by compliance without a technical translation layer.
                  </p>
                </div>
              </Reveal>
            </Reveal>
          </div>
        </section>

        {/* ── How the motion works ── */}
        <section className="section-block">
          <div className="video-shell">
            <HeroVideo src={ADOPTION_VIDEO} objectClassName="opacity-90" />
          </div>
          <div className="content-wrap">
            <Reveal className="max-w-3xl">
              <p className="eyebrow">// How It Expands</p>
              <h2 className="section-title">
                Engineer installs. Compliance officer reads. CTO pays.
              </h2>
              <p className="section-copy">
                No procurement approval required to install. No sales call required to upgrade to
                the first paid tier. The path from shadow mode to Enterprise contract runs through
                the value of the product, not a sales process.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-4">
              {expansionSteps.map((item, index) => (
                <Reveal
                  className="grid gap-4 md:grid-cols-[100px_1px_1fr]"
                  delay={index * 0.07}
                  key={item.step}
                >
                  <div className="space-y-1 pt-1">
                    <p className="text-xs uppercase tracking-[0.26em] text-white/28">{item.step}</p>
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
                    Your agent made a decision you cannot explain.
                    <br />
                    Install Blocklog and replay it in.
                  </motion.h2>

                  <motion.p
                    className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/68"
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
                  >
                    Free shadow mode. No production impact. No procurement approval.
                    First forensic replay in under 20 minutes.
                  </motion.p>

                  <motion.div
                    className="mt-10 flex flex-col gap-4 sm:flex-row"
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.72 }}
                  >
                    <PrimaryButton href="/get-started" className="inline-flex items-center gap-2">
                      Get Started For Free
                      <ArrowUpRightIcon width={16} height={16} />
                    </PrimaryButton>
                    <PrimaryButton href="/docs" inverted>
                      Read the Docs
                    </PrimaryButton>
                  </motion.div>

                </div>
              );
            })()}
          </section>

        <Footer />
      </PageFrame>
    </div>
  );
}
