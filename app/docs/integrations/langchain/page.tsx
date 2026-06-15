"use client";

import Link from "next/link";

const installCode = `pip install blocklog`;

const basicCode = `import blocklog
from blocklog.integrations.langchain import instrument_langchain

# Initialize Blocklog
blocklog.init(api_key="blk_live_xxxx")

# Create the callback handler
handler = instrument_langchain(blocklog.client)

# Pass to any LangChain runnable
chain = your_chain.with_config(callbacks=[handler])
chain.invoke({"input": "your prompt"})`;

const agentCode = `from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import ChatOpenAI
from blocklog.integrations.langchain import instrument_langchain
import blocklog

blocklog.init(api_key="blk_live_xxxx")
handler = instrument_langchain(blocklog.client)

llm = ChatOpenAI(model="gpt-4o")
agent = create_openai_functions_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools)

# Blocklog captures every chain, LLM call, and tool invocation
result = executor.invoke(
    {"input": "Analyze this trade"},
    config={"callbacks": [handler]}
)`;

const eventsCode = `# Every execution produces structured, tamper-evident events:

agent.chain.started    # Chain entry — inputs, context snapshot, timestamp
agent.model.started    # LLM call — prompts, context_fetched_at
agent.model.completed  # LLM response — full model output
agent.tool.started     # Tool invocation — serialized tool + input
agent.tool.completed   # Tool result — output, causality link
agent.chain.completed  # Chain exit — outputs, parent linkage`;

const replayCode = `import blocklog

# After an incident, replay any traced execution
session = blocklog.replay(trace_id="your-trace-id")

# Reconstruct the full timeline
for event in session.timeline():
    print(f"[{event.get('at')}] {event.get('item_type')}: {event.get('summary')}")

# Identify root cause
cause = session.root_cause()
if cause["detected"]:
    print(f"Type: {cause['root_cause_type']}")
    print(f"Cause: {cause['description']}")
    print(f"Fix: {cause['remediation']}")`;

const customSourceCode = `# Use custom source label to distinguish multiple chains
handler = instrument_langchain(blocklog.client, source="risk-agent")
handler2 = instrument_langchain(blocklog.client, source="compliance-checker")`;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-zinc-200 sm:p-5">
      <code>{code}</code>
    </pre>
  );
}

function Section({ step, title, description, code }: { step: string; title: string; description: string; code: string }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{step}</p>
      <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-[15px]">{description}</p>
      <div className="mt-5"><CodeBlock code={code} /></div>
    </section>
  );
}

export default function LangChainIntegrationDocsPage() {
  return (
    <main
      className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      style={{ position: "relative", zIndex: 1 }}
    >
      <div className="space-y-8">

        <header className="max-w-3xl">
          <p className="eyebrow">Integrations</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            LangChain Integration
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">
            Drop-in callback handler that captures every chain, LLM call, and tool invocation — with full causality linkage and forensic replay support. Zero changes to your agent logic.
          </p>
        </header>

        {/* What gets captured */}
        <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:grid-cols-3 sm:p-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Install</p>
            <p className="mt-2 text-sm text-white">pip install blocklog</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Integration</p>
            <p className="mt-2 text-sm text-white">LangChain callback handler</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Impact</p>
            <p className="mt-2 text-sm text-white">Zero production changes</p>
          </div>
        </section>

        {/* Install */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Step 1</p>
          <h2 className="text-lg font-semibold tracking-tight text-white">Install the SDK</h2>
          <p className="mt-3 text-sm leading-7 text-muted">Install the Blocklog Python SDK. The LangChain integration is included.</p>
          <div className="mt-5"><CodeBlock code={installCode} /></div>
        </section>

        {/* Basic usage */}
        <Section
          step="Step 2"
          title="Attach the callback handler"
          description="Call instrument_langchain() with the Blocklog client and pass the returned handler to any LangChain runnable via with_config. No changes to your chain logic."
          code={basicCode}
        />

        {/* Agent usage */}
        <Section
          step="Step 3"
          title="Use with LangChain agents"
          description="Pass the handler through AgentExecutor config. Blocklog captures every LLM call, tool invocation, and chain transition with full parent-run linkage across the execution tree."
          code={agentCode}
        />

        {/* Events captured */}
        <Section
          step="What gets logged"
          title="Captured events"
          description="The handler automatically emits structured, tamper-evident events for every stage of execution. Each event carries a span_id, parent_run_id, causality_type, and context snapshot."
          code={eventsCode}
        />

        {/* Forensic replay */}
        <Section
          step="Incident investigation"
          title="Replay any execution"
          description="After an incident, pass the trace_id to blocklog.replay() to reconstruct the full timeline and run automated root cause heuristics across the captured event chain."
          code={replayCode}
        />

        {/* Multiple chains */}
        <Section
          step="Advanced"
          title="Label multiple chains"
          description="Pass a custom source string to distinguish events from different agents or chains within the same application. Useful when running parallel agent workflows."
          code={customSourceCode}
        />

        {/* What each event contains */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Event payload fields
          </p>
          <ul className="space-y-3 text-sm leading-7 text-muted">
            {[
              { field: "span_id", desc: "Unique identifier for this execution span, derived from LangChain run_id." },
              { field: "parent_run_id", desc: "Links this event to its parent chain or agent run for causal graph construction." },
              { field: "causality_type", desc: "Semantic label for the event stage: chain_start, llm_start, tool_end, etc." },
              { field: "context_fetched_at", desc: "ISO-8601 timestamp of when context was captured — enables staleness analysis." },
              { field: "framework", desc: "Always 'langchain' — used to distinguish events from other integrations." },
              { field: "captured_at", desc: "UTC timestamp of when Blocklog recorded the event." },
            ].map((item) => (
              <li key={item.field} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                <code className="text-zinc-100">{item.field}</code>
                <p className="mt-1">{item.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        <nav className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            href="/docs/incident-reconstruction"
          >
            End-to-End Example
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
            href="/docs/python-sdk"
          >
            Python SDK Reference
          </Link>
        </nav>
      </div>
    </main>
  );
}