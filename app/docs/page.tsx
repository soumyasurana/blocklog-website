"use client";

import { useMemo, useState } from "react";
import { Footer, PageFrame, Reveal, SiteHeader } from "@/components/site/Primitives";
import { SearchIcon } from "@/components/site/icons";

const docsTree = [
  {
    category: "Getting Started",
    items: ["Introduction", "How Blocklog Works", "Quick Start (5 minutes)", "Shadow Mode Setup", "Your First Governance Record"],
  },
  {
    category: "SDK Reference",
    items: ["TypeScript SDK", "Python SDK", "Configuration Options", "Event Types", "Error Handling"],
  },
  {
    category: "Authorization Gate",
    items: ["Overview", "Policy Engine", "Approval Workflows", "Token Verification", "Revocation"],
  },
  {
    category: "Forensic Replay",
    items: ["Overview", "Running a Replay", "Counterfactual Analysis", "Staleness Analysis", "Approval Lineage"],
  },
  {
    category: "Compliance Reports",
    items: ["Overview", "Report Structure", "Regulatory Mappings", "PDF Export", "Automated Delivery"],
  },
  {
    category: "Framework Integrations",
    items: ["LangChain", "OpenAI Agents SDK", "CrewAI", "Temporal", "n8n", "Celery"],
  },
  {
    category: "API Reference",
    items: ["Authentication", "Governance Record API", "Authorization Gate API", "Forensic Replay API", "Compliance Report API", "Verification API"],
  },
  {
    category: "Security",
    items: ["Cryptographic Attestation", "Hash Chaining", "Agent Identity", "Key Management", "SOC2"],
  },
  {
    category: "Regulatory",
    items: ["EU AI Act Article 12", "EU AI Act Article 14", "SR 11-7", "Colorado AI Act", "CFPB", "FCA"],
  },
];

const docBodies: Record<string, string> = {
  Introduction: "Blocklog is the control plane protecting autonomous financial operations. It observes, authorizes, reconstructs, and proves AI financial decisions using cryptographic evidence rather than screenshots and institutional memory.",
  "How Blocklog Works": "Blocklog captures every decision with timestamps, staleness data, policy version, approval lineage, and cryptographic chain position. Replay, report generation, and authorization all consume the same record.",
  "Quick Start (5 minutes)": "Install the SDK, set mode=shadow, wrap the financial decision call, and let Blocklog emit governance records without changing the execution path.",
  "Shadow Mode Setup": "Shadow mode records the full governance envelope without blocking live execution. That is how Blocklog enters production before procurement friction arrives.",
  "Your First Governance Record": "The first valuable output is not a dashboard tile. It is a decision record with decision_id, agent_id, policy_version, input_staleness_ms, and execution context.",
};

const quickStart = `import { Blocklog } from '@blocklog/sdk';

const blocklog = new Blocklog({
  apiKey: process.env.BLOCKLOG_API_KEY,
  mode: 'shadow',
  agentId: 'refund-agent-v2',
});

const decision = await blocklog.observe(async () => {
  return await yourRefundAgent.process(transaction);
});

// Governance record created.
// Forensic replay available immediately.
// Compliance report generating.`;

export default function DocsPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("Quick Start (5 minutes)");

  const filteredTree = useMemo(() => {
    if (!query.trim()) return docsTree;
    const needle = query.toLowerCase();
    return docsTree
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.toLowerCase().includes(needle)),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  return (
    <div className="page-shell">
      <SiteHeader />
      <PageFrame>
        <section className="section-block pt-32">
          <div className="content-wrap">
            <Reveal className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <aside className="liquid-glass h-fit rounded-[2rem] p-4 lg:sticky lg:top-28">
                <div className="mb-4 flex items-center gap-3 rounded-full border border-white/10 px-4 py-3">
                  <SearchIcon width={15} height={15} />
                  <input
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/28"
                    placeholder="Search documentation..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <div className="scrollbar-thin max-h-[70vh] overflow-auto pr-2">
                  {filteredTree.map((group) => (
                    <div className="mb-5" key={group.category}>
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/38">{group.category}</p>
                      <div className="grid gap-2">
                        {group.items.map((item) => (
                          <button
                            className={`rounded-full px-4 py-3 text-left text-sm ${active === item ? "bg-white text-black" : "liquid-glass text-white/72"}`}
                            key={item}
                            onClick={() => setActive(item)}
                            type="button"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </aside>

              <div className="space-y-6">
                <Reveal>
                  <div className="liquid-glass-strong rounded-[2.4rem] p-6 md:p-8">
                    <p className="eyebrow">Documentation Hub</p>
                    <h1 className="mt-4 text-5xl serif-italic">Blocklog Docs</h1>
                    <p className="mt-5 max-w-3xl text-base leading-7 text-white/72">
                      Default view starts with the quick start path, but the underlying structure is designed for engineering, risk, security, and audit teams to work from the same source.
                    </p>
                  </div>
                </Reveal>
                <Reveal delay={0.08}>
                  <div className="liquid-glass rounded-[2.4rem] p-6 md:p-8">
                    <p className="eyebrow">{active}</p>
                    <div className="mt-4 text-sm leading-7 text-white/74">
                      {docBodies[active] ?? "Detailed reference content for this section is being prepared. The structure is already aligned to the authorization gate, replay, reporting, and regulatory workflows."}
                    </div>
                    <pre className="mt-8 overflow-auto rounded-[1.8rem] border border-white/10 bg-white/[0.02] p-5 text-sm text-white/74">
                      {quickStart}
                    </pre>
                  </div>
                </Reveal>
              </div>
            </Reveal>
          </div>
        </section>

        <Footer />
      </PageFrame>
    </div>
  );
}
