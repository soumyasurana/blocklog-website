"use client";

import { motion } from "framer-motion";
import { Footer, HeroVideo, PageFrame, PlayTextButton, PrimaryButton, Reveal, SiteHeader, SYSTEM_VIDEO } from "@/components/site/Primitives";
import { ArrowUpRightIcon } from "@/components/site/icons";

const proofCards = [
  {
    title: "Runtime Authorization",
    description:
      "Block refunds, payouts, and high-risk AI actions unless policy-approved and cryptographically authorized.",
    tags: ["Policy Engine", "Approval Gates", "Token Verification", "Execution Control"],
    visual: ["agent.request()", "policy.match()", "token.sign()", "processor.execute()"],
  },
  {
    title: "Forensic Replay",
    description:
      "Reconstruct exactly why an AI system made a financial decision, including policy state, stale inputs, approvals, and causal lineage.",
    tags: ["Timeline Replay", "Causal Graph", "Input Staleness", "Decision Lineage"],
    visual: ["input.score: stale", "policy v17.3", "checkpoint skipped", "counterfactual delta"],
  },
  {
    title: "Cryptographic Proof",
    description:
      "Hash chains, Merkle proofs, signed evidence bundles, and independently verifiable audit exports.",
    tags: ["Hash Chaining", "Merkle Roots", "Signed Bundles", "Independent Verification"],
    visual: ["2cb7f3...", "7c9a8d...", "67ab1e...", "root: 4de0a1..."],
  },
];

const pilotSteps = [
  "Engineer installs SDK",
  "Blocklog observes every AI financial decision",
  "Forensic report generated after 30 days",
  "Compliance officer reads the report",
  "Enterprise contract signed",
];

// const socialProof = [
//   {
//     company: "Series C lending platform",
//     role: "Head of Risk",
//     quote: "The first report showed us exactly which underwriting decisions depended on stale income signals.",
//     metric: "$11.8M in monthly decision volume reviewed",
//   },
//   {
//     company: "Digital payments processor",
//     role: "Staff Security Engineer",
//     quote: "We finally had a regulator-ready narrative for why one refund agent escalated and another did not.",
//     metric: "62,000 adjudications mapped",
//   },
//   {
//     company: "Chargeback automation vendor",
//     role: "VP Compliance",
//     quote: "Counterfactual replay made policy tuning a governance discussion instead of an engineering archaeology project.",
//     metric: "$180K exposure surfaced in week one",
//   },
// ];

const incidentNodes = [
  { time: "Hour 00", title: "Customer score fetched", state: "22 seconds stale", tone: "text-white/58" },
  { time: "Hour 08", title: "Fraud signal delayed", state: "Not delivered to model", tone: "text-white/42" },
  { time: "Hour 21", title: "Refund adjudication", state: "Checkpoint skipped", tone: "text-white/74" },
  { time: "Hour 48", title: "Execution completed", state: "$180,000 exposed", tone: "text-white" },
  { time: "Hour 72", title: "Investigation starts", state: "No governance record", tone: "text-white/50" },
];

const regulatoryPills = [
  "EU AI Act · August 2, 2026 · 75 days",
  "Colorado AI Act · June 30, 2026",
  "SR 11-7 · Federal Reserve · Active",
  "DORA · EU · Active",
];

export default function HomePage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <PageFrame>
        <section className="relative min-h-screen overflow-hidden">
          <HeroVideo />
          <div className="bg-grid" />
          <div className="content-wrap relative flex min-h-screen items-end pb-16 pt-28">
            <div className="grid w-full gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <Reveal className="space-y-8">
                <div className="space-y-6">
                  <motion.h1
                    className="max-w-4xl font-heading text-6xl italic leading-[0.82] tracking-[-4px] text-white md:text-7xl lg:text-[5.5rem]"
                    initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  >
                    Logs Are Claims.
                    <br />
                    Blocklog Makes Them Proof.
                  </motion.h1>
                  <p className="max-w-2xl text-sm font-light leading-tight text-white/85 md:text-base">
                    Block financial AI actions unless policy-approved and cryptographically authorized.
                    Replay decisions, verify integrity, and prove what autonomous systems actually did.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <PrimaryButton href="/signup" className="inline-flex items-center gap-2">
                    Join 30-Day Pilot
                    <ArrowUpRightIcon width={16} height={16} />
                  </PrimaryButton>
                  <PlayTextButton href="/#proof-flow">See Proof Flow</PlayTextButton>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["Hash Chain Integrity", "99.999%", "daily verification window"],
                    ["Proof Verification", "30 Sec", "median retrieval time"],
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
                <div className="space-y-5 pt-2">
                  <div className="liquid-glass inline-flex rounded-full px-4 py-3 text-sm text-white/76">
                    Built for financial systems, audits, and autonomous agents.
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-3 text-2xl serif-italic text-white/84">
                    <span>SOC2</span>
                    <span>AI Governance</span>
                    <span>Audit Trails</span>
                    <span>Proof Systems</span>
                    <span>Runtime Authorization</span>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="liquid-glass-strong rounded-[2.4rem] p-6">
                  <div className="flex items-center justify-between">
                    <p className="eyebrow">Forensic report preview</p>
                    <span className="text-xs uppercase tracking-[0.24em] text-white/42">production-derived</span>
                  </div>
                  <div className="mt-6 space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="liquid-glass rounded-[1.5rem] p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/38">Decision ID</p>
                        <div className="mt-2 text-lg serif-italic">dec_9af1c18</div>
                        <p className="mt-3 text-sm text-white/58">refund-agent-v2 · 2026-05-25T09:42:11.882Z</p>
                      </div>
                      <div className="liquid-glass rounded-[1.5rem] p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/38">Policy State</p>
                        <div className="mt-2 text-lg serif-italic">policy.v17.3</div>
                        <p className="mt-3 text-sm text-white/58">thresholds · staleness gates · human checkpoints</p>
                      </div>
                    </div>
                    <div className="liquid-glass rounded-[1.8rem] p-5">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-white/40">
                        <span>Input staleness table</span>
                        <span>milliseconds at decision time</span>
                      </div>
                      <div className="mt-4 space-y-3 text-sm text-white/74">
                        {[
                          ["risk_score", "22018 ms", "stale"],
                          ["fraud_signal_count", "0 ms", "fresh"],
                          ["customer_tier", "391 ms", "fresh"],
                          ["prior_disputes", "5220 ms", "warning"],
                        ].map(([field, value, state]) => (
                          <div className="flex items-center justify-between rounded-full border border-white/8 px-4 py-3" key={field}>
                            <span className="mono text-white/84">{field}</span>
                            <span className="mono text-white/62">{value}</span>
                            <span className="text-white/48">{state}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="liquid-glass rounded-[1.5rem] p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/38">Approval lineage</p>
                        <p className="mt-3 text-sm text-white/72">KYC checkpoint complete · Manual fraud review skipped · Senior approval not required</p>
                      </div>
                      <div className="liquid-glass rounded-[1.5rem] p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/38">Counterfactual summary</p>
                        <p className="mt-3 text-sm text-white/72">Decision would have routed to human review if risk_score freshness were below 5s.</p>
                      </div>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/12 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/54">
                      EU AI Act Article 12 ✓ · SR 11-7 ✓ · CFPB ✓ · signed hash: 7a8e1b... · chain position: 2281184
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-6">
                <p className="eyebrow">{`// The Incident`}</p>
                <h2 className="section-title">$180,000. 72 Hours. 400 Decisions. Zero Governance Record.</h2>
                <p className="section-copy">
                  Meridian Payments ran an AI refund adjudication agent against a customer risk score that was 22 seconds stale.
                  Three fraud signals never reached the model. By the time the investigation started, the causal chain had already dissolved into application logs, screenshots, and partial institutional memory.
                </p>
                <div className="liquid-glass rounded-[2rem] p-5 text-sm leading-7 text-white/72">
                  Blocklog would have captured the stale inputs, the exact policy version, the approval path, the execution token, and the counterfactual trigger that would have changed the outcome.
                </div>
              </div>
              <div className="liquid-glass-strong rounded-[2.2rem] p-6">
                <div className="grid gap-4">
                  {incidentNodes.map((node, index) => (
                    <Reveal className="grid grid-cols-[96px_1px_1fr] gap-4 items-start" delay={index * 0.08} key={node.time}>
                      <div className="pt-1 text-xs uppercase tracking-[0.22em] text-white/38">{node.time}</div>
                      <div className="relative h-full">
                        <div className="mx-auto h-3 w-3 rounded-full bg-white/72" />
                        {index !== incidentNodes.length - 1 ? <div className="trace-line mx-auto mt-2 h-full min-h-14" /> : null}
                      </div>
                      <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.02] p-4">
                        <div className="text-base text-white">{node.title}</div>
                        <div className={`mt-2 text-sm ${node.tone}`}>{node.state}</div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
            <div className="mt-10 flex gap-3 overflow-x-auto pb-2">
              {regulatoryPills.map((pill) => (
                <div className="liquid-glass whitespace-nowrap rounded-full px-4 py-3 text-sm text-white/74" key={pill}>
                  {pill}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-block relative overflow-hidden" id="proof-flow">
          <div className="video-shell">
            <HeroVideo src={SYSTEM_VIDEO} objectClassName="opacity-50" />
          </div>
          <div className="content-wrap relative">
            <Reveal className="max-w-3xl">
              <p className="eyebrow">{`// Proof Flow`}</p>
              <h2 className="section-title">
                Every financial AI action becomes independently verifiable.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {proofCards.map((card, index) => (
                <Reveal delay={index * 0.08} key={card.title}>
                  <article className="liquid-glass-strong flex h-full flex-col rounded-[2rem] p-6">
                    <p className="eyebrow">{card.title}</p>
                    <p className="mt-5 text-base leading-7 text-white/78">{card.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {card.tags.map((tag) => (
                        <span className="rounded-full border border-white/8 px-3 py-2 text-xs uppercase tracking-[0.16em] text-white/48" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-8 space-y-3 rounded-[1.8rem] border border-white/10 bg-black/30 p-4">
                      {card.visual.map((item, visualIndex) => (
                        <div className="flex items-center justify-between" key={item}>
                          <span className="mono text-sm text-white/78">{item}</span>
                          {visualIndex !== card.visual.length - 1 ? <span className="text-white/28">→</span> : <span className="text-white/46">✓</span>}
                        </div>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="mx-auto max-w-4xl text-center">
              <h2 className="section-title">The Report Your Regulator Will Actually Accept.</h2>
              <p className="section-copy">
                Generated from production data in under 20 minutes. No engineer required in the room.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="mt-12">
              <div className="liquid-glass-strong rounded-[2.6rem] p-6 md:p-10">
                <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
                  <div className="space-y-5">
                    <div>
                      <p className="eyebrow">Enterprise PDF export</p>
                      <div className="mt-3 text-4xl serif-italic">Forensic Compliance Report</div>
                    </div>
                    <div className="space-y-3 text-sm leading-7 text-white/72">
                      <p>Decision ID and timestamp</p>
                      <p>Agent identity fingerprint</p>
                      <p>Policy version evaluated</p>
                      <p>Approval lineage completed or skipped</p>
                      <p>Counterfactual summary</p>
                      <p>Regulatory mapping</p>
                    </div>
                  </div>
                  <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-5">
                    <div className="grid gap-3 text-sm text-white/74">
                      {[
                        "Decision ID · dec_9af1c18",
                        "Agent fingerprint · agt_f84e1a2",
                        "Policy version · refund-policy-v17.3",
                        "Input staleness · 4 fields analyzed",
                        "Approval lineage · 3/4 checkpoints completed",
                        "Counterfactual · stale risk_score flipped review path",
                        "Regulatory mapping · EU AI Act Article 12 ✓ · SR 11-7 ✓ · CFPB ✓",
                      ].map((item) => (
                        <div className="rounded-full border border-white/8 px-4 py-3" key={item}>
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 rounded-[1.4rem] border border-white/12 px-4 py-4 text-xs uppercase tracking-[0.2em] text-white/48">
                      Cryptographic attestation footer · signed hash 7a8e1b... · chain position 2281184
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="max-w-3xl">
              <p className="eyebrow">{`// Entry Flow`}</p>
              <h2 className="section-title">Shadow Mode to Enterprise Contract in 30 Days.</h2>
            </Reveal>
            <div className="mt-12 grid gap-4">
              {pilotSteps.map((step, index) => (
                <Reveal className="grid gap-4 md:grid-cols-[120px_1px_1fr]" delay={index * 0.08} key={step}>
                  <div className="text-sm uppercase tracking-[0.24em] text-white/38">Step {index + 1}</div>
                  <div className="trace-line hidden min-h-24 md:block" />
                  <div className="liquid-glass rounded-[2rem] p-5">
                    <div className="text-xl serif-italic">{step}</div>
                    <p className="mt-3 text-sm leading-7 text-white/68">
                      {index === 0 && "npm install @blocklog/sdk. Shadow mode activates with zero production impact."}
                      {index === 1 && "Captures inputs, timestamps, policy version, approval chain status, and escalation triggers."}
                      {index === 2 && "Real dollar amounts. Real compliance implications. Real decisions from production."}
                      {index === 3 && "The output is readable by compliance and risk without engineering archaeology."}
                      {index === 4 && "Authorization gate enabled. Execution dependency established. Infrastructure pricing locked."}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* <section className="section-block">
          <div className="content-wrap">
            <Reveal className="max-w-3xl">
              <h2 className="section-title">Built With Teams Running AI Financial Systems in Production.</h2>
            </Reveal>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {socialProof.map((item, index) => (
                <Reveal delay={index * 0.08} key={item.company}>
                  <div className="liquid-glass rounded-[2rem] p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/38">{item.company}</p>
                    <div className="mt-3 text-lg text-white">{item.role}</div>
                    <p className="mt-5 text-base leading-7 text-white/78">“{item.quote}”</p>
                    <div className="mt-6 rounded-full border border-white/10 px-4 py-3 text-sm text-white/58">{item.metric}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section> */}

        <section className="section-block min-h-[80vh]">
          <div className="content-wrap flex min-h-[60vh] flex-col items-center justify-center text-center">
            <Reveal className="max-w-4xl">
              <h2 className="section-title">Your AI is Making Decisions. Can You Prove What It Did?</h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/74">
                Install shadow mode in under 5 minutes. No production impact. No procurement approval. First forensic report in 30 days.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="mt-10 flex flex-col gap-4 sm:flex-row">
              <PrimaryButton href="/signup" className="inline-flex items-center gap-2">
                Join 30-Day Pilot
                <ArrowUpRightIcon width={16} height={16} />
              </PrimaryButton>
              <PrimaryButton href="/docs" inverted>
                Read the Docs
              </PrimaryButton>
            </Reveal>
          </div>
        </section>

        <Footer />
      </PageFrame>
    </div>
  );
}
