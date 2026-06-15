"use client";

import Link from "next/link";

type Param = {
  name: string;
  type: string;
  description: string;
};

type ApiSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  signature: string;
  params?: Param[];
  example: string;
};

function CodeBlock({ code, small = false }: { code: string; small?: boolean }) {
  return (
    <pre className={["overflow-x-auto rounded-xl border border-white/10 bg-black/30 text-zinc-200", small ? "p-4 text-[13px] leading-6" : "p-4 text-sm leading-6 sm:p-5"].join(" ")}>
      <code>{code}</code>
    </pre>
  );
}

function ApiSection({ eyebrow, title, description, signature, params, example }: ApiSectionProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{eyebrow}</p>
      <h2 className="text-lg font-semibold tracking-tight text-white"><code>{title}</code></h2>
      <p className="mt-3 text-sm leading-7 text-muted sm:text-[15px]">{description}</p>
      <div className="mt-4"><CodeBlock code={signature} /></div>
      {params && params.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-white">Parameters</h3>
          <ul className="mt-3 space-y-3 text-sm leading-7 text-muted">
            {params.map((param) => (
              <li key={param.name} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                <code className="text-zinc-100">{param.name}</code>
                <span className="text-zinc-400"> · {param.type}</span>
                <p className="mt-1">{param.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-5">
        <h3 className="text-sm font-semibold text-white">Example</h3>
        <div className="mt-3"><CodeBlock code={example} small /></div>
      </div>
    </section>
  );
}

const sections = [
  {
    eyebrow: "Method",
    title: "blocklog.init()",
    description: "Initialize the global SDK configuration. Call once at application startup.",
    signature: `def init(
    api_key: str | None = None,
    *,
    base_url: str | None = None,
    signing_key: str | None = None,
    timeout: float | None = None,
    max_retries: int | None = None,
    debug: bool = False,
) -> BlocklogClient`,
    params: [
      { name: "api_key", type: "str, optional", description: "Key for verification. Falls back to BLOCKLOG_API_KEY." },
      { name: "base_url", type: "str, optional", description: "Custom API endpoint override." },
      { name: "signing_key", type: "str, optional", description: "Ed25519 key for client-side signing." },
      { name: "timeout", type: "float, optional", description: "Request timeout in seconds. Default is 10." },
      { name: "max_retries", type: "int, optional", description: "Ingestion retries. Default is 3." },
    ],
    example: `import blocklog\nblocklog.init(api_key="blk_live_xxxx", debug=True)`,
  },
  {
    eyebrow: "Decorator",
    title: "@blocklog.agent",
    description: "Trace an AI agent function or class, opening an execution session context.",
    signature: `def agent(
    func: F | None = None,
    *,
    name: str | None = None,
    version: str = "1.0",
    tags: list[str] | None = None,
    metadata: dict[str, Any] | None = None,
) -> F | Callable[[F], F]`,
    example: `@blocklog.agent(name="stock-trader", version="2.0", tags=["prod"])\ndef run_trading(ticker):\n    pass`,
  },
  {
    eyebrow: "Decorator",
    title: "@blocklog.tool",
    description: "Wrap a helper function or external API call to record it as a TOOL_CALL event.",
    signature: `def tool(
    func: F | None = None,
    *,
    name: str | None = None,
    schema: dict[str, Any] | None = None,
    tags: list[str] | None = None,
    metadata: dict[str, Any] | None = None,
) -> F | Callable[[F], F]`,
    example: `@blocklog.tool(name="fetch-price", tags=["market-data"])\ndef get_price(ticker):\n    return 189.30`,
  },
  {
    eyebrow: "Context Manager",
    title: "blocklog.decision()",
    description: "Define a block for recording structured inputs, outputs, and review tasks associated with a system choice.",
    signature: `def decision(
    *,
    type: str,
    asset: str | None = None,
    confidence: float | None = None,
    metadata: dict[str, Any] | None = None,
    agent_id: str | None = None,
    trace_id: str | None = None,
) -> Generator[DecisionContext, None, None]`,
    example: `with blocklog.decision(type="BUY", asset="AAPL", confidence=0.9) as d:\n    d.record_input(price=189.30)\n    d.tag("high-conviction")\n    d.record_output(order_id="ord_99")`,
  },
  {
    eyebrow: "Governance Method",
    title: "blocklog.approval.request()",
    description: "Request human review for an action. Triggers webhooks asynchronously.",
    signature: `def request(
    decision_id: str | None = None,
    *,
    reason: str,
    reviewer: str | None = None,
    log_id: str | None = None,
    metadata: dict[str, Any] | None = None,
) -> dict[str, Any]`,
    example: `blocklog.approval.request(\n    decision_id="dec_123",\n    reason="Price exceeds limits",\n    reviewer="cro@company.com"\n)`,
  },
  {
    eyebrow: "Forensic Method",
    title: "blocklog.replay()",
    description: "Instantiate a session to examine execution traces, staleness heatmaps, and counterfactual outcomes.",
    signature: `def replay(
    trace_id: str,
    *,
    token_id: str | None = None,
    metadata: dict[str, Any] | None = None,
) -> ReplaySession`,
    example: `session = blocklog.replay("trace-uuid")\ncause = session.root_cause()\nprint(cause["description"])`,
  },
  {
    eyebrow: "Verification Method",
    title: "blocklog.verify.log()",
    description: "Confirm a single log entry has not been tampered with since creation.",
    signature: `def log(log_id: str) -> dict[str, Any]`,
    example: `result = blocklog.verify.log("log-uuid")\nassert result["status"] == "verified"`,
  },
];

export default function PythonSdkDocsPage() {
  return (
    <main
      className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      style={{ position: "relative", zIndex: 1 }}
    >
      <div className="space-y-8">
        <header className="max-w-3xl">
          <p className="eyebrow">SDK Reference</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Python SDK Reference
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">
            Method signatures, parameter schemas, return types, and runnable code examples for the Blocklog Python client.
          </p>
        </header>

        <div className="space-y-6">
          {sections.map((section) => (
            <ApiSection key={section.title} {...section} />
          ))}
        </div>

        <nav className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            href="/docs/api-reference"
          >
            API Reference
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
            href="/docs/concepts"
          >
            Core Concepts
          </Link>
        </nav>
      </div>
    </main>
  );
}