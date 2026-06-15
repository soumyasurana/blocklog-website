"use client";

import Link from "next/link";

const setupCode = `import os
import random
from uuid import uuid4
import blocklog

# Initialize SDK
blocklog.init(api_key=os.environ.get("BLOCKLOG_API_KEY", "blk_demo_key"))
WORKFLOW_ID = str(uuid4())

@blocklog.tool(name="fetch-price")
def fetch_price(ticker: str) -> float:
    return {"TSLA": 412.50, "AAPL": 189.30}.get(ticker, 250.0)

@blocklog.tool(name="check-risk-limits")
def check_risk_limits(ticker: str, qty: int, price: float) -> dict:
    trade_value = qty * price
    return {
        "approved": trade_value < 50_000,
        "trade_value": trade_value,
        "limit": 50_000,
    }

@blocklog.agent(name="market-analyst", version="2.1")
def analyst_agent(ticker: str) -> dict:
    price = fetch_price(ticker)
    score = 0.85
    signal = "BUY"

    with blocklog.decision(
        type="SIGNAL",
        asset=ticker,
        confidence=score,
        metadata={"workflow_id": WORKFLOW_ID},
    ) as d:
        d.record_input(price=price)
        d.record_output(signal=signal, score=score)

    return {"ticker": ticker, "price": price, "signal": signal, "decision_id": d.id}

@blocklog.agent(name="risk-manager", version="1.5")
def risk_agent(ticker: str, price: float, qty: int, analyst_dec_id: str) -> dict:
    risk = check_risk_limits(ticker, qty, price)

    with blocklog.decision(
        type="RISK_APPROVAL",
        asset=ticker,
        confidence=1.0 if risk["approved"] else 0.0,
        metadata={"workflow_id": WORKFLOW_ID},
    ) as d:
        d.record_input(qty=qty, price=price, analyst_decision_id=analyst_dec_id)
        d.record_output(approved=risk["approved"])

        if not risk["approved"]:
            d.request_approval(
                reason=f"Value \${risk['trade_value']:.0f} exceeds limit \${risk['limit']:.0f}",
                reviewer="cro@fund.com",
            )

    return {**risk, "risk_decision_id": d.id}

if __name__ == "__main__":
    TICKER = "TSLA"
    QTY = 150  # 150 * 412.50 = $61,875

    analysis = analyst_agent(TICKER)
    risk_status = risk_agent(TICKER, analysis["price"], QTY, analysis["decision_id"])`;

const replayCode = `import blocklog

session = blocklog.replay(trace_id="your-trace-id-here")

for event in session.timeline():
    print(f"[{event.get('at')}] {event.get('item_type')}: {event.get('summary')}")

cause = session.root_cause()
if cause["detected"]:
    print(f"Incident: {cause['root_cause_type']}")
    print(f"Explanation: {cause['description']}")
    print(f"Remediation: {cause['remediation']}")`;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-zinc-200 sm:p-5">
      <code>{code}</code>
    </pre>
  );
}

function StorySection({ step, title, description, code }: { step: string; title: string; description: string; code: string }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{step}</p>
      <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-[15px]">{description}</p>
      <div className="mt-5"><CodeBlock code={code} /></div>
    </section>
  );
}

export default function IncidentReconstructionDocsPage() {
  return (
    <main
      className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      style={{ position: "relative", zIndex: 1 }}
    >
      <div className="space-y-8">
        <header className="max-w-3xl">
          <p className="eyebrow">End-to-End Example</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            AI Agent Incident Reconstruction
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">
            Walkthrough of a multi-agent hedge fund workflow where a risk limit violation triggers a human-in-the-loop review and downstream forensic replay.
          </p>
        </header>

        <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:grid-cols-3 sm:p-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Workflow</p>
            <p className="mt-2 text-sm text-white">Analyst → Risk → Executor</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Trigger</p>
            <p className="mt-2 text-sm text-white">Risk limit violation</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Outcome</p>
            <p className="mt-2 text-sm text-white">HITL review + forensic replay</p>
          </div>
        </section>

        <StorySection
          step="Step 1"
          title="Multi-agent setup"
          description="An analyst agent produces a trading signal, a risk agent checks portfolio limits, and an executor fills the trade. A single WORKFLOW_ID binds the execution context across the workflow so every decision and tool call can be reconstructed later."
          code={setupCode}
        />

        <StorySection
          step="Step 2"
          title="Query forensics and root cause"
          description="Once an exception or human review request is raised, the forensic replay API reconstructs the timeline, surfaces the causal chain, and helps identify the root cause behind the incident."
          code={replayCode}
        />

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            What this example shows
          </p>
          <ul className="space-y-3 text-sm leading-7 text-muted sm:text-[15px]">
            <li>A shared workflow identifier links the signal, risk evaluation, and review path into one auditable trail.</li>
            <li>Risk approval becomes an explicit decision object instead of an implicit internal check.</li>
            <li>Human escalation and replay investigation are part of the same forensic lifecycle.</li>
          </ul>
        </section>

        <nav className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            href="/docs/quickstart"
          >
            Quickstart Guide
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
            href="/docs/api-reference"
          >
            REST API Reference
          </Link>
        </nav>
      </div>
    </main>
  );
}