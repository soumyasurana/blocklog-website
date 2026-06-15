"use client";

import Link from "next/link";

const installCommand = `pip install blocklog`;
const credentialCommand = `export BLOCKLOG_API_KEY="blk_live_xxxxxxxxx"`;
const quickstartCode = `import os
import blocklog

# 1. Initialize the SDK (loads from environment variables)
blocklog.init(api_key=os.environ.get("BLOCKLOG_API_KEY", "blk_demo_key"))

# 2. Instrument a tool dependency
@blocklog.tool(name="fetch-spot-price")
def check_price(ticker: str) -> float:
    return 412.50

# 3. Instrument the agent execution
@blocklog.agent(name="quickstart-trader")
def run_agent():
    price = check_price("TSLA")

    with blocklog.decision(type="BUY", asset="TSLA") as d:
        d.record_input(price=price)
        d.record_output(order_id="ord_123")

    print(f"Decision recorded: {d.id}")

    try:
        verification = blocklog.verify.decision(d.id)
        print(f"Verification status: {verification.get('status', 'verified')}")
    except Exception as e:
        print(f"Verification failed: {e}")

if __name__ == "__main__":
    run_agent()`;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-zinc-200 sm:p-5">
      <code>{code}</code>
    </pre>
  );
}

function StepCard({ step, title, description, children }: { step: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{step}</p>
      <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-muted sm:text-[15px]">{description}</p>
      <div className="mt-4">{children}</div>
    </article>
  );
}

export default function QuickstartDocsPage() {
  return (
    <main
      className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      style={{ position: "relative", zIndex: 1 }}
    >
      <div className="space-y-8">
        <header className="max-w-3xl">
          <p className="eyebrow">Quickstart</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            5 Minutes to First Log
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">
            Install the Python SDK, configure credentials, and send your first cryptographically anchored audit log.
          </p>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          <StepCard step="Step 1" title="Install the SDK" description="Install the official Python SDK using pip.">
            <CodeBlock code={installCommand} />
          </StepCard>
          <StepCard step="Step 2" title="Configure credentials" description="Set your Blocklog API key as an environment variable. The SDK will automatically detect it.">
            <CodeBlock code={credentialCommand} />
          </StepCard>
        </section>

        <StepCard step="Step 3" title="Ingest and verify your first log" description="Create ingest.py to trace an agent run, record a decision, and verify its integrity against the ledger.">
          <CodeBlock code={quickstartCode} />
        </StepCard>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Execution Summary
          </p>
          <p className="text-sm leading-7 text-muted sm:text-[15px]">
            The SDK manages the trace session, registers a{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 text-zinc-200">TOOL_CALL</code>{" "}
            event, submits the signed decision payload, and verifies the integrity chain via the REST backend.
          </p>
        </section>

        <nav className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            href="/docs/concepts"
          >
            Core Concepts
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