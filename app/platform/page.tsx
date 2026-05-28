"use client";

import { Footer, PageFrame, Reveal, SiteHeader } from "@/components/site/Primitives";

const layers = [
  {
    name: "Traceflow",
    description: "Execution and orchestration telemetry for agent workflows.",
    answers: "What exactly did the agent do?",
    status: "Coming Q3 2026",
  },
  {
    name: "Sentinel",
    description: "Runtime security and authorization enforcement for high-risk actions.",
    answers: "Should the agent be allowed to do this?",
    status: "Coming Q4 2026",
  },
  {
    name: "BlackVault",
    description: "Secure isolated execution for untrusted or irreversible actions.",
    answers: "How do we safely execute high-risk actions?",
    status: "Coming 2027",
  },
  {
    name: "Blocklog",
    description: "The cryptographic ledger and replay layer everything else orbits.",
    answers: "Can we prove why this decision happened?",
    status: "Core Layer",
  },
];

const layerDetails = [
  {
    name: "Blocklog — The Core",
    question: "The ledger everything else orbits.",
    points: [
      "Append-only governance record store with hash chaining",
      "Forensic replay engine",
      "Compliance report generator",
      "Counterfactual analysis",
      "Cryptographic attestation chains",
    ],
    status: "Core Layer",
    code: `decision_id: string
timestamp_us: bigint
agent_id: string
policy_version: string
input_staleness_ms: Record<string, number>
approval_lineage: ApprovalCheckpoint[]
counterfactual_delta: string
execution_token_id: string
chain_position: bigint`,
  },
  {
    name: "Traceflow — Execution + Orchestration",
    question: "What exactly did the agent do?",
    points: [
      "Browser automation",
      "Workflow execution",
      "Replayability",
      "Execution graphs",
      "Observability",
      "Distributed task orchestration",
      "Agent lifecycle tracing",
    ],
    status: "Coming Q3 2026",
  },
  {
    name: "Sentinel — Runtime Security",
    question: "Should the agent be allowed to do this?",
    points: [
      "Policy enforcement",
      "Runtime interception",
      "Approval logic",
      "Risk scoring",
      "Tool authorization",
      "Anomaly detection",
      "Escalation workflows",
    ],
    status: "Coming Q4 2026",
  },
  {
    name: "BlackVault — Secure Execution",
    question: "How do we safely execute untrusted or high-risk actions?",
    points: [
      "Sandboxed execution",
      "Container isolation",
      "Syscall restrictions",
      "Ephemeral runtimes",
      "Network controls",
      "Execution isolation",
    ],
    status: "Coming 2027",
  },
];

const integrations = [
  ["LangChain / LangGraph", "Most fintech AI", "Available"],
  ["OpenAI Agents SDK", "Modern agent stacks", "Available"],
  ["Temporal", "Workflow orchestration", "Coming Soon"],
  ["CrewAI", "Multi-agent frameworks", "Coming Soon"],
  ["n8n", "Smaller fintech teams", "Coming Soon"],
  ["Celery", "Python automation", "Available"],
];

const regulations = [
  ["EU AI Act Article 12 + 14", "EU", "Documentation, human oversight, and traceability", "Full"],
  ["SR 11-7", "United States", "Model governance and replayable decision evidence", "Full"],
  ["Colorado AI Act", "Colorado", "High-risk AI accountability surfaces", "Partial"],
  ["DORA", "EU", "Operational resilience evidence and incident reconstruction", "Full"],
  ["NYDFS Part 500", "New York", "Audit, controls, and security evidence", "Partial"],
  ["CFPB", "United States", "Decision traceability for consumer financial actions", "Full"],
  ["FCA", "United Kingdom", "Control evidence and decision lineage", "Partial"],
];

export default function PlatformPage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <PageFrame>
        <section className="section-block pt-32">
          <div className="content-wrap">
            <Reveal className="max-w-4xl">
              <p className="eyebrow">{`// Platform`}</p>
              <h1 className="section-title">Four Layers. One Governance Stack.</h1>
            </Reveal>
            <div className="mt-14 grid gap-4">
              {layers.map((layer, index) => (
                <Reveal delay={index * 0.08} key={layer.name}>
                  <div className="grid gap-4 md:grid-cols-[1fr_40px_1.4fr] md:items-center">
                    <div className="liquid-glass-strong rounded-[2rem] p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-2xl serif-italic">{layer.name}</div>
                          <p className="mt-3 text-sm leading-7 text-white/68">{layer.description}</p>
                        </div>
                        <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/46">
                          {layer.status}
                        </div>
                      </div>
                      <div className="mt-5 rounded-full border border-white/10 px-4 py-3 text-sm text-white/76">
                        Answers: {layer.answers}
                      </div>
                    </div>
                    <div className="hidden md:flex md:justify-center">
                      <div className="trace-line h-16" />
                    </div>
                    <div />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="content-wrap grid gap-6">
            {layerDetails.map((layer, index) => (
              <Reveal delay={index * 0.06} key={layer.name}>
                <article className="liquid-glass-strong rounded-[2.4rem] p-6 md:p-8">
                  <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
                    <div>
                      <p className="eyebrow">{layer.status}</p>
                      <h2 className="mt-4 text-4xl serif-italic">{layer.name}</h2>
                      <p className="mt-4 text-base leading-7 text-white/72">{layer.question}</p>
                    </div>
                    <div className="grid gap-3">
                      {layer.points.map((point) => (
                        <div className="rounded-full border border-white/10 px-4 py-3 text-sm text-white/74" key={point}>
                          {point}
                        </div>
                      ))}
                      {layer.code ? (
                        <pre className="mt-3 overflow-auto rounded-[1.6rem] border border-white/10 bg-white/[0.02] p-5 text-sm text-white/72">
                          {layer.code}
                        </pre>
                      ) : null}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="max-w-3xl">
              <h2 className="section-title">Integrates Where Your AI Already Lives.</h2>
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {integrations.map(([name, detail, status], index) => (
                <Reveal delay={index * 0.06} key={name}>
                  <div className="liquid-glass rounded-[2rem] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-xl serif-italic">{name}</div>
                      <div className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/46">
                        {status}
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-white/68">{detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="content-wrap">
            <Reveal className="max-w-4xl">
              <h2 className="section-title">Satisfies Every Requirement. Without an Engineer in the Room.</h2>
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {regulations.map(([name, jurisdiction, detail, coverage], index) => (
                <Reveal delay={index * 0.05} key={name}>
                  <div className="liquid-glass rounded-[2rem] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xl serif-italic">{name}</div>
                        <div className="mt-2 text-sm text-white/44">{jurisdiction}</div>
                      </div>
                      <div className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/46">
                        Coverage: {coverage}
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-white/68">{detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </PageFrame>
    </div>
  );
}
